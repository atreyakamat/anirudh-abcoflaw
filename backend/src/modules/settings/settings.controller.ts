import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard, Roles } from '../../common/guards/roles.guard.js';
import { UserRole } from '@prisma/client';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all public settings' })
  findAll() {
    return this.settingsService.findAll(true);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all settings (admin only)' })
  findAllPrivate() {
    return this.settingsService.findAll(false);
  }

  @Get(':key')
  @ApiOperation({ summary: 'Get setting by key' })
  findOne(@Param('key') key: string) {
    return this.settingsService.findByKey(key);
  }

  @Put(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update setting (admin only)' })
  update(
    @Param('key') key: string,
    @Body() body: { value: any; category?: string; isPublic?: boolean },
    @Body('userId') userId?: string,
  ) {
    return this.settingsService.set(
      key,
      body.value,
      body.category || 'general',
      body.isPublic || false,
    );
  }

  @Delete(':key')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete setting (admin only)' })
  delete(@Param('key') key: string) {
    return this.settingsService.delete(key);
  }

  @Post('initialize')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Initialize default settings (admin only)' })
  initialize() {
    return this.settingsService.initializeDefaults();
  }
}