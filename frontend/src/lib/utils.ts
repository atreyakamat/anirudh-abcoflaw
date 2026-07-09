import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  return `${hour > 12 ? hour - 12 : hour}:${m} ${hour >= 12 ? 'PM' : 'AM'}`;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING_REVIEW: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    PENDING_LAWYER_CONFIRMATION: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    RESCHEDULED: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    UPCOMING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    REMINDER_SENT: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    COMPLETED: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    ARCHIVED: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-300',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusLabel(status: string): string {
  return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = { CASH: 'Cash', GPAY: 'Google Pay', BANK_TRANSFER: 'Bank Transfer' };
  return labels[method] || method;
}