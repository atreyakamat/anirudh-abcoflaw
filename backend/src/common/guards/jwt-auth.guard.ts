import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  type: 'access' | 'refresh';
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromCookie(request);

    if (!token) {
      const authHeader = request.headers.authorization;
      if (authHeader?.startsWith('Bearer ')) {
        const tokenFromHeader = authHeader.substring(7);
        return this.validateToken(tokenFromHeader, 'access', request);
      }
      throw new UnauthorizedException('No token provided');
    }

    return this.validateToken(token, 'access', request);
  }

  private extractTokenFromCookie(request: Request): string | null {
    const cookies = request.cookies || {};
    return cookies['access_token'] || cookies['accessToken'] || null;
  }

  private async validateToken(
    token: string,
    type: 'access' | 'refresh',
    request: Request,
  ): Promise<boolean> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>(
          type === 'access' ? 'JWT_SECRET' : 'JWT_REFRESH_SECRET',
        ),
      });

      if (payload.type !== type) {
        throw new UnauthorizedException('Invalid token type');
      }

      // Attach user to request
      (request as any).user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };

      return true;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}