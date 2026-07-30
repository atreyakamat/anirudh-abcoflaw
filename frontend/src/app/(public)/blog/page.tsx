'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import Link from 'next/link';
import { Calendar, ShieldCheck, ArrowRight } from 'lucide-react';
import type { BlogPost, PaginatedResult } from '@/types';
import { PageHeader } from '@/components/page-header';

const fallbackArticles = [
  {
    id: 'f1',
    slug: 'understanding-inventory-proceedings-in-goa',
    title: 'Understanding Inventory Proceedings in Goa: An Educational Overview',
    excerpt: 'An informational note on estate administration, succession, and partition proceedings under Goa’s unique Portuguese Civil Law framework.',
    cat: 'Succession Law',
    date: '2026-07-15',
  },
  {
    id: 'f2',
    slug: 'documents-reviewed-in-goa-property-transactions',
    title: 'Documents Commonly Reviewed in Goa Property Transactions',
    excerpt: 'Outline of title deeds, Form I & XIV revenue records, survey plans, and mutation entries required during property due diligence.',
    cat: 'Property Law',
    date: '2026-07-10',
  },
  {
    id: 'f3',
    slug: 'preliminary-considerations-in-civil-litigation',
    title: 'Civil Litigation Procedure: Preliminary Considerations',
    excerpt: 'Understanding cause of action, jurisdiction, legal notices, and documentation required prior to initiating civil court proceedings in Goa.',
    cat: 'Civil Practice',
    date: '2026-07-05',
  },
];

export default function BlogListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['public-blogs'],
    queryFn: async () => { 
      try {
        const res = await api.blogs.published({ limit: 20 }); 
        return res.data.data as PaginatedResult<BlogPost>; 
      } catch {
        return { items: [], total: 0, page: 1, totalPages: 1, hasNextPage: false, hasPreviousPage: false };
      }
    },
  });

  const posts = (data?.items && data.items.length > 0) ? data.items : null;

  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900 bg-slate-50 min-h-screen">
      
      {/* BCI Compliance Disclaimer Header Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-yellow-500 shrink-0" />
            <span><strong>Bar Council Compliance Notice:</strong> Articles are published for general educational information and do not constitute legal advice.</span>
          </p>
          <span className="hidden md:inline-block text-slate-400 font-mono text-[10px]">Porvorim, Goa</span>
        </div>
      </div>

      <div className="pt-10">
        <PageHeader 
          badge="Educational Resource" 
          title="Legal Insights & Updates" 
          subtitle="Notes and guidance on legal procedures, property conveyancing, and statutory laws relevant in Goa." 
        />
      </div>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse" />)}
            </div>
          ) : posts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                  <div className="h-full flex flex-col p-6 rounded-2xl border border-slate-200 hover:border-yellow-600/40 hover:shadow-lg transition-all duration-300 bg-white">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mb-3 uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5 text-yellow-600" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-xl font-bold font-serif text-slate-900 mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2">{post.title}</h2>
                    <p className="text-slate-600 text-xs line-clamp-3 mb-6 flex-grow leading-relaxed">{post.excerpt}</p>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-600 pt-4 border-t border-slate-100">
                      <span>Read Note</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {fallbackArticles.map((fa) => (
                <div key={fa.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-yellow-700 uppercase tracking-wider mb-2">{fa.cat}</div>
                    <h2 className="text-xl font-bold font-serif text-slate-900 mb-3">{fa.title}</h2>
                    <p className="text-slate-600 text-xs leading-relaxed mb-6">{fa.excerpt}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
                    General Informational Note • Adv. Anirudha Sinai Borkar
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
