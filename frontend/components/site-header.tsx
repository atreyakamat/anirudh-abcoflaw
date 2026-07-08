import Link from 'next/link';
import { siteNavigation } from '@/lib/site-content';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white dark:bg-white dark:text-slate-950">LP</div>
          <div>
            <div className="text-sm font-semibold tracking-tight">Law Practice CRM</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Consultation automation platform</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {siteNavigation.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/book-consultation">
            <Button size="sm">Book Consultation</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
