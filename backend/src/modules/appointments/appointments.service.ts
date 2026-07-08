import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Appointment, AppointmentStatus, BookingSource } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PaginationDto, PaginatedResultDto, SortableDto, FilterableDto } from '../../common/dto/pagination.dto.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from './dto/update-appointment.dto.js';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  // Valid status transitions
  private readonly validTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
    PENDING_REVIEW: [AppointmentStatus.PENDING_LAWYER_CONFIRMATION, AppointmentStatus.CANCELLED],
    PENDING_LAWYER_CONFIRMATION: [
      AppointmentStatus.CONFIRMED,
      AppointmentStatus.REJECTED,
      AppointmentStatus.CANCELLED,
    ],
    CONFIRMED: [AppointmentStatus.UPCOMING, AppointmentStatus.CANCELLED, AppointmentStatus.RESCHEDULED],
    REJECTED: [AppointmentStatus.ARCHIVED],
    RESCHEDULED: [AppointmentStatus.CONFIRMED, AppointmentStatus.CANCELLED],
    UPCOMING: [AppointmentStatus.REMINDER_SENT, AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
    REMINDER_SENT: [AppointmentStatus.COMPLETED, AppointmentStatus.CANCELLED],
    COMPLETED: [AppointmentStatus.ARCHIVED],
    CANCELLED: [AppointmentStatus.ARCHIVED],
    ARCHIVED: [],
  };

  async findAll(
    pagination: PaginationDto & SortableDto & FilterableDto & { status?: AppointmentStatus; clientId?: string },
  ): Promise<PaginatedResultDto<Appointment>> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      search,
      startDate,
      endDate,
      status,
      clientId,
    } = pagination;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { referenceNumber: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { client: { firstName: { contains: search, mode: 'insensitive' } } },
        { client: { lastName: { contains: search, mode: 'insensitive' } } },
        { client: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (startDate || endDate) {
      where.preferredDate = {};
      if (startDate) where.preferredDate.gte = new Date(startDate);
      if (endDate) where.preferredDate.lte = new Date(endDate);
    }

    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.clientId = clientId;
    }

    const [items, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          client: true,
          bookedByUser: {
            select: { id: true, firstName: true, lastName: true, email: true },
          },
          documents: {
            where: { deletedAt: null },
          },
          _count: {
            select: {
              documents: true,
              payments: true,
            },
          },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return new PaginatedResultDto(items, total, page, limit);
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, deletedAt: null },
      include: {
        client: true,
        bookedByUser: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        documents: {
          where: { deletedAt: null },
        },
        payments: true,
        history: {
          orderBy: { createdAt: 'desc' },
        },
        notes: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true },
            },
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async create(
    data: {
      clientId?: string;
      email?: string;
      phone?: string;
      firstName?: string;
      lastName?: string;
      description: string;
      preferredDate: Date;
      preferredTime: string;
      source?: BookingSource;
    },
    userId?: string,
  ): Promise<Appointment> {
    // Create or find client
    let clientId = data.clientId;

    if (!clientId && data.email) {
      let client = await this.prisma.client.findUnique({
        where: { email: data.email },
      });

      if (!client) {
        client = await this.prisma.client.create({
          data: {
            email: data.email,
            phone: data.phone || '',
            firstName: data.firstName || 'Unknown',
            lastName: data.lastName || 'Client',
          },
        });
      }

      clientId = client.id;
    }

    if (!clientId) {
      throw new BadRequestException('Client ID or email is required');
    }

    // Check for time slot conflicts
    await this.checkConflicts(data.preferredDate, data.preferredTime, data.preferredTime);

    const appointment = await this.prisma.appointment.create({
      data: {
        clientId,
        bookedByUserId: userId,
        description: data.description,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        source: data.source || BookingSource.WEBSITE,
        status: AppointmentStatus.PENDING_REVIEW,
      },
      include: {
        client: true,
      },
    });

    // Create history entry
    await this.createHistoryEntry(appointment.id, null, null, AppointmentStatus.PENDING_REVIEW, 'Appointment created');

    return appointment;
  }

  async updateStatus(
    id: string,
    newStatus: AppointmentStatus,
    userId?: string,
    reason?: string,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    const currentStatus = appointment.status;

    // Validate transition
    if (!this.validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }

    // Store original date/time if rescheduling
    let updateData: any = { status: newStatus };

    if (newStatus === AppointmentStatus.RESCHEDULED) {
      updateData.originalDate = appointment.preferredDate;
      updateData.originalTime = appointment.preferredTime;
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
      },
    });

    // Create history entry
    await this.createHistoryEntry(id, userId, currentStatus, newStatus, reason);

    return updated;
  }

  async update(
    id: string,
    data: {
      description?: string;
      preferredDate?: Date;
      preferredTime?: string;
      lawyerNote?: string;
    },
    userId?: string,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // Check for conflicts if date/time changed
    if (data.preferredDate || data.preferredTime) {
      await this.checkConflicts(
        data.preferredDate || appointment.preferredDate,
        data.preferredTime || appointment.preferredTime,
        appointment.preferredTime,
        id,
      );
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: {
        description: data.description,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        lawyerNote: data.lawyerNote,
      },
      include: {
        client: true,
      },
    });

    // Create history entry
    await this.createHistoryEntry(
      id,
      userId,
      appointment.status,
      appointment.status,
      'Appointment updated',
    );

    return updated;
  }

  async addNote(appointmentId: string, userId: string, content: string): Promise<void> {
    await this.findOne(appointmentId); // Verify exists

    await this.prisma.appointmentNote.create({
      data: {
        appointmentId,
        userId,
        content,
      },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.appointment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.prisma.appointment.findMany({
      where: {
        preferredDate: {
          gte: today,
          lt: tomorrow,
        },
        deletedAt: null,
        status: {
          not: AppointmentStatus.ARCHIVED,
        },
      },
      include: {
        client: true,
      },
      orderBy: { preferredTime: 'asc' },
    });
  }

  async getUpcomingAppointments(limit = 10): Promise<Appointment[]> {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return this.prisma.appointment.findMany({
      where: {
        preferredDate: { gte: now },
        deletedAt: null,
        status: {
          in: [AppointmentStatus.CONFIRMED, AppointmentStatus.UPCOMING, AppointmentStatus.REMINDER_SENT],
        },
      },
      include: {
        client: true,
      },
      orderBy: [{ preferredDate: 'asc' }, { preferredTime: 'asc' }],
      take: limit,
    });
  }

  async getStatusCounts(): Promise<Record<AppointmentStatus, number>> {
    const appointments = await this.prisma.appointment.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: true,
    });

    const counts = Object.values(AppointmentStatus).reduce(
      (acc, status) => {
        acc[status] = 0;
        return acc;
      },
      {} as Record<AppointmentStatus, number>,
    );

    appointments.forEach((item) => {
      counts[item.status] = item._count;
    });

    return counts;
  }

  private async checkConflicts(
    date: Date,
    startTime: string,
    endTime: string,
    excludeId?: string,
  ): Promise<void> {
    const dateStr = date.toISOString().split('T')[0];

    const where: any = {
      preferredDate: {
        gte: new Date(`${dateStr}T00:00:00.000Z`),
        lt: new Date(`${dateStr}T23:59:59.999Z`),
      },
      deletedAt: null,
      status: {
        notIn: [AppointmentStatus.CANCELLED, AppointmentStatus.ARCHIVED],
      },
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    const conflicts = await this.prisma.appointment.findMany({
      where,
      select: {
        id: true,
        preferredTime: true,
        client: { select: { firstName: true, lastName: true } },
      },
    });

    // Check 30-min slot conflict
    for (const conflict of conflicts) {
      if (conflict.preferredTime === startTime) {
        throw new ConflictException(
          `Time slot ${startTime} is already booked for ${conflict.client.firstName} ${conflict.client.lastName}`,
        );
      }
    }
  }

  private async createHistoryEntry(
    appointmentId: string,
    userId: string | null,
    previousStatus: AppointmentStatus | null,
    newStatus: AppointmentStatus,
    reason?: string,
  ): Promise<void> {
    await this.prisma.appointmentHistory.create({
      data: {
        appointmentId,
        changedByUser: userId,
        previousStatus,
        newStatus,
        reason,
      },
    });
  }
}