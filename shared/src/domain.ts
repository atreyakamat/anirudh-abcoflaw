export const Roles = {
  ADMIN: 'admin',
  RECEPTIONIST: 'receptionist',
  LAWYER: 'lawyer',
  CLIENT: 'client',
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];

export const AppointmentStatuses = {
  PENDING_REVIEW: 'pending_review',
  PENDING_LAWYER_CONFIRMATION: 'pending_lawyer_confirmation',
  CONFIRMED: 'confirmed',
  REJECTED: 'rejected',
  RESCHEDULED: 'rescheduled',
  UPCOMING: 'upcoming',
  REMINDER_SENT: 'reminder_sent',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  ARCHIVED: 'archived',
} as const;

export type AppointmentStatus = (typeof AppointmentStatuses)[keyof typeof AppointmentStatuses];

export const PaymentStatuses = {
  PENDING: 'pending',
  PAID: 'paid',
  PARTIAL: 'partial',
  VOID: 'void',
} as const;

export type PaymentStatus = (typeof PaymentStatuses)[keyof typeof PaymentStatuses];

export const PaymentMethods = {
  CASH: 'cash',
  GPAY: 'gpay',
  BANK_TRANSFER: 'bank_transfer',
} as const;

export type PaymentMethod = (typeof PaymentMethods)[keyof typeof PaymentMethods];

export const DocumentTypes = {
  PDF: 'pdf',
  DOCX: 'docx',
  JPG: 'jpg',
  PNG: 'png',
} as const;

export type DocumentType = (typeof DocumentTypes)[keyof typeof DocumentTypes];

export const BookingSource = {
  WEBSITE: 'website',
  CHATBOT: 'chatbot',
  RECEPTIONIST: 'receptionist',
  LAWYER: 'lawyer',
} as const;

export type BookingSource = (typeof BookingSource)[keyof typeof BookingSource];

export const OfficeSchedule = {
  START_HOUR: 9,
  END_HOUR: 18,
  SLOT_MINUTES: 30,
  SUNDAY_CLOSED: true,
} as const;

export const UploadConstraints = {
  MAX_BYTES: 10 * 1024 * 1024,
  MIME_TYPES: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ],
} as const;