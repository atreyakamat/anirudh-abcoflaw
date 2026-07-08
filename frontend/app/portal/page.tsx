"use client";

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getPortalSummary } from '@/lib/api';
import { SessionGate } from '@/components/session-gate';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

function PortalContent() {
  const { data, isLoading } = useQuery({
    queryKey: ['portal-summary'],
    queryFn: getPortalSummary,
  });

  if (isLoading || !data) {
    return <div className="section-shell py-24 text-sm text-slate-500">Loading portal...</div>;
  }

  return (
    <main className="section-shell space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Client Portal</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">View your consultation timeline, payment status, and uploaded documents.</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href="/book-consultation"><Button>New consultation request</Button></Link>
          <Link href="/portal/login"><Button variant="outline">Switch client</Button></Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardHeader><CardTitle className="text-sm text-slate-500">Appointments</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{String(data.appointmentCount)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-slate-500">Pending</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{String(data.pendingAppointments)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-slate-500">Confirmed</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{String(data.confirmedAppointments)}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm text-slate-500">Recent payments</CardTitle></CardHeader><CardContent className="text-3xl font-semibold">{String(data.payments.length)}</CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent activity</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <p>Next appointment: {data.client.appointments[0]?.preferredDate ?? 'Not scheduled yet'}</p>
          <p>Last payment reference: {data.payments[0]?.referenceNumber ?? 'None'}</p>
          <p>Document uploads: {String(data.client.documents.length)}</p>
        </CardContent>
      </Card>
    </main>
  );
}

export default function PortalPage() {
  return (
    <SessionGate mode="portal" allowedRoles={['client']} redirectTo="/portal/login">
      <PortalContent />
    </SessionGate>
  );
}
