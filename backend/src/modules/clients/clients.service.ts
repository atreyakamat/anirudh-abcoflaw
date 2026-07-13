import { Injectable, NotFoundException } from '@nestjs/common';
import { Client } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PaginationDto, PaginatedResultDto, SortableDto, FilterableDto } from '../../common/dto/pagination.dto.js';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    pagination: PaginationDto & SortableDto & FilterableDto,
  ): Promise<PaginatedResultDto<Client>> {
    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 20;
    const { sortBy = 'createdAt', sortOrder = 'DESC', search, startDate, endDate } = pagination;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [items, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          _count: {
            select: {
              appointments: true,
              payments: true,
            },
          },
        },
      }),
      this.prisma.client.count({ where }),
    ]);

    return new PaginatedResultDto(items, total, page, limit);
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.prisma.client.findFirst({
      where: { id, deletedAt: null },
      include: {
        appointments: {
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        documents: {
          where: { deletedAt: null },
          orderBy: { uploadedAt: 'desc' },
        },
      },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async findByEmail(email: string): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: { email },
    });
  }

  async findByPhone(phone: string): Promise<Client[]> {
    return this.prisma.client.findMany({
      where: {
        phone,
        deletedAt: null,
      },
    });
  }

  async create(data: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    notes?: string;
  }): Promise<Client> {
    return this.prisma.client.create({
      data,
    });
  }

  async update(
    id: string,
    data: Partial<{
      email: string;
      phone: string;
      firstName: string;
      lastName: string;
      notes: string;
    }>,
  ): Promise<Client> {
    await this.findOne(id);

    return this.prisma.client.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.findOne(id);

    await this.prisma.client.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async getTimeline(id: string, limit = 20): Promise<any[]> {
    const client = await this.findOne(id);

    const appointments = await this.prisma.appointment.findMany({
      where: { clientId: id, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const payments = await this.prisma.payment.findMany({
      where: { clientId: id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Merge and sort by date
    const timeline = [
      ...appointments.map((a) => ({ type: 'appointment' as const, data: a, date: a.createdAt })),
      ...payments.map((p) => ({ type: 'payment' as const, data: p, date: p.createdAt })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return timeline.slice(0, limit);
  }
}