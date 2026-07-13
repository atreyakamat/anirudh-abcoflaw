import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { BlogPost, BlogPostStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PaginationDto, PaginatedResultDto, SortableDto, FilterableDto } from '../../common/dto/pagination.dto.js';
import { CreateBlogPostDto, UpdateBlogPostDto } from './dto/blog.dto.js';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async findAll(pagination: PaginationDto & SortableDto & FilterableDto & { status?: BlogPostStatus; categoryId?: string }): Promise<PaginatedResultDto<BlogPost>> {
    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 20;
    const { sortBy = 'createdAt', sortOrder = 'desc', search, status, categoryId } = pagination;
    const where: any = { deletedAt: null };
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { slug: { contains: search, mode: 'insensitive' } }, { excerpt: { contains: search, mode: 'insensitive' } }];
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    const [items, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where, orderBy: { [sortBy]: sortOrder }, skip: (page - 1) * limit, take: limit,
        include: { author: { select: { id: true, firstName: true, lastName: true } }, category: true, tags: { include: { tag: true } } },
      }),
      this.prisma.blogPost.count({ where }),
    ]);
    return new PaginatedResultDto(items, total, page, limit);
  }

  async findPublished(pagination: PaginationDto & SortableDto & FilterableDto): Promise<PaginatedResultDto<BlogPost>> {
    const page = Number(pagination.page) || 1;
    const limit = Number(pagination.limit) || 20;
    const { search, categoryId } = pagination;
    const where: any = { status: BlogPostStatus.PUBLISHED, deletedAt: null };
    if (search) where.OR = [{ title: { contains: search, mode: 'insensitive' } }, { excerpt: { contains: search, mode: 'insensitive' } }];
    if (categoryId) where.categoryId = categoryId;

    const [items, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where, orderBy: { publishedAt: 'desc' }, skip: (page - 1) * limit, take: limit,
        include: { author: { select: { firstName: true, lastName: true } }, category: true, tags: { include: { tag: true } } },
      }),
      this.prisma.blogPost.count({ where }),
    ]);
    return new PaginatedResultDto(items, total, page, limit);
  }

  async findBySlug(slug: string): Promise<BlogPost> {
    const post = await this.prisma.blogPost.findFirst({
      where: { slug, deletedAt: null },
      include: { author: { select: { id: true, firstName: true, lastName: true } }, category: true, tags: { include: { tag: true } } },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    if (post.status !== BlogPostStatus.PUBLISHED) {
      const admin = await this.prisma.user.findFirst({ where: { role: 'ADMIN' } });
      if (!admin) throw new NotFoundException('Blog post not published');
    }
    await this.prisma.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });
    return post;
  }

  async findOne(id: string): Promise<BlogPost> {
    const post = await this.prisma.blogPost.findFirst({
      where: { id, deletedAt: null },
      include: { author: { select: { id: true, firstName: true, lastName: true } }, category: true, tags: { include: { tag: true } } },
    });
    if (!post) throw new NotFoundException('Blog post not found');
    return post;
  }

  async create(data: CreateBlogPostDto, authorId: string): Promise<BlogPost> {
    const slug = await this.generateUniqueSlug(data.title);
    const postData: any = { ...data, slug, authorId };
    if (data.tagIds) {
      postData.tags = { create: data.tagIds.map((tagId) => ({ tagId })) };
      delete postData.tagIds;
    }
    if (data.status === BlogPostStatus.PUBLISHED) postData.publishedAt = new Date();
    return this.prisma.blogPost.create({ data: postData, include: { category: true, tags: { include: { tag: true } } } });
  }

  async update(id: string, data: UpdateBlogPostDto): Promise<BlogPost> {
    await this.findOne(id);
    const updateData: any = { ...data };
    if (data.title) updateData.slug = await this.generateUniqueSlug(data.title);
    if (data.status === BlogPostStatus.PUBLISHED) updateData.publishedAt = new Date();
    if (data.tagIds) {
      await this.prisma.blogPostTag.deleteMany({ where: { postId: id } });
      updateData.tags = { create: data.tagIds.map((tagId) => ({ tagId })) };
      delete updateData.tagIds;
    }
    return this.prisma.blogPost.update({ where: { id }, data: updateData, include: { category: true, tags: { include: { tag: true } } } });
  }

  async publish(id: string): Promise<BlogPost> {
    return this.update(id, { status: BlogPostStatus.PUBLISHED });
  }

  async softDelete(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.blogPost.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  private async generateUniqueSlug(title: string): Promise<string> {
    let slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let suffix = 0;
    let candidate = slug;
    while (await this.prisma.blogPost.findFirst({ where: { slug: candidate } })) {
      suffix++;
      candidate = `${slug}-${suffix}`;
    }
    return candidate;
  }
}