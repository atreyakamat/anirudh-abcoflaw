import { BadRequestException, Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { IsEmail, IsOptional, IsString, MinLength, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { CurrentUser } from '../../common/auth/current-user.decorator.js';
import { SessionGuard } from '../../common/auth/session.guard.js';
import { Roles } from '@crm/shared';
import { PortalService } from './portal.service.js';

class PortalLoginDto {
  @IsString()
  @MinLength(7)
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

function assertValid<T extends object>(cls: new () => T, body: unknown) {
  const instance = plainToInstance(cls, body);
  const errors = validateSync(instance, { whitelist: true, forbidUnknownValues: true });
  if (errors.length > 0) {
    throw new BadRequestException('Invalid portal login payload');
  }
  return instance;
}

@Controller('portal')
export class PortalController {
  constructor(private readonly portalService: PortalService) {}

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
      return { ok: true, user };
    });
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('session', { path: '/' });
    return { ok: true };
  }

  @UseGuards(SessionGuard)
  @Get('me')
  async me(@CurrentUser() user: { id: string; role: string }) {
    if (user.role !== Roles.CLIENT) {
      return { ok: false, message: 'Client role required' };
    }
    return { ok: true, client: await this.portalService.me(user.id) };
  }

  @UseGuards(SessionGuard)
  @Get('summary')
  async summary(@CurrentUser() user: { id: string; role: string }) {
    if (user.role !== Roles.CLIENT) {
      return { ok: false, message: 'Client role required' };
    }
    return this.portalService.summary(user.id);
  }
}