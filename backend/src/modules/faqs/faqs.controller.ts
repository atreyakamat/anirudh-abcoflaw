import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FaqsService } from './faqs.service.js';
import { CreateFaqDto, UpdateFaqDto, ReorderFaqDto } from './dto/faq.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard, Roles } from '../../common/guards/roles.guard.js';
import { UserRole } from '@prisma/client';
import { Public } from '../../common/decorators/public.decorator.js';

@ApiTags('FAQs')
@Controller('faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all visible FAQs (public)' })
  findAll(@Query('search') search?: string, @Query('categoryId') categoryId?: string) {
    return this.faqsService.findAll(search, categoryId, true);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Get FAQ categories (public)' })
  getCategories() {
    return this.faqsService.findAllCategories();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all FAQs including hidden (admin)' })
  findAllAdmin(@Query('search') search?: string, @Query('categoryId') categoryId?: string) {
    return this.faqsService.findAll(search, categoryId, false);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER, UserRole.RECEPTIONIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get FAQ by ID' })
  findOne(@Param('id') id: string) {
    return this.faqsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create FAQ' })
  create(@Body() dto: CreateFaqDto) {
    return this.faqsService.create(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update FAQ' })
  update(@Param('id') id: string, @Body() dto: UpdateFaqDto) {
    return this.faqsService.update(id, dto);
  }

  @Put('reorder/batch')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reorder FAQs' })
  reorder(@Body() dto: ReorderFaqDto[]) {
    return this.faqsService.reorder(dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete FAQ' })
  delete(@Param('id') id: string) {
    return this.faqsService.delete(id);
  }
}