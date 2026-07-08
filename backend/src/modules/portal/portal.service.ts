import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Roles } from '@crm/shared';
import { PrismaService } from '../../database/prisma.service.js';
import { SessionTokenService } from '../../common/auth/session-token.service.js';
import { AuthenticatedIdentity } from '../../common/auth/static-credentials.provider.js';

@Injectable()
export class PortalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sessionTokens: SessionTokenService,
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

    const identity: AuthenticatedIdentity = {
      id: client.id,
      username: client.phone,
      displayName: client.fullName,
      role: Roles.CLIENT,
    };

    return {
      token: this.sessionTokens.sign(identity),
      user: identity,
    };
  }

  async me(clientId: string) {
    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: {
        appointments: { orderBy: { createdAt: 'desc' }, take: 5 },
        documents: { orderBy: { createdAt: 'desc' }, take: 5 },
        payments: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (!client) {
      throw new UnauthorizedException('Client portal access not found');
    }

    return client;
  }

  async summary(clientId: string) {
    const [client, appointmentCount, pendingAppointments, confirmedAppointments, payments] = await Promise.all([
      this.prisma.client.findUnique({
        where: { id: clientId },
        include: {
          appointments: { orderBy: { createdAt: 'desc' }, take: 5 },
          documents: { orderBy: { createdAt: 'desc' }, take: 5 },
          payments: { orderBy: { createdAt: 'desc' }, take: 5 },
        },
      }),
      this.prisma.appointment.count({ where: { clientId } }),
      this.prisma.appointment.count({ where: { clientId, status: 'pending_review' } }),
      this.prisma.appointment.count({ where: { clientId, status: 'confirmed' } }),
      this.prisma.payment.findMany({ where: { clientId }, orderBy: { createdAt: 'desc' }, take: 5 }),
    ]);

    if (!client) {
      throw new UnauthorizedException('Client portal access not found');
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