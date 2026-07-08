import Link from 'next/link';
import { siteNavigation } from '@/lib/site-content';
import { Separator } from '@/components/ui/separator';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/70 dark:border-slate-800 dark:bg-slate-950/70">
      <div className="section-shell py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-lg font-semibold">Law Practice CRM</div>
            <p className="mt-3 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              A premium consultation platform for a single-lawyer practice with structured booking, client management, and auditability.
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Navigate</div>
            <div className="mt-4 flex flex-col gap-3">
              {siteNavigation.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Policies</div>
            <div className="mt-4 flex flex-col gap-3">
              <Link href="/privacy-policy" className="text-sm text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">Privacy Policy</Link>
              <Link href="/terms" className="text-sm text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">Terms</Link>
              <Link href="/admin/login" className="text-sm text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">Admin Login</Link>
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Contact</div>
            <div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p>Reception hours: 9:00 AM - 6:00 PM</p>
              <p>Sunday closed</p>
              <p>Response target: within one business day</p>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <p className="text-sm text-slate-500 dark:text-slate-400">© 2026 Law Practice CRM. All rights reserved.</p>
      </div>
    </footer>
  );
}
