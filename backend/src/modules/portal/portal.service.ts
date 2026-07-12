import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PortalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(phone: string, email?: string) {
    const client = await this.prisma.client.findFirst({
      where: {
        phone,
        ...(email ? { email } : {}),
      },
    });

    if (!client) {
      throw new UnauthorizedException('Client portal access not found');
    }

    const token = this.jwtService.sign({
      sub: client.id,
      email: client.email,
      role: 'CLIENT',
    });

    return {
      token,
      user: {
        id: client.id,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        role: 'CLIENT',
      },
    };
  }

  async me(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: {
        appointments: { orderBy: { createdAt: 'desc' }, take: 5 },
        documents: { orderBy: { uploadedAt: 'desc' }, take: 5 },
        payments: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (!client) {
      throw new UnauthorizedException('Client not found');
    }

    return client;
  }

  async summary(clientId: string) {
    const [client, appointmentCount, pendingAppointments, confirmedAppointments, payments] = await Promise.all([
      this.prisma.client.findUnique({
        where: { id: clientId },
        include: {
          appointments: { orderBy: { createdAt: 'desc' }, take: 5 },
          documents: { orderBy: { uploadedAt: 'desc' }, take: 5 },
          payments: { orderBy: { createdAt: 'desc' }, take: 5 },
        },
      }),
      this.prisma.appointment.count({ where: { clientId } }),
      this.prisma.appointment.count({ where: { clientId, status: 'PENDING_REVIEW' as any } }),
      this.prisma.appointment.count({ where: { clientId, status: 'CONFIRMED' as any } }),
      this.prisma.payment.findMany({ where: { clientId }, orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    if (!client) {
      throw new UnauthorizedException('Client not found');
    }

    return {
      client,
      appointmentCount,
      pendingAppointments,
      confirmedAppointments,
      payments,
    };
  }
}