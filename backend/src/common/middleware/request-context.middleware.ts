import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = (req.headers['x-request-id'] as string) || (req.headers['x-correlation-id'] as string) || randomUUID();
    const startTime = Date.now();

    // Attach request ID to request and response header
    req.headers['x-request-id'] = requestId;
    res.setHeader('X-Request-Id', requestId);
    res.setHeader('X-Correlation-Id', requestId);

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode;
      const method = req.method;
      const url = req.originalUrl || req.url;

      this.logger.log(`[${requestId.slice(0, 8)}] ${method} ${url} ${statusCode} - ${duration}ms`);
    });

    next();
  }
}
