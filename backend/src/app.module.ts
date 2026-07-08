import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { AppointmentsModule } from './modules/appointments/appointments.module.js';
import { ClientsModule } from './modules/clients/clients.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module.js';
import { FilesModule } from './modules/files/files.module.js';
import { InquiriesModule } from './modules/inquiries/inquiries.module.js';
import { BlogsModule } from './modules/blogs/blogs.module.js';
import { FAQsModule } from './modules/faqs/faqs.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { SettingsModule } from './modules/settings/settings.module.js';
import { CalendarBlocksModule } from './modules/calendar-blocks/calendar-blocks.module.js';
import { SearchModule } from './modules/search/search.module.js';
import { DocumentsModule } from './modules/documents/documents.module.js';
import { BlogCategoriesModule } from './modules/blog-categories/blog-categories.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    AppointmentsModule,
    ClientsModule,
    DashboardModule,
    AuditLogsModule,
    FilesModule,
    InquiriesModule,
    BlogsModule,
    FAQsModule,
    PaymentsModule,
    NotificationsModule,
    SettingsModule,
    CalendarBlocksModule,
    SearchModule,
    DocumentsModule,
    BlogCategoriesModule,
  ],
})
export class AppModule {}