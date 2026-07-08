import { BadRequestException, Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IsString, MinLength, validateSync } from 'class-validator';
import { Request, Response } from 'express';
import { SessionGuard } from '../../common/auth/session.guard.js';
import { CurrentUser } from '../../common/auth/current-user.decorator.js';
import { StaticCredentialsProvider } from '../../common/auth/static-credentials.provider.js';
import { SessionTokenService } from '../../common/auth/session-token.service.js';

class LoginDto {
  @IsString()
  @MinLength(2)
  username!: string;

  @IsString()
  @MinLength(4)
  password!: string;
}

function assertValidLogin(body: unknown) {
  const instance = plainToInstance(LoginDto, body);
  const errors = validateSync(instance, { whitelist: true, forbidUnknownValues: true });
  if (errors.length > 0) {
    throw new BadRequestException('Invalid login payload');
  }
  return instance;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly credentials: StaticCredentialsProvider,
    private readonly sessionTokens: SessionTokenService,
  ) {}

  @Post('login')
  login(@Body() body: unknown, @Res({ passthrough: true }) response: Response) {
    const payload = assertValidLogin(body);
    const identity = this.credentials.verify(payload.username, payload.password);
    if (!identity) {
      return { ok: false, message: 'Invalid credentials' };
    }

    const token = this.sessionTokens.sign(identity);
    response.cookie('session', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return { ok: true, user: identity };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('session', { path: '/' });
    return { ok: true };
  }

  @UseGuards(SessionGuard)
  @Get('me')
  me(@CurrentUser() user: ReturnType<StaticCredentialsProvider['verify']>) {
    return { ok: true, user };
  }
}