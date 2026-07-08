import { Badge } from '@/components/ui/badge';
import { ResourceField, ResourceColumn } from './resource-page';

type ResourceConfig = {
  resource: string;
  title: string;
  description: string;
  columns: ResourceColumn[];
  fields: ResourceField[];
};

const statusBadge = (value: unknown) => <Badge>{String(value)}</Badge>;

export const adminResources: Record<string, ResourceConfig> = {
  appointments: {
    resource: 'appointments',
    title: 'Appointments',
    description: 'Track consultation requests from intake through completion.',
    columns: [
      { key: 'status', label: 'Status', render: (_, row) => statusBadge(row.status) },
      { key: 'bookingSource', label: 'Source' },
      { key: 'preferredDate', label: 'Preferred date' },
      { key: 'preferredTime', label: 'Preferred time' },
      { key: 'notes', label: 'Notes' },
    ],
    fields: [
      { name: 'clientId', label: 'Client ID', type: 'text' },
      { name: 'bookingSource', label: 'Booking source', type: 'select', options: [
        { label: 'Website', value: 'website' },
        { label: 'Chatbot', value: 'chatbot' },
        { label: 'Receptionist', value: 'receptionist' },
        { label: 'Lawyer', value: 'lawyer' },
      ] },
      { name: 'preferredDate', label: 'Preferred date', type: 'date' },
      { name: 'preferredTime', label: 'Preferred time', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: [
        { label: 'Pending Review', value: 'pending_review' },
        { label: 'Pending Lawyer Confirmation', value: 'pending_lawyer_confirmation' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Rescheduled', value: 'rescheduled' },
        { label: 'Upcoming', value: 'upcoming' },
        { label: 'Reminder Sent', value: 'reminder_sent' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Archived', value: 'archived' },
      ] },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'consultationFee', label: 'Consultation fee', type: 'number' },
    ],
  },
  clients: {
    resource: 'clients',
    title: 'Clients',
    description: 'Manage client profiles, notes, and follow-up details.',
    columns: [
      { key: 'fullName', label: 'Name' },
      { key: 'phone', label: 'Phone' },
      { key: 'email', label: 'Email' },
      { key: 'notes', label: 'Notes' },
    ],
    fields: [
      { name: 'fullName', label: 'Full name', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
      { name: 'source', label: 'Source', type: 'text' },
    ],
  },
  blogs: {
    resource: 'blogs',
    title: 'Blogs',
    description: 'Draft, publish, and organize legal content with SEO metadata.',
    columns: [
      { key: 'title', label: 'Title' },
      { key: 'slug', label: 'Slug' },
      { key: 'visibility', label: 'Visibility', render: (_, row) => statusBadge(row.visibility) },
      { key: 'seoTitle', label: 'SEO title' },
    ],
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea' },
      { name: 'content', label: 'Content', type: 'textarea' },
      { name: 'seoTitle', label: 'SEO title', type: 'text' },
      { name: 'metaDescription', label: 'Meta description', type: 'textarea' },
      { name: 'featuredImageUrl', label: 'Featured image', type: 'url' },
      { name: 'visibility', label: 'Visibility', type: 'select', options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ] },
    ],
  },
  faqs: {
    resource: 'faqs',
    title: 'FAQs',
    description: 'Maintain categorized answers for the chatbot and public site.',
    columns: [
      { key: 'category', label: 'Category' },
      { key: 'question', label: 'Question' },
      { key: 'visible', label: 'Visible', render: (_, row) => statusBadge(row.visible ? 'Yes' : 'No') },
    ],
    fields: [
      { name: 'category', label: 'Category', type: 'text' },
      { name: 'question', label: 'Question', type: 'text' },
      { name: 'answer', label: 'Answer', type: 'textarea' },
      { name: 'sortOrder', label: 'Order', type: 'number' },
      { name: 'visible', label: 'Visible', type: 'checkbox' },
    ],
  },
  payments: {
    resource: 'payments',
    title: 'Payments',
    description: 'Record offline payment status and references.',
    columns: [
      { key: 'amount', label: 'Amount' },
      { key: 'method', label: 'Method' },
      { key: 'status', label: 'Status', render: (_, row) => statusBadge(row.status) },
      { key: 'referenceNumber', label: 'Reference' },
    ],
    fields: [
      { name: 'appointmentId', label: 'Appointment ID', type: 'text' },
      { name: 'clientId', label: 'Client ID', type: 'text' },
      { name: 'amount', label: 'Amount', type: 'number' },
      { name: 'method', label: 'Method', type: 'select', options: [
        { label: 'Cash', value: 'cash' },
        { label: 'GPay', value: 'gpay' },
        { label: 'Bank Transfer', value: 'bank_transfer' },
      ] },
      { name: 'referenceNumber', label: 'Reference number', type: 'text' },
      { name: 'status', label: 'Status', type: 'select', options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Paid', value: 'paid' },
        { label: 'Partial', value: 'partial' },
        { label: 'Void', value: 'void' },
      ] },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  notifications: {
    resource: 'notifications',
    title: 'Notifications',
    description: 'Track inbound and outbound communications across channels.',
    columns: [
      { key: 'channel', label: 'Channel' },
      { key: 'title', label: 'Title' },
      { key: 'status', label: 'Status', render: (_, row) => statusBadge(row.status) },
    ],
    fields: [
      { name: 'appointmentId', label: 'Appointment ID', type: 'text' },
      { name: 'userId', label: 'User ID', type: 'text' },
      { name: 'channel', label: 'Channel', type: 'select', options: [
        { label: 'In App', value: 'in_app' },
        { label: 'Email', value: 'email' },
        { label: 'WhatsApp', value: 'whatsapp' },
        { label: 'Telegram', value: 'telegram' },
      ] },
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'body', label: 'Body', type: 'textarea' },
      { name: 'status', label: 'Status', type: 'select', options: [
        { label: 'Unread', value: 'unread' },
        { label: 'Read', value: 'read' },
        { label: 'Archived', value: 'archived' },
      ] },
    ],
  },
  calendar: {
    resource: 'calendar-blocks',
    title: 'Calendar Blocks',
    description: 'Manage blocked dates and unavailable consultation windows.',
    columns: [
      { key: 'date', label: 'Date' },
      { key: 'startTime', label: 'Start' },
      { key: 'endTime', label: 'End' },
      { key: 'reason', label: 'Reason' },
    ],
    fields: [
      { name: 'date', label: 'Date', type: 'date' },
      { name: 'startTime', label: 'Start time', type: 'text' },
      { name: 'endTime', label: 'End time', type: 'text' },
      { name: 'reason', label: 'Reason', type: 'textarea' },
    ],
  },
  'audit-logs': {
    resource: 'audit-logs',
    title: 'Audit Logs',
    description: 'Immutable trace of every important CRUD action.',
    columns: [
      { key: 'action', label: 'Action' },
      { key: 'entity', label: 'Entity' },
      { key: 'createdAt', label: 'Timestamp' },
    ],
    fields: [],
  },
  settings: {
    resource: 'settings',
    title: 'Settings',
    description: 'Update configuration records such as office hours and website content.',
    columns: [
      { key: 'key', label: 'Key' },
      { key: 'updatedAt', label: 'Updated at' },
    ],
    fields: [
      { name: 'key', label: 'Key', type: 'text' },
      { name: 'value', label: 'Value (JSON string)', type: 'textarea' },
    ],
  },
  documents: {
    resource: 'documents',
    title: 'Documents',
    description: 'Track uploaded files attached to clients, appointments, and inquiries.',
    columns: [
      { key: 'originalName', label: 'Original name' },
      { key: 'mimeType', label: 'Mime type' },
      { key: 'fileSize', label: 'Size' },
      { key: 'storagePath', label: 'Storage path' },
    ],
    fields: [
      { name: 'clientId', label: 'Client ID', type: 'text' },
      { name: 'appointmentId', label: 'Appointment ID', type: 'text' },
      { name: 'fileName', label: 'File name', type: 'text' },
      { name: 'originalName', label: 'Original name', type: 'text' },
      { name: 'mimeType', label: 'Mime type', type: 'text' },
      { name: 'fileSize', label: 'File size', type: 'number' },
      { name: 'storagePath', label: 'Storage path', type: 'text' },
    ],
  },
  'blog-categories': {
    resource: 'blog-categories',
    title: 'Blog Categories',
    description: 'Organize blog content with durable categories and slugs.',
    columns: [
      { key: 'name', label: 'Name' },
      { key: 'slug', label: 'Slug' },
      { key: 'order', label: 'Order' },
    ],
    fields: [
      { name: 'name', label: 'Name', type: 'text' },
      { name: 'slug', label: 'Slug', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'order', label: 'Order', type: 'number' },
    ],
  },
};
