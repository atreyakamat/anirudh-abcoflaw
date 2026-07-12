import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from './dto/update-appointment.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';
import { AddNoteDto } from './dto/add-note.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard, Roles } from '../../common/guards/roles.guard.js';
import { UserRole, AppointmentStatus } from '@prisma/client';
import { PaginationDto, SortableDto, FilterableDto } from '../../common/dto/pagination.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all appointments (admin/lawyer/receptionist)' })
  findAll(@Query() query: PaginationDto & SortableDto & FilterableDto & { status?: AppointmentStatus; clientId?: string }) {
    return this.appointmentsService.findAll(query);
  }

  @Get('today')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get today's appointments" })
  getTodayAppointments() {
    return this.appointmentsService.getTodayAppointments();
  }

  @Get('upcoming')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get upcoming appointments' })
  getUpcomingAppointments(@Query('limit') limit?: number) {
    return this.appointmentsService.getUpcomingAppointments(limit);
  }

  @Get('status-counts')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get appointment counts by status' })
  getStatusCounts() {
    return this.appointmentsService.getStatusCounts();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get appointment by ID' })
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create new appointment (public booking)' })
  create(
    @Body() createAppointmentDto: CreateAppointmentDto,
    @CurrentUser('id') userId?: string,
  ) {
    return this.appointmentsService.create(createAppointmentDto, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update appointment' })
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
    @CurrentUser('id') userId?: string,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto, userId);
  }

  @Post(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update appointment status' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateStatusDto,
    @CurrentUser('id') userId?: string,
  ) {
    return this.appointmentsService.updateStatus(id, updateStatusDto.status, userId, updateStatusDto.reason);
  }

  @Post(':id/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirm appointment' })
  confirm(
    @Param('id') id: string,
    @CurrentUser('id') userId?: string,
    @Body('reason') reason?: string,
  ) {
    return this.appointmentsService.updateStatus(id, AppointmentStatus.CONFIRMED, userId, reason);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reject appointment' })
  reject(
    @Param('id') id: string,
    @CurrentUser('id') userId?: string,
    @Body('reason') reason?: string,
  ) {
    return this.appointmentsService.updateStatus(id, AppointmentStatus.REJECTED, userId, reason);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel appointment' })
  cancel(
    @Param('id') id: string,
    @CurrentUser('id') userId?: string,
    @Body('reason') reason?: string,
  ) {
    return this.appointmentsService.updateStatus(id, AppointmentStatus.CANCELLED, userId, reason);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark appointment as completed' })
  complete(
    @Param('id') id: string,
    @CurrentUser('id') userId?: string,
    @Body('reason') reason?: string,
  ) {
    return this.appointmentsService.updateStatus(id, AppointmentStatus.COMPLETED, userId, reason);
  }

  @Post(':id/notes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add note to appointment' })
  addNote(
    @Param('id') id: string,
    @Body() addNoteDto: AddNoteDto,
    @CurrentUser('id') userId?: string,
  ) {
    return this.appointmentsService.addNote(id, userId!, addNoteDto.content);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete appointment' })
  delete(@Param('id') id: string) {
    return this.appointmentsService.softDelete(id);
  }
}