import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { IsEmail, IsOptional, IsString, MinLength, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PortalService } from './portal.service.js';

// ---------------------------------------------------------------------------
// DTOs — defined here for locality. These are portal-specific and not shared
// with the staff-side API, so co-location with the controller is intentional.
// ---------------------------------------------------------------------------

class SendOtpDto {
  @IsString()
  @MinLength(7)
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

class VerifyOtpDto {
  @IsString()
  @MinLength(7)
  phone!: string;

  @IsString()
  @MinLength(6)
  code!: string;
}

class UploadDocumentDto {
  @IsString()
  originalName!: string;

  @IsString()
  fileName!: string;

  @IsString()
  filePath!: string;

  @IsOptional()
  fileSize?: number;

  @IsOptional()
  mimeType?: string;

  @IsOptional()
  documentType?: string;

  @IsOptional()
  appointmentId?: string;
}

class RescheduleDto {
  @IsString()
  appointmentId!: string;

  @IsString()
  preferredDate!: string;

  @IsString()
  preferredTime!: string;

  @IsOptional()
  reason?: string;
}

function assertValid<T extends object>(cls: new () => T, body: unknown) {
  const instance = plainToInstance(cls, body);
  const errors = validateSync(instance, { whitelist: true, forbidUnknownValues: true });
  if (errors.length > 0) {
    throw new BadRequestException('Invalid portal payload');
  }
  return instance;
}

// ---------------------------------------------------------------------------
// Guard helper — enforces CLIENT role on portal-specific endpoints without
// relying on the staff RolesGuard (which only knows about UserRole enum values).
// ---------------------------------------------------------------------------
function assertClientRole(user: { id: string; role: string }) {
  if (user.role !== 'CLIENT') {
    throw new ForbiddenException('Client portal access required');
  }
}

@Controller('portal')
export class PortalController {
  constructor(
    private readonly portalService: PortalService,
    private readonly configService: ConfigService,
  ) {}

  @Public()
  @Post('send-otp')
  async sendOtp(@Body() body: unknown) {
    const payload = assertValid(SendOtpDto, body);
    return this.portalService.sendOtp(payload.phone, payload.email);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(
    @Body() body: unknown,
    @Res({ passthrough: true }) response: Response,
  ) {
    const payload = assertValid(VerifyOtpDto, body);
    const result = await this.portalService.verifyOtp(payload.phone, payload.code);

    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';

    response.cookie('session', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isProduction,
      path: '/',
      // Align cookie lifetime with token expiry (default 1 hour for portal)
      maxAge: 60 * 60 * 1000,
    });

    // token is returned in body so SPA clients that cannot read httpOnly cookies
    // (e.g. React Native) can store it themselves. Staff-side dashboard uses
    // the cookie exclusively.
    return { ok: true, token: result.token, user: result.user };
  }

  @Public()
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('session', { path: '/' });
    return { ok: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@CurrentUser() user: { id: string; role: string }) {
    assertClientRole(user);
    return { ok: true, client: await this.portalService.me(user.id) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  async summary(@CurrentUser() user: { id: string; role: string }) {
    assertClientRole(user);
    return this.portalService.summary(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('documents')
  async getDocuments(@CurrentUser() user: { id: string; role: string }) {
    assertClientRole(user);
    return { ok: true, documents: await this.portalService.getDocuments(user.id) };
  }

  @UseGuards(JwtAuthGuard)
  @Post('documents/upload')
  async uploadDocument(
    @CurrentUser() user: { id: string; role: string },
    @Body() body: unknown,
  ) {
    assertClientRole(user);
    const payload = assertValid(UploadDocumentDto, body);
    const doc = await this.portalService.uploadDocument(user.id, {
      originalName: payload.originalName,
      fileName: payload.fileName,
      filePath: payload.filePath,
      fileSize: payload.fileSize || 1024,
      mimeType: payload.mimeType || 'application/pdf',
      documentType: payload.documentType || 'PDF',
      appointmentId: payload.appointmentId,
    });
    return { ok: true, document: doc };
  }

  @UseGuards(JwtAuthGuard)
  @Post('appointments/reschedule')
  async rescheduleAppointment(
    @CurrentUser() user: { id: string; role: string },
    @Body() body: unknown,
  ) {
    assertClientRole(user);
    const payload = assertValid(RescheduleDto, body);
    const updated = await this.portalService.rescheduleAppointment(
      user.id,
      payload.appointmentId,
      payload.preferredDate,
      payload.preferredTime,
      payload.reason,
    );
    return { ok: true, appointment: updated };
  }
}