import { Injectable, NotFoundException } from '@nestjs/common';
import { Faq, FaqCategory } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateFaqDto, UpdateFaqDto, ReorderFaqDto } from './dto/faq.dto.js';

@Injectable()
export class FaqsService {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, categoryId?: string, visibleOnly = false): Promise<Faq[]> {
    const where: any = {};
    if (visibleOnly) where.isVisible = true;
    if (categoryId) where.categoryId = categoryId;
    if (search) where.OR = [{ question: { contains: search, mode: 'insensitive' } }, { answer: { contains: search, mode: 'insensitive' } }];
    return this.prisma.faq.findMany({ where, orderBy: { order: 'asc' }, include: { category: true } });
  }

  async findOne(id: string): Promise<Faq> {
    const faq = await this.prisma.faq.findFirst({ where: { id }, include: { category: true } });
    if (!faq) throw new NotFoundException('FAQ not found');
    return faq;
  }

  async create(dto: CreateFaqDto): Promise<Faq> {
    const maxOrder = await this.prisma.faq.aggregate({ where: { categoryId: dto.categoryId || null }, _max: { order: true } });
    return this.prisma.faq.create({ data: { ...dto, order: (maxOrder._max.order ?? -1) + 1 }, include: { category: true } });
  }

  async update(id: string, dto: UpdateFaqDto): Promise<Faq> {
    await this.findOne(id);
    return this.prisma.faq.update({ where: { id }, data: dto, include: { category: true } });
  }

  async reorder(items: ReorderFaqDto[]): Promise<{ updated: number }> {
    await Promise.all(items.map((item) => this.prisma.faq.update({ where: { id: item.id }, data: { order: item.order, categoryId: item.categoryId } })));
    return { updated: items.length };
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.faq.delete({ where: { id } });
  }

  async findAllCategories(): Promise<FaqCategory[]> {
    return this.prisma.faqCategory.findMany({ orderBy: { order: 'asc' }, include: { _count: { select: { faqs: true } } } });
  }
}