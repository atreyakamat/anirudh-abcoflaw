import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <main className="section-shell">
      <Card className="mx-auto max-w-2xl">
        <CardHeader><CardTitle>Contact the practice</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Your name" />
            <Input placeholder="Phone" />
          </div>
          <Input placeholder="Email" />
          <Textarea placeholder="How can we help?" />
          <Button type="button">Send message</Button>
        </CardContent>
      </Card>
    </main>
  );
}
