import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    // Use NestJS structured logger; suppress raw process.stdout console.log
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  // Production Secret Validation Guard
  if (isProduction) {
    const jwtSecret = configService.get<string>('JWT_SECRET');
    const insecureSecrets = ['secret', 'changeme', 'admin123', 'test', '123456', 'your-super-secret-jwt-key-min-32-chars-here'];
    if (!jwtSecret || insecureSecrets.includes(jwtSecret.toLowerCase())) {
      logger.error('FATAL: Insecure or missing JWT_SECRET in production mode! Application startup aborted.');
      process.exit(1);
    }
  }

  // Global middleware
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGINS', 'http://localhost:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global filters
  app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new TransformInterceptor());

  // Root-level health check registered before global prefix to remain accessible
  // without authentication and without the /api/v1 namespace.
  app.getHttpAdapter().get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API prefix applied after the root health check
  app.setGlobalPrefix(apiPrefix);

  // Swagger API documentation — disabled in production to avoid exposing
  // endpoint schemas and security metadata to external actors.
  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Law Practice CRM API')
      .setDescription('API documentation for Law Practice CRM & Consultation Automation Platform')
      .setVersion('1.0')
      .addCookieAuth('Authentication', { type: 'http' }, 'cookie')
      .addBearerAuth({ type: 'http' }, 'bearer')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });

    logger.log(`API documentation available at http://localhost:${port}/docs`);
  }

  await app.listen(port);
  logger.log(`Application running on http://localhost:${port}/${apiPrefix}`);
  logger.log(`Environment: ${isProduction ? 'production' : 'development'}`);
}

bootstrap();
