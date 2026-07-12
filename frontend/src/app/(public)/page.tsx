'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Shield, Users, Clock, ArrowRight, Star } from 'lucide-react';
import type { BlogPost, Faq, PaginatedResult } from '@/types';

const practiceAreas = [
  { title: 'Corporate Law', desc: 'Business formation, M&A, compliance, contracts.', icon: Shield },
  { title: 'Family Law', desc: 'Divorce, custody, adoption, domestic matters.', icon: Users },
  { title: 'Property Law', desc: 'Real estate transactions, disputes, titles.', icon: Scale },
  { title: 'Employment Law', desc: 'Workplace disputes, contracts, wrongful termination.', icon: Clock },
];

const testimonials = [
  { name: 'Priya Sharma', text: 'Excellent representation in our company merger. Highly professional.', rating: 5 },
  { name: 'Rahul Mehta', text: 'Guided me through a complex property dispute with great expertise.', rating: 5 },
  { name: 'Anita Desai', text: 'Compassionate and thorough in handling my family law matter.', rating: 5 },
];

export default function HomePage() {
  const { data: blogs } = useQuery({
    queryKey: ['home-blogs'],
    queryFn: async () => { const res = await api.blogs.published({ limit: 3 }); return (res.data.data as PaginatedResult<BlogPost>).items; },
  });

  const { data: faqs } = useQuery({
    queryKey: ['home-faqs'],
    queryFn: async () => { const res = await api.faqs.published({ limit: 5 }); return res.data.data as Faq[]; },
  });

  return (
    <div className="animate-in">
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Expert Legal Counsel<br />You Can Trust</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">Professional legal consultation services with over 15 years of experience in corporate, family, property, and employment law.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">Book a Consultation <ArrowRight className="w-4 h-4" /></Link>
            <Link href="/services" className="inline-flex items-center gap-2 px-6 py-3 border rounded-lg font-medium hover:bg-accent transition-colors">Our Services</Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-y">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[{ n: '15+', l: 'Years Experience' }, { n: '500+', l: 'Cases Handled' }, { n: '98%', l: 'Success Rate' }, { n: '24/7', l: 'Support Available' }].map((s) => <div key={s.l}><p className="text-3xl font-bold text-primary">{s.n}</p><p className="text-sm text-muted-foreground mt-1">{s.l}</p></div>)}
        </div>
      </section>

      {/* Practice Areas */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Practice Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {practiceAreas.map((a) => (<Card key={a.title} className="hover:shadow-lg transition-shadow"><CardHeader><a.icon className="w-10 h-10 text-primary mb-2" /><CardTitle>{a.title}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{a.desc}</p></CardContent></Card>))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (<Card key={t.name}><CardContent className="pt-6"><div className="flex gap-1 mb-3">{[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}</div><p className="text-sm text-muted-foreground mb-4">&ldquo;{t.text}&rdquo;</p><p className="font-medium">{t.name}</p></CardContent></Card>))}
          </div>
        </div>
      </section>

      {/* Recent Blogs */}
      {blogs && blogs.length > 0 && <section className="py-20"><div className="max-w-6xl mx-auto px-4"><h2 className="text-3xl font-bold text-center mb-12">Latest from Our Blog</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{blogs.map((b) => (<Link key={b.id} href={`/blog/${b.slug}`}><Card className="hover:shadow-lg transition-shadow h-full"><CardContent className="pt-6"><p className="text-xs text-muted-foreground mb-2">{b.createdAt}</p><h3 className="font-bold mb-2 line-clamp-2">{b.title}</h3><p className="text-sm text-muted-foreground line-clamp-3">{b.excerpt}</p></CardContent></Card></Link>))}</div><div className="text-center mt-8"><Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium hover:underline">View all posts <ArrowRight className="w-4 h-4" /></Link></div></div></section>}

      {/* CTA */}
      <section className="py-20"><div className="max-w-3xl mx-auto px-4 text-center"><h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2><p className="text-muted-foreground mb-8">Schedule a consultation today and let us help you with your legal needs.</p><Link href="/book" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90">Book Your Consultation <ArrowRight className="w-4 h-4" /></Link></div></section>
    </div>
  );
}