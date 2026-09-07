import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AutomationsController } from './automations.controller.js';
import { AutomationsService } from './automations.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [AutomationsController],
  providers: [AutomationsService],
  exports: [AutomationsService],
})
export class AutomationsModule {}
