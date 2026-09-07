import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditLogsService } from '../../modules/audit-logs/audit-logs.service.js';

@Injectable()
export class AuditLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuditLoggingMiddleware.name);

  constructor(private auditLogsService: AuditLogsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const userId = (req as any).user?.id;

      if (userId && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
        const entityMatch = req.originalUrl.match(/\/api\/v1\/(\w+)/);
        const entity = entityMatch ? entityMatch[1] : 'unknown';

        this.auditLogsService.create({
          userId,
          action: this.mapMethodToAction(req.method),
          entity: entity.charAt(0).toUpperCase() + entity.slice(1) as any,
          entityId: (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) || '',
          newValue: req.method !== 'DELETE' ? req.body : undefined,
          reason: req.body?.reason,
          ipAddress: req.ip,
          userAgent: req.get('user-agent'),
        }).catch(err => this.logger.error('Failed to create audit log', err));
      }

      this.logger.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    });

    next();
  }

  private mapMethodToAction(method: string): 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' {
    switch (method) {
      case 'POST': return 'CREATE';
      case 'PUT':
      case 'PATCH': return 'UPDATE';
      case 'DELETE': return 'DELETE';
      default: return 'UPDATE';
    }
  }
}