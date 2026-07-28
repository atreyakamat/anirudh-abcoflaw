import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { AutomationsModule } from './automations.module.js';
import { AutomationsService } from './automations.service.js';

describe('Single End-to-End Automation Pipeline Integration', () => {
  let service: AutomationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        EventEmitterModule.forRoot(),
        AutomationsModule,
      ],
    }).compile();

    service = module.get<AutomationsService>(AutomationsService);
  });

  it('should process appointment.created domain event, trigger n8n webhook, and log execution', async () => {
    const initialLogCount = service.getLogs().length;

    const testAppointment = {
      id: `test-appt-${Date.now()}`,
      client: {
        firstName: 'Integration',
        lastName: 'Tester',
        phone: '+919999888877',
        email: 'tester@example.com',
      },
      preferredDate: '2026-08-15',
      preferredTime: '11:00',
      description: 'Need urgent corporate agreement review',
      status: 'PENDING_REVIEW',
    };

    // Execute single proven workflow pipeline: Appointment Created -> n8n Webhook -> Execution Log
    const log = await service.triggerWorkflow('wf-booking-created', testAppointment);

    expect(log).toBeDefined();
    expect(log.status).toBe('SUCCESS');
    expect(log.event).toBe('appointment.created');
    expect(log.durationMs).toBeGreaterThan(0);

    const logs = service.getLogs();
    expect(logs.length).toBe(initialLogCount + 1);
    expect(logs[0].id).toBe(log.id);
  });
});
