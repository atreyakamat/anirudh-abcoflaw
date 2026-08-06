'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { formatDate, formatTime, getStatusColor, getStatusLabel, formatCurrency } from '@/lib/utils';
import { ArrowLeft, Phone, Mail, Calendar, DollarSign, FileText, StickyNote, Activity } from 'lucide-react';
import { ClientTimeline } from '@/components/portal/client-timeline';
import { ActivityFeed, ActivityItem } from '@/components/ui/activity-feed';
import { useState } from 'react';
import type { Client } from '@/types';

type MatterTab = 'timeline' | 'appointments' | 'documents' | 'payments' | 'notes';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<MatterTab>('timeline');

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', id],
    queryFn: async () => { const res = await api.clients.get(id); return res.data.data as Client; },
    enabled: !!id,
  });

  if (isLoading) return <div className="space-y-4 animate-pulse"><div className="h-8 bg-muted rounded w-1/3" /><div className="h-64 bg-muted rounded-xl" /></div>;
  if (!client) return <div className="text-center py-12 text-muted-foreground">Client not found.</div>;

  const appointments = client.appointments || [];
  const payments = client.payments || [];
  const documents = client.documents || [];
  const latestAppt = appointments[0];

  const activityItems: ActivityItem[] = [
    ...appointments.map((apt) => ({
      id: `apt-${apt.id}`,
      type: 'APPOINTMENT' as const,
      title: `Consultation Booked: ${apt.description}`,
      description: `Preferred Slot: ${formatDate(apt.preferredDate)} at ${formatTime(apt.preferredTime)}`,
      timestamp: apt.createdAt,
      status: apt.status === 'CONFIRMED' ? 'SUCCESS' as const : 'PENDING' as const,
      actor: `${client.firstName} ${client.lastName}`,
    })),
    ...payments.map((p) => ({
      id: `pay-${p.id}`,
      type: 'PAYMENT' as const,
      title: `Payment Recorded: ${formatCurrency(p.amount)}`,
      description: `Method: ${p.method} • Status: ${p.status}`,
      timestamp: p.createdAt,
      status: p.status === 'PAID' ? 'SUCCESS' as const : 'PENDING' as const,
      actor: 'Billing System',
    })),
    ...documents.map((doc) => ({
      id: `doc-${doc.id}`,
      type: 'DOCUMENT' as const,
      title: `Document Uploaded: ${doc.originalName}`,
      description: `Type: ${doc.documentType} • Size: ${(doc.fileSize / 1024).toFixed(1)} KB`,
      timestamp: doc.uploadedAt,
      status: 'SUCCESS' as const,
      actor: `${client.firstName} ${client.lastName}`,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href="/clients" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to clients directory
      </Link>

      {/* Client Header Info Banner */}
      <div className="bg-card border rounded-xl p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{client.firstName} {client.lastName}</h1>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              Matter ID: {client.id.slice(-8)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-primary" /> {client.email}</span>
            <span className="flex items-center gap-1.5"><Phone className="w-4 h-4 text-emerald-500" /> {client.phone}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${client.phone}`}
            className="px-3.5 py-2 border rounded-lg text-xs font-semibold hover:bg-accent flex items-center gap-1.5 shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" /> Call Client
          </a>
          <a
            href={`mailto:${client.email}`}
            className="px-3.5 py-2 border rounded-lg text-xs font-semibold hover:bg-accent flex items-center gap-1.5 shadow-2xs"
          >
            <Mail className="w-3.5 h-3.5 text-primary" /> Send Email
          </a>
        </div>
      </div>

      {/* Client Matter Timeline */}
      <ClientTimeline
        currentStatus={latestAppt?.status || 'PENDING_REVIEW'}
        hasLawyer={Boolean(latestAppt?.bookedByUserId)}
        hasDocuments={documents.length > 0}
      />

      {/* Matter Hub Tabs */}
      <div className="flex border-b text-sm font-semibold gap-6">
        <button
          onClick={() => setActiveTab('timeline')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'timeline' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Activity className="w-4 h-4" /> Activity Feed ({activityItems.length})
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'appointments' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar className="w-4 h-4" /> Appointments ({appointments.length})
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'documents' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-4 h-4" /> Documents ({documents.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'payments' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <DollarSign className="w-4 h-4" /> Payments ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'notes' ? 'border-primary text-primary font-bold' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <StickyNote className="w-4 h-4" /> Case Notes
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'timeline' && (
        <ActivityFeed items={activityItems} title="Matter Activity Feed & Lifecycle Events" />
      )}

      {activeTab === 'appointments' && (
        <div className="bg-card border rounded-xl p-5 shadow-2xs space-y-3">
          <h3 className="font-semibold text-sm">Consultations & Appointments</h3>
          {appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No appointments recorded for this client.</p>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-accent/40 text-sm">
                <div>
                  <p className="font-semibold">{formatDate(apt.preferredDate)} at {formatTime(apt.preferredTime)}</p>
                  <p className="text-xs text-muted-foreground max-w-md truncate">{apt.description}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                  {getStatusLabel(apt.status)}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-card border rounded-xl p-5 shadow-2xs space-y-3">
          <h3 className="font-semibold text-sm">Case Document Vault</h3>
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No documents uploaded for this client yet.</p>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-accent/40 text-sm">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">{doc.originalName}</p>
                    <p className="text-xs text-muted-foreground">{(doc.fileSize / 1024).toFixed(1)} KB • Uploaded {formatDate(doc.uploadedAt)}</p>
                  </div>
                </div>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-muted font-semibold">{doc.documentType}</span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="bg-card border rounded-xl p-5 shadow-2xs space-y-3">
          <h3 className="font-semibold text-sm">Billing & Payment Records</h3>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No payment records found for this client.</p>
          ) : (
            payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-accent/40 text-sm">
                <div>
                  <p className="font-bold">{formatCurrency(p.amount)}</p>
                  <p className="text-xs text-muted-foreground">{p.method.replace('_', ' ')}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${p.status === 'PAID' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-amber-100 text-amber-800'}`}>
                  {p.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="bg-card border rounded-xl p-5 shadow-2xs space-y-3">
          <h3 className="font-semibold text-sm">Advocate Case Notes & Strategy</h3>
          <p className="text-sm text-foreground bg-muted/30 p-4 rounded-lg border">
            {client.notes || 'No confidential case notes added yet. Advocate can add legal strategy notes in client settings.'}
          </p>
        </div>
      )}
    </div>
  );
}