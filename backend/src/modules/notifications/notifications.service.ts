import { Injectable, Logger } from '@nestjs/common';
import { Notification, NotificationType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PaginationDto, PaginatedResultDto } from '../../common/dto/pagination.dto.js';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

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

  async sendN8nWebhook(event: string, payload: any): Promise<void> {
    const webhookUrl = this.configService.get<string>('N8N_WEBHOOK_URL');
    if (!webhookUrl) {
      this.logger.warn('N8N_WEBHOOK_URL is not set. Skipping Telegram notification via n8n.');
      return;
    }

    try {
      this.logger.log(`Sending webhook to n8n for event: ${event}`);
      await firstValueFrom(
        this.httpService.post(webhookUrl, { event, ...payload }, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 5000,
        })
      );
      this.logger.log(`Successfully triggered n8n webhook for event: ${event}`);
    } catch (error: any) {
      this.logger.error(`Failed to send n8n webhook for event ${event}: ${error.message}`, error.stack);
    }
  }
}