import { Injectable } from '@nestjs/common';

@Injectable()
export class InquiriesService {
  async createInquiry(payload: Record<string, any>, file?: Express.Multer.File) {
    // Inquiries are stored as appointments with source INQUIRY
    // This is a stub - in production, redirect to appointment creation
    return { ok: true, id: 'inquiry-' + Date.now(), message: 'Inquiry received. Please book a consultation.' };
  }
}