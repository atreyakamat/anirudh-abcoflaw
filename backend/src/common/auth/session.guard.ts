import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { SessionTokenService } from './session-token.service.js';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessionTokenService: SessionTokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization as string | undefined;
    const cookieToken = request.cookies?.session as string | undefined;
    const bearerToken = authorization?.startsWith('Bearer ') ? authorization.slice(7) : undefined;
    const token = bearerToken ?? cookieToken;

    if (!token) {
      throw new UnauthorizedException('Session required');
    }

    const identity = this.sessionTokenService.verify(token);
    if (!identity) {
      throw new UnauthorizedException('Invalid session');
    }

    request.user = identity;
    return true;
  }
}