'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { formatDate, formatCurrency, getPaymentMethodLabel } from '@/lib/utils';
import type { Payment, PaginatedResult } from '@/types';
import Link from 'next/link';
import { Plus } from 'lucide-react';

export default function PaymentsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => { const res = await api.payments.list({ limit: 50, sortBy: 'createdAt', sortOrder: 'desc' }); return res.data.data as PaginatedResult<Payment>; },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-serif text-slate-900 tracking-tight">Payments</h1>
          <Link href="/dashboard/payments/new" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> Record Payment
          </Link>
        </div>
        <p className="text-slate-500">Track and manage client payments and financial records.</p>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="p-4 font-semibold text-slate-600">Client</th>
              <th className="p-4 font-semibold text-slate-600">Amount</th>
              <th className="p-4 font-semibold text-slate-600 hidden md:table-cell">Method</th>
              <th className="p-4 font-semibold text-slate-600">Status</th>
              <th className="p-4 font-semibold text-slate-600 hidden md:table-cell">Date</th>
              <th className="p-4 font-semibold text-slate-600 hidden md:table-cell">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td colSpan={6} className="p-4">
                    <div className="h-4 bg-slate-200/50 rounded animate-pulse" />
                  </td>
                </tr>
              ))
            ) : data?.items?.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  No payments recorded yet.
                </td>
              </tr>
            ) : (
              data?.items?.map((pay) => (
                <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">
                    {pay.client?.firstName} {pay.client?.lastName}
                  </td>
                  <td className="p-4 font-bold text-slate-900">{formatCurrency(pay.amount)}</td>
                  <td className="p-4 text-slate-500 hidden md:table-cell">{getPaymentMethodLabel(pay.method)}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                      pay.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 
                      pay.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 
                      pay.status === 'PARTIAL' ? 'bg-blue-100 text-blue-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {pay.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 hidden md:table-cell">
                    {pay.paidAt ? formatDate(pay.paidAt) : '-'}
                  </td>
                  <td className="p-4 text-slate-500 hidden md:table-cell font-mono text-xs">
                    {pay.referenceNumber || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}