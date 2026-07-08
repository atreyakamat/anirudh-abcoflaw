import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <main className="section-shell">
      <Card>
        <CardHeader><CardTitle>Privacy Policy</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
          <p>We collect only the information required to review consultations, manage client relationships, and maintain operational records.</p>
          <p>Documents submitted through the booking workflow are used for consultation review and are protected by the platform's access controls.</p>
          <p>Automation integrations are intentionally deferred until the workflow layer is ready.</p>
        </CardContent>
      </Card>
    </main>
  );
}
