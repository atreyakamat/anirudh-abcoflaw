'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { formatDate, formatCurrency, getPaymentMethodLabel } from '@/lib/utils';
import type { Payment, PaginatedResult } from '@/types';

export default function PaymentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => { const res = await api.payments.list({ limit: 50, sortBy: 'createdAt', sortOrder: 'desc' }); return res.data.data as PaginatedResult<Payment>; },
  });

  return (
    <div className="space-y-6 animate-in">
      <h1 className="text-2xl font-bold">Payments</h1>
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted"><tr><th className="text-left p-3 font-medium">Client</th><th className="text-left p-3 font-medium">Amount</th><th className="text-left p-3 font-medium hidden md:table-cell">Method</th><th className="text-left p-3 font-medium">Status</th><th className="text-left p-3 font-medium hidden md:table-cell">Date</th><th className="text-left p-3 font-medium hidden md:table-cell">Reference</th></tr></thead>
          <tbody>
            {isLoading ? [...Array(5)].map((_, i) => <tr key={i}><td colSpan={6} className="p-3"><div className="h-4 bg-muted rounded animate-pulse" /></td></tr>) :
            data?.items?.map((pay) => (
              <tr key={pay.id} className="border-t hover:bg-muted/50">
                <td className="p-3 font-medium">{pay.client?.firstName} {pay.client?.lastName}</td>
                <td className="p-3 font-medium">{formatCurrency(pay.amount)}</td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{getPaymentMethodLabel(pay.method)}</td>
                <td className="p-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pay.status === 'PAID' ? 'bg-green-100 text-green-800' : pay.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{pay.status}</span></td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{pay.paidAt ? formatDate(pay.paidAt) : '-'}</td>
                <td className="p-3 text-muted-foreground hidden md:table-cell">{pay.referenceNumber || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}