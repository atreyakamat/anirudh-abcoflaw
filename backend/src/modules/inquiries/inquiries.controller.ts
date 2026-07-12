import { BadRequestException, Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MinLength, validateSync } from 'class-validator';
import { InquiriesService } from './inquiries.service.js';

const UploadConstraints = {
  MAX_BYTES: 10 * 1024 * 1024, // 10MB
  MIME_TYPES: ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

class InquiryCreateDto {
  @IsString()
  @MinLength(2)
  fullName!: string;

  @IsString()
  @MinLength(7)
  phone!: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  preferredDate?: string;

  @IsOptional()
  @IsString()
  preferredTime?: string;

  @IsString()
  @MinLength(10)
  description!: string;

  @IsString()
  @MinLength(2)
  source!: string;
}

function assertInquiryBody(body: unknown) {
  const instance = plainToInstance(InquiryCreateDto, body);
  const errors = validateSync(instance, { whitelist: true, forbidUnknownValues: true });
  if (errors.length > 0) {
    throw new BadRequestException('Invalid inquiry payload');
  }
  return instance;
}

@Controller('inquiries')
export class InquiriesController {
  constructor(private readonly inquiriesService: InquiriesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('document', {
    limits: { fileSize: UploadConstraints.MAX_BYTES },
    fileFilter: (_, file, callback) => {
      if (UploadConstraints.MIME_TYPES.includes(file.mimetype)) {
        callback(null, true);
        return;
      }
      callback(new Error('Unsupported file type'), false);
    },
  }))
  create(@Body() body: unknown, @UploadedFile() file?: Express.Multer.File) {
    return this.inquiriesService.createInquiry(assertInquiryBody(body), file);
  }
}