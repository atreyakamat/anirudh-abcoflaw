'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { formatDate, formatTime, getStatusColor, getStatusLabel } from '@/lib/utils';
import type { Appointment, PaginatedResult } from '@/types';

export default function PortalAppointmentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['portal-appointments'],
    queryFn: async () => { const res = await api.appointments.list({ limit: 50, sortBy: 'preferredDate', sortOrder: 'desc' }); return res.data.data as PaginatedResult<Appointment>; },
  });

  return (
    <div className="space-y-6 animate-in">
      <h1 className="text-2xl font-bold">My Appointments</h1>
      <div className="space-y-3">
        {isLoading ? [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />) :
        data?.items?.map((apt) => (
          <div key={apt.id} className="border rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{formatDate(apt.preferredDate)} at {formatTime(apt.preferredTime)}</p>
              <p className="text-sm text-muted-foreground mt-1">{apt.description}</p>
              <p className="text-xs text-muted-foreground mt-1">Ref: {apt.referenceNumber}</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>{getStatusLabel(apt.status)}</span>
          </div>
        ))}
        {data?.items?.length === 0 && <p className="text-center text-muted-foreground py-8">No appointments yet.</p>}
      </div>
    </div>
  );
}