'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, getStatusLabel } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { DashboardStats } from '@/types';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316', '#6366f1', '#84cc16'];

export default function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: async () => { const res = await api.analytics.dashboard(); return res.data.data as DashboardStats; },
  });

  const { data: trends } = useQuery({
    queryKey: ['appointment-trends'],
    queryFn: async () => { const res = await api.analytics.appointmentTrends(30); return res.data.data; },
  });

  const { data: revenue } = useQuery({
    queryKey: ['revenue-trends'],
    queryFn: async () => { const res = await api.analytics.revenue(6); return res.data.data; },
  });

  if (statsLoading) return <div className="animate-pulse space-y-6"><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-muted rounded-xl" />)}</div></div>;

  return (
    <div className="space-y-6 animate-in">
      <h1 className="text-2xl font-bold">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Total Revenue</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{formatCurrency(stats?.totalRevenue || 0)}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Total Clients</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats?.totalClients || 0}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Today&apos;s Appointments</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats?.todayAppointments || 0}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Status Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats?.statusCounts?.map((s) => ({ name: getStatusLabel(s.status), value: s.count })) || []} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                  {stats?.statusCounts?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Appointment Trends (30 days)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends || []}>
                <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en', { day: '2-digit', month: 'short' })} tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Revenue by Month</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenue || []}>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Booking Sources</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats?.sourceCounts?.map((s) => (
                <div key={s.source} className="flex items-center justify-between">
                  <span className="text-sm capitalize">{s.source.toLowerCase()}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (s.count / Math.max(...(stats?.sourceCounts?.map((x) => x.count) || [1]))) * 100)}%` }} /></div>
                    <span className="text-sm font-medium w-8 text-right">{s.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}