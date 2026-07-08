import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { practiceAreas } from '@/lib/site-content';

export default function ServicesPage() {
  return (
    <main className="section-shell grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {practiceAreas.map((service) => (
        <Card key={service}>
          <CardHeader><CardTitle>{service}</CardTitle></CardHeader>
          <CardContent className="text-sm text-slate-600 dark:text-slate-300">Structured consultation support, document review, and clear operational tracking for this service area.</CardContent>
        </Card>
      ))}
    </main>
  );
}
