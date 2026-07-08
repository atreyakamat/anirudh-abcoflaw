import { PaginationQuery, PaginatedResult } from '@crm/shared';

export function normalizePagination(query: PaginationQuery): Required<PaginationQuery> {
  return {
    page: Math.max(1, Number(query.page ?? 1)),
    limit: Math.min(100, Math.max(1, Number(query.limit ?? 20))),
    search: query.search?.trim() ?? '',
    sortBy: query.sortBy?.trim() ?? 'createdAt',
    sortOrder: query.sortOrder === 'asc' ? 'asc' : 'desc',
  };
}

export function toPaginatedResult<T>(items: T[], total: number, page: number, limit: number): PaginatedResult<T> {
  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}