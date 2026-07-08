import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type WorkspaceProps = {
  title: string;
  subtitle: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  cards: Array<{ title: string; value: string; description: string }>;
  notes: string[];
};

export function RoleWorkspace({ title, subtitle, primaryHref, primaryLabel, secondaryHref, secondaryLabel, cards, notes }: WorkspaceProps) {
  return (
    <main className="section-shell space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Link href={primaryHref}><Button>{primaryLabel}</Button></Link>
          <Link href={secondaryHref}><Button variant="outline">{secondaryLabel}</Button></Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader><CardTitle className="text-sm text-slate-500">{card.title}</CardTitle></CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{card.value}</div>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Today&apos;s priorities</CardTitle></CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
          {notes.map((note) => <p key={note}>{note}</p>)}
        </CardContent>
      </Card>
    </main>
  );
}
