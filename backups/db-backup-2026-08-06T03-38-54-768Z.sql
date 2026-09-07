generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

model User {
  id                String             @id @default(cuid())
  email             String             @unique
  username          String             @unique
  password          String
  firstName         String
  lastName          String
  role              UserRole           @default(RECEPTIONIST)
  isActive          Boolean            @default(true)
  createdAt         DateTime           @default(now())
  updatedAt         DateTime           @updatedAt
  deletedAt         DateTime?
  appointments      Appointment[]
  appointmentNotes  AppointmentNote[]
  auditLogs         AuditLog[]
  availabilitySlots AvailabilitySlot[]
  blogPosts         BlogPost[]
  notifications     Notification[]
  refreshTokens     RefreshToken[]
  settings          Setting[]

  @@index([email])
  @@index([username])
  @@index([role])
  @@index([deletedAt])
}

model ClientPortalUser {
  id            String         @id @default(cuid())
  email         String         @unique
  password      String
  firstName     String
  lastName      String
  phone         String?
  isActive      Boolean        @default(true)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  deletedAt     DateTime?
  documents     Document[]
  notifications Notification[]
  refreshTokens RefreshToken[]

  @@index([email])
  @@index([deletedAt])
}

model Client {
  id           String        @id @default(cuid())
  email        String        @unique
  phone        String
  firstName    String
  lastName     String
  notes        String?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
  deletedAt    DateTime?
  appointments Appointment[]
  documents    Document[]
  payments     Payment[]

  @@index([email])
  @@index([phone])
  @@index([deletedAt])
}

model Appointment {
  id                       String               @id @default(cuid())
  clientId                 String
  bookedByUserId           String?
  lawyerNote               String?
  description              String
  preferredDate            DateTime
  preferredTime            String
  status                   AppointmentStatus    @default(PENDING_REVIEW)
  source                   BookingSource        @default(WEBSITE)
  referenceNumber          String               @unique @default(cuid())
  conflictingAppointmentId String?
  originalDate             DateTime?
  originalTime             String?
  reminderSentAt           DateTime?
  reminderMethod           String?
  createdAt                DateTime             @default(now())
  updatedAt                DateTime             @updatedAt
  deletedAt                DateTime?
  bookedByUser             User?                @relation(fields: [bookedByUserId], references: [id])
  client                   Client               @relation(fields: [clientId], references: [id])
  history                  AppointmentHistory[]
  notes                    AppointmentNote[]
  documents                Document[]
  payments                 Payment[]

  @@index([clientId])
  @@index([bookedByUserId])
  @@index([status])
  @@index([preferredDate])
  @@index([referenceNumber])
  @@index([deletedAt])
  @@index([createdAt])
  @@index([preferredDate, status, deletedAt])
}

model AppointmentHistory {
  id              String             @id @default(cuid())
  appointmentId   String
  changedByUser   String?
  changedByClient String?
  previousStatus  AppointmentStatus?
  newStatus       AppointmentStatus
  reason          String?
  notes           String?
  metadata        Json?
  createdAt       DateTime           @default(now())
  appointment     Appointment        @relation(fields: [appointmentId], references: [id], onDelete: Cascade)

  @@index([appointmentId])
  @@index([createdAt])
  @@index([newStatus])
}

model AppointmentNote {
  id            String      @id @default(cuid())
  appointmentId String
  userId        String
  content       String
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  appointment   Appointment @relation(fields: [appointmentId], references: [id], onDelete: Cascade)
  user          User        @relation(fields: [userId], references: [id])

  @@index([appointmentId])
  @@index([userId])
}

model Document {
  id            String            @id @default(cuid())
  clientId      String?
  userId        String?
  appointmentId String?
  originalName  String
  fileName      String
  filePath      String
  fileSize      Int
  mimeType      String
  documentType  DocumentType
  uploadedAt    DateTime          @default(now())
  deletedAt     DateTime?
  appointment   Appointment?      @relation(fields: [appointmentId], references: [id])
  client        Client?           @relation(fields: [clientId], references: [id])
  portalUser    ClientPortalUser? @relation(fields: [userId], references: [id])

  @@index([clientId])
  @@index([appointmentId])
  @@index([userId])
  @@index([deletedAt])
}

