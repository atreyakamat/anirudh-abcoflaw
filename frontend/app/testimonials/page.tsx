import { testimonials } from '@/lib/site-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestimonialsPage() {
  return (
    <main className="section-shell grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {testimonials.map((item) => (
        <Card key={item.name}>
          <CardHeader><CardTitle>{item.name}</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-300">“{item.quote}”</p>
            <div className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">{item.role}</div>
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
