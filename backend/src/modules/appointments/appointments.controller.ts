import { Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/auth/current-user.decorator.js';
import { SessionGuard } from '../../common/auth/session.guard.js';
import { CrudController } from '../../common/crud/crud.controller.js';
import { AppointmentsService } from './appointments.service.js';

@Controller('appointments')
export class AppointmentsController extends CrudController {
  constructor(service: AppointmentsService) {
    super(service);
  }

  @UseGuards(SessionGuard)
  @Post('bulk-archive')
  bulkArchive(@CurrentUser() user: unknown) {
    return { ok: true, user };
  }
}