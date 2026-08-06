'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Users } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import type { Client, PaginatedResult } from '@/types';

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['clients', search, page],
    queryFn: async () => {
      const res = await api.clients.list({ search, page, limit: 20, sortBy: 'createdAt', sortOrder: 'desc' });
      return res.data.data as PaginatedResult<Client>;
    },
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clients Directory</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage client records, history, and consultation accounts</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search clients by name, email, or phone..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background"
        />
      </div>

      {data?.items?.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Clients Found"
          description="There are no client records matching your query."
          actionLabel="Add Consultation Booking"
          actionHref="/book"
        />
      ) : (
        <div className="border rounded-xl overflow-hidden bg-card shadow-xs">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 font-medium">Name</th>
                <th className="text-left p-3 font-medium">Email</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Phone</th>
                <th className="text-left p-3 font-medium hidden md:table-cell">Appointments</th>
                <th className="text-left p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={5} className="p-3"><div className="h-4 bg-muted/60 rounded animate-pulse" /></td></tr>
              )) : data?.items?.map((client) => (
                <tr key={client.id} className="border-t hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-medium">{client.firstName} {client.lastName}</td>
                  <td className="p-3 text-muted-foreground">{client.email}</td>
                  <td className="p-3 text-muted-foreground hidden md:table-cell">{client.phone}</td>
                  <td className="p-3 hidden md:table-cell">{client._count?.appointments || 0}</td>
                  <td className="p-3">
                    <Link href={`/clients/${client.id}`} className="px-2.5 py-1 text-xs border rounded hover:bg-accent font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {page} of {data.totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!data.hasPreviousPage} className="px-3 py-1 text-sm border rounded disabled:opacity-50 font-medium">Previous</button>
            <button onClick={() => setPage((p) => p + 1)} disabled={!data.hasNextPage} className="px-3 py-1 text-sm border rounded disabled:opacity-50 font-medium">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
