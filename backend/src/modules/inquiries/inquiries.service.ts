import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { FilesService } from '../files/files.service.js';

@Injectable()
export class InquiriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly filesService: FilesService,
  ) {}

  async createInquiry(payload: Record<string, any>, file?: Express.Multer.File) {
    const fileData = file ? await this.filesService.saveUpload(file) : null;

    const inquiry = await this.prisma.inquiry.create({
      data: {
        fullName: String(payload.fullName ?? '').trim(),
        phone: String(payload.phone ?? '').trim(),
        email: payload.email ? String(payload.email).trim() : null,
        preferredDate: payload.preferredDate ? new Date(String(payload.preferredDate)) : null,
        preferredTime: payload.preferredTime ? String(payload.preferredTime).trim() : null,
        description: payload.description ? String(payload.description).trim() : null,
        source: String(payload.source ?? 'website'),
        status: 'pending_review',
        documentFileName: fileData?.fileName ?? null,
        documentOriginalName: fileData?.originalName ?? null,
        documentMimeType: fileData?.mimeType ?? null,
        documentFileSize: fileData?.fileSize ?? null,
        documentStoragePath: fileData?.storagePath ?? null,
      },
    });

    return { ok: true, id: inquiry.id };
  }
}