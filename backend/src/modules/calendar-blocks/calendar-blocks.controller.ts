import { Controller } from '@nestjs/common';
import { CrudController } from '../../common/crud/crud.controller.js';
import { CalendarBlocksService } from './calendar-blocks.service.js';

@Controller('calendar-blocks')
export class CalendarBlocksController extends CrudController {
  constructor(service: CalendarBlocksService) {
    super(service);
  }
}