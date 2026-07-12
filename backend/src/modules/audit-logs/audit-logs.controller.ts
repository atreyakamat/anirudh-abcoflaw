import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard, Roles } from '../../common/guards/roles.guard.js';
import { UserRole, AuditAction, AuditEntity } from '@prisma/client';
import { PaginationDto, SortableDto, FilterableDto } from '../../common/dto/pagination.dto.js';

@ApiTags('Audit Logs')
@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all audit logs (admin only)' })
  findAll(
    @Query()
    query: PaginationDto &
      SortableDto &
      FilterableDto & {
        userId?: string;
        entity?: AuditEntity;
        entityId?: string;
        action?: AuditAction;
      },
  ) {
    return this.auditLogsService.findAll(query);
  }

  @Get('entity/:entity/:entityId')
  @ApiOperation({ summary: 'Get audit logs for specific entity' })
  findByEntity(@Param('entity') entity: string, @Param('entityId') entityId: string) {
    return this.auditLogsService.findByEntity(entity as AuditEntity, entityId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get audit logs for specific user' })
  findByUser(@Param('userId') userId: string, @Query('limit') limit?: number) {
    return this.auditLogsService.findByUser(userId, limit);
  }
}