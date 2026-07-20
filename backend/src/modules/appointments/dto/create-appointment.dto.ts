import { IsString, IsOptional, IsEnum, IsDateString, MinLength, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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

  @ApiProperty()
  @IsDateString()
  @Type(() => Date)
  preferredDate: Date;

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

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documentIds?: string[];
}