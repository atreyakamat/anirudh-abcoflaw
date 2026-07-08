import { cn } from '@/lib/utils';

export function Badge({ className, children }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <span className={cn('inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-200', className)}>
      {children}
    </span>
  );
}
