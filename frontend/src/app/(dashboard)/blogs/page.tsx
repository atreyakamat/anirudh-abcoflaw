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
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"><Plus className="w-4 h-4" /> New Post</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? [...Array(6)].map((_, i) => <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />) :
        data?.items?.map((post) => (
          <Link key={post.id} href={`/blogs/${post.id}`} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : post.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>{post.status}</span>{post.category && <span className="text-xs text-muted-foreground">{post.category.name}</span>}</div>
            <h3 className="font-medium line-clamp-2">{post.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{post.excerpt}</p>
            <p className="text-xs text-muted-foreground mt-3">{post.author?.firstName} {post.author?.lastName} · {post.publishedAt ? formatDate(post.publishedAt) : 'Not published'}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}