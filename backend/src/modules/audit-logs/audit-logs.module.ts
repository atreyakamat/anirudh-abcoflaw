import { Module, Global } from '@nestjs/common';
import { AuditLogsController } from './audit-logs.controller.js';
import { AuditLogsService } from './audit-logs.service.js';
import { AuditContext } from '../../common/audit/audit-context.js';

@Global()
@Module({
  controllers: [AuditLogsController],
  providers: [AuditLogsService, AuditContext],
  exports: [AuditLogsService, AuditContext],
})
export class AuditLogsModule {}