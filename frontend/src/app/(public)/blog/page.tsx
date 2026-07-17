'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import type { BlogPost, PaginatedResult } from '@/types';

import { PageHeader } from '@/components/page-header';

export default function BlogListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['public-blogs'],
    queryFn: async () => { const res = await api.blogs.published({ limit: 20 }); return res.data.data as PaginatedResult<BlogPost>; },
  });

  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900">
      <PageHeader 
        badge="Firm Insights" 
        title="Legal Blog" 
        subtitle="Insights, case studies, and practical legal advice from Advocate Anirudha Sinai Borkar and the team at AB & Co. Legal." 
      />

      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data?.items?.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                  <div className="h-full flex flex-col p-8 rounded-2xl border border-slate-200 hover:border-yellow-600/30 hover:shadow-xl transition-all duration-300 bg-white shadow-sm">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                      <Calendar className="w-4 h-4 text-yellow-600" />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-2xl font-bold font-serif text-slate-900 mb-3 group-hover:text-yellow-600 transition-colors line-clamp-2">{post.title}</h2>
                    <p className="text-slate-600 line-clamp-3 mb-6 flex-grow">{post.excerpt}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags?.map((t) => (
                        <span key={t.tag?.id} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                          {t.tag?.name}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-yellow-600 pt-4 border-t border-slate-100">
                      Read Article <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {data?.items?.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-lg">No insights published yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}