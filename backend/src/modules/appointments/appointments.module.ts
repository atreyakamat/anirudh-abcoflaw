import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller.js';
import { AppointmentsService } from './appointments.service.js';
import { ClientsModule } from '../clients/clients.module.js';
import { NotificationsModule } from '../notifications/notifications.module.js';

@Module({
  imports: [ClientsModule, NotificationsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}