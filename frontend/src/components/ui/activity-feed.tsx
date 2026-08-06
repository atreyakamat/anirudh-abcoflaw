'use client';

import { CheckCircle2, Clock, AlertCircle, Send, FileText, CreditCard, User, Shield, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export interface ActivityItem {
  id: string;
  type: 'APPOINTMENT' | 'AUTOMATION' | 'CLIENT' | 'DOCUMENT' | 'PAYMENT' | 'SECURITY';
  title: string;
  description: string;
  timestamp: string | Date;
  status?: 'SUCCESS' | 'PENDING' | 'FAILED' | 'COMPLETED' | 'RETRY_PENDING';
  actor?: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  title?: string;
  emptyMessage?: string;
}

export function ActivityFeed({ items, title = 'Recent Activity & Audit Trail', emptyMessage = 'No recent activity recorded yet.' }: ActivityFeedProps) {
  const getIcon = (type: ActivityItem['type'], status?: string) => {
    if (status === 'FAILED') return <AlertCircle className="w-4 h-4 text-destructive" />;
    if (status === 'PENDING' || status === 'RETRY_PENDING') return <Clock className="w-4 h-4 text-amber-500 animate-pulse" />;

    switch (type) {
      case 'APPOINTMENT':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'AUTOMATION':
        return <Zap className="w-4 h-4 text-indigo-500" />;
      case 'CLIENT':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'DOCUMENT':
        return <FileText className="w-4 h-4 text-amber-500" />;
      case 'PAYMENT':
        return <CreditCard className="w-4 h-4 text-violet-500" />;
      case 'SECURITY':
        return <Shield className="w-4 h-4 text-cyan-500" />;
      default:
        return <Send className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="bg-card border rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <span className="text-xs text-muted-foreground font-mono">{items.length} events</span>
      </div>

      {items.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {items.map((item) => (
            <div key={item.id} className="relative group">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-background border flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                {getIcon(item.type, item.status)}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <time className="text-[11px] text-muted-foreground font-mono">
                  {typeof item.timestamp === 'string'
                    ? formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })
                    : formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </time>
              </div>

              <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>

              {item.actor && (
                <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                  Actor: {item.actor}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
