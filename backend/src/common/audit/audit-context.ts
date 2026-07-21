import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AuditAction, AuditEntity } from '@prisma/client';

export interface AuditLogData {
  userId?: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  metadata?: Record<string, any>;
}

@Injectable({ scope: Scope.REQUEST })
export class AuditContext {
  private userId: string | undefined;
  private requestId: string;

  constructor(@Inject(REQUEST) private readonly request: Request) {
    this.requestId = crypto.randomUUID();
  }

  setUser(userId: string) {
    this.userId = userId;
  }

  getUserId(): string | undefined {
    return this.userId || (this.request.user as any)?.id;
  }

  getRequestId(): string {
    return this.requestId;
  }

  getIpAddress(): string {
    return (this.request.headers['x-forwarded-for'] as string || this.request.ip || this.request.socket.remoteAddress || '').split(',')[0].trim();
  }

  getUserAgent(): string {
    return this.request.get('user-agent') || '';
  }

  getMetadata(): Record<string, any> {
    return {
      requestId: this.requestId,
      ip: this.getIpAddress(),
      userAgent: this.getUserAgent(),
      path: this.request.path,
      method: this.request.method,
    };
  }
}