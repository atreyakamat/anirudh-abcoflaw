import { Controller } from '@nestjs/common';
import { CrudController } from '../../common/crud/crud.controller.js';
import { DocumentsService } from './documents.service.js';

@Controller('documents')
export class DocumentsController extends CrudController {
  constructor(service: DocumentsService) {
    super(service);
  }
}