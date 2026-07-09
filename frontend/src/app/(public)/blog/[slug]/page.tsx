'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useParams } from 'next/navigation';
import { Calendar, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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
    <div className="animate-in max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4"><Calendar className="w-4 h-4" /><span>{post.createdAt}</span></div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex gap-2 mb-8">{post.tags?.map((t: any) => <span key={t.id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted text-xs rounded"><Tag className="w-3 h-3" />{t.name}</span>)}</div>
      <div className="prose prose-neutral dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}