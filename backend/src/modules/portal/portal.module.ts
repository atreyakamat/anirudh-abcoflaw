import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module.js';
import { PortalController } from './portal.controller.js';
import { PortalService } from './portal.service.js';

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [PortalController],
  providers: [PortalService],
})
export class PortalModule {}