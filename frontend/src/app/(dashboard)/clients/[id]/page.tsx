'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDate, getStatusColor, getStatusLabel, formatCurrency } from '@/lib/utils';
import { ArrowLeft, Phone, Mail, Calendar, DollarSign } from 'lucide-react';
import type { Client } from '@/types';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => { const res = await api.clients.get(id); return res.data.data as Client; },
    enabled: !!id,
  });

  if (isLoading) return <div className="space-y-4 animate-pulse"><div className="h-8 bg-muted rounded w-1/3" /><div className="h-64 bg-muted rounded-xl" /></div>;
  if (!client) return <div className="text-center py-12 text-muted-foreground">Client not found.</div>;

  return (
    <div className="space-y-6 animate-in">
      <Link href="/clients" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" /> Back to clients</Link>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">{client.firstName} {client.lastName}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {client.email}</span>
            <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {client.phone}</span>
          </div>
        </div>
      </div>

      {client.notes && <div className="border rounded-xl p-4"><h3 className="font-medium mb-1">Notes</h3><p className="text-sm text-muted-foreground">{client.notes}</p></div>}

      {client.appointments && client.appointments.length > 0 && (
        <div className="border rounded-xl p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2"><Calendar className="w-4 h-4" /> Recent Appointments</h3>
          <div className="space-y-2">
            {client.appointments.slice(0, 5).map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-2 rounded hover:bg-accent text-sm">
                <div><p className="font-medium">{formatDate(apt.preferredDate)} at {apt.preferredTime}</p><p className="text-xs text-muted-foreground truncate max-w-xs">{apt.description}</p></div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>{getStatusLabel(apt.status)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {client.payments && client.payments.length > 0 && (
        <div className="border rounded-xl p-4">
          <h3 className="font-medium mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Payment History</h3>
          <div className="space-y-2">
            {client.payments.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between p-2 rounded hover:bg-accent text-sm">
                <div><p className="font-medium">{formatCurrency(p.amount)}</p><p className="text-xs text-muted-foreground">{p.method.replace('_', ' ')}</p></div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}