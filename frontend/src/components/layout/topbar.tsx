'use client';

import { useTheme } from 'next-themes';
import { Menu, Sun, Moon, Search, Bell, CheckCheck, Calendar, CreditCard, FileText, Zap, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { CommandPalette } from './command-palette';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const { data: notificationsData } = useQuery({
    queryKey: ['topbar-notifications'],
    queryFn: async () => {
      const res = await api.notifications.list({ limit: 10 }).catch(() => null);
      return res?.data?.data?.items || [];
    },
    refetchInterval: 30000,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.notifications.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topbar-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.notifications.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['topbar-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleNotificationClick = (n: any) => {
    if (!n.isRead) {
      markReadMutation.mutate(n.id);
    }
    setNotifOpen(false);

    if (n.type === 'APPOINTMENT' || n.title?.toLowerCase().includes('appointment') || n.title?.toLowerCase().includes('booking')) {
      router.push('/appointments');
    } else if (n.type === 'PAYMENT' || n.title?.toLowerCase().includes('payment') || n.title?.toLowerCase().includes('invoice')) {
      router.push('/payments');
    } else if (n.type === 'DOCUMENT' || n.title?.toLowerCase().includes('document')) {
      router.push('/documents');
    } else if (n.type === 'AUTOMATION' || n.title?.toLowerCase().includes('outbox') || n.title?.toLowerCase().includes('webhook')) {
      router.push('/automations');
    } else {
      router.push('/notifications');
    }
  };

  const unreadCount = notificationsData?.filter((n: any) => !n.isRead)?.length || 0;

  const getNotifIcon = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('appointment') || t.includes('booking')) return <Calendar className="w-4 h-4 text-blue-500 shrink-0" />;
    if (t.includes('payment') || t.includes('invoice')) return <CreditCard className="w-4 h-4 text-emerald-500 shrink-0" />;
    if (t.includes('document')) return <FileText className="w-4 h-4 text-amber-500 shrink-0" />;
    if (t.includes('webhook') || t.includes('outbox') || t.includes('automation')) return <Zap className="w-4 h-4 text-indigo-500 shrink-0" />;
    return <Shield className="w-4 h-4 text-primary shrink-0" />;
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-card border-b flex items-center px-4 md:px-6 gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 hover:bg-accent rounded-lg">
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 max-w-md hidden md:block">
          <button
            onClick={() => setPaletteOpen(true)}
            className="w-full flex items-center justify-between pl-3 pr-4 py-2 text-sm border rounded-lg bg-background text-muted-foreground hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Search clients, bookings, articles (Ctrl + K)...</span>
            </div>
            <kbd className="text-[10px] font-mono px-2 py-0.5 border rounded bg-muted">
              Ctrl K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Notification Bell Dropdown Button */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors relative"
              title="Notifications Center"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background animate-pulse" />
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notifOpen && (
              <div
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border rounded-xl shadow-2xl z-50 p-4 space-y-3 animate-in zoom-in-95"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">Notification Center</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => markAllReadMutation.mutate()}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 text-xs">
                  {notificationsData?.length === 0 ? (
                    <p className="text-center py-6 text-muted-foreground">No recent notifications</p>
                  ) : (
                    notificationsData?.map((n: any) => (
                      <div
                        key={n.id}
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                          !n.isRead ? 'bg-primary/5 border-primary/20 hover:bg-primary/10' : 'bg-background border-border/40 hover:bg-accent/50'
                        }`}
                      >
                        {getNotifIcon(n.title)}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-foreground truncate">{n.title}</p>
                          <p className="text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                          <span className="text-[10px] text-muted-foreground font-mono mt-1 block">
                            {new Date(n.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="border-t pt-2 text-center">
                  <Link
                    href="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}
        </div>
      </header>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}