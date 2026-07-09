'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDays, Users, CreditCard, Clock } from 'lucide-react';
import { formatCurrency, getStatusColor, getStatusLabel } from '@/lib/utils';
import type { DashboardStats } from '@/types';

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => { const res = await api.analytics.dashboard(); return res.data.data as DashboardStats; },
  });

  if (isLoading) return <div className="animate-pulse space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-xl" />)}</div></div>;

  const stats = data;

  return (
    <div className="space-y-6 animate-in">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle><CalendarDays className="w-4 h-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-3xl font-bold">{stats?.todayAppointments || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Clients</CardTitle><Users className="w-4 h-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-3xl font-bold">{stats?.totalClients || 0}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Revenue</CardTitle><CreditCard className="w-4 h-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-3xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pending Payments</CardTitle><Clock className="w-4 h-4 text-muted-foreground" /></CardHeader>
          <CardContent><div className="text-3xl font-bold">{stats?.pendingPayments?.count || 0}</div><p className="text-xs text-muted-foreground">{formatCurrency(stats?.pendingPayments?.total || 0)}</p></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Appointment Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.statusCounts?.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>{getStatusLabel(item.status)}</span>
                  <span className="font-medium">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.recentActivity?.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                  <div>
                    <p><span className="font-medium">{log.user?.firstName} {log.user?.lastName}</span> {log.action.toLowerCase()}d a {log.entity.toLowerCase()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {(!stats?.recentActivity || stats.recentActivity.length === 0) && <p className="text-sm text-muted-foreground">No recent activity</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}