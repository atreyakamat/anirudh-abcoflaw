import { Body, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CrudService } from './crud.service.js';

export class CrudController {
  constructor(protected readonly service: CrudService) {}

  @Get()
  list(@Query() query: Record<string, any>) {
    return this.service.list(query);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }

  @Post()
  create(@Body() body: Record<string, any>) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}