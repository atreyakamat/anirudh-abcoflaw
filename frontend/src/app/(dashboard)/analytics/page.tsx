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

  if (statsLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="h-8 w-48 bg-slate-200/50 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white/40 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-96 bg-white/40 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold font-serif text-slate-900 tracking-tight">Analytics Overview</h1>
        <p className="text-slate-500">Key performance indicators and firm metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-32 bg-yellow-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-4xl font-bold text-slate-900">{formatCurrency(stats?.totalRevenue || 0)}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Clients</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-4xl font-bold text-slate-900">{stats?.totalClients || 0}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <CardHeader className="pb-2 relative z-10">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">Today&apos;s Appointments</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-4xl font-bold text-slate-900">{stats?.todayAppointments || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats?.statusCounts?.map((s) => ({ name: getStatusLabel(s.status), value: s.count })) || []} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={4} dataKey="value" stroke="none">
                  {stats?.statusCounts?.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Appointment Trends (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString('en', { day: '2-digit', month: 'short' })} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="total" fill="#0F172A" radius={[6, 6, 0, 0]} barSize={12} />
                <Bar dataKey="completed" fill="#CA8A04" radius={[6, 6, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Revenue by Month</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenue || []} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(v: number) => formatCurrency(v)} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="revenue" fill="#CA8A04" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl">
          <CardHeader>
            <CardTitle className="font-serif text-xl">Booking Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 pt-4">
              {stats?.sourceCounts?.map((s) => (
                <div key={s.source} className="flex items-center justify-between">
                  <span className="text-sm font-medium uppercase tracking-wider text-slate-600">{s.source.toLowerCase()}</span>
                  <div className="flex items-center gap-4 flex-1 ml-6">
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div className="h-full bg-slate-900 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, (s.count / Math.max(...(stats?.sourceCounts?.map((x) => x.count) || [1]))) * 100)}%` }} />
                    </div>
                    <span className="text-sm font-bold w-8 text-right text-slate-900">{s.count}</span>
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