'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { formatDateTime } from '@/lib/utils';
import { Bell, CheckCheck } from 'lucide-react';
import type { Notification, PaginatedResult } from '@/types';

export default function NotificationsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => { const res = await api.notifications.list({ limit: 50 }); return res.data.data as PaginatedResult<Notification>; },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.notifications.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => api.notifications.markAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button onClick={() => markAllReadMutation.mutate()} className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm hover:bg-accent"><CheckCheck className="w-4 h-4" /> Mark all read</button>
      </div>
      <div className="space-y-2">
        {isLoading ? [...Array(5)].map((_, i) => <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />) :
        data?.items?.map((n) => (
          <div key={n.id} className={`border rounded-lg p-4 flex items-start gap-3 ${!n.isRead ? 'bg-primary/5' : ''}`} onClick={() => !n.isRead && markReadMutation.mutate(n.id)}>
            <Bell className="w-5 h-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{n.title}</p>
              <p className="text-sm text-muted-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{formatDateTime(n.createdAt)}</p>
            </div>
            {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
          </div>
        ))}
        {data?.items?.length === 0 && <p className="text-center text-muted-foreground py-8">No notifications</p>}
      </div>
    </div>
  );
}