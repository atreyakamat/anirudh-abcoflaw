'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';
import { Loader2, ArrowLeft, Receipt, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import type { Client, Appointment, PaginatedResult } from '@/types';

const paymentSchema = z.object({
  appointmentId: z.string().min(1, 'Please select an appointment'),
  amount: z.coerce.number().min(1, 'Amount must be greater than 0'),
  method: z.enum(['CASH', 'GPAY', 'BANK_TRANSFER'], { required_error: 'Please select a payment method' }),
  status: z.enum(['PENDING', 'PAID', 'PARTIAL', 'VOID']),
  referenceNumber: z.string().optional(),
  paidAt: z.string().optional(),
  notes: z.string().optional(),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function RecordPaymentPage() {
  const router = useRouter();

  const { data: appointmentsResponse, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['appointments-for-payment'],
    queryFn: async () => {
      const res = await api.appointments.list({ limit: 100, sortBy: 'createdAt', sortOrder: 'desc' });
      return res.data.data as PaginatedResult<Appointment>;
    }
  });

  const appointments = appointmentsResponse?.items || [];

  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      status: 'PAID',
      method: 'CASH',
      paidAt: new Date().toISOString().split('T')[0], // Default to today
    }
  });

  const createPayment = useMutation({
    mutationFn: async (data: PaymentFormValues) => {
      // Find the associated client from the selected appointment
      const appointment = appointments.find(a => a.id === data.appointmentId);
      const payload = {
        ...data,
        clientId: appointment?.clientId,
        paidAt: data.paidAt ? new Date(data.paidAt).toISOString() : undefined,
      };
      return api.payments.create(payload);
    },
    onSuccess: () => {
      toast.success('Payment recorded successfully!');
      router.push('/dashboard/payments');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    }
  });

  const onSubmit = (data: PaymentFormValues) => {
    createPayment.mutate(data);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-3xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/payments" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold font-serif text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-yellow-600" /> Record Offline Payment
          </h1>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 md:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900">Link to Appointment / Case</label>
            <select 
              {...register('appointmentId')}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600/20 focus:border-yellow-600 transition-all"
              disabled={isLoadingAppointments}
            >
              <option value="">-- Select an Appointment --</option>
              {appointments.map(app => (
                <option key={app.id} value={app.id}>
                  {app.client?.firstName} {app.client?.lastName} - {new Date(app.preferredDate).toLocaleDateString()} (Ref: {app.referenceNumber})
                </option>
              ))}
            </select>
            {errors.appointmentId && <p className="text-red-500 text-xs font-medium">{errors.appointmentId.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900">Amount (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-slate-500 font-medium">₹</span>
                <input 
                  type="number"
                  step="0.01"
                  {...register('amount')}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600/20 focus:border-yellow-600 transition-all font-mono"
                />
              </div>
              {errors.amount && <p className="text-red-500 text-xs font-medium">{errors.amount.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900">Payment Date</label>
              <input 
                type="date"
                {...register('paidAt')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600/20 focus:border-yellow-600 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900">Payment Method</label>
              <select 
                {...register('method')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600/20 focus:border-yellow-600 transition-all"
              >
                <option value="CASH">Cash</option>
                <option value="GPAY">GPay / UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
              </select>
              {errors.method && <p className="text-red-500 text-xs font-medium">{errors.method.message}</p>}
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-900">Payment Status</label>
              <select 
                {...register('status')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600/20 focus:border-yellow-600 transition-all"
              >
                <option value="PAID">Paid (Cleared)</option>
                <option value="PENDING">Pending</option>
                <option value="PARTIAL">Partial</option>
              </select>
              {errors.status && <p className="text-red-500 text-xs font-medium">{errors.status.message}</p>}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900">Transaction Reference / UTR Number</label>
            <input 
              {...register('referenceNumber')}
              placeholder="e.g. UPI/234987123984 or Cheque No."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600/20 focus:border-yellow-600 transition-all"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-900">Internal Notes</label>
            <textarea 
              {...register('notes')}
              rows={3}
              placeholder="Any additional remarks about this payment..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-600/20 focus:border-yellow-600 transition-all resize-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link 
              href="/dashboard/payments"
              className="px-6 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              disabled={createPayment.isPending}
              className="px-8 py-3 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-xl hover:-translate-y-0.5 rounded-xl transition-all flex items-center gap-2"
            >
              {createPayment.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              Save Payment
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