model BlogPost {
  id             String         @id @default(cuid())
  authorId       String
  categoryId     String?
  title          String
  slug           String         @unique
  excerpt        String?
  content        String
  featuredImage  String?
  seoTitle       String?
  seoDescription String?
  status         BlogPostStatus @default(DRAFT)
  publishedAt    DateTime?
  scheduledAt    DateTime?
  viewCount      Int            @default(0)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  deletedAt      DateTime?
  author         User           @relation(fields: [authorId], references: [id])
  category       BlogCategory?  @relation(fields: [categoryId], references: [id])
  tags           BlogPostTag[]

  @@index([slug])
  @@index([status])
  @@index([authorId])
  @@index([categoryId])
  @@index([publishedAt])
  @@index([deletedAt])
}

model BlogCategory {
  id          String     @id @default(cuid())
  name        String     @unique
  slug        String     @unique
  description String?
  order       Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  posts       BlogPost[]

  @@index([slug])
  @@index([order])
}

model BlogTag {
  id        String        @id @default(cuid())
  name      String        @unique
  slug      String        @unique
  createdAt DateTime      @default(now())
  posts     BlogPostTag[]

  @@index([slug])
}

model BlogPostTag {
  postId String
  tagId  String
  post   BlogPost @relation(fields: [postId], references: [id], onDelete: Cascade)
  tag    BlogTag  @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([postId, tagId])
  @@index([postId])
  @@index([tagId])
}

model FaqCategory {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  faqs        Faq[]

  @@index([order])
}

model Faq {
  id         String       @id @default(cuid())
  categoryId String?
  question   String
  answer     String
  order      Int          @default(0)
  isVisible  Boolean      @default(true)
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
  category   FaqCategory? @relation(fields: [categoryId], references: [id])

  @@index([categoryId])
  @@index([order])
  @@index([isVisible])
}

model Payment {
  id              String        @id @default(cuid())
  appointmentId   String
  clientId        String
  amount          Decimal       @db.Decimal(10, 2)
  method          PaymentMethod
  status          PaymentStatus @default(PENDING)
  referenceNumber String?
  notes           String?
  paidAt          DateTime?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  appointment     Appointment   @relation(fields: [appointmentId], references: [id])
  client          Client        @relation(fields: [clientId], references: [id])

  @@index([appointmentId])
  @@index([clientId])
  @@index([status])
  @@index([paidAt])
  @@index([createdAt])
  @@index([clientId, status])
}

model Notification {
  id        String            @id @default(cuid())
  userId    String?
  clientId  String?
  type      NotificationType
  title     String
  message   String
  data      Json?
  isRead    Boolean           @default(false)
  readAt    DateTime?
  createdAt DateTime          @default(now())
  client    ClientPortalUser? @relation(fields: [clientId], references: [id])
  user      User?             @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([clientId])
  @@index([isRead])
  @@index([type])
  @@index([createdAt])
}

model AuditLog {
  id        String      @id @default(cuid())
  userId    String?
  action    AuditAction
  entity    AuditEntity
  entityId  String
  oldValue  Json?
  newValue  Json?
  reason    String?
  ipAddress String?
  userAgent String?
  createdAt DateTime    @default(now())
  user      User?       @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([entity])
  @@index([entityId])
  @@index([action])
  @@index([createdAt])
}

model Setting {
  id              String   @id @default(cuid())
  key             String   @unique
  value           Json
  category        String   @default("general")
  isPublic        Boolean  @default(false)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  updatedByUserId String?
  updatedByUser   User?    @relation(fields: [updatedByUserId], references: [id])

  @@index([key])
  @@index([category])
  @@index([isPublic])
}

model AvailabilitySlot {
  id          String   @id @default(cuid())
  userId      String
  date        DateTime @db.Date
  startTime   String
  endTime     String
  isAvailable Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([date])
  @@index([isAvailable])
}

