import { Injectable, BadRequestException } from '@nestjs/common';
import { AvailabilitySlot, Appointment } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async getSlots(userId: string, startDate: Date, endDate: Date): Promise<AvailabilitySlot[]> {
    return this.prisma.availabilitySlot.findMany({
      where: { userId, date: { gte: startDate, lte: endDate } },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async getAppointmentsInRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    return this.prisma.appointment.findMany({
      where: { preferredDate: { gte: startDate, lte: endDate }, deletedAt: null, status: { notIn: ['CANCELLED', 'ARCHIVED'] } },
      include: { client: { select: { firstName: true, lastName: true, phone: true } } },
      orderBy: [{ preferredDate: 'asc' }, { preferredTime: 'asc' }],
    });
  }

  async createSlots(userId: string, date: Date, slots: { startTime: string; endTime: string }[]): Promise<AvailabilitySlot[]> {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0) throw new BadRequestException('Cannot create slots on Sunday');
    const created = await Promise.all(
      slots.map((s) => this.prisma.availabilitySlot.create({ data: { userId, date, startTime: s.startTime, endTime: s.endTime, isAvailable: true } })),
    );
    return created;
  }

  async blockSlot(id: string): Promise<AvailabilitySlot> {
    return this.prisma.availabilitySlot.update({ where: { id }, data: { isAvailable: false } });
  }

  async unblockSlot(id: string): Promise<AvailabilitySlot> {
    return this.prisma.availabilitySlot.update({ where: { id }, data: { isAvailable: true } });
  }

  async deleteSlot(id: string): Promise<void> {
    await this.prisma.availabilitySlot.delete({ where: { id } });
  }
}