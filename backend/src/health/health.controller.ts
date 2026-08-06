import { Controller, Get, Res, HttpStatus, Injectable } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service.js';
import { Public } from '../common/decorators/public.decorator.js';
import { Response } from 'express';
import { readFileSync } from 'fs';
import path from 'path';

let APP_VERSION = '1.0.0';
try {
  const pkgPath = path.resolve(process.cwd(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  if (pkg.version) APP_VERSION = pkg.version;
} catch (_err) {
  // Fallback to default if package.json unavailable
}

@Injectable()
@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Check active database and operational metrics' })
  async check() {
    let dbStatus = 'down';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      dbStatus = 'up';
    } catch (_error) {
      dbStatus = 'down';
    }

    const memoryUsage = process.memoryUsage();

    return {
      status: dbStatus === 'up' ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      memory: {
        heapUsedMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heapTotalMB: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rssMB: Math.round(memoryUsage.rss / 1024 / 1024),
      },
      services: {
        backend: 'up',
        database: dbStatus,
        n8n: 'up',
      },
      environment: process.env.NODE_ENV || 'development',
      version: APP_VERSION,
    };
  }

  @Get('live')
  @Public()
  @ApiOperation({ summary: 'Liveness probe endpoint for Kubernetes / cloud orchestration' })
  live() {
    return { status: 'alive', timestamp: new Date().toISOString() };
  }

  @Get('ready')
  @Public()
  @ApiOperation({ summary: 'Readiness probe endpoint verifying active database query SELECT 1' })
  async ready(@Res() res: Response) {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return res.status(HttpStatus.OK).json({ status: 'ready', database: 'connected', timestamp: new Date().toISOString() });
    } catch (_error) {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({ status: 'not_ready', database: 'disconnected', timestamp: new Date().toISOString() });
    }
  }

  @Get('version')
  @Public()
  @ApiOperation({ summary: 'Get application build version metadata from package.json' })
  version() {
    return {
      name: 'law-practice-crm',
      version: APP_VERSION,
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform,
    };
  }
}
