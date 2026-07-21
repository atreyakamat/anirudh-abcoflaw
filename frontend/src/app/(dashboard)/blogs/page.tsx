'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import type { BlogPost, PaginatedResult } from '@/types';

export default function BlogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => { const res = await api.blogs.list({ limit: 50 }); return res.data.data as PaginatedResult<BlogPost>; },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-serif text-slate-900 tracking-tight">Blog CMS</h1>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5">
            <Plus className="w-4 h-4" /> New Post
          </button>
        </div>
        <p className="text-slate-500">Manage your firm's publications, articles, and legal insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-56 bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl animate-pulse" />
          ))
        ) : (
          data?.items?.map((post) => (
            <Link key={post.id} href={`/blogs/${post.id}`} className="block group">
              <div className="h-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] group-hover:-translate-y-1 transition-all duration-300 rounded-3xl p-6 relative overflow-hidden flex flex-col">
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-colors duration-500 group-hover:bg-slate-200/50" />
                
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                    post.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-800' : 
                    post.status === 'DRAFT' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {post.status}
                  </span>
                  {post.category && (
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{post.category.name}</span>
                  )}
                </div>
                
                <h3 className="font-serif text-xl font-bold text-slate-900 line-clamp-2 mb-2 relative z-10 group-hover:text-slate-700 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-sm text-slate-500 line-clamp-3 mb-6 relative z-10 flex-grow">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 relative z-10">
                  <p className="text-xs font-medium text-slate-600">
                    {post.author?.firstName} {post.author?.lastName}
                  </p>
                  <p className="text-xs text-slate-400">
                    {post.publishedAt ? formatDate(post.publishedAt) : 'Unpublished'}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}