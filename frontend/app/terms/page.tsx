import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <main className="section-shell">
      <Card>
        <CardHeader><CardTitle>Terms of Use</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>The booking system captures consultation requests for manual review. No submission is auto-confirmed.</p>
          <p>The chatbot is informational and must not be used as a source of legal advice.</p>
          <p>Administrative access is protected by authenticated sessions and audit logging.</p>
        </CardContent>
      </Card>
    </main>
  );
}
