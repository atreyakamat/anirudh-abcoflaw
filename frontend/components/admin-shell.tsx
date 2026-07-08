"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  CalendarDays,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Megaphone,
  MessageSquareMore,
  Settings2,
  ShieldCheck,
  Users,
  Wallet,
  ChartColumnBig,
  Bell,
  Search,
} from 'lucide-react';
import { logout } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/appointments', label: 'Appointments', icon: CalendarDays },
  { href: '/admin/clients', label: 'Clients', icon: Users },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/faqs', label: 'FAQs', icon: MessageSquareMore },
  { href: '/admin/payments', label: 'Payments', icon: Wallet },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/analytics', label: 'Analytics', icon: ChartColumnBig },
  { href: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: ShieldCheck },
  { href: '/admin/settings', label: 'Settings', icon: Settings2 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  async function handleLogout() {
    await logout();
    window.location.href = '/admin/login';
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="grid min-h-screen lg:grid-cols-[18rem_1fr]">
        <aside className="border-r border-slate-200 bg-white/90 px-4 py-5 dark:border-slate-800 dark:bg-slate-950/90">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">LP</div>
            <div>
              <div className="text-sm font-semibold">Law Practice CRM</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Operations dashboard</div>
            </div>
          </div>

          <div className="mt-6 space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between rounded-2xl px-4 py-3 text-sm transition',
                    active ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-60" />
                </Link>
              );
            })}
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex items-center gap-2 text-sm font-medium"><Search className="h-4 w-4" /> Global search</div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Appointments, clients, blogs, and payments are all searchable from one place.</p>
          </div>

          <Button type="button" variant="outline" className="mt-6 w-full justify-start rounded-2xl" onClick={handleLogout}>
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </aside>

        <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
