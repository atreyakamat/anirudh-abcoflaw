'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

const practiceAreas = ['Corporate Law', 'Family Law', 'Property Law', 'Employment Law', 'Criminal Law', 'Civil Litigation'];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', practiceArea: '', preferredDate: '', preferredTime: '', description: '', documentType: 'none' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('Booking request submitted! You will receive a confirmation email once the lawyer reviews your request.');
    setSubmitting(false);
    setStep(4);
  };

  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900 bg-slate-50 min-h-screen pb-24">
      {/* Header Section */}
      <section className="relative py-16 md:py-24 bg-[#0F172A] text-center text-white overflow-hidden mb-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-sm font-bold tracking-widest text-yellow-500 uppercase mb-3">Schedule</h2>
          <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">Book a Consultation</h1>
          <p className="text-lg md:text-xl text-slate-300 font-light">Select your practice area and preferred time.</p>
        </div>
      </section>

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