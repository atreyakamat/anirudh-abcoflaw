import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Document as PrismaDocument, DocumentType } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import * as path from 'path';
import * as fs from 'fs/promises';

const ALLOWED_MIME: Record<string, DocumentType> = {
  'application/pdf': DocumentType.PDF,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': DocumentType.DOCX,
  'image/jpeg': DocumentType.JPG,
  'image/png': DocumentType.PNG,
};
const MAX_SIZE = 10 * 1024 * 1024;
const UPLOAD_DIR = process.env.UPLOAD_DESTINATION || './uploads';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(clientId?: string, appointmentId?: string): Promise<PrismaDocument[]> {
    const where: any = { deletedAt: null };
    if (clientId) where.clientId = clientId;
    if (appointmentId) where.appointmentId = appointmentId;
    return this.prisma.document.findMany({ where, orderBy: { uploadedAt: 'desc' } });
  }

  async findOne(id: string): Promise<PrismaDocument> {
    const doc = await this.prisma.document.findFirst({ where: { id, deletedAt: null } });
    if (!doc) throw new NotFoundException('Document not found');
    return doc;
  }

  async upload(file: Express.Multer.File, clientId?: string, appointmentId?: string, userId?: string): Promise<PrismaDocument> {
    if (file.size > MAX_SIZE) throw new BadRequestException('File exceeds 10MB limit');
    const docType = ALLOWED_MIME[file.mimetype];
    if (!docType) throw new BadRequestException(`File type ${file.mimetype} not allowed. Allowed: PDF, DOCX, JPG, PNG`);

    const dir = path.join(UPLOAD_DIR, clientId || 'unassigned');
    await fs.mkdir(dir, { recursive: true });

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(dir, fileName);
    await fs.writeFile(filePath, file.buffer);

    return this.prisma.document.create({
      data: {
        clientId, userId, appointmentId,
        originalName: file.originalname, fileName,
        filePath, fileSize: file.size,
        mimeType: file.mimetype, documentType: docType,
      },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.document.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}