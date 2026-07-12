'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Search } from 'lucide-react';
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
    <div className="space-y-6 animate-in">
      <h1 className="text-2xl font-bold">Clients</h1>
      <div className="relative max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><input type="text" placeholder="Search clients..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 text-sm border rounded-lg bg-background" /></div>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left p-3 font-medium">Name</th><th className="text-left p-3 font-medium">Email</th><th className="text-left p-3 font-medium hidden md:table-cell">Phone</th><th className="text-left p-3 font-medium hidden md:table-cell">Appointments</th><th className="text-left p-3 font-medium">Actions</th></tr></thead>
          <tbody>
            {isLoading ? [...Array(5)].map((_, i) => <tr key={i}><td colSpan={5} className="p-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>) :
            data?.items?.map((client) => (
              <tr key={client.id} className="border-t hover:bg-muted/50">
                <td className="p-3 font-medium">{client.firstName} {client.lastName}</td>
                <td className="p-3 text-muted-foreground">{client.email}</td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{client.phone}</td>
                <td className="p-3 hidden md:table-cell">{client._count?.appointments || 0}</td>
                <td className="p-3"><Link href={`/clients/${client.id}`} className="px-2 py-1 text-xs border rounded hover:bg-accent">View</Link></td>
              </tr>
            ))}
            {data?.items?.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No clients found</td></tr>}
          </tbody>
        </table>
      </div>
      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Page {page} of {data.totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!data.hasPreviousPage} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Previous</button>
            <button onClick={() => setPage((p) => p + 1)} disabled={!data.hasNextPage} className="px-3 py-1 text-sm border rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}