'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Tag, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => { const res = await api.blogs.getBySlug(slug); return res.data.data; },
    enabled: !!slug,
  });

  if (isLoading) return <div className="max-w-3xl mx-auto px-4 py-20"><div className="h-12 bg-slate-200 rounded w-3/4 mb-4 animate-pulse" /><div className="h-6 bg-slate-200 rounded w-1/4 mb-8 animate-pulse" /><div className="space-y-3">{[...Array(10)].map((_, i) => <div key={i} className="h-4 bg-slate-200 rounded animate-pulse" />)}</div></div>;
  if (!post) return <div className="max-w-3xl mx-auto px-4 py-20 text-center"><p className="text-slate-500">Article not found.</p><Link href="/blog" className="text-xs font-bold text-yellow-600 hover:underline mt-4 inline-block">&larr; Return to Legal Insights</Link></div>;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.excerpt,
    'author': {
      '@type': 'Person',
      'name': 'Adv. Anirudha Sinai Borkar',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'AB & Co. Legal',
    },
    'datePublished': post.createdAt,
    'mainEntityOfPage': `https://abco.legal/blog/${post.slug}`,
  };

  return (
    <div className="animate-in font-sans selection:bg-yellow-600/30 selection:text-slate-900 bg-white min-h-screen pb-24">
      
      {/* Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Header */}
      <section className="bg-slate-50 border-b border-slate-200 py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-yellow-600 transition-colors mb-6 group uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Legal Insights
          </Link>
          
          <div className="flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
            <Calendar className="w-3.5 h-3.5 text-yellow-600" />
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>Educational Article</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-slate-900 leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-600 font-medium">
            <span>Authored / Educational Resource • Adv. Anirudha Sinai Borkar</span>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t: any) => (
                  <span key={t.tag?.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-slate-200 text-slate-600 text-[11px] font-semibold rounded-md">
                    <Tag className="w-3 h-3 text-yellow-600" />
                    {t.tag?.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 space-y-12">
          <article className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-a:text-yellow-600 hover:prose-a:text-yellow-700 prose-p:leading-relaxed prose-p:text-slate-700 text-sm" 
            dangerouslySetInnerHTML={{ __html: post.content }} 
          />

          {/* Legal Disclaimer Footer */}
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-slate-600 text-xs leading-relaxed space-y-2">
            <p className="font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-yellow-600" />
              <span>Legal Article Disclaimer</span>
            </p>
            <p>
              This article is published strictly for general educational and informational purposes. It does not constitute legal advice, legal representation, or a legal opinion. Reading this note does not establish an advocate-client relationship. Readers should seek formal legal advice appropriate to their specific factual circumstances.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}