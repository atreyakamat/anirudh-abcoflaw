import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    const normalized = query.trim();
    if (!normalized) {
      return { appointments: [], clients: [], blogs: [], payments: [] };
    }

    const [appointments, clients, blogs, payments] = await Promise.all([
      this.prisma.appointment.findMany({ where: { OR: [{ notes: { contains: normalized, mode: 'insensitive' } }, { bookingSource: { contains: normalized, mode: 'insensitive' } }] }, take: 10 }),
      this.prisma.client.findMany({ where: { OR: [{ fullName: { contains: normalized, mode: 'insensitive' } }, { phone: { contains: normalized, mode: 'insensitive' } }, { email: { contains: normalized, mode: 'insensitive' } }] }, take: 10 }),
      this.prisma.blog.findMany({ where: { OR: [{ title: { contains: normalized, mode: 'insensitive' } }, { slug: { contains: normalized, mode: 'insensitive' } }, { excerpt: { contains: normalized, mode: 'insensitive' } }] }, take: 10 }),
      this.prisma.payment.findMany({ where: { OR: [{ referenceNumber: { contains: normalized, mode: 'insensitive' } }, { notes: { contains: normalized, mode: 'insensitive' } }] }, take: 10 }),
    ]);

    return { appointments, clients, blogs, payments };
  }
}