import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

@Injectable()
export class FilesService {
  async saveUpload(file: Express.Multer.File) {
    const uploadDir = path.resolve(process.cwd(), 'uploads');
    await mkdir(uploadDir, { recursive: true });
    const storageName = `${randomUUID()}-${file.originalname}`;
    const storagePath = path.join(uploadDir, storageName);
    await writeFile(storagePath, file.buffer);
    return {
      fileName: storageName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      fileSize: file.size,
      storagePath,
    };
  }
}