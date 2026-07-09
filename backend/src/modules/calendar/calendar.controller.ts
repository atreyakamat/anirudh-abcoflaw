import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CalendarService } from './calendar.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard, Roles } from '../../common/guards/roles.guard.js';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@ApiTags('Calendar')
@Controller('calendar')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('slots')
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get availability slots' })
  getSlots(@CurrentUser('id') userId: string, @Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.calendarService.getSlots(userId, new Date(startDate), new Date(endDate));
  }

  @Get('appointments')
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiOperation({ summary: 'Get appointments in date range' })
  getAppointments(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.calendarService.getAppointmentsInRange(new Date(startDate), new Date(endDate));
  }

  @Post('slots')
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create availability slots' })
  createSlots(@CurrentUser('id') userId: string, @Body() body: { date: string; slots: { startTime: string; endTime: string }[] }) {
    return this.calendarService.createSlots(userId, new Date(body.date), body.slots);
  }

  @Put('slots/:id/block')
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiOperation({ summary: 'Block a slot' })
  blockSlot(@Param('id') id: string) {
    return this.calendarService.blockSlot(id);
  }

  @Put('slots/:id/unblock')
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiOperation({ summary: 'Unblock a slot' })
  unblockSlot(@Param('id') id: string) {
    return this.calendarService.unblockSlot(id);
  }

  @Delete('slots/:id')
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a slot' })
  deleteSlot(@Param('id') id: string) {
    return this.calendarService.deleteSlot(id);
  }
}