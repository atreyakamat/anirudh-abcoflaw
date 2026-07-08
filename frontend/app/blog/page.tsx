import Link from 'next/link';
import { blogPosts } from '@/lib/site-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BlogPage() {
  return (
    <main className="section-shell grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {blogPosts.map((post) => (
        <Card key={post.slug} id={post.slug}>
          <CardHeader>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{post.category}</div>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-300">{post.excerpt}</p>
            <Link href="/book-consultation" className="mt-4 inline-block text-sm font-medium text-sky-600">Book a consultation</Link>
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
