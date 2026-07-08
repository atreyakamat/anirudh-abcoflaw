import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="section-shell flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="text-sm uppercase tracking-[0.3em] text-slate-500">404</div>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-md text-sm text-slate-600 dark:text-slate-300">The requested page does not exist. Return to the public site or start a consultation request.</p>
      <div className="mt-6 flex gap-3">
        <Link href="/"><Button>Back home</Button></Link>
        <Link href="/book-consultation"><Button variant="outline">Book consultation</Button></Link>
      </div>
    </main>
  );
}
