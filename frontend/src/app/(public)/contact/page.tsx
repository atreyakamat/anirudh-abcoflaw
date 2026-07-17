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
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900">
      {/* Header Section */}
      <section className="relative py-24 md:py-32 bg-[#0F172A] text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-sm font-bold tracking-widest text-yellow-500 uppercase mb-3">Get in Touch</h2>
          <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">Contact Us</h1>
          <p className="text-lg md:text-xl text-slate-300 font-light">We are here to provide the strategic legal counsel you need.</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Details & Image */}
          <div className="space-y-12 flex flex-col h-full">
            <div className="w-full relative aspect-square md:aspect-[4/3] lg:aspect-square xl:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/contactuspage.png" alt="Law Office Entrance" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold font-serif text-slate-900 mb-6">Office Information</h2>
              <p className="text-slate-600 leading-relaxed text-lg mb-8">Located in Porvorim, Goa, our doors are always open to clients seeking reliable, premium legal representation. Reach out to schedule a consultation.</p>
            </div>
            <div className="space-y-8">
              {[
                { i: MapPin, t: 'Office Address', d: 'FF1, Krishna Kunj, Chogm Rd, Porvorim, Goa 403501' }, 
                { i: Phone, t: 'Direct Phone', d: '+91-94224 45340' }, 
                { i: Mail, t: 'Email Address', d: 'hello@abcoflaw.in' }, 
                { i: Clock, t: 'Working Hours', d: 'Mon-Fri: 10:30am - 6:30pm | Sat: 10:30am - 1pm' }
              ].map((c) => (
                <div key={c.t} className="flex items-start gap-4 group">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0 group-hover:border-yellow-600/50 group-hover:shadow-md transition-all">
                    <c.i className="w-5 h-5 text-slate-900 group-hover:text-yellow-600 transition-colors" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900 uppercase tracking-wider mb-1">{c.t}</p>
                    <p className="text-lg text-slate-600">{c.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-600/10 rounded-full blur-3xl" />
            <h3 className="text-2xl font-bold font-serif text-slate-900 mb-6 relative z-10">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Full Name</label>
                <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900" placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Phone</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-wider">Message</label>
                <textarea required rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 bg-slate-50 transition-all text-slate-900 resize-none" placeholder="How can we help you?" />
              </div>
              <button type="submit" disabled={submitting} className="w-full py-4 bg-[#0F172A] text-white rounded-xl font-bold tracking-wider uppercase hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                {submitting ? 'Transmitting...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold tracking-widest text-yellow-600 uppercase mb-3">Client Testimonials</h2>
            <h3 className="text-4xl font-serif font-bold text-slate-900 mb-6">Trusted by Our Clients</h3>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <p className="text-3xl font-bold text-slate-900">5.0</p>
            </div>
            <p className="text-slate-600 font-medium uppercase tracking-wider">Based on 65 Google Reviews</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "I would definately recommend considering my personal experience..",
              "He will always give genuine advice and great service.",
              "Excellent and approachable Lawyer and very professional with his legal services"
            ].map((review, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm relative">
                <div className="absolute top-6 right-6 opacity-10">
                  <svg className="w-12 h-12 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <div className="flex gap-1 text-yellow-500 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 leading-relaxed italic relative z-10 font-medium">"{review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}