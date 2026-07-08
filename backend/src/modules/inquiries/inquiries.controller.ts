import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadConstraints } from '@crm/shared';
import { InquiriesService } from './inquiries.service.js';

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
  create(@Body() body: Record<string, any>, @UploadedFile() file?: Express.Multer.File) {
    return this.inquiriesService.createInquiry(body, file);
  }
}