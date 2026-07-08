import { Controller } from '@nestjs/common';
import { CrudController } from '../../common/crud/crud.controller.js';
import { NotificationsService } from './notifications.service.js';

@Controller('notifications')
export class NotificationsController extends CrudController {
  constructor(service: NotificationsService) {
    super(service);
  }
}