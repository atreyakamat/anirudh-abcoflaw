import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AuditAction, AuditEntity } from '@prisma/client';

export interface CreateAuditLogDto {
  userId?: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogsService {
  private readonly logger = new Logger(AuditLogsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    userId?: string;
    entity?: string;
    entityId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 50;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.userId) where.userId = query.userId;
    if (query.entity) where.entity = query.entity;
    if (query.entityId) where.entityId = query.entityId;
    if (query.action) where.action = query.action;
    if (query.startDate || query.endDate) {
      where.createdAt = {};
      if (query.startDate) where.createdAt.gte = new Date(query.startDate);
      if (query.endDate) where.createdAt.lte = new Date(query.endDate);
    }

    const [items, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    };
  }

  async findByEntity(entity: string, entityId: string) {
    return this.prisma.auditLog.findMany({
      where: { entity: entity as any, entityId },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: string, limit = 50) {
    return this.prisma.auditLog.findMany({
      where: { userId },
      include: { user: { select: { id: true, firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async create(data: CreateAuditLogDto) {
    try {
      const auditLog = await this.prisma.auditLog.create({
        data: {
          userId: data.userId,
          action: data.action,
          entity: data.entity,
          entityId: data.entityId,
          oldValue: data.oldValue ?? undefined,
          newValue: data.newValue ?? undefined,
          reason: data.reason,
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
        },
      });
      return auditLog;
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Log asynchronously without blocking the main operation
   * Use this for non-critical audit logging that shouldn't fail the main transaction
   */
  logAsync(data: CreateAuditLogDto): void {
    setImmediate(() => {
      this.create(data).catch(err => {
        this.logger.error(`Async audit log failed: ${err.message}`);
      });
    });
  }

  /**
   * Log a create operation
   */
  async logCreate(params: {
    userId?: string;
    entity: AuditEntity;
    newData: any;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.create({
      userId: params.userId,
      action: AuditAction.CREATE,
      entity: params.entity,
      entityId: params.newData.id || '',
      newValue: params.newData,
      reason: params.reason,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  }

  /**
   * Log an update operation with before/after state
   */
  async logUpdate(params: {
    userId?: string;
    entity: AuditEntity;
    entityId: string;
    oldData: any;
    newData: any;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const action = this.detectAction(params.oldData, params.newData);
    return this.create({
      userId: params.userId,
      action,
      entity: params.entity,
      entityId: params.entityId,
      oldValue: params.oldData,
      newValue: params.newData,
      reason: params.reason,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  }

  /**
   * Log a delete operation
   */
  async logDelete(params: {
    userId?: string;
    entity: AuditEntity;
    entityId: string;
    deletedData: any;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.create({
      userId: params.userId,
      action: AuditAction.DELETE,
      entity: params.entity,
      entityId: params.entityId,
      oldValue: params.deletedData,
      reason: params.reason,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  }

  /**
   * Log a status change (specialized update)
   */
  async logStatusChange(params: {
    userId?: string;
    entity: AuditEntity;
    entityId: string;
    oldStatus: string;
    newStatus: string;
    reason?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.create({
      userId: params.userId,
      action: AuditAction.STATUS_CHANGE,
      entity: params.entity,
      entityId: params.entityId,
      oldValue: { status: params.oldStatus },
      newValue: { status: params.newStatus },
      reason: params.reason,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  }

  private detectAction(oldData: any, newData: any): AuditAction {
    if (oldData === null || oldData === undefined) return AuditAction.CREATE;
    if (newData === null || newData === undefined) return AuditAction.DELETE;
    return AuditAction.UPDATE;
  }
}