import {
  IsString,
  IsEmail,
  IsOptional,
  IsDateString,
  IsEnum,
  MinLength,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BookingSource } from '@prisma/client';

export class CreateAppointmentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'I need legal advice regarding...' })
  @IsString()
  @MinLength(10)
  description: string;

  @ApiProperty({ example: '2024-12-20' })
  @IsDateString()
  preferredDate: string;

  @ApiProperty({ example: '10:00' })
  @IsString()
  preferredTime: string;

  @ApiPropertyOptional({ enum: BookingSource })
  @IsOptional()
  @IsEnum(BookingSource)
  source?: BookingSource;
}

export class UpdateAppointmentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(10)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  preferredDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preferredTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lawyerNote?: string;
}

export class UpdateStatusDto {
  @ApiProperty()
  @IsEnum([
    'PENDING_REVIEW',
    'PENDING_LAWYER_CONFIRMATION',
    'CONFIRMED',
    'REJECTED',
    'RESCHEDULED',
    'UPCOMING',
    'REMINDER_SENT',
    'COMPLETED',
    'CANCELLED',
    'ARCHIVED',
  ])
  status: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  reason?: string;
}

export class AddNoteDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  content: string;
}

export class AppointmentQueryDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientId?: string;
}