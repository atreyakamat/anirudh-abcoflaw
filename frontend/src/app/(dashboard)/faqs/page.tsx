'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useState } from 'react';
import type { Faq, FaqCategory } from '@/types';

export default function FaqsPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: faqs, isLoading } = useQuery({
    queryKey: ['faqs-admin'],
    queryFn: async () => { const res = await api.faqs.list({}); return res.data.data as Faq[]; },
  });
  const { data: categories } = useQuery({
    queryKey: ['faq-categories'],
    queryFn: async () => { const res = await api.faqs.categories(); return res.data.data as FaqCategory[]; },
  });

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">FAQs</h1>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"><Plus className="w-4 h-4" /> Add FAQ</button>
      </div>
      <div className="space-y-2">
        {isLoading ? [...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />) :
        faqs?.map((faq) => (
          <div key={faq.id} className="border rounded-lg">
            <button onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${faq.isVisible ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="font-medium">{faq.question}</span>
                {faq.category && <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{faq.category.name}</span>}
              </div>
              {expandedId === faq.id ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
            </button>
            {expandedId === faq.id && <div className="px-4 pb-4 text-sm text-muted-foreground border-t pt-3">{faq.answer}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}