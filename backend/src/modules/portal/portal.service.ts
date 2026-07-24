import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PortalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // In-memory OTP cache for demo/dev mode
  private otpStore = new Map<string, { code: string; expiresAt: number }>();

  async sendOtp(phone: string, email?: string) {
    const cleanPhone = phone.trim();
    let client = await this.prisma.client.findFirst({
      where: { phone: cleanPhone },
    });

    if (!client) {
      // Auto-register client record if phone does not exist
      const generatedEmail = email || `client_${cleanPhone.replace(/\D/g, '')}@client.local`;
      client = await this.prisma.client.create({
        data: {
          phone: cleanPhone,
          email: generatedEmail,
          firstName: 'Client',
          lastName: cleanPhone.slice(-4) || 'User',
        },
      });
    }

    // Default static OTP in dev for reliable testing: 123456
    const code = '123456';
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 mins
    this.otpStore.set(cleanPhone, { code, expiresAt });

    return {
      success: true,
      message: 'OTP sent successfully to ' + cleanPhone,
      devOtp: code,
    };
  }

  async verifyOtp(phone: string, code: string) {
    const cleanPhone = phone.trim();
    const stored = this.otpStore.get(cleanPhone);

    // Accept 123456 or stored OTP
    if (code !== '123456' && (!stored || stored.code !== code || stored.expiresAt < Date.now())) {
      throw new UnauthorizedException('Invalid or expired OTP code');
    }

    let client = await this.prisma.client.findFirst({
      where: { phone: cleanPhone },
    });

    if (!client) {
      client = await this.prisma.client.create({
        data: {
          phone: cleanPhone,
          email: `client_${cleanPhone.replace(/\D/g, '')}@client.local`,
          firstName: 'Client',
          lastName: cleanPhone.slice(-4) || 'User',
        },
      });
    }

    const token = this.jwtService.sign({
      sub: client.id,
      email: client.email,
      role: 'CLIENT',
    });

    this.otpStore.delete(cleanPhone);

    return {
      token,
      user: {
        id: client.id,
        phone: client.phone,
        email: client.email,
        firstName: client.firstName,
        lastName: client.lastName,
        role: 'CLIENT',
      },
    };
  }

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
        appointments: { orderBy: { createdAt: 'desc' }, take: 10 },
        documents: { orderBy: { uploadedAt: 'desc' }, take: 10 },
        payments: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!client) {
      throw new UnauthorizedException('Client not found');
    }

    return client;
  }

  async getDocuments(clientId: string) {
    return this.prisma.document.findMany({
      where: { clientId, deletedAt: null },
      orderBy: { uploadedAt: 'desc' },
      include: {
        appointment: {
          select: { id: true, description: true, preferredDate: true, referenceNumber: true },
        },
      },
    });
  }

  async uploadDocument(clientId: string, data: {
    originalName: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    documentType: any;
    appointmentId?: string;
  }) {
    return this.prisma.document.create({
      data: {
        clientId,
        originalName: data.originalName,
        fileName: data.fileName,
        filePath: data.filePath,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        documentType: data.documentType || 'PDF',
        appointmentId: data.appointmentId || null,
      },
    });
  }

  async rescheduleAppointment(clientId: string, appointmentId: string, preferredDate: string, preferredTime: string, reason?: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: appointmentId, clientId },
    });

    if (!appointment) {
      throw new UnauthorizedException('Appointment not found or unauthorized');
    }

    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        originalDate: appointment.preferredDate,
        originalTime: appointment.preferredTime,
        preferredDate: new Date(preferredDate),
        preferredTime,
        status: 'RESCHEDULED',
      },
    });

    await this.prisma.appointmentHistory.create({
      data: {
        appointmentId,
        changedByClient: clientId,
        previousStatus: appointment.status,
        newStatus: 'RESCHEDULED',
        reason: reason || 'Rescheduled via Client Portal',
      },
    });

    return updated;
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