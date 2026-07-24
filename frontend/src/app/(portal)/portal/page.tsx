'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  CalendarDays,
  FileText,
  CreditCard,
  Upload,
  RefreshCw,
  Clock,
  FileUp,
  Calendar,
} from 'lucide-react';

export default function PortalDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [rescheduleAppt, setRescheduleAppt] = useState<any | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00');
  const [rescheduleReason, setRescheduleReason] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [sumRes, docRes] = await Promise.all([
        api.portal.summary().catch(() => null),
        api.portal.documents().catch(() => null),
      ]);
      if (sumRes?.data) setSummary(sumRes.data);
      if (docRes?.data?.documents) setDocuments(docRes.data.documents);
    } catch (err) {
      console.error('Failed to load portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploading(true);
    try {
      await api.portal.uploadDocument({
        originalName: uploadFile.name,
        fileName: `${Date.now()}_${uploadFile.name}`,
        filePath: `/uploads/${uploadFile.name}`,
        fileSize: uploadFile.size,
        mimeType: uploadFile.type || 'application/pdf',
        documentType: uploadFile.name.endsWith('.pdf') ? 'PDF' : 'DOCX',
      });
      setUploadFile(null);
      await loadData();
    } catch {
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRescheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleAppt || !newDate) return;

    try {
      await api.portal.reschedule({
        appointmentId: rescheduleAppt.id,
        preferredDate: newDate,
        preferredTime: newTime,
        reason: rescheduleReason,
      });
      setRescheduleAppt(null);
      await loadData();
    } catch {
      alert('Reschedule request failed.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const client = summary?.client;
  const appointments = client?.appointments || [];
  const payments = summary?.payments || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background border border-primary/20">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {client?.firstName || 'Client'}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Access your legal consultations, upload case documents, and review case status in real-time.
          </p>
        </div>
        <Button onClick={loadData} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Consultations</CardTitle>
            <CalendarDays className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.appointmentCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {summary?.confirmedAppointments || 0} Confirmed • {summary?.pendingAppointments || 0} Pending
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Case Documents</CardTitle>
            <FileText className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Uploaded to secure vault</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Records</CardTitle>
            <CreditCard className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Invoices & Receipts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Consultations & Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointments Section */}
        <Card className="border-border/50 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span>Upcoming & Recent Consultations</span>
            </CardTitle>
            <CardDescription>View status or request a date reschedule</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {appointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No consultations found. Book an appointment from our website homepage.
              </div>
            ) : (
              appointments.map((appt: any) => (
                <div
                  key={appt.id}
                  className="p-4 rounded-xl border border-border/40 bg-card hover:bg-accent/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{appt.description}</span>
                      <Badge variant="outline" className="capitalize text-xs">
                        {appt.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(appt.preferredDate).toLocaleDateString()} at {appt.preferredTime}
                      </span>
                      <span>Ref: {appt.referenceNumber?.slice(-6)}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRescheduleAppt(appt);
                      setNewDate(appt.preferredDate?.slice(0, 10) || '');
                      setNewTime(appt.preferredTime || '10:00');
                    }}
                  >
                    Reschedule
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Linked Document Vault Section */}
        <Card className="border-border/50 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileUp className="w-5 h-5 text-emerald-500" />
              <span>Linked Document Vault</span>
            </CardTitle>
            <CardDescription>Upload case files & evidence for attorney review</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1">
            {/* Upload Box */}
            <form onSubmit={handleUpload} className="p-4 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 flex flex-col items-center justify-center gap-3 text-center">
              <Upload className="w-8 h-8 text-primary/60" />
              <div>
                <p className="text-sm font-medium">Upload Legal Files (PDF, DOCX, JPG)</p>
                <p className="text-xs text-muted-foreground">Select a document from your device</p>
              </div>
              <Input
                type="file"
                accept=".pdf,.docx,.jpg,.png"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                className="max-w-xs text-xs"
              />
              {uploadFile && (
                <Button type="submit" size="sm" disabled={uploading}>
                  {uploading ? 'Uploading...' : `Upload "${uploadFile.name}"`}
                </Button>
              )}
            </form>

            {/* Document List */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Vault Documents ({documents.length})
              </h4>
              {documents.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No documents uploaded yet.</p>
              ) : (
                documents.map((doc: any) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-lg border border-border/30 bg-card flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileText className="w-5 h-5 text-primary shrink-0" />
                      <div className="truncate">
                        <p className="font-medium truncate">{doc.originalName}</p>
                        <p className="text-xs text-muted-foreground">
                          {(doc.fileSize / 1024).toFixed(1)} KB • Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      {doc.documentType}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reschedule Modal Overlay */}
      {rescheduleAppt && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-lg border-border shadow-2xl">
            <CardHeader>
              <CardTitle>Reschedule Consultation</CardTitle>
              <CardDescription>Select a new preferred date and time slot</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRescheduleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred Date</Label>
                  <Input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Preferred Time Slot</Label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:30">03:30 PM</option>
                    <option value="17:00">05:00 PM</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Reason for Rescheduling (Optional)</Label>
                  <Input
                    placeholder="e.g., Schedule conflict"
                    value={rescheduleReason}
                    onChange={(e) => setRescheduleReason(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setRescheduleAppt(null)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Reschedule Request</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}