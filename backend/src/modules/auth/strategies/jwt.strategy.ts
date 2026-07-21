import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prisma: PrismaService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => request?.cookies?.access_token,
        ExtractJwt.fromHeader('authorization'),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('SUPABASE_JWT_SECRET') || configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // Legacy tokens had type='access', Supabase tokens have aud='authenticated'
    if (payload.type && payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    const email = payload.email;

    if (!email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    // Try finding an admin/lawyer/staff user first
    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      if (!user.isActive) {
        throw new UnauthorizedException('User inactive');
      }
      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    }

    // Fallback to client portal user
    const client = await this.prisma.clientPortalUser.findUnique({
      where: { email },
    });

    if (client) {
      if (!client.isActive) {
        throw new UnauthorizedException('Client inactive');
      }
      return {
        id: client.id,
        email: client.email,
        role: 'CLIENT',
      };
    }

    throw new UnauthorizedException('User not found');
  }
}