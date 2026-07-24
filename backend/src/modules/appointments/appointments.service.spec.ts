import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from './appointments.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { AppointmentStatus, BookingSource } from '@prisma/client';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let prisma: PrismaService;
  let notificationsService: NotificationsService;

  const mockPrismaService = {
    appointment: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      groupBy: jest.fn(),
    },
    client: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    document: {
      updateMany: jest.fn(),
    },
    appointmentHistory: {
      create: jest.fn(),
    },
    appointmentNote: {
      create: jest.fn(),
    },
  };

  const mockNotificationsService = {
    sendN8nWebhook: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentsService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
    prisma = module.get<PrismaService>(PrismaService);
    notificationsService = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return appointment if found', async () => {
      const mockAppt = { id: 'a1', status: AppointmentStatus.PENDING_REVIEW };
      mockPrismaService.appointment.findFirst.mockResolvedValue(mockAppt);

      const result = await service.findOne('a1');
      expect(result).toEqual(mockAppt);
    });

    it('should throw NotFoundException if not found', async () => {
      mockPrismaService.appointment.findFirst.mockResolvedValue(null);

      await expect(service.findOne('a1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStatus', () => {
    it('should throw BadRequestException on invalid status transition', async () => {
      const mockAppt = { id: 'a1', status: AppointmentStatus.PENDING_REVIEW };
      mockPrismaService.appointment.findFirst.mockResolvedValue(mockAppt);

      // PENDING_REVIEW -> COMPLETED is invalid (must go via CONFIRMED/UPCOMING)
      await expect(
        service.updateStatus('a1', AppointmentStatus.COMPLETED, 'u1'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should allow valid transition PENDING_REVIEW -> PENDING_LAWYER_CONFIRMATION', async () => {
      const mockAppt = { id: 'a1', status: AppointmentStatus.PENDING_REVIEW };
      const mockUpdated = { id: 'a1', status: AppointmentStatus.PENDING_LAWYER_CONFIRMATION };

      mockPrismaService.appointment.findFirst.mockResolvedValue(mockAppt);
      mockPrismaService.appointment.update.mockResolvedValue(mockUpdated);

      const result = await service.updateStatus(
        'a1',
        AppointmentStatus.PENDING_LAWYER_CONFIRMATION,
        'u1',
      );

      expect(result).toEqual(mockUpdated);
      expect(mockPrismaService.appointmentHistory.create).toHaveBeenCalled();
    });
  });
});
