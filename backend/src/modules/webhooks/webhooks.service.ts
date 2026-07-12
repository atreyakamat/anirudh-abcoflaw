import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private prisma: PrismaService) {}

  async handleAppointmentEvent(event: string, payload: any): Promise<{ received: boolean; event: string }> {
    this.logger.log(`Webhook received: ${event}`, JSON.stringify(payload));
    return { received: true, event };
  }

  async handleWahaEvent(event: string, payload: any): Promise<{ received: boolean; event: string }> {
    this.logger.log(`WAHA webhook received: ${event}`, JSON.stringify(payload));
    return { received: true, event };
  }

  async handleN8nEvent(event: string, payload: any): Promise<{ received: boolean; event: string }> {
    this.logger.log(`n8n webhook received: ${event}`, JSON.stringify(payload));
    return { received: true, event };
  }
}