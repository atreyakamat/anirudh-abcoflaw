'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import type { BlogPost, PaginatedResult } from '@/types';

export default function BlogListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['public-blogs'],
    queryFn: async () => { const res = await api.blogs.published({ limit: 20 }); return res.data.data as PaginatedResult<BlogPost>; },
  });

  return (
    <div className="animate-in">
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-background text-center">
        <div className="max-w-3xl mx-auto px-4"><h1 className="text-4xl font-bold mb-4">Blog</h1><p className="text-lg text-muted-foreground">Legal insights, updates, and practical advice from our practice.</p></div>
      </section>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          {isLoading ? <div className="space-y-6">{[...Array(3)].map((_, i) => <div key={i} className="h-40 bg-muted rounded-xl animate-pulse" />)}</div> :
          <div className="space-y-6">
            {data?.items?.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="hover:shadow-md transition-shadow"><CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2"><Calendar className="w-4 h-4" /><span>{post.createdAt}</span></div>
                  <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                  <p className="text-muted-foreground line-clamp-2">{post.excerpt}</p>
                  <div className="flex gap-2 mt-3">{post.tags?.map((t) => <span key={t.id} className="px-2 py-0.5 bg-muted text-xs rounded">{t.name}</span>)}</div>
                </CardContent></Card>
              </Link>
            ))}
          </div>}
          {data?.items?.length === 0 && <p className="text-center text-muted-foreground py-12">No blog posts available yet.</p>}
        </div>
      </section>
    </div>
  );
}