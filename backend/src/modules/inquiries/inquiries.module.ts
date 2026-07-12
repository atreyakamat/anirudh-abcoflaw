import { Module } from '@nestjs/common';
import { FilesModule } from '../files/files.module.js';
import { InquiriesController } from './inquiries.controller.js';
import { InquiriesService } from './inquiries.service.js';

@Module({
  imports: [FilesModule],
  controllers: [InquiriesController],
  providers: [InquiriesService],
})
export class InquiriesModule {}