'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Faq } from '@/types';

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { data: faqs, isLoading } = useQuery({
    queryKey: ['public-faqs'],
    queryFn: async () => { const res = await api.faqs.published(); return res.data.data as Faq[]; },
  });

  const grouped = faqs?.reduce<Record<string, Faq[]>>((acc, f) => { const cat = f.category?.name || 'General'; (acc[cat] = acc[cat] || []).push(f); return acc; }, {}) || {};

  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <section className="relative py-24 md:py-32 bg-[#0F172A] text-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="text-sm font-bold tracking-widest text-yellow-500 uppercase mb-3">Client Support</h2>
          <h1 className="text-5xl md:text-6xl font-bold font-serif mb-6">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl text-slate-300 font-light">Clear, transparent answers to common legal and administrative queries.</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 space-y-16">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="space-y-6">
                <h2 className="text-3xl font-bold font-serif text-slate-900 border-b border-slate-200 pb-4">{cat}</h2>
                <div className="space-y-4">
                  {items.map((f) => (
                    <div key={f.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm transition-all duration-300 hover:border-yellow-600/30">
                      <button 
                        onClick={() => setOpenId(openId === f.id ? null : f.id)} 
                        className="w-full flex items-center justify-between p-6 text-left font-bold text-lg text-slate-900 hover:text-yellow-600 transition-colors"
                      >
                        <span>{f.question}</span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${openId === f.id ? 'bg-yellow-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          {openId === f.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </div>
                      </button>
                      <div className={`px-6 overflow-hidden transition-all duration-300 ${openId === f.id ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-slate-600 leading-relaxed pt-2 border-t border-slate-100">{f.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}