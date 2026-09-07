'use client';

import { MapPin, Mail, Clock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/components/page-header';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Administrative inquiry received. Our office will get back to you shortly.');
    setForm({ name: '', email: '', phone: '', message: '' });
    setSubmitting(false);
  };

  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900">
      
      {/* BCI Compliance Disclaimer Header Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-500 shrink-0" />
            <span><strong>Bar Council Compliance Notice:</strong> Contact information provided per Rule 36 of Bar Council of India Rules (1975).</span>
          </p>
          <span className="hidden md:inline-block text-slate-400 font-mono text-[10px]">Porvorim, Goa</span>
        </div>
      </div>

      <div className="pt-10">
        <PageHeader 
          badge="Office Information" 
          title="Contact AB & Co. Legal" 
          subtitle="Reach out to our Porvorim office for administrative inquiries or to schedule a consultation." 
        />
      </div>

      {/* Contact Content */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Details */}
          <div className="space-y-10 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 mb-4">Office Details</h2>
              <p className="text-slate-600 leading-relaxed text-base mb-8">
                Our office in Porvorim puts us at the heart of Goa’s legal district, with ready access to the Bombay High Court (Panaji Bench), Goa District & Sessions Courts, and local tribunals.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                { i: MapPin, t: 'Office Location', d: 'Porvorim, North Goa – (near Panaji), 403521' }, 
                { i: Mail, t: 'Confidential Email', d: 'info@abco.legal' }, 
                { i: Clock, t: 'Office Hours', d: 'Mon–Fri: 10:00–17:00 IST (Zoom/phone calls by appointment)' }
              ].map((c) => (
                <div key={c.t} className="flex items-start gap-4">
                  <div className="w-11 h-11 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                    <c.i className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-0.5">{c.t}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{c.d}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 text-xs leading-relaxed space-y-2">
              <p className="font-bold text-yellow-400">Consultation Fee Notice:</p>
              <p>Standard consultation fee is <strong>₹2,500 for a 60-minute session</strong>. All appointments are scheduled upon prior confirmation.</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-2xl border border-slate-200 shadow-lg">
            <h3 className="text-2xl font-bold font-serif text-slate-900 mb-2">Administrative Inquiry Form</h3>
            <p className="text-xs text-slate-500 mb-6">Submit factual details regarding your inquiry. Confidentiality is strictly maintained.</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wider">Full Name *</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 bg-slate-50 text-sm text-slate-900" placeholder="Full Name" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wider">Email Address *</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 bg-slate-50 text-sm text-slate-900" placeholder="name@example.com" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wider">Phone Number *</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 bg-slate-50 text-sm text-slate-900" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 mb-1 block uppercase tracking-wider">Inquiry Context *</label>
                <textarea required rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 bg-slate-50 text-sm text-slate-900 resize-none" placeholder="Briefly describe your inquiry..." />
              </div>
              <button type="submit" disabled={submitting} className="w-full py-3.5 bg-[#0F172A] text-white rounded-xl font-bold tracking-wider uppercase text-xs hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-sm">
                {submitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
