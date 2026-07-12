import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsersModule } from './modules/users/users.module.js';
import { AppointmentsModule } from './modules/appointments/appointments.module.js';
import { ClientsModule } from './modules/clients/clients.module.js';
import { BlogsModule } from './modules/blogs/blogs.module.js';
import { FaqsModule } from './modules/faqs/faqs.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { DocumentsModule } from './modules/documents/documents.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module.js';
import { AnalyticsModule } from './modules/analytics/analytics.module.js';
import { CalendarModule } from './modules/calendar/calendar.module.js';
import { SettingsModule } from './modules/settings/settings.module.js';
import { ChatbotModule } from './modules/chatbot/chatbot.module.js';
import { SearchModule } from './modules/search/search.module.js';
import { WebhooksModule } from './modules/webhooks/webhooks.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [{
          ttl: config.get<number>('THROTTLE_TTL', 60000),
          limit: config.get<number>('THROTTLE_LIMIT', 100),
        }],
      }),
    }),

    // Prisma
    PrismaModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    AppointmentsModule,
    ClientsModule,
    BlogsModule,
    FaqsModule,
    PaymentsModule,
    DocumentsModule,
    NotificationsModule,
    AuditLogsModule,
    AnalyticsModule,
    CalendarModule,
    SettingsModule,
    ChatbotModule,
    SearchModule,
    WebhooksModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}