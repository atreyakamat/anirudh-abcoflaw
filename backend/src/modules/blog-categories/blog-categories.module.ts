import { Module } from '@nestjs/common';
import { BlogCategoriesController } from './blog-categories.controller.js';
import { BlogCategoriesService } from './blog-categories.service.js';

@Module({
  controllers: [BlogCategoriesController],
  providers: [BlogCategoriesService],
})
export class BlogCategoriesModule {}