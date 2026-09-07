'use client';

import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';
import { api } from '@/lib/api/client';
import { Upload, X, FileText, Image as ImageIcon, File, ShieldCheck, CreditCard, Clock, MapPin, Copy, CalendarPlus, PhoneCall, CheckCircle2 } from 'lucide-react';

const practiceAreas = [
  'Civil & Criminal Litigation (Goa Courts)',
  'Property & Conveyancing (RERA / Title)',
  'Family Law & Succession (Goa Civil Code)',
  'Business & Commercial Advisory',
  'Notary & Preliminary IP Guidance',
];

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
    consultationMode: 'IN_PERSON',
  });
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<any>(null);
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
      } catch {
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
    if (type.startsWith('image/')) return <ImageIcon className="w-5 h-5 text-blue-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const descriptionWithArea = form.practiceArea
        ? `[${form.practiceArea}] [Mode: ${form.consultationMode}] ${form.description}`
        : form.description;

      const res = await api.appointments.create({
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

      setCreatedAppointment(res.data);
      toast.success('Consultation request submitted! Payment details sent via email.');
      setStep(4);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to submit request. Please check inputs.';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const copyReferenceNumber = () => {
    const refNum = createdAppointment?.referenceNumber || 'AB-LEGAL-REF';
    navigator.clipboard.writeText(refNum);
    toast.success('Reference number copied to clipboard');
  };

  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900 bg-slate-50 min-h-screen pb-24">
      
      {/* BCI Compliance Disclaimer Header Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-500 shrink-0" />
            <span><strong>Bar Council Compliance:</strong> Booking is purely administrative. Consultation Fee: ₹2,500 (60 mins). No free consultations or solicitation.</span>
          </p>
          <span className="hidden md:inline-block text-slate-400 font-mono text-[10px]">Porvorim, Goa</span>
        </div>
      </div>

      <div className="mb-8 pt-10">
        <PageHeader
          badge="Administrative Booking"
          title="Schedule a Consultation"
          subtitle="Select a practice area and a convenient date/time for an in-person or video consultation with Adv. Anirudha S. Borkar."
        />
      </div>

      <div className="max-w-3xl mx-auto px-4">
        
        {/* Fee & Policy Callout Box */}
        <div className="mb-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-700 grid sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-50 text-yellow-700 shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Standard Fee</p>
              <p className="text-slate-500">₹2,500 for 60-min session</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-50 text-yellow-700 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Cancellation Policy</p>
              <p className="text-slate-500">24-hour advance notice</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-50 text-yellow-700 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Location / Mode</p>
              <p className="text-slate-500">Porvorim Office or Video Call</p>
            </div>
          </div>
        </div>

        {step < 4 && (
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
            {[1, 2, 3].map((s, idx) => (
              <div key={s} className="flex items-center gap-2 sm:gap-4">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-500 ${step >= s ? 'bg-yellow-600 text-white shadow-[0_0_15px_rgba(202,138,4,0.4)] scale-110' : 'bg-white/60 text-slate-400 border border-slate-200/50 backdrop-blur-sm'}`}>
                  {s}
                </div>
                {idx < 2 && <div className={`w-6 sm:w-12 h-1 rounded-full transition-all duration-500 ${step > s ? 'bg-yellow-600 shadow-[0_0_10px_rgba(202,138,4,0.3)]' : 'bg-slate-200/50'}`} />}
              </div>
            ))}
          </div>
        )}

        {step === 4 ? (
          <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl p-8 md:p-12 text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-200">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <h2 className="text-3xl font-bold font-serif text-slate-900 mb-2 tracking-tight">Consultation Reserved</h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-md mx-auto mb-6">
              Your consultation request has been submitted. Our office will review the schedule and issue confirmation with payment instructions (UPI / Net Banking / Card).
            </p>

            {/* Reference Number Box */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl max-w-md mx-auto mb-8 flex items-center justify-between gap-4">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Reference Number</span>
                <span className="text-base font-mono font-bold text-slate-900">{createdAppointment?.referenceNumber || 'AB-LEGAL-REF-001'}</span>
              </div>
              <button
                onClick={copyReferenceNumber}
                className="px-3 py-1.5 text-xs font-medium border border-slate-300 rounded-lg hover:bg-white flex items-center gap-1.5 text-slate-700 shadow-xs transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Consultation+with+AB+%26+Co.+Legal&details=Reference:+${createdAppointment?.referenceNumber}&dates=${form.preferredDate.replace(/-/g, '')}T100000Z/${form.preferredDate.replace(/-/g, '')}T110000Z`}
                target="_blank"
                rel="noreferrer"
                className="p-3 border rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-bold text-slate-800 transition-colors shadow-xs"
              >
                <CalendarPlus className="w-4 h-4 text-blue-600" />
                <span>Add to Google Calendar</span>
              </a>
              <a
                href="https://maps.google.com/?q=Porvorim+Goa"
                target="_blank"
                rel="noreferrer"
                className="p-3 border rounded-xl hover:bg-slate-50 flex items-center justify-center gap-2 text-xs font-bold text-slate-800 transition-colors shadow-xs"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Get Office Directions</span>
              </a>
            </div>

            <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl max-w-md mx-auto text-xs text-left space-y-2 border border-slate-800">
              <p className="font-bold text-yellow-400 flex items-center gap-2">
                <PhoneCall className="w-4 h-4" />
                <span>Porvorim Office Contact:</span>
              </p>
              <p className="text-slate-400">• Adv. Anirudha S. Borkar Chamber, Porvorim, North Goa</p>
              <p className="text-slate-400">• Office Hours: Mon–Fri, 10:00–17:00 IST</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur-xl border border-slate-200 shadow-xl rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-300">
            
            {step === 1 && (
              <div className="space-y-6 relative z-10">
                <h2 className="text-xl font-bold font-serif text-slate-900 border-b border-slate-100 pb-3">1. Contact Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider">First Name *</label><input required value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900 text-sm" placeholder="First Name" /></div>
                  <div><label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider">Last Name *</label><input required value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900 text-sm" placeholder="Last Name" /></div>
                </div>
                <div><label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider">Email Address *</label><input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900 text-sm" placeholder="name@example.com" /></div>
                <div><label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider">Phone / WhatsApp *</label><input required type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900 text-sm" placeholder="+91 98221 XXXXX" /></div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 relative z-10">
                <h2 className="text-xl font-bold font-serif text-slate-900 border-b border-slate-100 pb-3">2. Consultation Details</h2>
                
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider">Practice Area *</label>
                  <select required value={form.practiceArea} onChange={(e) => setForm((f) => ({ ...f, practiceArea: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900 text-sm">
                    <option value="">Select Practice Area...</option>{practiceAreas.map((a) => <option key={a}>{a}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider">Consultation Mode *</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, consultationMode: 'IN_PERSON' }))}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${form.consultationMode === 'IN_PERSON' ? 'bg-yellow-50 border-yellow-600 text-yellow-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                    >
                      In-Person (Porvorim Office)
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, consultationMode: 'VIDEO_CALL' }))}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${form.consultationMode === 'VIDEO_CALL' ? 'bg-yellow-50 border-yellow-600 text-yellow-900' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                    >
                      Video / Phone Call
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider">Preferred Date *</label><input required type="date" value={form.preferredDate} onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900 text-sm" /></div>
                  <div><label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider">Preferred Time *</label><input required type="time" value={form.preferredTime} onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900 text-sm" /></div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wider">Brief Matter Description *</label>
                  <p className="text-[11px] text-slate-500 mb-2">Please provide only a brief description of the matter at this stage. Sensitive documents and detailed information can be shared through secure channels after the appointment is confirmed.</p>
                  <textarea required rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900 text-sm resize-none" placeholder="Provide brief factual context regarding your matter..." />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 mb-2 block uppercase tracking-wider">Attach Relevant Documents (Optional)</label>
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
                    className="w-full py-6 border-2 border-dashed border-slate-300 rounded-2xl hover:border-yellow-600/50 hover:bg-yellow-50/30 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-slate-600 cursor-pointer bg-white"
                  >
                    <Upload className="w-5 h-5 text-slate-400" />
                    <span className="font-medium text-xs">{uploading ? 'Uploading...' : 'Click to select documents'}</span>
                  </button>

                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file) => (
                        <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                          <div className="flex items-center gap-3">
                            {getFileIcon(file.type)}
                            <div>
                              <p className="text-xs font-medium text-slate-900 truncate max-w-[200px]">{file.name}</p>
                              <p className="text-[10px] text-slate-500">{formatFileSize(file.size)}</p>
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
                <h2 className="text-xl font-bold font-serif text-slate-900 border-b border-slate-100 pb-3">3. Summary & Confirmation</h2>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4 text-slate-700 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px] mb-0.5">Client Name</span> {form.firstName} {form.lastName}</p>
                    <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px] mb-0.5">Email</span> {form.email}</p>
                    <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px] mb-0.5">Phone</span> {form.phone}</p>
                    <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px] mb-0.5">Practice Area</span> {form.practiceArea}</p>
                    <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px] mb-0.5">Requested Slot</span> {form.preferredDate} at {form.preferredTime}</p>
                    <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px] mb-0.5">Mode</span> {form.consultationMode === 'IN_PERSON' ? 'In-Person (Porvorim)' : 'Video/Phone'}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-200">
                    <p><span className="font-bold text-slate-900 block uppercase tracking-wider text-[10px] mb-0.5">Matter Summary</span> {form.description}</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-slate-900 text-slate-300 text-xs leading-relaxed space-y-2 border border-slate-800">
                  <p className="font-bold text-yellow-400">Consultation Fee & Bar Council Compliance:</p>
                  <p>• Standard Fee: <strong>₹2,500 for a 60-minute session</strong> (paid prior to consultation).</p>
                  <p>• Cancellation: At least 24 hours advance notice required for rescheduling.</p>
                  <p>• Strict BCI Rule 36 compliance: All client information is treated with strict legal confidentiality.</p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-100 relative z-10">
              {step > 1 ? (
                <button type="button" onClick={() => setStep((s) => s - 1)} className="px-5 py-2.5 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all uppercase tracking-wider text-xs cursor-pointer">
                  Back
                </button>
              ) : <div />}

              <div>
                {step < 3 ? (
                  <button type="button" onClick={() => setStep((s) => s + 1)} className="px-7 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all uppercase tracking-wider text-xs cursor-pointer">
                    Next Step
                  </button>
                ) : (
                  <button type="submit" disabled={submitting} className="px-7 py-3 bg-yellow-600 text-white font-bold rounded-xl hover:bg-yellow-500 transition-all shadow-md disabled:opacity-50 uppercase tracking-wider text-xs cursor-pointer">
                    {submitting ? 'Submitting...' : 'Confirm Request (₹2,500 Fee)'}
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
