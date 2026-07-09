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
    <div className="animate-in max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Book a Consultation</h1>
      {step < 4 && <div className="flex items-center justify-center gap-2 mb-8"><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>1</div><div className="w-16 h-0.5 bg-muted" /><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>2</div><div className="w-16 h-0.5 bg-muted" /><div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>3</div></div>}

      {step === 4 ? (
        <Card><CardContent className="pt-6 text-center py-12"><h2 className="text-2xl font-bold mb-2">Booking Submitted!</h2><p className="text-muted-foreground">Your consultation request has been received. The lawyer will review and confirm your appointment within 24 hours.</p></CardContent></Card>
      ) : (
        <form onSubmit={handleSubmit}>
          {step === 1 && <Card><CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-bold">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">First Name *</label><input required value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background" /></div>
              <div><label className="text-sm font-medium">Last Name *</label><input required value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background" /></div>
            </div>
            <div><label className="text-sm font-medium">Email *</label><input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background" /></div>
            <div><label className="text-sm font-medium">Phone *</label><input required type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background" /></div>
          </CardContent></Card>}

          {step === 2 && <Card><CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-bold">Consultation Details</h2>
            <div><label className="text-sm font-medium">Practice Area *</label><select required value={form.practiceArea} onChange={(e) => setForm((f) => ({ ...f, practiceArea: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background"><option value="">Select...</option>{practiceAreas.map((a) => <option key={a}>{a}</option>)}</select></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">Preferred Date *</label><input required type="date" value={form.preferredDate} onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background" /></div>
              <div><label className="text-sm font-medium">Preferred Time *</label><input required type="time" value={form.preferredTime} onChange={(e) => setForm((f) => ({ ...f, preferredTime: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background" /></div>
            </div>
            <div><label className="text-sm font-medium">Description *</label><textarea required rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background" placeholder="Briefly describe your legal matter..." /></div>
          </CardContent></Card>}

          {step === 3 && <Card><CardContent className="pt-6 space-y-4">
            <h2 className="text-lg font-bold">Review & Submit</h2>
            <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {form.firstName} {form.lastName}</p>
              <p><span className="font-medium">Email:</span> {form.email}</p>
              <p><span className="font-medium">Phone:</span> {form.phone}</p>
              <p><span className="font-medium">Practice Area:</span> {form.practiceArea}</p>
              <p><span className="font-medium">Date/Time:</span> {form.preferredDate} at {form.preferredTime}</p>
              <p><span className="font-medium">Description:</span> {form.description}</p>
            </div>
            <p className="text-xs text-muted-foreground">By submitting, you agree to our terms and privacy policy. A nominal fee may apply after confirmation.</p>
          </CardContent></Card>}

          <div className="flex justify-between mt-6">
            {step > 1 && <button type="button" onClick={() => setStep((s) => s - 1)} className="px-4 py-2 border rounded-lg text-sm hover:bg-accent">Back</button>}
            <div className="ml-auto">
              {step < 3 ? <button type="button" onClick={() => setStep((s) => s + 1)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">Next</button> :
              <button type="submit" disabled={submitting} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit Booking'}</button>}
            </div>
          </div>
        </form>
      )}
    </div>
  );
}