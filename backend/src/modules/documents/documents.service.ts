import { Injectable } from '@nestjs/common';
import { CrudService } from '../../common/crud/crud.service.js';
import { PrismaService } from '../../database/prisma.service.js';

@Injectable()
export class DocumentsService extends CrudService {
  constructor(prisma: PrismaService) {
    super(prisma.document, ['fileName', 'originalName', 'mimeType', 'storagePath']);
  }
}