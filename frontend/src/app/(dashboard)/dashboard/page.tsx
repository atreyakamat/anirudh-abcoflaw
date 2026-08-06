'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityFeed, ActivityItem } from '@/components/ui/activity-feed';
import { CalendarDays, Users, CreditCard, Clock, Plus, Zap, BookOpen, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils';
import Link from 'next/link';
import type { DashboardStats } from '@/types';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => { const res = await api.analytics.dashboard(); return res.data.data as DashboardStats; },
  });

  if (isLoading) return (
    <div className="animate-pulse space-y-6">
      <div className="h-10 bg-muted/60 rounded-xl w-64" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-muted/60 rounded-xl" />)}
      </div>
    </div>
  );

  const stats = data;

  const activityItems: ActivityItem[] = (stats?.recentActivity || []).map((log) => ({
    id: log.id,
    type: log.entity === 'APPOINTMENT' ? 'APPOINTMENT' : log.entity === 'DOCUMENT' ? 'DOCUMENT' : log.entity === 'PAYMENT' ? 'PAYMENT' : 'SECURITY',
    title: `${log.user?.firstName || 'System'} ${log.action.toLowerCase()}d ${log.entity.toLowerCase()}`,
    description: `Entity ID: ${log.entityId || 'N/A'}`,
    timestamp: log.createdAt,
    actor: `${log.user?.firstName || 'System'} ${log.user?.lastName || ''}`.trim(),
    status: 'SUCCESS',
  }));

  const pendingConfirmationCount = stats?.statusCounts?.find(s => s.status === 'PENDING_REVIEW')?.count || 0;
  const pendingPaymentCount = stats?.pendingPayments?.count || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Quick Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Practice Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time consultation, revenue, and legal operational intelligence</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/book"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New Booking</span>
          </Link>
          <Link
            href="/blogs/new"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border bg-card hover:bg-accent transition-colors shadow-xs"
          >
            <BookOpen className="w-4 h-4 text-pink-500" />
            <span>Write Article</span>
          </Link>
          <Link
            href="/automations"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg border bg-card hover:bg-accent transition-colors shadow-xs"
          >
            <Zap className="w-4 h-4 text-indigo-500" />
            <span>Outbox</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
            <CalendarDays className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.todayAppointments || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Consultation slots today</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalClients || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">Active client records</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="w-4 h-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div>
            <p className="text-xs text-muted-foreground mt-1">Processed consultations</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="w-4 h-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.pendingPayments?.count || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">{formatCurrency(stats?.pendingPayments?.total || 0)} outstanding</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Center & Smart Practice Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Action Needed / Attention Center */}
        <Card className="border-amber-500/30 bg-amber-500/5 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" /> What Needs Attention
            </CardTitle>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
              Action Required
            </span>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card text-sm">
              <div className="space-y-0.5">
                <p className="font-semibold">Unconfirmed Consultations</p>
                <p className="text-xs text-muted-foreground">{pendingConfirmationCount} bookings pending advocate confirmation</p>
              </div>
              <Link href="/appointments" className="text-xs font-bold text-primary hover:underline">
                Review & Confirm &rarr;
              </Link>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-card text-sm">
              <div className="space-y-0.5">
                <p className="font-semibold">Outstanding Client Invoices</p>
                <p className="text-xs text-muted-foreground">{pendingPaymentCount} invoices totaling {formatCurrency(stats?.pendingPayments?.total || 0)}</p>
              </div>
              <Link href="/payments" className="text-xs font-bold text-primary hover:underline">
                View Invoices &rarr;
              </Link>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-card text-sm">
              <div className="space-y-0.5">
                <p className="font-semibold">Automation Webhook Outbox</p>
                <p className="text-xs text-muted-foreground">n8n webhook dispatch & outbox events status</p>
              </div>
              <Link href="/automations" className="text-xs font-bold text-primary hover:underline">
                Inspect Outbox &rarr;
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Smart Practice Insights - Data-driven from PostgreSQL */}
        <Card className="border-border/50 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Practice Intelligence & Insights
            </CardTitle>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="p-3 rounded-lg border bg-muted/30 text-xs space-y-1">
              <p className="font-semibold text-foreground">📌 Practice Area Concentration</p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-bold text-foreground">{stats?.practiceInsights?.topPracticeArea || 'Corporate Law'}</span> represents{' '}
                <span className="font-bold text-primary">{stats?.practiceInsights?.topPracticeShare || 0}%</span> of total consultations in the system.
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-muted/30 text-xs space-y-1">
              <p className="font-semibold text-foreground">📅 Overall Consultation Volume</p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-bold text-foreground">{stats?.practiceInsights?.totalAppointmentsCount || 0}</span> total legal consultation slots recorded across all practice areas.
              </p>
            </div>

            <div className="p-3 rounded-lg border bg-muted/30 text-xs space-y-1">
              <p className="font-semibold text-foreground">🌐 Digital Self-Service Intake Rate</p>
              <p className="text-muted-foreground leading-relaxed">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats?.practiceInsights?.webConversionRate || 100}%</span> of bookings originate directly from the responsive website without requiring receptionist phone calls.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Status Distribution & Real-Time Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 shadow-xs">
          <CardHeader>
            <CardTitle>Appointment Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.statusCounts?.map((item) => (
                <div key={item.status} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/40 transition-colors">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>{getStatusLabel(item.status)}</span>
                  <span className="font-bold text-sm">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Real-Time Audit Activity Feed */}
        <ActivityFeed items={activityItems} title="Live Activity Feed & Audit Trail" />
      </div>
    </div>
  );
}