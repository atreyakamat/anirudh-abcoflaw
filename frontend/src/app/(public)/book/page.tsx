'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { api } from '@/lib/api/client';
import { Upload, X, FileText, Image, File } from 'lucide-react';

const practiceAreas = ['Corporate Law', 'Family Law', 'Property Law', 'Employment Law', 'Criminal Law', 'Civil Litigation'];

const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    practiceArea: '',
    preferredDate: '',
    preferredTime: '',
    description: '',
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    for (const file of selectedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds 10MB limit`);
        continue;
      }
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} has unsupported file type`);
        continue;
      }

      setUploading(true);
      try {
        const res = await api.documents.uploadPublic(file);
        const doc = res.data;
        setFiles((prev) => [...prev, {
          id: doc.id,
          name: doc.originalName,
          size: doc.fileSize,
          type: doc.mimeType,
        }]);
        toast.success(`${file.name} uploaded successfully`);
      } catch (err: any) {
        toast.error(`Failed to upload ${file.name}`);
      } finally {
        setUploading(false);
      }
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    if (type === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (type.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const descriptionWithArea = form.practiceArea
        ? `[${form.practiceArea}] ${form.description}`
        : form.description;

      await api.appointments.create({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        description: descriptionWithArea,
        preferredDate: new Date(form.preferredDate).toISOString(),
        preferredTime: form.preferredTime,
        source: 'WEBSITE',
        documentIds: files.map((f) => f.id),
      });

      toast.success('Booking request submitted! You will receive a confirmation email once the lawyer reviews your request.');
      setStep(4);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit booking. Please try again.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900 bg-slate-50 min-h-screen pb-24">
      <div className="mb-12">
        <PageHeader
          badge="Schedule"
          title="Book a Consultation"
          subtitle="Select a practice area and a convenient time to meet with our legal team."
        />
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {step < 4 && (
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((s, idx) => (
              <div key={s} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-600/20' : 'bg-white text-slate-400 border border-slate-200'}`}>
                  {s}
                </div>
                {idx < 2 && <div className={`w-12 h-1 rounded-full transition-colors ${step > s ? 'bg-yellow-600' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>
        )}

        {step === 4 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">Booking Submitted!</h2>
            <p className="text-slate-600 text-lg">Your consultation request has been successfully received. The lawyer will review your details and you will receive a confirmation email within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 md:p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 rounded-full blur-3xl pointer-events-none" />

            {step === 1 && (
              <div className="space-y-6 relative z-10">
                <h2 className="text-2xl font-bold font-serif text-slate-900 border-b border-slate-100 pb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">First Name *</label><input required value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900" /></div>
                  <div><label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Last Name *</label><input required value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900" /></div>
                </div>
                <div><label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Email *</label><input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900" /></div>
                <div><label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Phone *</label><input required type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900" /></div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 relative z-10">
                <h2 className="text-2xl font-bold font-serif text-slate-900 border-b border-slate-100 pb-4">Consultation Details</h2>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Practice Area *</label>
                  <select required value={form.practiceArea} onChange={(e) => setForm((f) => ({ ...f, practiceArea: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900">
                    <option value="">Select...</option>{practiceAreas.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Preferred Date *</label><input required type="date" value={form.preferredDate} onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900" /></div>
                  <div><label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Preferred Time *</label><input required type="time" value={form.preferredTime} onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900" /></div>
                </div>
                <div><label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Description *</label><textarea required rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900 resize-none" placeholder="Briefly describe your legal matter..." /></div>

                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Supporting Documents (Optional)</label>
                  <p className="text-xs text-slate-500 mb-3">PDF, DOCX, JPG, PNG up to 10MB each</p>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-yellow-600/50 hover:bg-yellow-50/50 transition-colors flex items-center justify-center gap-2 text-slate-600"
                  >
                    <Upload className="w-5 h-5" />
                    {uploading ? 'Uploading...' : 'Click to upload documents'}
                  </button>

                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">{file.name}</p>
                              <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(file.id)}
                            className="p-1 hover:bg-slate-200 rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-slate-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 relative z-10">
                <h2 className="text-2xl font-bold font-serif text-slate-900 border-b border-slate-100 pb-4">Review & Submit</h2>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 text-slate-700">
                  <div className="grid grid-cols-2 gap-4">
                    <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-xs mb-1">Name</span> {form.firstName} {form.lastName}</p>
                    <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-xs mb-1">Email</span> {form.email}</p>
                    <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-xs mb-1">Phone</span> {form.phone}</p>
                    <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-xs mb-1">Practice Area</span> {form.practiceArea}</p>
                    <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-xs mb-1">Date/Time</span> {form.preferredDate} at {form.preferredTime}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-xs mb-1">Description</span> {form.description}</p>
                  </div>
                  {files.length > 0 && (
                    <div className="pt-4 border-t border-slate-200">
                      <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-xs mb-1">Attached Documents</span></p>
                      <div className="mt-2 space-y-1">
                        {files.map((file) => (
                          <p key={file.id} className="text-sm flex items-center gap-2">
                            {getFileIcon(file.type)}
                            {file.name}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-500 bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-xl">
                  By submitting, you agree to our terms and privacy policy. A nominal consultation fee may apply after confirmation by the lawyer.
                </p>
              </div>
            )}

            <div className="flex justify-between items-center mt-8 pt-8 border-t border-slate-100 relative z-10">
              {step > 1 ? (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors uppercase tracking-wider text-sm">
                  Back
                </button>
              ) : <div />}

              <div>
                {step < 3 ? (
                  <button type="button" onClick={() => setStep((s) => s + 1)} className="px-8 py-3 bg-[#0F172A] text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-md uppercase tracking-wider text-sm">
                    Next Step
                  </button>
                ) : (
                  <button type="submit" disabled={submitting} className="px-8 py-3 bg-yellow-600 text-white font-bold rounded-xl hover:bg-yellow-700 transition-colors shadow-md shadow-yellow-600/20 disabled:opacity-50 uppercase tracking-wider text-sm">
                    {submitting ? 'Submitting...' : 'Confirm Booking'}
                  </button>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}