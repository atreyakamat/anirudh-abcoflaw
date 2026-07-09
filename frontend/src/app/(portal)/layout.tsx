'use client';

import { AuthProvider, useAuth } from '@/lib/auth/auth-context';
import Link from 'next/link';
import { Scale, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

function PortalShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 border-b flex items-center px-4 md:px-6">
        <Link href="/portal" className="flex items-center gap-2 font-bold text-lg"><Scale className="w-6 h-6" /><span>Client Portal</span></Link>
        <nav className="ml-8 hidden md:flex gap-1">
          <Link href="/portal" className={cn('px-3 py-2 text-sm rounded-lg', pathname === '/portal' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent')}>Dashboard</Link>
          <Link href="/portal/appointments" className={cn('px-3 py-2 text-sm rounded-lg', pathname === '/portal/appointments' ? 'bg-primary text-primary-foreground' : 'hover:bg-accent')}>My Appointments</Link>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{user?.firstName}</span>
          <button onClick={() => logout()} className="p-2 hover:bg-accent rounded-lg"><LogOut className="w-4 h-4" /></button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto p-4 md:p-8">{children}</main>
    </div>
  );
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider><PortalShell>{children}</PortalShell></AuthProvider>;
}