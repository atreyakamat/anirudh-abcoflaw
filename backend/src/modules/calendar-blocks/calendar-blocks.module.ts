import { Module } from '@nestjs/common';
import { CalendarBlocksController } from './calendar-blocks.controller.js';
import { CalendarBlocksService } from './calendar-blocks.service.js';

@Module({
  controllers: [CalendarBlocksController],
  providers: [CalendarBlocksService],
})
export class CalendarBlocksModule {}