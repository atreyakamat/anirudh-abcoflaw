import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { JwtPayload } from '../../../common/guards/jwt-auth.guard.js';

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
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException('Invalid token type');
    }

    // For client portal users
    if (payload.role === 'CLIENT') {
      const client = await this.prisma.clientPortalUser.findUnique({
        where: { id: payload.sub },
      });

      if (!client || !client.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      return {
        id: client.id,
        email: client.email,
        role: 'CLIENT',
      };
    }

    // For admin/receptionist/lawyer users
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}