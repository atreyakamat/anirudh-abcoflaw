import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

describe('SearchService', () => {
  let service: SearchService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      client: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'c1', firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
        ]),
      },
      appointment: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'a1', description: 'Corporate law consultation', client: { firstName: 'John', lastName: 'Doe' } },
        ]),
      },
      blogPost: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'b1', title: 'Understanding Corporate Contracts', excerpt: 'Guide to contracts' },
        ]),
      },
      payment: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'p1', amount: 5000, referenceNumber: 'REF-123', client: { firstName: 'John', lastName: 'Doe' } },
        ]),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);
  });

  describe('globalSearch', () => {
    it('should return empty array for query less than 2 characters', async () => {
      const results = await service.globalSearch('a');
      expect(results).toEqual([]);
      expect(prisma.client.findMany).not.toHaveBeenCalled();
    });

    it('should execute parallel searches across models for valid query', async () => {
      const results = await service.globalSearch('corporate');

      expect(results.length).toBe(4);
      expect(results[0].type).toBe('client');
      expect(results[1].type).toBe('appointment');
      expect(results[2].type).toBe('blog');
      expect(results[3].type).toBe('payment');
    });
  });
});
