import { getDashboardSummary } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCharts } from '@/components/admin/dashboard-charts';

export default async function AnalyticsPage() {
  const summary = await getDashboardSummary().catch(() => null);
  const counts = summary?.appointmentsByStatus ?? {};
  const chartData = Object.entries(counts).map(([name, value]) => ({ name, value: Number(value) }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><CardTitle className="text-sm text-slate-500">Bookings</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{summary ? String(Object.values(counts).reduce((total, value) => total + Number(value), 0)) : '—'}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-slate-500">Revenue</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{summary ? String(summary.revenue) : '—'}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-slate-500">Clients</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{summary ? String(summary.clients) : '—'}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-slate-500">Pending payments</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{summary ? String(summary.pendingPayments) : '—'}</CardContent></Card>
      </div>

      <DashboardCharts data={chartData.length > 0 ? chartData : [{ name: 'No data', value: 0 }]} />

      <Card>
        <CardHeader><CardTitle>Status distribution</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {Object.entries(counts).map(([status, value]) => (
            <div key={status} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
              <div className="text-sm text-slate-500">{status}</div>
              <div className="mt-2 text-2xl font-semibold">{String(value)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}