'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Tag, ArrowLeft } from 'lucide-react';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => { const res = await api.blogs.getBySlug(slug); return res.data.data; },
    enabled: !!slug,
  });

  if (isLoading) return <div className="max-w-3xl mx-auto px-4 py-20"><div className="h-12 bg-muted rounded w-3/4 mb-4 animate-pulse" /><div className="h-6 bg-muted rounded w-1/4 mb-8 animate-pulse" /><div className="space-y-3">{[...Array(10)].map((_, i) => <div key={i} className="h-4 bg-muted rounded animate-pulse" />)}</div></div>;
  if (!post) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><p className="text-muted-foreground">Post not found.</p></div>;

  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900 bg-white min-h-screen pb-24">
      {/* Blog Post Header */}
      <section className="bg-slate-50 border-b border-slate-200 py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-yellow-600 transition-colors mb-8 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Insights
          </Link>
          
          <div className="flex items-center gap-3 text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
            <Calendar className="w-4 h-4 text-yellow-600" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-slate-900 leading-tight mb-8">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap gap-2">
            {post.tags?.map((t: any) => (
              <span key={t.tag?.id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg shadow-sm">
                <Tag className="w-3 h-3 text-yellow-600" />
                {t.tag?.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Post Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <article className="prose prose-lg prose-slate max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-a:text-yellow-600 hover:prose-a:text-yellow-700 prose-p:leading-relaxed prose-p:text-slate-700 prose-li:text-slate-700" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />
        </div>
      </section>
    </div>
  );
}