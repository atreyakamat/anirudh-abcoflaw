import { IsString, IsOptional, IsEnum, IsDateString, MinLength, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingSource } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  clientId?: string;

  @ApiProperty()
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ description: 'ISO 8601 date string e.g. 2026-08-15 or 2026-08-15T10:00:00Z' })
  @IsDateString()
  preferredDate: string;

  @ApiProperty()
  @IsString()
  preferredTime: string;

  @ApiPropertyOptional({ enum: BookingSource })
  @IsEnum(BookingSource)
  @IsOptional()
  source?: BookingSource;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Practice area e.g. Corporate Law, Family Law' })
  @IsString()
  @IsOptional()
  practiceArea?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documentIds?: string[];
}