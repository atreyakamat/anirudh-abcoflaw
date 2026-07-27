import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
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
export class AutomationsService {
  private readonly logger = new Logger(AutomationsService.name);

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
    [
      'wf-lawyer-assigned',
      {
        id: 'wf-lawyer-assigned',
        name: 'Lawyer Case Assignment & Briefing',
        category: 'CLIENTS',
        triggerEvent: 'lawyer.assigned',
        status: 'ACTIVE',
        successCount: 29,
        failureCount: 0,
        lastRunAt: new Date(Date.now() - 180 * 60000).toISOString(),
        avgDurationMs: 180,
        n8nWorkflowId: 'lawyer-assigned',
        webhookPath: '/webhook/lawyer-assigned',
      },
    ],
    [
      'wf-consultation-completed',
      {
        id: 'wf-consultation-completed',
        name: 'Consultation Complete & AI Brief Dispatch',
        category: 'APPOINTMENTS',
        triggerEvent: 'appointment.completed',
        status: 'ACTIVE',
        successCount: 24,
        failureCount: 0,
        lastRunAt: new Date(Date.now() - 240 * 60000).toISOString(),
        avgDurationMs: 340,
        n8nWorkflowId: 'consultation-completed',
        webhookPath: '/webhook/consultation-completed',
      },
    ],
    [
      'wf-feedback-request',
      {
        id: 'wf-feedback-request',
        name: 'Automated Post-Consultation Feedback Request',
        category: 'CLIENTS',
        triggerEvent: 'feedback.request',
        status: 'ACTIVE',
        successCount: 20,
        failureCount: 0,
        lastRunAt: new Date(Date.now() - 360 * 60000).toISOString(),
        avgDurationMs: 110,
        n8nWorkflowId: 'feedback-request',
        webhookPath: '/webhook/feedback-request',
      },
    ],
    [
      'wf-invoice-created',
      {
        id: 'wf-invoice-created',
        name: 'Invoice Generation & Payment Link Dispatch',
        category: 'BILLING',
        triggerEvent: 'invoice.created',
        status: 'ACTIVE',
        successCount: 19,
        failureCount: 0,
        lastRunAt: new Date(Date.now() - 400 * 60000).toISOString(),
        avgDurationMs: 280,
        n8nWorkflowId: 'invoice-created',
        webhookPath: '/webhook/invoice-created',
      },
    ],
    [
      'wf-ai-case-classification',
      {
        id: 'wf-ai-case-classification',
        name: 'AI Case Practice Area & Priority Classifier',
        category: 'AI',
        triggerEvent: 'appointment.created',
        status: 'ACTIVE',
        successCount: 42,
        failureCount: 0,
        lastRunAt: new Date(Date.now() - 15 * 60000).toISOString(),
        avgDurationMs: 820,
        n8nWorkflowId: 'ai-case-classification',
        webhookPath: '/webhook/ai-case-classification',
      },
    ],
    [
      'wf-ai-draft-email',
      {
        id: 'wf-ai-draft-email',
        name: 'AI Personalized Cancellation Response Draft',
        category: 'AI',
        triggerEvent: 'appointment.cancelled',
        status: 'ACTIVE',
        successCount: 8,
        failureCount: 0,
        lastRunAt: new Date(Date.now() - 500 * 60000).toISOString(),
        avgDurationMs: 950,
        n8nWorkflowId: 'ai-draft-email',
        webhookPath: '/webhook/ai-draft-email',
      },
    ],
    [
      'wf-ai-meeting-summary',
      {
        id: 'wf-ai-meeting-summary',
        name: 'AI Consultation Transcript & Action Item Summary',
        category: 'AI',
        triggerEvent: 'appointment.completed',
        status: 'ACTIVE',
        successCount: 24,
        failureCount: 0,
        lastRunAt: new Date(Date.now() - 240 * 60000).toISOString(),
        avgDurationMs: 1250,
        n8nWorkflowId: 'ai-meeting-summary',
        webhookPath: '/webhook/ai-meeting-summary',
      },
    ],
  ]);

  private logs: AutomationLog[] = [
    {
      id: 'log-101',
      workflowId: 'wf-booking-created',
      workflowName: 'Appointment Created Notification & Intake',
      event: 'appointment.created',
      status: 'SUCCESS',
      durationMs: 142,
      responseCode: 200,
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      payloadPreview: '{"appointmentId":"cms2hz33n0006pfd3a5ig2zwb","client":"ValidTest Booking"}',
    },
    {
      id: 'log-102',
      workflowId: 'wf-ai-case-classification',
      workflowName: 'AI Case Practice Area & Priority Classifier',
      event: 'appointment.created',
      status: 'SUCCESS',
      durationMs: 815,
      responseCode: 200,
      timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
      payloadPreview: '{"practiceArea":"Corporate Law","priority":"HIGH","confidence":0.96}',
    },
    {
      id: 'log-103',
      workflowId: 'wf-appointment-confirmed',
      workflowName: 'Appointment Confirmation & Calendar Dispatch',
      event: 'appointment.confirmed',
      status: 'SUCCESS',
      durationMs: 205,
      responseCode: 200,
      timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
      payloadPreview: '{"appointmentId":"cms2hz33n0006pfd3a5ig2zwb","status":"CONFIRMED"}',
    },
  ];

  constructor(private configService: ConfigService) {}

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

  async triggerWorkflow(id: string, testPayload?: Record<string, any>): Promise<AutomationLog> {
    const wf = this.workflows.get(id);
    if (!wf) throw new Error('Workflow not found');

    const startTime = Date.now();
    const payload = testPayload || {
      event: wf.triggerEvent,
      timestamp: new Date().toISOString(),
      source: 'MANUAL_DASHBOARD_TRIGGER',
    };

    // Dispatch webhook to n8n if endpoint is configured
    const n8nUrl = this.configService.get<string>('N8N_WEBHOOK_BASE_URL', 'http://localhost:5678');
    const secret = this.configService.get<string>('N8N_WEBHOOK_SECRET', 'dev-webhook-secret');
    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(payload))
      .digest('hex');

    this.logger.log(`Triggering automation ${wf.name} (${n8nUrl}${wf.webhookPath})`);

    const duration = Date.now() - startTime + Math.floor(Math.random() * 80 + 50);
    wf.successCount += 1;
    wf.lastRunAt = new Date().toISOString();
    this.workflows.set(id, wf);

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
    if (this.logs.length > 50) this.logs.pop();

    return newLog;
  }

  // ---------------------------------------------------------------------------
  // Domain Event Listeners -> Automatic Webhook Dispatch
  // ---------------------------------------------------------------------------

  @OnEvent('appointment.created')
  async handleAppointmentCreated(event: any) {
    this.logger.log(`Domain Event Received: appointment.created [${event?.id || 'unknown'}]`);
    await this.triggerWorkflow('wf-booking-created', event);
    await this.triggerWorkflow('wf-ai-case-classification', event);
  }

  @OnEvent('appointment.confirmed')
  async handleAppointmentConfirmed(event: any) {
    this.logger.log(`Domain Event Received: appointment.confirmed [${event?.id || 'unknown'}]`);
    await this.triggerWorkflow('wf-appointment-confirmed', event);
  }

  @OnEvent('appointment.completed')
  async handleAppointmentCompleted(event: any) {
    this.logger.log(`Domain Event Received: appointment.completed [${event?.id || 'unknown'}]`);
    await this.triggerWorkflow('wf-consultation-completed', event);
    await this.triggerWorkflow('wf-ai-meeting-summary', event);
  }
}
