import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

export interface SearchResult {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async globalSearch(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return [];
    const results: SearchResult[] = [];
    const pattern = { contains: query, mode: 'insensitive' as const };

    const [clients, appointments, posts, payments] = await Promise.all([
      this.prisma.client.findMany({ where: { ...pattern, deletedAt: null }, take: 5 }),
      this.prisma.appointment.findMany({ where: { description: pattern, deletedAt: null }, take: 5, include: { client: { select: { firstName: true, lastName: true } } } }),
      this.prisma.blogPost.findMany({ where: { title: pattern, deletedAt: null }, take: 5 }),
      this.prisma.payment.findMany({ where: { referenceNumber: pattern }, take: 5, include: { client: { select: { firstName: true, lastName: true } } } }),
    ]);

    for (const c of clients) results.push({ type: 'client', id: c.id, title: `${c.firstName} ${c.lastName}`, subtitle: c.email, url: `/clients/${c.id}` });
    for (const a of appointments) results.push({ type: 'appointment', id: a.id, title: `Appointment - ${a.client.firstName} ${a.client.lastName}`, subtitle: a.description.slice(0, 60), url: `/appointments/${a.id}` });
    for (const p of posts) results.push({ type: 'blog', id: p.id, title: p.title, subtitle: p.excerpt?.slice(0, 60) || '', url: `/blogs/${p.id}` });
    for (const p of payments) results.push({ type: 'payment', id: p.id, title: `Payment - ₹${p.amount}`, subtitle: `${p.client.firstName} ${p.client.lastName} | ${p.referenceNumber || 'No ref'}`, url: `/payments` });

    return results;
  }
}