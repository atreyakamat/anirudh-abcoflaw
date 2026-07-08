import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionGuard } from '../../common/auth/session.guard.js';
import { CurrentUser } from '../../common/auth/current-user.decorator.js';
import { StaticCredentialsProvider } from '../../common/auth/static-credentials.provider.js';
import { SessionTokenService } from '../../common/auth/session-token.service.js';

class LoginDto {
  username!: string;
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly credentials: StaticCredentialsProvider,
    private readonly sessionTokens: SessionTokenService,
  ) {}

  @Post('login')
  login(@Body() body: LoginDto, @Res({ passthrough: true }) response: Response) {
    const identity = this.credentials.verify(body.username, body.password);
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