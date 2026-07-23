import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter.js';
import { TransformInterceptor } from './common/interceptors/transform.interceptor.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3001);
  const apiPrefix = configService.get<string>('API_PREFIX', 'api/v1');

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

  // Root-level health check (no prefix)
  app.getHttpAdapter().get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // API prefix
  app.setGlobalPrefix(apiPrefix);

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Law Practice CRM API')
    .setDescription('API documentation for Law Practice CRM & Consultation Automation Platform')
    .setVersion('1.0')
    .addCookieAuth('Authentication', { type: 'http' }, 'cookie')
    .addBearerAuth({ type: 'http' }, 'bearer')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });


  await app.listen(port);
  console.log(`🚀 Application running on http://localhost:${port}`);
  console.log(`📚 API documentation on http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();