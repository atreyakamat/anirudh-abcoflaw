
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  username: 'username',
  password: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  role: 'role',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.ClientPortalUserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  firstName: 'firstName',
  lastName: 'lastName',
  phone: 'phone',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.ClientScalarFieldEnum = {
  id: 'id',
  email: 'email',
  phone: 'phone',
  firstName: 'firstName',
  lastName: 'lastName',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.AppointmentScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  bookedByUserId: 'bookedByUserId',
  lawyerNote: 'lawyerNote',
  description: 'description',
  preferredDate: 'preferredDate',
  preferredTime: 'preferredTime',
  status: 'status',
  source: 'source',
  referenceNumber: 'referenceNumber',
  conflictingAppointmentId: 'conflictingAppointmentId',
  originalDate: 'originalDate',
  originalTime: 'originalTime',
  reminderSentAt: 'reminderSentAt',
  reminderMethod: 'reminderMethod',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.AppointmentHistoryScalarFieldEnum = {
  id: 'id',
  appointmentId: 'appointmentId',
  changedByUser: 'changedByUser',
  changedByClient: 'changedByClient',
  previousStatus: 'previousStatus',
  newStatus: 'newStatus',
  reason: 'reason',
  notes: 'notes',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.AppointmentNoteScalarFieldEnum = {
  id: 'id',
  appointmentId: 'appointmentId',
  userId: 'userId',
  content: 'content',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.DocumentScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  userId: 'userId',
  appointmentId: 'appointmentId',
  originalName: 'originalName',
  fileName: 'fileName',
  filePath: 'filePath',
  fileSize: 'fileSize',
  mimeType: 'mimeType',
  documentType: 'documentType',
  uploadedAt: 'uploadedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.BlogPostScalarFieldEnum = {
  id: 'id',
  authorId: 'authorId',
  categoryId: 'categoryId',
  title: 'title',
  slug: 'slug',
  excerpt: 'excerpt',
  content: 'content',
  featuredImage: 'featuredImage',
  seoTitle: 'seoTitle',
  seoDescription: 'seoDescription',
  status: 'status',
  publishedAt: 'publishedAt',
  scheduledAt: 'scheduledAt',
  viewCount: 'viewCount',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.BlogCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  order: 'order',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BlogTagScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  createdAt: 'createdAt'
};

exports.Prisma.BlogPostTagScalarFieldEnum = {
  postId: 'postId',
  tagId: 'tagId'
};

exports.Prisma.FaqCategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  order: 'order',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FaqScalarFieldEnum = {
  id: 'id',
  categoryId: 'categoryId',
  question: 'question',
  answer: 'answer',
  order: 'order',
  isVisible: 'isVisible',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  appointmentId: 'appointmentId',
  clientId: 'clientId',
  amount: 'amount',
  method: 'method',
  status: 'status',
  referenceNumber: 'referenceNumber',
  notes: 'notes',
  paidAt: 'paidAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  clientId: 'clientId',
  type: 'type',
  title: 'title',
  message: 'message',
  data: 'data',
  isRead: 'isRead',
  readAt: 'readAt',
  createdAt: 'createdAt'
};

exports.Prisma.AuditLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  action: 'action',
  entity: 'entity',
  entityId: 'entityId',
  oldValue: 'oldValue',
  newValue: 'newValue',
  reason: 'reason',
  ipAddress: 'ipAddress',
  userAgent: 'userAgent',
  createdAt: 'createdAt'
};

exports.Prisma.SettingScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  category: 'category',
  isPublic: 'isPublic',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  updatedByUserId: 'updatedByUserId'
};

exports.Prisma.AvailabilitySlotScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  date: 'date',
  startTime: 'startTime',
  endTime: 'endTime',
  isAvailable: 'isAvailable',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChatbotSessionScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  email: 'email',
  isActive: 'isActive',
  startedAt: 'startedAt',
  endedAt: 'endedAt',
  source: 'source',
  metadata: 'metadata'
};

exports.Prisma.ChatbotMessageScalarFieldEnum = {
  id: 'id',
  sessionId: 'sessionId',
  content: 'content',
  isFromBot: 'isFromBot',
  intent: 'intent',
  confidence: 'confidence',
  createdAt: 'createdAt'
};

