import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [appointments, clients, payments, pendingPayments, revenue] = await Promise.all([
      this.prisma.appointment.groupBy({ by: ['status'], _count: { status: true } }),
      this.prisma.client.count(),
      this.prisma.payment.count(),
      this.prisma.payment.count({ where: { status: 'pending' } }),
      this.prisma.payment.aggregate({ _sum: { amount: true } }),
    ]);

    return {
      appointmentsByStatus: appointments.reduce<Record<string, number>>((accumulator, item) => {
        accumulator[item.status] = item._count.status;
        return accumulator;
      }, {}),
      clients,
      payments,
      pendingPayments,
      revenue: revenue._sum.amount ?? 0,
    };
  }
}