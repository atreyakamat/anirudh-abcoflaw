import { Controller, Get, Post, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard, Roles } from '../../common/guards/roles.guard.js';
import { UserRole, NotificationType } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get notifications' })
  findAll(@CurrentUser('id') userId: string, @Query() query: PaginationDto & { type?: NotificationType; unreadOnly?: boolean }) {
    return this.notificationsService.findAll(userId, query);
  }

  @Get('unread-count')
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get unread notification count' })
  getUnreadCount(@CurrentUser('id') userId: string) {
    return this.notificationsService.getUnreadCount(userId);
  }

  @Post(':id/read')
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark notification as read' })
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  @Post('read-all')
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  markAllAsRead(@CurrentUser('id') userId: string) {
    return this.notificationsService.markAllAsRead(userId);
  }
}