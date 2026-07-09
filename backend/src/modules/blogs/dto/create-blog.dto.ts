import { BlogPostStatus } from '@prisma/client';
import { IsArray, IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @MaxLength(180)
  title!: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  seoTitle?: string;

  @IsOptional()
  @IsString()
  seoDescription?: string;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsArray()
  tagIds?: string[];

  @IsOptional()
  status?: BlogPostStatus;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}