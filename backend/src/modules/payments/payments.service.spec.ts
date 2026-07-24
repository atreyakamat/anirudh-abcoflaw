import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PaymentStatus, PaymentMethod } from '@prisma/client';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    payment: {
      findMany: jest.fn(),
      count: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      aggregate: jest.fn(),
    },
    appointment: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a payment if found', async () => {
      const mockPayment = { id: 'p1', amount: 1500, status: PaymentStatus.PAID };
      mockPrismaService.payment.findFirst.mockResolvedValue(mockPayment);

      const result = await service.findOne('p1');
      expect(result).toEqual(mockPayment);
      expect(mockPrismaService.payment.findFirst).toHaveBeenCalledWith({
        where: { id: 'p1' },
        include: { client: true, appointment: true },
      });
    });

    it('should throw NotFoundException if payment does not exist', async () => {
      mockPrismaService.payment.findFirst.mockResolvedValue(null);

      await expect(service.findOne('p1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a payment when appointment exists', async () => {
      const dto = {
        appointmentId: 'a1',
        clientId: 'c1',
        amount: 2500,
        method: PaymentMethod.CASH,
        status: PaymentStatus.PAID,
        referenceNumber: 'REF123',
      };
      mockPrismaService.appointment.findUnique.mockResolvedValue({ id: 'a1' });
      mockPrismaService.payment.create.mockResolvedValue({ id: 'p1', ...dto });

      const result = await service.create(dto as any);
      expect(result).toHaveProperty('id', 'p1');
      expect(mockPrismaService.appointment.findUnique).toHaveBeenCalledWith({ where: { id: 'a1' } });
    });

    it('should throw BadRequestException if appointment does not exist', async () => {
      mockPrismaService.appointment.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ appointmentId: 'invalid', clientId: 'c1', amount: 100, method: PaymentMethod.CASH } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getTotalRevenue', () => {
    it('should return aggregated revenue', async () => {
      mockPrismaService.payment.aggregate.mockResolvedValue({
        _sum: { amount: 5000 },
        _count: 3,
      });

      const result = await service.getTotalRevenue();
      expect(result).toEqual({ total: 5000, count: 3 });
    });
  });
});
