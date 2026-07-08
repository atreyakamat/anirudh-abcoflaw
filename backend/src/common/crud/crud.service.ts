import { BadRequestException, NotFoundException } from '@nestjs/common';
import { normalizePagination, toPaginatedResult } from '../pagination.js';

type PrismaDelegate = {
  findMany: (args?: Record<string, unknown>) => Promise<any[]>;
  count: (args?: Record<string, unknown>) => Promise<number>;
  findUnique: (args: Record<string, unknown>) => Promise<any | null>;
  create: (args: Record<string, unknown>) => Promise<any>;
  update: (args: Record<string, unknown>) => Promise<any>;
  delete: (args: Record<string, unknown>) => Promise<any>;
};

export class CrudService {
  constructor(
    protected readonly delegate: PrismaDelegate,
    private readonly searchableFields: string[] = [],
    private readonly defaultSortBy = 'createdAt',
  ) {}

  async list(query: Record<string, any> = {}) {
    const pagination = normalizePagination(query);
    const where = this.buildWhere(query.search ?? pagination.search, query.filter ?? {});
    const orderBy = {
      [query.sortBy ?? pagination.sortBy ?? this.defaultSortBy]: query.sortOrder ?? pagination.sortOrder ?? 'desc',
    };
    const [items, total] = await Promise.all([
      this.delegate.findMany({
        where,
        orderBy,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
      }),
      this.delegate.count({ where }),
    ]);

    return toPaginatedResult(items, total, pagination.page, pagination.limit);
  }

  async get(id: string) {
    const item = await this.delegate.findUnique({ where: { id } });
    if (!item) {
      throw new NotFoundException('Record not found');
    }
    return item;
  }

  async create(data: Record<string, unknown>) {
    if (!data || typeof data !== 'object') {
      throw new BadRequestException('Invalid payload');
    }
    return this.delegate.create({ data });
  }

  async update(id: string, data: Record<string, unknown>) {
    if (!data || typeof data !== 'object') {
      throw new BadRequestException('Invalid payload');
    }
    return this.delegate.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.delegate.delete({ where: { id } });
  }

  protected buildWhere(search?: string, filter: Record<string, any> = {}) {
    const clauses = Object.entries(filter).reduce<Record<string, unknown>>((accumulator, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        accumulator[key] = value;
      }
      return accumulator;
    }, {});

    if (!search || this.searchableFields.length === 0) {
      return clauses;
    }

    return {
      ...clauses,
      OR: this.searchableFields.map((field) => ({ [field]: { contains: search, mode: 'insensitive' } })),
    };
  }
}