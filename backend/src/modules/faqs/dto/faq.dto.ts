import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min, ValidateNested } from 'class-validator';

export class CreateFaqDto {
  @IsString()
  @MaxLength(120)
  question!: string;

  @IsString()
  answer!: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}

export class UpdateFaqDto {
  @IsOptional()
  @IsString()
  question?: string;

  @IsOptional()
  @IsString()
  answer?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;
}

export class ReorderFaqItemDto {
  @IsString()
  id!: string;

  @IsInt()
  @Min(0)
  order!: number;

  @IsOptional()
  @IsString()
  categoryId?: string;
}

export class ReorderFaqDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderFaqItemDto)
  items!: ReorderFaqItemDto[];
}