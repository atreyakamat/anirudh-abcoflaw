import { Module } from '@nestjs/common';
import { ChatbotController } from './chatbot.controller.js';
import { ChatbotService } from './chatbot.service.js';
import { NotificationsModule } from '../notifications/notifications.module.js';
import { AppointmentsModule } from '../appointments/appointments.module.js';

@Module({
  imports: [NotificationsModule, AppointmentsModule],
  controllers: [ChatbotController],
  providers: [ChatbotService],
  exports: [ChatbotService],
})
export class ChatbotModule {}