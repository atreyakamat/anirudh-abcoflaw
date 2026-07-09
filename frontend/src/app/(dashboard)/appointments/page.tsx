'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useState } from 'react';
import { getStatusColor, getStatusLabel, formatDate, formatTime } from '@/lib/utils';
import Link from 'next/link';
import { Search, Filter, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Appointment, PaginatedResult } from '@/types';

export default function AppointmentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['appointments', search, statusFilter, page],
    queryFn: async () => {
      const res = await api.appointments.list({ search, status: statusFilter || undefined, page, limit: 20, sortBy: 'preferredDate', sortOrder: 'desc' });
      return res.data.data as PaginatedResult<Appointment>;
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (id: string) => api.appointments.confirm(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['appointments'] }); toast.success('Appointment confirmed'); },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => api.appointments.reject(id, reason),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['appointments'] }); toast.success('Appointment rejected'); },
  });

  const statuses = ['PENDING_REVIEW', 'PENDING_LAWYER_CONFIRMATION', 'CONFIRMED', 'REJECTED', 'RESCHEDULED', 'UPCOMING', 'REMINDER_SENT', 'COMPLETED', 'CANCELLED', 'ARCHIVED'];

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <Link href="/book" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"><Plus className="w-4 h-4" /> New Appointment</Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background" /></div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="px-3 py-2 text-sm border rounded-lg bg-background"><option value="">All Statuses</option>{statuses.map((s) => <option key={s} value={s}>{getStatusLabel(s)}</option>)}</select>
      </div>

      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left p-3 font-medium">Client</th><th className="text-left p-3 font-medium hidden md:table-cell">Description</th><th className="text-left p-3 font-medium">Date & Time</th><th className="text-left p-3 font-medium">Status</th><th className="text-left p-3 font-medium">Actions</th></tr></thead>
          <tbody>
            {isLoading ? [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5} className="p-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>) :
            data?.items?.map((apt) => (
              <tr key={apt.id} className="border-t hover:bg-muted/50">
                <td className="p-3"><Link href={`/clients/${apt.clientId}`} className="font-medium hover:underline">{apt.client?.firstName} {apt.client?.lastName}</Link><p className="text-xs text-muted-foreground">{apt.client?.email}</p></td>
                <td className="p-3 hidden md:table-cell text-muted-foreground max-w-xs truncate">{apt.description}</td>
                <td className="p-3"><p className="font-medium">{formatDate(apt.preferredDate)}</p><p className="text-xs text-muted-foreground">{formatTime(apt.preferredTime)}</p></td>
                <td className="p-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>{getStatusLabel(apt.status)}</span></td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <Link href={`/appointments/${apt.id}`} className="px-2 py-1 text-xs border rounded hover:bg-accent">View</Link>
                    {apt.status === 'PENDING_LAWYER_CONFIRMATION' && <>
                      <button onClick={() => confirmMutation.mutate(apt.id)} className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">Confirm</button>
                      <button onClick={() => rejectMutation.mutate({ id: apt.id })} className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
            {data?.items?.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No appointments found</td></tr>}
          </tbody>
        </table>
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {((page - 1) * 20) + 1} to {Math.min(page * 20, data.total)} of {data.total}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!data.hasPreviousPage} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button>
            <button onClick={() => setPage((p) => p + 1)} disabled={!data.hasNextPage} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}