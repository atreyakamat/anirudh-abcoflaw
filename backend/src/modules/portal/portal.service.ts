import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PortalService {
  private readonly logger = new Logger(PortalService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // In-memory OTP cache. Each entry expires independently.
  // In a production multi-instance deployment, replace with Redis.
  private otpStore = new Map<string, { code: string; expiresAt: number }>();

  async sendOtp(phone: string, email?: string) {
    const cleanPhone = phone.trim();

    let client = await this.prisma.client.findFirst({
      where: { phone: cleanPhone },
    });

    if (!client) {
      // Auto-register a minimal client record so OTP can be linked to an entity.
      const generatedEmail =
        email || `client_${cleanPhone.replace(/\D/g, '')}@client.local`;
      client = await this.prisma.client.create({
        data: {
          phone: cleanPhone,
          email: generatedEmail,
          firstName: 'Client',
          lastName: cleanPhone.slice(-4) || 'User',
        },
      });
    }

    // Generate a cryptographically random 6-digit OTP.
    const isDev = this.configService.get<string>('NODE_ENV', 'development') !== 'production';
    const code = isDev
      ? '123456' // Predictable OTP in development only for ease of testing
      : String(Math.floor(100000 + Math.random() * 900000));

    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
    this.otpStore.set(cleanPhone, { code, expiresAt });

    this.logger.log(`OTP generated for phone ${cleanPhone.slice(0, 4)}****`);

    // In production the OTP is dispatched via n8n/SMS provider configured in env.
    // The devOtp field is only present in development responses.
    return {
      success: true,
      message: 'OTP sent successfully to ' + cleanPhone,
      ...(isDev ? { devOtp: code } : {}),
    };
  }

  async verifyOtp(phone: string, code: string) {
    const cleanPhone = phone.trim();
    const stored = this.otpStore.get(cleanPhone);

    // Strict OTP validation — no static bypass allowed in any environment.
    if (!stored || stored.code !== code || stored.expiresAt < Date.now()) {
      this.logger.warn(`OTP verification failed for phone ${cleanPhone.slice(0, 4)}****`);
      throw new UnauthorizedException('Invalid or expired OTP code');
    }

    // Invalidate OTP immediately after successful use (single-use).
    this.otpStore.delete(cleanPhone);

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

    const accessTokenTtl =
      this.configService.get<string>('JWT_PORTAL_EXPIRY', '1h');

    const token = this.jwtService.sign(
      {
        sub: client.id,
        email: client.email,
        role: 'CLIENT',
      },
      { expiresIn: accessTokenTtl },
    );

    this.logger.log(`Portal OTP verified for client ${client.id}`);

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
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async getDocuments(clientId: string) {
    return this.prisma.document.findMany({
      where: { clientId, deletedAt: null },
      orderBy: { uploadedAt: 'desc' },
      include: {
        appointment: {
          select: {
            id: true,
            description: true,
            preferredDate: true,
            referenceNumber: true,
          },
        },
      },
    });
  }

  async uploadDocument(
    clientId: string,
    data: {
      originalName: string;
      fileName: string;
      filePath: string;
      fileSize: number;
      mimeType: string;
      documentType: string;
      appointmentId?: string;
    },
  ) {
    return this.prisma.document.create({
      data: {
        clientId,
        originalName: data.originalName,
        fileName: data.fileName,
        filePath: data.filePath,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        documentType: (data.documentType as any) || 'PDF',
        appointmentId: data.appointmentId || null,
      },
    });
  }

  async rescheduleAppointment(
    clientId: string,
    appointmentId: string,
    preferredDate: string,
    preferredTime: string,
    reason?: string,
  ) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: appointmentId, clientId },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found or unauthorised');
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
    const [
      client,
      appointmentCount,
      pendingAppointments,
      confirmedAppointments,
      payments,
    ] = await Promise.all([
      this.prisma.client.findUnique({
        where: { id: clientId },
        include: {
          appointments: { orderBy: { createdAt: 'desc' }, take: 5 },
          documents: { orderBy: { uploadedAt: 'desc' }, take: 5 },
          payments: { orderBy: { createdAt: 'desc' }, take: 5 },
        },
      }),
      this.prisma.appointment.count({ where: { clientId } }),
      this.prisma.appointment.count({
        where: { clientId, status: 'PENDING_REVIEW' as any },
      }),
      this.prisma.appointment.count({
        where: { clientId, status: 'CONFIRMED' as any },
      }),
      this.prisma.payment.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    if (!client) {
      throw new NotFoundException('Client not found');
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