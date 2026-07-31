import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../../prisma/prisma.service.js';
import { OutboxStatus } from '@prisma/client';
import { firstValueFrom } from 'rxjs';
import * as crypto from 'crypto';

export interface AutomationWorkflow {
  id: string;
  name: string;
  category: 'APPOINTMENTS' | 'BILLING' | 'CLIENTS' | 'AI';
  triggerEvent: string;
  status: 'ACTIVE' | 'INACTIVE';
  successCount: number;
  failureCount: number;
  lastRunAt: string | null;
  avgDurationMs: number;
  n8nWorkflowId?: string;
  webhookPath: string;
}

export interface AutomationLog {
  id: string;
  workflowId: string;
  workflowName: string;
  event: string;
  status: 'SUCCESS' | 'FAILURE' | 'RETRYING';
  durationMs: number;
  responseCode: number;
  timestamp: string;
  payloadPreview: string;
}

@Injectable()
export class AutomationsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AutomationsService.name);
  private pollingTimer: NodeJS.Timeout | null = null;
  private isProcessing = false;

  private workflows: Map<string, AutomationWorkflow> = new Map([
    [
      'wf-booking-created',
      {
        id: 'wf-booking-created',
        name: 'Appointment Created Notification & Intake',
        category: 'APPOINTMENTS',
        triggerEvent: 'appointment.created',
        status: 'ACTIVE',
        successCount: 42,
        failureCount: 0,
        lastRunAt: new Date(Date.now() - 15 * 60000).toISOString(),
        avgDurationMs: 140,
        n8nWorkflowId: 'appointment-created',
        webhookPath: '/webhook/appointment-created',
      },
    ],
    [
      'wf-appointment-confirmed',
      {
        id: 'wf-appointment-confirmed',
        name: 'Appointment Confirmation & Calendar Dispatch',
        category: 'APPOINTMENTS',
        triggerEvent: 'appointment.confirmed',
        status: 'ACTIVE',
        successCount: 38,
        failureCount: 1,
        lastRunAt: new Date(Date.now() - 45 * 60000).toISOString(),
        avgDurationMs: 210,
        n8nWorkflowId: 'appointment-confirmed',
        webhookPath: '/webhook/appointment-confirmed',
      },
    ],
    [
      'wf-appointment-reminder',
      {
        id: 'wf-appointment-reminder',
        name: '24h & 2h Consultation Reminders',
        category: 'APPOINTMENTS',
        triggerEvent: 'appointment.reminder',
        status: 'ACTIVE',
        successCount: 112,
        failureCount: 2,
        lastRunAt: new Date(Date.now() - 120 * 60000).toISOString(),
        avgDurationMs: 95,
        n8nWorkflowId: 'appointment-reminder',
        webhookPath: '/webhook/appointment-reminder',
      },
    ],
  ]);

  private logs: AutomationLog[] = [];

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  onModuleInit() {
    // Start background outbox polling every 10 seconds
    this.pollingTimer = setInterval(() => {
      this.processOutbox().catch(err => this.logger.error(`Outbox polling error: ${err.message}`));
    }, 10000);
  }

  onModuleDestroy() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
    }
  }

  getWorkflows(): AutomationWorkflow[] {
    return Array.from(this.workflows.values());
  }

  getLogs(): AutomationLog[] {
    return this.logs;
  }

  toggleWorkflow(id: string): AutomationWorkflow {
    const wf = this.workflows.get(id);
    if (!wf) throw new Error('Workflow not found');
    wf.status = wf.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.workflows.set(id, wf);
    this.logger.log(`Workflow ${id} status set to ${wf.status}`);
    return wf;
  }

  async getOutboxEvents(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.automationEvent.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.automationEvent.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async retryOutboxEvent(id: string) {
    const event = await this.prisma.automationEvent.findUnique({ where: { id } });
    if (!event) throw new Error('Outbox event not found');

    const updated = await this.prisma.automationEvent.update({
      where: { id },
      data: {
        status: OutboxStatus.RETRY_PENDING,
        nextAttemptAt: new Date(),
        attemptCount: 0,
        lastError: null,
      },
    });

    // Trigger immediate outbox processing run
    this.processOutbox().catch(err => this.logger.error(`Immediate outbox error: ${err.message}`));
    return updated;
  }

  // ---------------------------------------------------------------------------
  // Transactional Outbox Dispatcher with Backoff, HMAC & Idempotency
  // ---------------------------------------------------------------------------

  async processOutbox(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      const pendingEvents = await this.prisma.automationEvent.findMany({
        where: {
          status: { in: [OutboxStatus.PENDING, OutboxStatus.RETRY_PENDING] },
          nextAttemptAt: { lte: new Date() },
        },
        orderBy: { createdAt: 'asc' },
        take: 10,
      });

      if (pendingEvents.length === 0) {
        this.isProcessing = false;
        return;
      }

      const n8nBaseUrl = this.configService.get<string>('N8N_WEBHOOK_URL') || 'http://localhost:5678/webhook/appointment-created';
      const webhookSecret = this.configService.get<string>('N8N_WEBHOOK_SECRET', 'dev-webhook-secret');

      for (const event of pendingEvents) {
        await this.dispatchSingleEvent(event, n8nBaseUrl, webhookSecret);
      }
    } catch (err: any) {
      this.logger.error(`Error processing transactional outbox: ${err.message}`);
    } finally {
      this.isProcessing = false;
    }
  }

  private async dispatchSingleEvent(event: any, webhookUrl: string, webhookSecret: string) {
    const attempts = event.attemptCount + 1;
    const timestamp = new Date().toISOString();

    // Mark as PROCESSING
    await this.prisma.automationEvent.update({
      where: { id: event.id },
      data: { status: OutboxStatus.PROCESSING, lastAttemptAt: new Date() },
    });

    const payloadObj = typeof event.payload === 'string' ? JSON.parse(event.payload) : event.payload;
    const bodyString = JSON.stringify(payloadObj);

    // Compute HMAC-SHA256 signature over payload
    const signature = crypto
      .createHmac('sha256', webhookSecret)
      .update(bodyString)
      .digest('hex');

    try {
      this.logger.log(`Dispatching Outbox Event [${event.eventId}] (${event.eventType}) to n8n (attempt ${attempts})...`);
      
      const response = await firstValueFrom(
        this.httpService.post(
          webhookUrl,
          bodyString,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Event-Id': event.eventId,
              'X-Webhook-Signature': signature,
              'X-Webhook-Timestamp': timestamp,
            },
            timeout: 5000,
          },
        ),
      );

      // On Success: Set status = COMPLETED
      await this.prisma.automationEvent.update({
        where: { id: event.id },
        data: {
          status: OutboxStatus.COMPLETED,
          attemptCount: attempts,
          processedAt: new Date(),
          lastError: null,
        },
      });

      this.logger.log(`Successfully delivered Outbox Event [${event.eventId}] to n8n. Status: COMPLETED`);

      // Log in memory audit preview
      this.logs.unshift({
        id: `log-${event.id}`,
        workflowId: 'wf-booking-created',
        workflowName: 'Appointment Created Notification & Intake',
        event: event.eventType,
        status: 'SUCCESS',
        durationMs: 120,
        responseCode: response.status || 200,
        timestamp,
        payloadPreview: bodyString.slice(0, 120),
      });

    } catch (error: any) {
      const errMsg = error?.response?.data?.message || error.message || 'Webhook dispatch failed';
      this.logger.warn(`Failed to deliver Outbox Event [${event.eventId}] (attempt ${attempts}/${event.maxAttempts}): ${errMsg}`);

      if (attempts >= event.maxAttempts) {
        // DEAD_LETTER after max attempts reached
        await this.prisma.automationEvent.update({
          where: { id: event.id },
          data: {
            status: OutboxStatus.DEAD_LETTER,
            attemptCount: attempts,
            lastError: `Max attempts reached (${event.maxAttempts}). Last error: ${errMsg}`,
          },
        });
      } else {
        // Calculate backoff delay: Attempt 1 -> 30s, Attempt 2 -> 120s, Attempt 3 -> 600s, Attempt 4 -> 1800s
        const backoffSeconds = [30, 120, 600, 1800][attempts - 1] || 1800;
        const nextAttemptAt = new Date(Date.now() + backoffSeconds * 1000);

        await this.prisma.automationEvent.update({
          where: { id: event.id },
          data: {
            status: OutboxStatus.RETRY_PENDING,
            attemptCount: attempts,
            nextAttemptAt,
            lastError: errMsg,
          },
        });
      }
    }
  }

  async triggerWorkflow(id: string, testPayload?: Record<string, any>): Promise<AutomationLog> {
    const wf = this.workflows.get(id);
    if (!wf) throw new Error('Workflow not found');

    const startTime = Date.now();
    const payload = testPayload || {
      event: wf.triggerEvent,
      timestamp: new Date().toISOString(),
      source: 'MANUAL_DASHBOARD_TRIGGER',
    };

    const duration = Date.now() - startTime + 50;
    wf.successCount += 1;
    wf.lastRunAt = new Date().toISOString();

    const newLog: AutomationLog = {
      id: `log-${Date.now()}`,
      workflowId: wf.id,
      workflowName: wf.name,
      event: wf.triggerEvent,
      status: 'SUCCESS',
      durationMs: duration,
      responseCode: 200,
      timestamp: new Date().toISOString(),
      payloadPreview: JSON.stringify(payload).slice(0, 120),
    };

    this.logs.unshift(newLog);
    return newLog;
  }

  // ---------------------------------------------------------------------------
  // Domain Event Listeners -> Trigger Immediate Outbox Processing
  // ---------------------------------------------------------------------------

  @OnEvent('appointment.created')
  async handleAppointmentCreated(event: any) {
    this.logger.log(`Domain Event Received: appointment.created [${event?.id || 'unknown'}]`);
    this.processOutbox().catch(err => this.logger.error(`Error processing outbox on event: ${err.message}`));
  }
}
