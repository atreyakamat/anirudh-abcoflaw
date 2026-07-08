import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedIdentity } from './static-credentials.provider.js';

export const CurrentUser = createParamDecorator((_, context: ExecutionContext): AuthenticatedIdentity | null => {
  const request = context.switchToHttp().getRequest();
  return request.user ?? null;
});