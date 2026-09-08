import { IsString, IsOptional, IsDateString, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SubmitLeadDto {
  @ApiPropertyOptional({ description: 'Lead full name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Lead email; required to create a booking' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Lead phone / WhatsApp' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ description: 'Brief matter description; used as the appointment description when booking' })
  @IsString()
  @IsOptional()
  message?: string;

  @ApiPropertyOptional({ description: 'Practice area e.g. Property & Conveyancing (RERA / Title)' })
  @IsString()
  @IsOptional()
  practiceArea?: string;

  @ApiPropertyOptional({ description: 'ISO 8601 date string e.g. 2026-08-15 — provide with preferredTime to create a booking' })
  @IsDateString()
  @IsOptional()
  preferredDate?: string;

  @ApiPropertyOptional({ description: 'Preferred time slot "HH:MM" — provide with preferredDate to create a booking' })
  @IsString()
  @IsOptional()
  preferredTime?: string;
}
