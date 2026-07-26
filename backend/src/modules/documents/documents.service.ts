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

/**
 * Sanitises a path segment to prevent directory traversal.
 * Strips any path separators and dots that could be used to escape
 * the intended upload directory.
 */
function sanitisePathSegment(segment: string): string {
  // Remove any path separators and dots sequences; keep only alphanumeric,
  // hyphens, and underscores.
  return segment.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64);
}

/**
 * Sanitises an original filename for safe use on the filesystem.
 * Preserves the file extension while stripping dangerous characters.
 */
function sanitiseFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const base = path.basename(originalName, ext);
  const safeBase = base.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 100);
  return `${safeBase}${ext}`;
}

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

  async upload(
    file: Express.Multer.File,
    clientId?: string,
    appointmentId?: string,
    userId?: string,
  ): Promise<PrismaDocument> {
    if (file.size > MAX_SIZE) {
      throw new BadRequestException('File exceeds 10MB limit');
    }

    const docType = ALLOWED_MIME[file.mimetype];
    if (!docType) {
      throw new BadRequestException(
        `File type ${file.mimetype} not allowed. Allowed: PDF, DOCX, JPG, PNG`,
      );
    }

    // Sanitise both the directory segment and the filename to prevent
    // path traversal attacks. clientId comes from a validated JWT, but we
    // sanitise defensively since the value ultimately controls a filesystem path.
    const dirSegment = sanitisePathSegment(clientId || 'unassigned');
    const dir = path.join(UPLOAD_DIR, dirSegment);
    await fs.mkdir(dir, { recursive: true });

    const safeOriginalName = sanitiseFilename(file.originalname);
    const fileName = `${Date.now()}-${safeOriginalName}`;
    const filePath = path.join(dir, fileName);
    await fs.writeFile(filePath, file.buffer);

    return this.prisma.document.create({
      data: {
        clientId,
        userId,
        appointmentId,
        originalName: file.originalname, // preserve display name in DB
        fileName,
        filePath,
        fileSize: file.size,
        mimeType: file.mimetype,
        documentType: docType,
      },
    });
  }

  async softDelete(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.document.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}