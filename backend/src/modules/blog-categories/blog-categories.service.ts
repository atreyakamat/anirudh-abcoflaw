import { Injectable } from '@nestjs/common';
import { CrudService } from '../../common/crud/crud.service.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class BlogCategoriesService extends CrudService {
  constructor(prisma: PrismaService) {
    super(prisma.blogCategory, ['name', 'slug', 'description']);
  }
}