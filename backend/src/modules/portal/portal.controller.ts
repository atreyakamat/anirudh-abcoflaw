import { BadRequestException, Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { IsEmail, IsOptional, IsString, MinLength, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { PortalService } from './portal.service.js';

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

class PortalLoginDto {
  @IsString()
  @MinLength(7)
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;
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

@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

  @Public()
  @Post('send-otp')
  async sendOtp(@Body() body: unknown) {
    const payload = assertValid(SendOtpDto, body);
    return this.portalService.sendOtp(payload.phone, payload.email);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    const payload = assertValid(VerifyOtpDto, body);
    const result = await this.portalService.verifyOtp(payload.phone, payload.code);
    
    response.cookie('session', result.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return { ok: true, token: result.token, user: result.user };
  }

  @Public()
  @Post('login')
  login(@Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    const payload = assertValid(PortalLoginDto, body);
    return this.portalService.login(payload.phone, payload.email).then(({ token, user }) => {
      response.cookie('session', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      });
      return { ok: true, user, token };
    });
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
    if (user.role !== 'CLIENT') {
      return { ok: false, message: 'Client role required' };
    }
    return { ok: true, client: await this.portalService.me(user.id) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('summary')
  async summary(@CurrentUser() user: { id: string; role: string }) {
    if (user.role !== 'CLIENT') {
      return { ok: false, message: 'Client role required' };
    }
    return this.portalService.summary(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('documents')
  async getDocuments(@CurrentUser() user: { id: string; role: string }) {
    if (user.role !== 'CLIENT') {
      return { ok: false, message: 'Client role required' };
    }
    return { ok: true, documents: await this.portalService.getDocuments(user.id) };
  }

  @UseGuards(JwtAuthGuard)
  @Post('documents/upload')
  async uploadDocument(
    @CurrentUser() user: { id: string; role: string },
    @Body() body: unknown,
  ) {
    if (user.role !== 'CLIENT') {
      return { ok: false, message: 'Client role required' };
    }
    const payload = assertValid(UploadDocumentDto, body);
    const doc = await this.portalService.uploadDocument(user.id, {
      originalName: payload.originalName,
      fileName: payload.fileName,
      filePath: payload.filePath,
      fileSize: payload.fileSize || 1024,
      mimeType: payload.mimeType || 'application/pdf',
      documentType: (payload.documentType as any) || 'PDF',
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
    if (user.role !== 'CLIENT') {
      return { ok: false, message: 'Client role required' };
    }
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