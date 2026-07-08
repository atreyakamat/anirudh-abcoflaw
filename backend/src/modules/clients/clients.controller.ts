import { Controller } from '@nestjs/common';
import { CrudController } from '../../common/crud/crud.controller.js';
import { ClientsService } from './clients.service.js';

@Controller('clients')
export class ClientsController extends CrudController {
  constructor(service: ClientsService) {
    super(service);
  }
}