import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AutomationsService } from './automations.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard, Roles } from '../../common/guards/roles.guard.js';
import { UserRole } from '@prisma/client';

@ApiTags('Automations')
@Controller('automations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.LAWYER)
@ApiBearerAuth()
export class AutomationsController {
  constructor(private readonly automationsService: AutomationsService) {}

  @Get()
  @ApiOperation({ summary: 'List all intelligent workflows and AI automations' })
  getWorkflows() {
    return {
      success: true,
      data: this.automationsService.getWorkflows(),
    };
  }

  @Get('logs')
  @ApiOperation({ summary: 'List recent workflow execution history logs' })
  getLogs() {
    return {
      success: true,
      data: this.automationsService.getLogs(),
    };
  }

  @Get('outbox')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'List durable transactional outbox automation events (Admin only)' })
  async getOutboxEvents(@Query('page') page?: number, @Query('limit') limit?: number) {
    const res = await this.automationsService.getOutboxEvents(Number(page) || 1, Number(limit) || 20);
    return res;
  }

  @Post('outbox/:id/retry')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Manually retry a failed/dead-letter outbox event (Admin only)' })
  async retryOutboxEvent(@Param('id') id: string) {
    const res = await this.automationsService.retryOutboxEvent(id);
    return res;
  }

  @Post(':id/toggle')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Enable or disable a specific workflow' })
  toggleWorkflow(@Param('id') id: string) {
    return {
      success: true,
      data: this.automationsService.toggleWorkflow(id),
    };
  }

  @Post(':id/trigger')
  @ApiOperation({ summary: 'Manually trigger a test workflow execution' })
  async triggerWorkflow(@Param('id') id: string, @Body() body: any) {
    const log = await this.automationsService.triggerWorkflow(id, body);
    return {
      success: true,
      data: log,
    };
  }
}
