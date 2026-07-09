'use client';

import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Message sent! We will get back to you soon.');
    setForm({ name: '', email: '', phone: '', message: '' });
    setSubmitting(false);
  };

  return (
    <div className="animate-in">
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background text-center">
        <div className="max-w-3xl mx-auto px-4"><h1 className="text-4xl font-bold mb-4">Contact Us</h1><p className="text-lg text-muted-foreground">Reach out to us for legal assistance.</p></div>
      </section>
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <div className="space-y-4">
              {[{ i: MapPin, t: 'Address', d: '123 Legal Street, Suite 100, Mumbai, India' }, { i: Phone, t: 'Phone', d: '+91-9876543210' }, { i: Mail, t: 'Email', d: 'contact@lawpractice.com' }, { i: Clock, t: 'Hours', d: 'Mon-Sat: 9:00 AM - 6:00 PM' }].map((c) => (<div key={c.t} className="flex items-start gap-3"><c.i className="w-5 h-5 text-primary mt-0.5 shrink-0" /><div><p className="font-medium text-sm">{c.t}</p><p className="text-sm text-muted-foreground">{c.d}</p></div></div>))}
            </div>
          </div>
          <Card><CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label className="text-sm font-medium">Name</label><input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background" /></div>
              <div><label className="text-sm font-medium">Email</label><input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background" /></div>
              <div><label className="text-sm font-medium">Phone</label><input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background" /></div>
              <div><label className="text-sm font-medium">Message</label><textarea required rows={4} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm bg-background" /></div>
              <button type="submit" disabled={submitting} className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50">{submitting ? 'Sending...' : 'Send Message'}</button>
            </form>
          </CardContent></Card>
        </div>
      </section>
    </div>
  );
}