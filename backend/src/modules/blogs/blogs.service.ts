import { Injectable } from '@nestjs/common';
import { CrudService } from '../../common/crud/crud.service.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class BlogsService extends CrudService {
  constructor(prisma: PrismaService) {
    super(prisma.blog, ['title', 'slug', 'excerpt', 'content', 'seoTitle', 'metaDescription']);
  }
}