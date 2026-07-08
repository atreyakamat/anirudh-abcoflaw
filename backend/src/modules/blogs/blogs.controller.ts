import { Controller } from '@nestjs/common';
import { CrudController } from '../../common/crud/crud.controller.js';
import { BlogsService } from './blogs.service.js';

@Controller('blogs')
export class BlogsController extends CrudController {
  constructor(service: BlogsService) {
    super(service);
  }
}