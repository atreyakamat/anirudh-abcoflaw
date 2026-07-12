import { Controller } from '@nestjs/common';
import { CrudController } from '../../common/crud/crud.controller.js';
import { BlogCategoriesService } from './blog-categories.service.js';

@Controller('blog-categories')
export class BlogCategoriesController extends CrudController {
  constructor(service: BlogCategoriesService) {
    super(service);
  }
}