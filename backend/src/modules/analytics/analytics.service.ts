import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AppointmentStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      todayAppointments,
      totalClients,
      totalRevenue,
      pendingPayments,
      statusCounts,
      sourceCounts,
      allAppointments,
      recentActivity,
    ] = await Promise.all([
      this.prisma.appointment.count({ where: { preferredDate: { gte: today, lt: tomorrow }, deletedAt: null } }),
      this.prisma.client.count({ where: { deletedAt: null } }),
      this.prisma.payment.aggregate({ where: { status: PaymentStatus.PAID }, _sum: { amount: true } }),
      this.prisma.payment.aggregate({ where: { status: PaymentStatus.PENDING }, _sum: { amount: true }, _count: true }),
      this.prisma.appointment.groupBy({ by: ['status'], _count: true }),
      this.prisma.appointment.groupBy({ by: ['source'], _count: true }),
      this.prisma.appointment.findMany({
        where: { deletedAt: null },
        select: { source: true, status: true, bookedByUserId: true },
      }),
      this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 20, include: { user: { select: { firstName: true, lastName: true } } } }),
    ]);

    const totalAppointmentsCount = allAppointments.length;
    let webBookingsCount = 0;
    let completedCount = 0;

    for (const apt of allAppointments) {
      if (apt.source === 'WEBSITE' || !apt.bookedByUserId) {
        webBookingsCount++;
      }
      if (apt.status === AppointmentStatus.COMPLETED) {
        completedCount++;
      }
    }

    const webConversionRate = totalAppointmentsCount > 0
      ? Math.round((webBookingsCount / totalAppointmentsCount) * 100)
      : 100;

    const completionRate = totalAppointmentsCount > 0
      ? Math.round((completedCount / totalAppointmentsCount) * 100)
      : 0;

    return {
      todayAppointments,
      totalClients,
      totalRevenue: Number(totalRevenue._sum.amount ?? 0),
      pendingPayments: { count: pendingPayments._count, total: Number(pendingPayments._sum.amount ?? 0) },
      statusCounts: statusCounts.map((s) => ({ status: s.status, count: s._count })),
      sourceCounts: sourceCounts.map((s) => ({ source: s.source, count: s._count })),
      practiceInsights: {
        topPracticeArea: 'Corporate & Commercial Practice',
        webConversionRate,
        completionRate,
        totalAppointmentsCount,
      },
      recentActivity,
    };
  }

  async getAppointmentTrends(days = 30) {
    const numDays = Number(days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - numDays);
    const appointments = await this.prisma.appointment.findMany({
      where: { createdAt: { gte: startDate }, deletedAt: null },
      select: { createdAt: true, status: true },
    });
    const grouped: Record<string, { total: number; completed: number; cancelled: number }> = {};
    for (let i = 0; i < numDays; i++) {
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
    const numMonths = Number(months) || 6;
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - numMonths);
    const payments = await this.prisma.payment.findMany({
      where: { status: PaymentStatus.PAID, paidAt: { gte: startDate } },
      select: { amount: true, paidAt: true },
    });
    const grouped: Record<string, number> = {};
    for (let i = 0; i < numMonths; i++) {
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