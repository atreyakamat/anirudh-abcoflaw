'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { formatDateTime } from '@/lib/utils';
import { useState } from 'react';
import type { AuditLog, PaginatedResult } from '@/types';

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs', page],
    queryFn: async () => { const res = await api.auditLogs.list({ page, limit: 50, sortBy: 'createdAt', sortOrder: 'desc' }); return res.data.data as PaginatedResult<AuditLog>; },
  });

  return (
    <div className="space-y-6 animate-in">
      <h1 className="text-2xl font-bold">Audit Logs</h1>
      <p className="text-sm text-muted-foreground">Immutable record of all system actions. Logs cannot be modified or deleted.</p>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left p-3 font-medium">Time</th><th className="text-left p-3 font-medium">User</th><th className="text-left p-3 font-medium">Action</th><th className="text-left p-3 font-medium hidden md:table-cell">Entity</th><th className="text-left p-3 font-medium hidden md:table-cell">Entity ID</th></tr></thead>
          <tbody>
            {isLoading ? [...Array(10)].map((_, i) => <tr key={i}><td colSpan={5} className="p-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>) :
            data?.items?.map((log) => (
              <tr key={log.id} className="border-t hover:bg-muted/50">
                <td className="p-3 text-xs">{formatDateTime(log.createdAt)}</td>
                <td className="p-3">{log.user ? `${log.user.firstName} ${log.user.lastName}` : 'System'}</td>
                <td className="p-3"><span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted">{log.action}</span></td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{log.entity}</td>
                <td className="p-3 text-muted-foreground hidden md:table-cell font-mono text-xs">{log.entityId.slice(0, 8)}...</td>
              </tr>
            ))}
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