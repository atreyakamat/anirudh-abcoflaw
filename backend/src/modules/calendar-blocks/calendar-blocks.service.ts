import { Injectable } from '@nestjs/common';
import { CrudService } from '../../common/crud/crud.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class CalendarBlocksService extends CrudService {
  constructor(prisma: PrismaService) {
    super(prisma.availabilitySlot, ['date', 'startTime', 'endTime']);
  }
}