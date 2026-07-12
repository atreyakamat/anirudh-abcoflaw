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
    <div className="animate-in">
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background text-center">
        <div className="max-w-3xl mx-auto px-4"><h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1><p className="text-lg text-muted-foreground">Find answers to common legal questions.</p></div>
      </section>
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          {isLoading ? [...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />) :
          Object.entries(grouped).map(([cat, items]) => (
            <div key={cat}>
              <h2 className="text-xl font-bold mb-4">{cat}</h2>
              <div className="space-y-2">
                {items.map((f) => (
                  <div key={f.id} className="border rounded-lg">
                    <button onClick={() => setOpenId(openId === f.id ? null : f.id)} className="w-full flex items-center justify-between p-4 text-left font-medium hover:bg-muted/50 transition-colors">
                      <span>{f.question}</span>
                      {openId === f.id ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                    </button>
                    {openId === f.id && <div className="px-4 pb-4 text-sm text-muted-foreground">{f.answer}</div>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}