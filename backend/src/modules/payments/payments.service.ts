import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Payment, PaymentStatus, PaymentMethod } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PaginationDto, PaginatedResultDto, SortableDto, FilterableDto } from '../../common/dto/pagination.dto.js';
import { CreatePaymentDto, UpdatePaymentDto } from './dto/payment.dto.js';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: PaginationDto & SortableDto & FilterableDto & { status?: PaymentStatus; clientId?: string; appointmentId?: string }): Promise<PaginatedResultDto<Payment>> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC', search, status, clientId, appointmentId } = pagination;
    const where: any = {};
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (appointmentId) where.appointmentId = appointmentId;
    if (search) where.OR = [{ referenceNumber: { contains: search, mode: 'insensitive' } }, { client: { firstName: { contains: search, mode: 'insensitive' } } }];

    const [items, total] = await Promise.all([
      this.prisma.payment.findMany({ where, orderBy: { [sortBy]: sortOrder }, skip: (page - 1) * limit, take: limit, include: { client: true, appointment: { select: { id: true, referenceNumber: true, description: true } } } }),
      this.prisma.payment.count({ where }),
    ]);
    return new PaginatedResultDto(items, total, page, limit);
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.prisma.payment.findFirst({ where: { id }, include: { client: true, appointment: true } });
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async create(dto: CreatePaymentDto): Promise<Payment> {
    const appointment = await this.prisma.appointment.findUnique({ where: { id: dto.appointmentId } });
    if (!appointment) throw new BadRequestException('Appointment not found');
    return this.prisma.payment.create({ data: dto, include: { client: true } });
  }

  async update(id: string, dto: UpdatePaymentDto): Promise<Payment> {
    await this.findOne(id);
    return this.prisma.payment.update({ where: { id }, data: dto, include: { client: true } });
  }

  async getTotalRevenue(startDate?: string, endDate?: string): Promise<{ total: number; count: number }> {
    const where: any = { status: PaymentStatus.PAID };
    if (startDate || endDate) {
      where.paidAt = {};
      if (startDate) where.paidAt.gte = new Date(startDate);
      if (endDate) where.paidAt.lte = new Date(endDate);
    }
    const result = await this.prisma.payment.aggregate({ where, _sum: { amount: true }, _count: true });
    return { total: Number(result._sum.amount ?? 0), count: result._count };
  }
}