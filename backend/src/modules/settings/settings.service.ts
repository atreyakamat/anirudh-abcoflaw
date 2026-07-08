import { Injectable, NotFoundException } from '@nestjs/common';
import { Setting } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async findAll(publicOnly = false): Promise<Setting[]> {
    return this.prisma.setting.findMany({
      where: publicOnly ? { isPublic: true } : {},
      orderBy: { category: 'asc' },
    });
  }

  async findByKey(key: string): Promise<Setting | null> {
    return this.prisma.setting.findUnique({
      where: { key },
    });
  }

  async get<T = any>(key: string, defaultValue?: T): Promise<T | null> {
    const setting = await this.findByKey(key);
    if (!setting) return defaultValue ?? null;
    return setting.value as T;
  }

  async set(
    key: string,
    value: any,
    category = 'general',
    isPublic = false,
    userId?: string,
  ): Promise<Setting> {
    return this.prisma.setting.upsert({
      where: { key },
      update: {
        value,
        category,
        isPublic,
        updatedByUserId: userId,
      },
      create: {
        key,
        value,
        category,
        isPublic,
        updatedByUserId: userId,
      },
    });
  }

  async delete(key: string): Promise<void> {
    const setting = await this.findByKey(key);
    if (!setting) {
      throw new NotFoundException('Setting not found');
    }

    await this.prisma.setting.delete({
      where: { key },
    });
  }

  // Initialize default settings
  async initializeDefaults(): Promise<void> {
    const defaults = [
      { key: 'office_hours_start', value: '09:00', category: 'office_hours', isPublic: true },
      { key: 'office_hours_end', value: '18:00', category: 'office_hours', isPublic: true },
      { key: 'consultation_duration', value: 30, category: 'appointment', isPublic: true },
      { key: 'slot_interval', value: 30, category: 'appointment', isPublic: true },
      { key: 'sunday_closed', value: true, category: 'office_hours', isPublic: true },
      { key: 'reminder_before_hours', value: 24, category: 'notifications', isPublic: false },
      { key: 'lawyer_name', value: 'Anirudh', category: 'branding', isPublic: true },
      { key: 'lawyer_title', value: 'Attorney at Law', category: 'branding', isPublic: true },
      { key: 'lawyer_email', value: 'contact@lawpractice.com', category: 'contact', isPublic: true },
      { key: 'lawyer_phone', value: '+1-234-567-8900', category: 'contact', isPublic: true },
      { key: 'lawyer_address', value: '123 Legal Street, Suite 100', category: 'contact', isPublic: true },
      { key: 'social_facebook', value: '', category: 'social', isPublic: true },
      { key: 'social_twitter', value: '', category: 'social', isPublic: true },
      { key: 'social_linkedin', value: '', category: 'social', isPublic: true },
    ];

    for (const setting of defaults) {
      await this.set(setting.key, setting.value, setting.category, setting.isPublic);
    }
  }
}