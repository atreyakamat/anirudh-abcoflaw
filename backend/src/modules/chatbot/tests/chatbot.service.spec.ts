import { Test, TestingModule } from '@nestjs/testing';
import { ChatbotService } from '../chatbot.service.js';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { NotificationsService } from '../../notifications/notifications.service.js';

// Mock Prisma Service with proper typing
const createMockPrismaService = () => ({
  chatbotSession: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  chatbotMessage: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  faq: {
    findMany: jest.fn(),
  },
  notification: {
    create: jest.fn(),
  },
});

describe('ChatbotService', () => {
  let service: ChatbotService;
  let prismaService: ReturnType<typeof createMockPrismaService>;
  let notificationsService: { create: jest.Mock };

  const mockSession = {
    id: 'session-123',
    clientId: null,
    email: null,
    isActive: true,
    startedAt: new Date(),
    endedAt: null,
    source: 'website',
    metadata: null,
  };

  const mockFaq = {
    id: 'faq-123',
    categoryId: 'general',
    question: 'What areas of law do you practice?',
    answer: 'We practice Corporate Law, Family Law, Property Law, and more.',
    order: 1,
    isVisible: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: 'general',
      name: 'General',
      description: 'General questions',
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  };

  beforeEach(async () => {
    prismaService = createMockPrismaService();
    notificationsService = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatbotService,
        { provide: PrismaService, useValue: prismaService },
        { provide: NotificationsService, useValue: notificationsService },
      ],
    }).compile();

    service = module.get<ChatbotService>(ChatbotService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSession', () => {
    it('should create a chatbot session', async () => {
      prismaService.chatbotSession.create.mockResolvedValue(mockSession);

      const result = await service.createSession('test@example.com', 'website');

      expect(result).toEqual(mockSession);
      expect(prismaService.chatbotSession.create).toHaveBeenCalledWith({
        data: {
          email: 'test@example.com',
          source: 'website',
          isActive: true,
          metadata: expect.any(Object),
        },
      });
    });
  });

  describe('getSession', () => {
    it('should return session by id', async () => {
      prismaService.chatbotSession.findUnique.mockResolvedValue(mockSession);

      const result = await service.getSession('session-123');

      expect(result).toEqual(mockSession);
    });

    it('should return null for non-existent session', async () => {
      prismaService.chatbotSession.findUnique.mockResolvedValue(null);

      const result = await service.getSession('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('endSession', () => {
    it('should mark session as inactive', async () => {
      prismaService.chatbotSession.update.mockResolvedValue({
        ...mockSession,
        isActive: false,
        endedAt: expect.any(Date),
      });

      await service.endSession('session-123');

      expect(prismaService.chatbotSession.update).toHaveBeenCalledWith({
        where: { id: 'session-123' },
        data: { isActive: false, endedAt: expect.any(Date) },
      });
    });
  });

  describe('addMessage', () => {
    it('should create a message record', async () => {
      const mockMessage = {
        id: 'msg-123',
        sessionId: 'session-123',
        content: 'Hello',
        isFromBot: false,
        intent: 'GREETING',
        confidence: 0.95,
        createdAt: new Date(),
      };

      prismaService.chatbotMessage.create.mockResolvedValue(mockMessage);

      const result = await service.addMessage('session-123', 'Hello', false, 'GREETING', 0.95);

      expect(result).toEqual(mockMessage);
    });
  });

  describe('getMessages', () => {
    it('should return all messages for session', async () => {
      const messages = [
        { id: 'msg-1', sessionId: 'session-123', content: 'Hello', isFromBot: false },
        { id: 'msg-2', sessionId: 'session-123', content: 'Hi there!', isFromBot: true },
      ];

      prismaService.chatbotMessage.findMany.mockResolvedValue(messages);

      const result = await service.getMessages('session-123');

      expect(result).toEqual(messages);
      expect(prismaService.chatbotMessage.findMany).toHaveBeenCalledWith({
        where: { sessionId: 'session-123' },
        orderBy: { createdAt: 'asc' },
      });
    });
  });

  describe('processMessage', () => {
    beforeEach(() => {
      prismaService.chatbotSession.findUnique.mockResolvedValue(mockSession);
      prismaService.faq.findMany.mockResolvedValue([mockFaq]);
    });

    it('should detect greeting intent', async () => {
      const result = await service.processMessage('session-123', 'Hello there!');

      expect(result.intent.name).toBe('GREETING');
      expect(result.intent.confidence).toBe(0.95);
      expect(result.response).toContain('Welcome');
    });

    it('should detect booking intent', async () => {
      const result = await service.processMessage('session-123', 'I want to book an appointment');

      expect(result.intent.name).toBe('BOOK');
      expect(result.shouldCollectContact).toBe(true);
    });

    it('should detect fees intent', async () => {
      const result = await service.processMessage('session-123', 'What are your consultation fees?');

      expect(result.intent.name).toBe('FEES');
      expect(result.intent.confidence).toBe(0.85);
    });
  });

  describe('detectIntent', () => {
    it('should detect book intent from keywords', () => {
      const intent = (service as any).detectIntent('I would like to schedule a consultation');

      expect(intent.name).toBe('BOOK');
      expect(intent.confidence).toBe(0.9);
    });

    it('should detect phone intent from keywords', () => {
      const intent = (service as any).detectIntent('What is your phone number?');

      expect(intent.name).toBe('PHONE');
      expect(intent.confidence).toBe(0.85);
    });

    it('should return UNKNOWN for unrecognized text', () => {
      const intent = (service as any).detectIntent('asdfghjkl');

      expect(intent.name).toBe('UNKNOWN');
      expect(intent.confidence).toBeLessThan(0.3);
    });
  });

  describe('generateIntentResponse', () => {
    it('should return greeting response', () => {
      const response = (service as any).generateIntentResponse({ name: 'GREETING', confidence: 0.95 }, null);

      expect(response).toContain('Welcome');
    });

    it('should return booking response', () => {
      const response = (service as any).generateIntentResponse({ name: 'BOOK', confidence: 0.9 }, null);

      expect(response).toContain('book');
    });
  });

  describe('qualifyAndSaveLead', () => {
    it('should update session with lead data', async () => {
      const leadData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+919876543210',
        message: 'Interested in consultation',
      };

      prismaService.chatbotSession.findUnique.mockResolvedValue(mockSession);
      prismaService.chatbotSession.update.mockResolvedValue({
        ...mockSession,
        email: leadData.email,
        metadata: { leadData, qualifiedAt: expect.any(String) },
      });
      notificationsService.create.mockResolvedValue({} as any);

      await service.qualifyAndSaveLead('session-123', leadData);

      expect(prismaService.chatbotSession.update).toHaveBeenCalled();
    });
  });

  describe('getSessionAnalytics', () => {
    it('should return session statistics', async () => {
      prismaService.chatbotSession.count
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(5)
        .mockResolvedValueOnce(25);

      const result = await service.getSessionAnalytics();

      expect(result).toEqual({
        totalSessions: 100,
        activeSessions: 5,
        leadsGenerated: 25,
      });
    });
  });
});