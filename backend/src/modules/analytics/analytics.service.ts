import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AppointmentStatus, PaymentStatus, BookingSource } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayAppointments, totalClients, totalRevenue, pendingPayments, statusCounts, sourceCounts, recentActivity] = await Promise.all([
      this.prisma.appointment.count({ where: { preferredDate: { gte: today, lt: tomorrow }, deletedAt: null } }),
      this.prisma.client.count({ where: { deletedAt: null } }),
      this.prisma.payment.aggregate({ where: { status: PaymentStatus.PAID }, _sum: { amount: true } }),
      this.prisma.payment.aggregate({ where: { status: PaymentStatus.PENDING }, _sum: { amount: true }, _count: true }),
      this.prisma.appointment.groupBy({ by: ['status'], where: { deletedAt: null }, _count: true }),
      this.prisma.appointment.groupBy({ by: ['source'], where: { deletedAt: null }, _count: true }),
      this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 20, include: { user: { select: { firstName: true, lastName: true } } } }),
    ]);

    return {
      todayAppointments,
      totalClients,
      totalRevenue: Number(totalRevenue._sum.amount ?? 0),
      pendingPayments: { count: pendingPayments._count, total: Number(pendingPayments._sum.amount ?? 0) },
      statusCounts: statusCounts.map((s) => ({ status: s.status, count: s._count })),
      sourceCounts: sourceCounts.map((s) => ({ source: s.source, count: s._count })),
      recentActivity,
    };
  }

  async getAppointmentTrends(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const appointments = await this.prisma.appointment.findMany({
      where: { createdAt: { gte: startDate }, deletedAt: null },
      select: { createdAt: true, status: true },
    });
    const grouped: Record<string, { total: number; completed: number; cancelled: number }> = {};
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      grouped[d.toISOString().split('T')[0]] = { total: 0, completed: 0, cancelled: 0 };
    }
    for (const a of appointments) {
      const key = a.createdAt.toISOString().split('T')[0];
      if (!grouped[key]) grouped[key] = { total: 0, completed: 0, cancelled: 0 };
      grouped[key].total++;
      if (a.status === AppointmentStatus.COMPLETED) grouped[key].completed++;
      if (a.status === AppointmentStatus.CANCELLED) grouped[key].cancelled++;
    }
    return Object.entries(grouped).map(([date, data]) => ({ date, ...data }));
  }

  async getRevenueByMonth(months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);
    const payments = await this.prisma.payment.findMany({
      where: { status: PaymentStatus.PAID, paidAt: { gte: startDate } },
      select: { amount: true, paidAt: true },
    });
    const grouped: Record<string, number> = {};
    for (let i = 0; i < months; i++) {
      const d = new Date(startDate);
      d.setMonth(d.getMonth() + i);
      grouped[d.toISOString().slice(0, 7)] = 0;
    }
    for (const p of payments) {
      if (p.paidAt) {
        const key = p.paidAt.toISOString().slice(0, 7);
        grouped[key] = (grouped[key] || 0) + Number(p.amount);
      }
    }
    return Object.entries(grouped).map(([month, revenue]) => ({ month, revenue }));
  }
}