exports.Prisma.RefreshTokenScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  token: 'token',
  expiresAt: 'expiresAt',
  isRevoked: 'isRevoked',
  createdAt: 'createdAt',
  revokedAt: 'revokedAt',
  clientPortalUserId: 'clientPortalUserId'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
  RECEPTIONIST: 'RECEPTIONIST',
  LAWYER: 'LAWYER',
  ADMIN: 'ADMIN'
};

exports.AppointmentStatus = exports.$Enums.AppointmentStatus = {
  PENDING_REVIEW: 'PENDING_REVIEW',
  PENDING_LAWYER_CONFIRMATION: 'PENDING_LAWYER_CONFIRMATION',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
  RESCHEDULED: 'RESCHEDULED',
  UPCOMING: 'UPCOMING',
  REMINDER_SENT: 'REMINDER_SENT',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ARCHIVED: 'ARCHIVED'
};

exports.BookingSource = exports.$Enums.BookingSource = {
  WEBSITE: 'WEBSITE',
  CHATBOT: 'CHATBOT',
  RECEPTIONIST: 'RECEPTIONIST',
  LAWYER: 'LAWYER',
  CLIENT_PORTAL: 'CLIENT_PORTAL'
};

exports.DocumentType = exports.$Enums.DocumentType = {
  PDF: 'PDF',
  DOCX: 'DOCX',
  JPG: 'JPG',
  PNG: 'PNG'
};

exports.BlogPostStatus = exports.$Enums.BlogPostStatus = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  SCHEDULED: 'SCHEDULED',
  ARCHIVED: 'ARCHIVED'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  CASH: 'CASH',
  GPAY: 'GPAY',
  BANK_TRANSFER: 'BANK_TRANSFER'
};

exports.PaymentStatus = exports.$Enums.PaymentStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  PARTIAL: 'PARTIAL',
  VOID: 'VOID'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  APPOINTMENT_CREATED: 'APPOINTMENT_CREATED',
  APPOINTMENT_CONFIRMED: 'APPOINTMENT_CONFIRMED',
  APPOINTMENT_REJECTED: 'APPOINTMENT_REJECTED',
  APPOINTMENT_RESCHEDULED: 'APPOINTMENT_RESCHEDULED',
  APPOINTMENT_CANCELLED: 'APPOINTMENT_CANCELLED',
  APPOINTMENT_COMPLETED: 'APPOINTMENT_COMPLETED',
  APPOINTMENT_REMINDER: 'APPOINTMENT_REMINDER',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  BLOG_PUBLISHED: 'BLOG_PUBLISHED',
  SYSTEM: 'SYSTEM'
};

exports.AuditAction = exports.$Enums.AuditAction = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  SOFT_DELETE: 'SOFT_DELETE',
  RESTORE: 'RESTORE',
  STATUS_CHANGE: 'STATUS_CHANGE',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  PASSWORD_CHANGE: 'PASSWORD_CHANGE'
};

exports.AuditEntity = exports.$Enums.AuditEntity = {
  USER: 'USER',
  CLIENT: 'CLIENT',
  APPOINTMENT: 'APPOINTMENT',
  PAYMENT: 'PAYMENT',
  BLOG_POST: 'BLOG_POST',
  BLOG_CATEGORY: 'BLOG_CATEGORY',
  BLOG_TAG: 'BLOG_TAG',
  FAQ: 'FAQ',
  FAQ_CATEGORY: 'FAQ_CATEGORY',
  DOCUMENT: 'DOCUMENT',
  SETTING: 'SETTING',
  NOTIFICATION: 'NOTIFICATION',
  AVAILABILITY_SLOT: 'AVAILABILITY_SLOT',
  CHATBOT_SESSION: 'CHATBOT_SESSION'
};

exports.Prisma.ModelName = {
  User: 'User',
  ClientPortalUser: 'ClientPortalUser',
  Client: 'Client',
  Appointment: 'Appointment',
  AppointmentHistory: 'AppointmentHistory',
  AppointmentNote: 'AppointmentNote',
  Document: 'Document',
  BlogPost: 'BlogPost',
  BlogCategory: 'BlogCategory',
  BlogTag: 'BlogTag',
  BlogPostTag: 'BlogPostTag',
  FaqCategory: 'FaqCategory',
  Faq: 'Faq',
  Payment: 'Payment',
  Notification: 'Notification',
  AuditLog: 'AuditLog',
  Setting: 'Setting',
  AvailabilitySlot: 'AvailabilitySlot',
  ChatbotSession: 'ChatbotSession',
  ChatbotMessage: 'ChatbotMessage',
  RefreshToken: 'RefreshToken'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
