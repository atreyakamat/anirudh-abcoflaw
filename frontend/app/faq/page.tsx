import { faqItems } from '@/lib/site-content';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function FAQPage() {
  return (
    <main className="section-shell space-y-4">
      {faqItems.map((item) => (
        <Card key={item.question}>
          <CardHeader><CardTitle>{item.question}</CardTitle></CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-300">{item.answer}</CardContent>
        </Card>
      ))}
    </main>
  );
}
