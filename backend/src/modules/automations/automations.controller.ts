import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
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
