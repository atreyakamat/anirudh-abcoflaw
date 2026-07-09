'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useParams, useRouter } from 'next/navigation';
import { formatDate, getStatusColor, getStatusLabel, formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import type { Client } from '@/types';

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: client, isLoading } = useQuery({
    queryKey: ['client', params.id],
    queryFn: async () => { const res = await api.clients.get(params.id as string); return res.data.data as Client; },
    enabled: !!params.id,
  });

  if (isLoading) return <div className="animate-pulse space-y-4"><div className="h-8 bg-muted rounded w-48" /><div className="h-64 bg-muted rounded-xl" /></div>;
  if (!client) return <div className="text-center py-12 text-muted-foreground">Client not found</div>;

  return (
    <div className="space-y-6 animate-in">
      <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /> Back</button>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{client.firstName} {client.lastName}</h1>
          <div className="flex gap-4 mt-2 text-sm text-muted-foreground"><span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {client.email}</span><span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {client.phone}</span></div>
        </div>
      </div>

      {client.notes && <div className="border rounded-xl p-4"><h3 className="font-medium mb-2">Notes</h3><p className="text-sm text-muted-foreground">{client.notes}</p></div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-xl p-4">
          <h3 className="font-medium mb-3">Recent Appointments</h3>
          <div className="space-y-2">
            {client.appointments?.slice(0, 5).map((apt: any) => (
              <Link key={apt.id} href={`/appointments/${apt.id}`} className="flex items-center justify-between p-2 rounded hover:bg-accent text-sm">
                <div><p className="font-medium">{formatDate(apt.preferredDate)} at {apt.preferredTime}</p><p className="text-xs text-muted-foreground truncate max-w-xs">{apt.description}</p></div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>{getStatusLabel(apt.status)}</span>
              </Link>
            ))}
            {(!client.appointments || client.appointments.length === 0) && <p className="text-sm text-muted-foreground">No appointments</p>}
          </div>
        </div>

        <div className="border rounded-xl p-4">
          <h3 className="font-medium mb-3">Payment History</h3>
          <div className="space-y-2">
            {client.payments?.slice(0, 5).map((pay: any) => (
              <div key={pay.id} className="flex items-center justify-between p-2 rounded text-sm">
                <div><p className="font-medium">{formatCurrency(pay.amount)}</p><p className="text-xs text-muted-foreground">{pay.method} | {pay.paidAt ? formatDate(pay.paidAt) : 'Not paid'}</p></div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pay.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{pay.status}</span>
              </div>
            ))}
            {(!client.payments || client.payments.length === 0) && <p className="text-sm text-muted-foreground">No payments</p>}
          </div>
        </div>
      </div>
    </div>
  );
}