export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'RECEPTIONIST' | 'LAWYER';
  isActive: boolean;
}

export interface Client {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  notes?: string;
  createdAt: string;
  _count?: { appointments: number; payments: number };
}

export interface Appointment {
  id: string;
  clientId: string;
  bookedByUserId?: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  status: AppointmentStatus;
  source: BookingSource;
  referenceNumber: string;
  lawyerNote?: string;
  createdAt: string;
  client?: Client;
  bookedByUser?: { id: string; firstName: string; lastName: string; email: string };
  documents?: Document[];
  payments?: Payment[];
  history?: AppointmentHistory[];
  notes?: AppointmentNote[];
}

export type AppointmentStatus = 'PENDING_REVIEW' | 'PENDING_LAWYER_CONFIRMATION' | 'CONFIRMED' | 'REJECTED' | 'RESCHEDULED' | 'UPCOMING' | 'REMINDER_SENT' | 'COMPLETED' | 'CANCELLED' | 'ARCHIVED';

export type BookingSource = 'WEBSITE' | 'CHATBOT' | 'RECEPTIONIST' | 'LAWYER' | 'CLIENT_PORTAL';

export interface AppointmentHistory {
  id: string;
  appointmentId: string;
  changedByUser?: string;
  previousStatus?: AppointmentStatus;
  newStatus: AppointmentStatus;
  reason?: string;
  createdAt: string;
}

export interface AppointmentNote {
  id: string;
  appointmentId: string;
  userId: string;
  content: string;
  createdAt: string;
  user?: { id: string; firstName: string; lastName: string };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featuredImage?: string;
  seoTitle?: string;
  seoDescription?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED';
  publishedAt?: string;
  viewCount: number;
  createdAt: string;
  author?: { id: string; firstName: string; lastName: string };
  category?: BlogCategory;
  tags?: { tag: BlogTag }[];
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  order: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
  categoryId?: string;
  category?: FaqCategory;
}

export interface FaqCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  _count?: { faqs: number };
}

export interface Payment {
  id: string;
  appointmentId: string;
  clientId: string;
  amount: number;
  method: 'CASH' | 'GPAY' | 'BANK_TRANSFER';
  status: 'PENDING' | 'PAID' | 'PARTIAL' | 'VOID';
  referenceNumber?: string;
  notes?: string;
  paidAt?: string;
  createdAt: string;
  client?: Client;
  appointment?: { id: string; referenceNumber: string; description: string };
}

export interface Document {
  id: string;
  originalName: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  documentType: 'PDF' | 'DOCX' | 'JPG' | 'PNG';
  uploadedAt: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  data?: any;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entity: string;
  entityId: string;
  oldValue?: any;
  newValue?: any;
  reason?: string;
  createdAt: string;
  user?: { id: string; firstName: string; lastName: string; email: string };
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  category: string;
  isPublic: boolean;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface DashboardStats {
  todayAppointments: number;
  totalClients: number;
  totalRevenue: number;
  pendingPayments: { count: number; total: number };
  statusCounts: { status: string; count: number }[];
  sourceCounts: { source: string; count: number }[];
  recentActivity: AuditLog[];
}

export interface SearchResult {
  type: string;
  id: string;
  title: string;
  subtitle: string;
  url: string;
}