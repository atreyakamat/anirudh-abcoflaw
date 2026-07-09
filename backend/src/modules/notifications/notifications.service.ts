import { Injectable } from '@nestjs/common';
import { Notification, NotificationType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PaginationDto, PaginatedResultDto } from '../../common/dto/pagination.dto.js';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, pagination: PaginationDto & { type?: NotificationType; unreadOnly?: boolean }): Promise<PaginatedResultDto<Notification>> {
    const { page = 1, limit = 20, type, unreadOnly } = pagination;
    const where: any = { userId };
    if (type) where.type = type;
    if (unreadOnly) where.isRead = false;

    const [items, total] = await Promise.all([
      this.prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, skip: (page - 1) * limit, take: limit }),
      this.prisma.notification.count({ where }),
    ]);
    return new PaginatedResultDto(items, total, page, limit);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.prisma.notification.count({ where: { userId, isRead: false } });
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.prisma.notification.update({ where: { id }, data: { isRead: true, readAt: new Date() } });
  }

  async markAllAsRead(userId: string): Promise<{ updated: number }> {
    const result = await this.prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true, readAt: new Date() } });
    return { updated: result.count };
  }

  async create(data: { userId?: string; clientId?: string; type: NotificationType; title: string; message: string; data?: any }): Promise<Notification> {
    return this.prisma.notification.create({ data });
  }
}