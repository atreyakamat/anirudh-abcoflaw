import { Module } from '@nestjs/common';
import { SessionGuard } from '../../common/auth/session.guard.js';
import { SessionTokenService } from '../../common/auth/session-token.service.js';
import { StaticCredentialsProvider } from '../../common/auth/static-credentials.provider.js';
import { AuthController } from './auth.controller.js';

@Module({
  controllers: [AuthController],
  providers: [StaticCredentialsProvider, SessionTokenService, SessionGuard],
  exports: [SessionGuard, SessionTokenService],
})
export class AuthModule {}