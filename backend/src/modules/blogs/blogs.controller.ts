import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { BlogsService } from './blogs.service.js';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blog.dto.js';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard.js';
import { RolesGuard, Roles } from '../../common/guards/roles.guard.js';
import { UserRole, BlogPostStatus } from '@prisma/client';
import { PaginationDto, SortableDto, FilterableDto } from '../../common/dto/pagination.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';

@ApiTags('Blogs')
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Public()
  @Get('published')
  @ApiOperation({ summary: 'Get published blog posts (public)' })
  findPublished(@Query() query: PaginationDto & SortableDto & FilterableDto) {
    return this.blogsService.findPublished(query);
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get blog post by slug (public)' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all blog posts (admin/lawyer)' })
  findAll(@Query() query: PaginationDto & SortableDto & FilterableDto & { status?: BlogPostStatus; categoryId?: string }) {
    return this.blogsService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get blog post by ID' })
  findOne(@Param('id') id: string) {
    return this.blogsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create blog post' })
  create(@Body() dto: CreateBlogPostDto, @CurrentUser('id') userId: string) {
    return this.blogsService.create(dto, userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update blog post' })
  update(@Param('id') id: string, @Body() dto: UpdateBlogPostDto) {
    return this.blogsService.update(id, dto);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.LAWYER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish blog post' })
  publish(@Param('id') id: string) {
    return this.blogsService.publish(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete blog post' })
  delete(@Param('id') id: string) {
    return this.blogsService.softDelete(id);
  }
}