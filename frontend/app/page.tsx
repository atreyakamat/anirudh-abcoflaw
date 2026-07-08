import Link from 'next/link';
import { ArrowRight, BarChart3, Calendar, CheckCircle2, MessageSquare, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { blogPosts, faqItems, practiceAreas, testimonials } from '@/lib/site-content';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const stats = [
  { value: '30m', label: 'Slot-based bookings' },
  { value: '1', label: 'Single-lawyer practice focus' },
  { value: '100%', label: 'Manual confirmation control' },
  { value: '4', label: 'Primary user groups' },
] as const;

const featureHighlights = [
  { icon: ShieldCheck, title: 'Audit-first', text: 'Every CRUD action is logged and reviewable.' },
  { icon: Calendar, title: 'Structured intake', text: 'Bookings become trackable records instead of lost messages.' },
  { icon: Users, title: 'Client timeline', text: 'Appointments, payments, and documents stay connected.' },
  { icon: BarChart3, title: 'Operational visibility', text: 'The dashboard surfaces what matters without clutter.' },
] as const;

export default function HomePage() {
  return (
    <main>
      <section className="section-shell pt-10 lg:pt-16">
        <div className="hero-grid glass-panel overflow-hidden rounded-[2rem]">
          <div className="grid gap-12 p-8 lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
            <div className="fade-up max-w-3xl space-y-6">
              <Badge>Single-lawyer practice operations</Badge>
              <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-balance text-slate-950 dark:text-white sm:text-6xl lg:text-7xl" style={{ fontFamily: 'var(--font-display)' }}>
                A premium operating system for modern legal consultations.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Replace fragmented messages, spreadsheets, and manual reminders with one secure workflow for bookings, clients, content, and audit-ready operations.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/book-consultation"><Button size="lg">Book Consultation</Button></Link>
                <Link href="/portal/login"><Button size="lg" variant="outline">Client Portal</Button></Link>
                <Link href="/about"><Button size="lg" variant="outline">Explore the practice</Button></Link>
              </div>
              <div className="grid gap-3 pt-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-3xl border border-slate-200 bg-white/80 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                    <div className="text-2xl font-semibold">{item.value}</div>
                    <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="self-start">
                <CardHeader>
                  <CardTitle>Practice areas</CardTitle>
                  <CardDescription>Clear service positioning for clients and search engines.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {practiceAreas.map((item) => (
                    <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                      <CheckCircle2 className="h-4 w-4 text-sky-600" />
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How consultation works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <p>1. Client submits inquiry through form or chatbot.</p>
                  <p>2. Receptionist reviews the request and supporting files.</p>
                  <p>3. Lawyer confirms, rejects, or reschedules the consultation.</p>
                  <p>4. Appointment history, payments, and audit logs stay linked.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {featureHighlights.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 dark:text-slate-300">{item.text}</CardContent>
            </Card>
          );
        })}
      </section>

      <section className="section-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Why choose this workflow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
            <p>Designed for a single-lawyer practice now, but structured cleanly for future multi-lawyer support.</p>
            <p>Public intake, receptionist operations, lawyer review, and audit logs all use the same record model.</p>
            <p>The chatbot never gives legal advice. It only helps with FAQs and booking guidance.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog#${post.slug}`} className="block rounded-2xl border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50/60 dark:border-slate-800 dark:hover:bg-slate-900/60">
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{post.category}</div>
                <div className="mt-1 font-semibold">{post.title}</div>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{post.excerpt}</p>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="section-shell grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Testimonials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <p className="text-sm text-slate-600 dark:text-slate-300">“{item.quote}”</p>
                <div className="mt-3 text-sm font-semibold">{item.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{item.role}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {faqItems.map((item) => (
              <details key={item.question} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                <summary className="cursor-pointer font-semibold">{item.question}</summary>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{item.answer}</p>
              </details>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="section-shell">
        <Card className="bg-slate-950 text-white dark:bg-white dark:text-slate-950">
          <CardContent className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between lg:p-10">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Ready to start</div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Book a consultation with one clear workflow.</h2>
            </div>
            <Link href="/book-consultation"><Button size="lg" variant="secondary">Start booking</Button></Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
