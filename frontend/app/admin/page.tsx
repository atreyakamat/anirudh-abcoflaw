import { getDashboardSummary } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardCharts } from '@/components/admin/dashboard-charts';

export default async function AdminDashboardPage() {
  const summary = await getDashboardSummary().catch(() => null);
  const appointmentTrends = [
    { name: 'Mon', value: 4 },
    { name: 'Tue', value: 6 },
    { name: 'Wed', value: 3 },
    { name: 'Thu', value: 8 },
    { name: 'Fri', value: 5 },
  ];

  const appointmentCounts = summary?.appointmentsByStatus ?? {};
  const metricCards = [
    { label: "Today's Appointments", value: '—' },
    { label: 'Pending', value: summary ? String(appointmentCounts.pending_review ?? 0) : '—' },
    { label: 'Confirmed', value: summary ? String(appointmentCounts.confirmed ?? 0) : '—' },
    { label: 'Total Clients', value: summary ? String(summary.clients) : '—' },
    { label: 'Revenue', value: summary ? String(summary.revenue) : '—' },
    { label: 'Pending Payments', value: summary ? String(summary.pendingPayments) : '—' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {metricCards.map((card) => (
          <Card key={card.label}>
            <CardHeader><CardTitle className="text-sm text-slate-500">{card.label}</CardTitle></CardHeader>
            <CardContent><div className="text-3xl font-semibold">{card.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <DashboardCharts data={appointmentTrends} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Recent activities</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Inquiry submitted through the booking form.</p>
            <p>Client profile updated after consultation review.</p>
            <p>Audit log captured a payment status change.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Quick actions</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
            <p>Confirm pending consultations.</p>
            <p>Review client documents and payment records.</p>
            <p>Publish a blog article or update FAQ content.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