model ChatbotSession {
  id        String           @id @default(cuid())
  clientId  String?
  email     String?
  isActive  Boolean          @default(true)
  startedAt DateTime         @default(now())
  endedAt   DateTime?
  source    String?
  metadata  Json?
  messages  ChatbotMessage[]

  @@index([clientId])
  @@index([isActive])
  @@index([startedAt])
}

model ChatbotMessage {
  id         String         @id @default(cuid())
  sessionId  String
  content    String
  isFromBot  Boolean        @default(true)
  intent     String?
  confidence Decimal?       @db.Decimal(3, 2)
  createdAt  DateTime       @default(now())
  session    ChatbotSession @relation(fields: [sessionId], references: [id], onDelete: Cascade)

  @@index([sessionId])
  @@index([createdAt])
}

model RefreshToken {
  id                 String            @id @default(cuid())
  userId             String?
  token              String            @unique
  expiresAt          DateTime
  isRevoked          Boolean           @default(false)
  createdAt          DateTime          @default(now())
  revokedAt          DateTime?
  clientPortalUserId String?
  clientPortalUser   ClientPortalUser? @relation(fields: [clientPortalUserId], references: [id], onDelete: Cascade)
  user               User?             @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([clientPortalUserId])
  @@index([token])
  @@index([expiresAt])
  @@index([isRevoked])
}

model AutomationEvent {
  id            String       @id @default(cuid())
  eventId       String       @unique
  eventType     String
  aggregateType String
  aggregateId   String
  payload       Json
  status        OutboxStatus @default(PENDING)
  attemptCount  Int          @default(0)
  maxAttempts   Int          @default(5)
  nextAttemptAt DateTime     @default(now())
  lastAttemptAt DateTime?
  processedAt   DateTime?
  lastError     String?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt

  @@index([status, nextAttemptAt])
  @@index([eventType])
}

enum UserRole {
  RECEPTIONIST
  LAWYER
  ADMIN
}

enum ClientRole {
  CLIENT
}

enum AppointmentStatus {
  PENDING_REVIEW
  PENDING_LAWYER_CONFIRMATION
  CONFIRMED
  REJECTED
  RESCHEDULED
  UPCOMING
  REMINDER_SENT
  COMPLETED
  CANCELLED
  ARCHIVED
}

enum BookingSource {
  WEBSITE
  CHATBOT
  RECEPTIONIST
  LAWYER
  CLIENT_PORTAL
}

enum PaymentStatus {
  PENDING
  PAID
  PARTIAL
  VOID
}

enum PaymentMethod {
  CASH
  GPAY
  BANK_TRANSFER
}

enum DocumentType {
  PDF
  DOCX
  JPG
  PNG
}

enum BlogPostStatus {
  DRAFT
  PUBLISHED
  SCHEDULED
  ARCHIVED
}

enum NotificationType {
  APPOINTMENT_CREATED
  APPOINTMENT_CONFIRMED
  APPOINTMENT_REJECTED
  APPOINTMENT_RESCHEDULED
  APPOINTMENT_CANCELLED
  APPOINTMENT_COMPLETED
  APPOINTMENT_REMINDER
  PAYMENT_RECEIVED
  BLOG_PUBLISHED
  SYSTEM
}

enum AuditAction {
  CREATE
  UPDATE
  DELETE
  SOFT_DELETE
  RESTORE
  STATUS_CHANGE
  LOGIN
  LOGOUT
  PASSWORD_CHANGE
}

enum AuditEntity {
  USER
  CLIENT
  APPOINTMENT
  PAYMENT
  BLOG_POST
  BLOG_CATEGORY
  BLOG_TAG
  FAQ
  FAQ_CATEGORY
  DOCUMENT
  SETTING
  NOTIFICATION
  AVAILABILITY_SLOT
  CHATBOT_SESSION
}

enum OutboxStatus {
  PENDING
  PROCESSING
  RETRY_PENDING
  COMPLETED
  DEAD_LETTER
}


