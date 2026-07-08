import { Injectable } from '@nestjs/common';
import { CrudService } from '../../common/crud/crud.service.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class AuditLogsService extends CrudService {
  constructor(prisma: PrismaService) {
    super(prisma.auditLog, ['action', 'entity', 'entityId']);
  }

  override async remove(): Promise<never> {
    throw new Error('Audit logs cannot be deleted');
  }
}