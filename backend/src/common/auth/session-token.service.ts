import { createHmac, timingSafeEqual } from 'crypto';
import { Injectable } from '@nestjs/common';
import { AuthenticatedIdentity } from './static-credentials.provider.js';

const SESSION_SEPARATOR = '.';

@Injectable()
export class SessionTokenService {
  private readonly secret = process.env.SESSION_SECRET ?? 'replace-me-in-production';

  sign(identity: AuthenticatedIdentity) {
    const payload = Buffer.from(JSON.stringify(identity)).toString('base64url');
    const signature = createHmac('sha256', this.secret).update(payload).digest('base64url');
    return `${payload}${SESSION_SEPARATOR}${signature}`;
  }

  verify(token: string): AuthenticatedIdentity | null {
    const [payload, signature] = token.split(SESSION_SEPARATOR);
    if (!payload || !signature) {
      return null;
    }

    const expected = createHmac('sha256', this.secret).update(payload).digest();
    const actual = Buffer.from(signature, 'base64url');

    if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
      return null;
    }

    return JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as AuthenticatedIdentity;
  }
}