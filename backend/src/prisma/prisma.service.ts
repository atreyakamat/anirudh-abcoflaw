import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log('📦 Prisma connected to database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('📦 Prisma disconnected from database');
  }

  // Helper for soft deletes
  async softDelete<T>(
    model: keyof Pick<PrismaClient, 'user' | 'clientPortalUser' | 'client' | 'appointment' | 'blogPost' | 'faq' | 'document' | 'setting'>,
    where: Record<string, unknown>,
  ): Promise<T> {
    const date = new Date();
    return (model as any).update({
      where: { ...where, deletedAt: null },
      data: { deletedAt: date },
    });
  }

  // Helper to exclude soft-deleted records
  whereNotDeleted() {
    return { deletedAt: null };
  }
}

// Type for Prisma models we use for soft delete
type PrismaClient = {
  user: any;
  clientPortalUser: any;
  client: any;
  appointment: any;
  blogPost: any;
  blogCategory: any;
  blogTag: any;
  faq: any;
  faqCategory: any;
  document: any;
  setting: any;
  availabilitySlot: any;
  payment: any;
  notification: any;
};