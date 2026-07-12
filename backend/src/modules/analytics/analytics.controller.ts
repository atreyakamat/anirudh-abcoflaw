import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard, Roles } from '../../common/guards/roles.guard.js';
import { UserRole } from '@prisma/client';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard stats' })
  getDashboardStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('appointment-trends')
  @ApiOperation({ summary: 'Get appointment trends' })
  getAppointmentTrends(@Query('days') days?: number) {
    return this.analyticsService.getAppointmentTrends(days);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue by month' })
  getRevenue(@Query('months') months?: number) {
    return this.analyticsService.getRevenueByMonth(months);
  }
}