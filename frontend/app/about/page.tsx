import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <main className="section-shell space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About the practice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>This platform is designed for a single-lawyer practice that wants modern operations without losing human control.</p>
          <p>The product combines public trust-building, consultation intake, receptionist workflows, lawyer review, and auditability.</p>
          <p>The architecture is intentionally modular so future expansion to multiple lawyers or additional service lines does not require a rewrite.</p>
        </CardContent>
      </Card>
    </main>
  );
}
