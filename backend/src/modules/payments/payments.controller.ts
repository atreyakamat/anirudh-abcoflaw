import { Controller } from '@nestjs/common';
import { CrudController } from '../../common/crud/crud.controller.js';
import { PaymentsService } from './payments.service.js';

@Controller('payments')
export class PaymentsController extends CrudController {
  constructor(service: PaymentsService) {
    super(service);
  }
}