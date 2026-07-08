import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CrudService } from '../../common/crud/crud.service.js';

@Injectable()
export class AppointmentsService extends CrudService {
  constructor(prisma: PrismaService) {
    super(prisma.appointment, ['notes', 'bookingSource', 'preferredTime', 'status']);
  }
}