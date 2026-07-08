import { Controller } from '@nestjs/common';
import { CrudController } from '../../common/crud/crud.controller.js';
import { FaqsService } from './faqs.service.js';

@Controller('faqs')
export class FaqsController extends CrudController {
  constructor(service: FaqsService) {
    super(service);
  }
}