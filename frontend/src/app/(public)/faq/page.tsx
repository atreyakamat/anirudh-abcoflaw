'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { Faq } from '@/types';

const fallbackFaqs = [
  { id: '1', question: 'How do I schedule a consultation with Advocate Anirudha?', answer: 'You can easily schedule a consultation by using our online booking portal, calling our office directly at +91-94224 45340, or reaching out via email. We offer both in-person meetings at our Porvorim office and virtual consultations.', category: { name: 'General Consultations' } },
  { id: '2', question: 'What documents should I bring to my first legal meeting?', answer: 'Please bring a valid government-issued ID and any documents relevant to your case. This includes contracts, legal notices received, property deeds, emails, or prior court orders. Having these ready allows us to provide actionable advice immediately.', category: { name: 'General Consultations' } },
  { id: '3', question: 'Do you assist with company registration and corporate compliance?', answer: 'Yes, we provide end-to-end corporate services including LLP and Company Registrations, drafting Partnership Deeds, ensuring regulatory compliance, and advising on corporate governance structures.', category: { name: 'Corporate & Business Law' } },
  { id: '4', question: 'Can you draft and review commercial contracts?', answer: 'Absolutely. We specialize in drafting, reviewing, and negotiating a wide variety of commercial agreements, including clinical trial agreements, vendor contracts, non-disclosure agreements (NDAs), and employment contracts.', category: { name: 'Corporate & Business Law' } },
  { id: '5', question: 'How do you handle property title verifications in Goa?', answer: 'Property transactions in Goa are subject to unique local laws. We conduct rigorous title searches, verify mutation records, draft sale deeds, and ensure the property is free from encumbrances before you proceed with a purchase.', category: { name: 'Real Estate & Property' } },
  { id: '6', question: 'Do you handle cheque bouncing (Section 138) cases?', answer: 'Yes, cheque bouncing is a criminal offense under Section 138 of the Negotiable Instruments Act. We aggressively represent clients in issuing legal notices, filing complaints, and recovering dues through the court system.', category: { name: 'Litigation & Dispute Resolution' } },
  { id: '7', question: 'What is the typical timeline for civil litigation?', answer: 'Civil litigation timelines can vary significantly based on the complexity of the case, court schedules, and the willingness of parties to settle. While we always strive for swift, amicable resolutions, we are fully prepared for long-term strategic litigation when necessary.', category: { name: 'Litigation & Dispute Resolution' } }
];

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const { data: faqs, isLoading } = useQuery({
    queryKey: ['public-faqs'],
    queryFn: async () => { 
      try {
        const res = await api.faqs.published(); 
        const items = res.data.data as Faq[];
        return items.length > 0 ? items : fallbackFaqs;
      } catch (err) {
        return fallbackFaqs;
      }
    },
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