'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import type { Faq } from '@/types';
import { PageHeader } from '@/components/page-header';

const fallbackFaqs = [
  { 
    id: '1', 
    question: 'Is there a free consultation?', 
    answer: 'No. All new appointments require the standard fee (₹2,500 for a 60-minute session). This ensures serious inquiries and respects Bar Council of India Rule 36 compliance. You will see the fee before confirming your booking.', 
    category: { name: 'Consultation & Fee Policy' } 
  },
  { 
    id: '2', 
    question: 'What if I must cancel or reschedule my appointment?', 
    answer: 'Please notify our office at least 24 hours in advance if you need to reschedule or cancel. Fees may apply for late cancellations per our administrative booking policy.', 
    category: { name: 'Consultation & Fee Policy' } 
  },
  { 
    id: '3', 
    question: 'What languages are consultations conducted in?', 
    answer: 'Consultations can be conducted in English, Konkani, Hindi, or Portuguese. We provide clear language support to ensure you fully understand your legal matter.', 
    category: { name: 'Office Procedures' } 
  },
  { 
    id: '4', 
    question: 'How is client confidentiality maintained?', 
    answer: 'As required by law and professional ethics, all client communications, documents, and case records are strictly confidential. We utilize secure digital and physical storage protocols for all sensitive information.', 
    category: { name: 'Office Procedures' } 
  },
  { 
    id: '5', 
    question: 'How does AB & Co. Legal comply with Bar Council rules?', 
    answer: 'We strictly follow Bar Council of India Rule 36 (BCI 1975). Our website and communications contain only factual, educational, and professional information (qualifications, core practice areas, and legal articles). We do not use promotional claims, slogans, or guarantees.', 
    category: { name: 'Ethics & Compliance' } 
  },
  { 
    id: '6', 
    question: 'What practice areas does the firm specialize in?', 
    answer: 'AB & Co. Legal focuses on Civil & Criminal Litigation in Goa Courts, Property & Conveyancing (RERA / Title / Transfers), Family Law & Succession under Goa’s unique Civil Code, Business & Commercial Advisory, and Central Government Notary services.', 
    category: { name: 'Practice Areas' } 
  }
] as Faq[];

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { data: faqs, isLoading } = useQuery({
    queryKey: ['public-faqs'],
    queryFn: async () => { 
      try {
        const res = await api.faqs.published(); 
        const items = res.data.data as Faq[];
        return items.length > 0 ? items : fallbackFaqs;
      } catch {
        return fallbackFaqs;
      }
    },
  });

  const grouped = faqs?.reduce<Record<string, Faq[]>>((acc, f) => { const cat = f.category?.name || 'General'; (acc[cat] = acc[cat] || []).push(f); return acc; }, {}) || {};

  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900 bg-slate-50 min-h-screen">
      
      {/* BCI Compliance Disclaimer Header Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-500 shrink-0" />
            <span><strong>Bar Council Compliance Notice:</strong> Factual information provided per Rule 36 of Bar Council of India Rules (1975).</span>
          </p>
          <span className="hidden md:inline-block text-slate-400 font-mono text-[10px]">Porvorim, Goa</span>
        </div>
      </div>

      <div className="pt-10">
        <PageHeader 
          badge="Factual Information" 
          title="Frequently Asked Questions" 
          subtitle="Clear, objective answers regarding our consultation process, office procedures, and BCI compliance." 
        />
      </div>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-20 bg-slate-200 rounded-xl animate-pulse" />)}
            </div>
          ) : (
            Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="space-y-4">
                <h2 className="text-2xl font-bold font-serif text-slate-900 border-b border-slate-200 pb-3">{cat}</h2>
                <div className="space-y-3">
                  {items.map((f) => (
                    <div key={f.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
                      <button 
                        onClick={() => setOpenId(openId === f.id ? null : f.id)} 
                        className="w-full flex items-center justify-between p-5 text-left font-bold text-base text-slate-900 hover:text-yellow-600 transition-colors"
                      >
                        <span>{f.question}</span>
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${openId === f.id ? 'bg-yellow-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                          {openId === f.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>
                      <div className={`px-5 overflow-hidden transition-all duration-300 ${openId === f.id ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-slate-600 text-sm leading-relaxed pt-2 border-t border-slate-100">{f.answer}</p>
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
