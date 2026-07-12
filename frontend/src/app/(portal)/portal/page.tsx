'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { CalendarDays, User } from 'lucide-react';

export default function PortalHome() {
  const { user } = useAuth();
  return (
    <div className="space-y-6 animate-in">
      <h1 className="text-2xl font-bold">Welcome, {user?.firstName}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/portal/appointments"><Card className="hover:shadow-md transition-shadow cursor-pointer"><CardHeader className="flex flex-row items-center gap-3"><CalendarDays className="w-5 h-5" /><CardTitle>My Appointments</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">View and manage your consultation appointments.</p></CardContent></Card></Link>
        <Card><CardHeader className="flex flex-row items-center gap-3"><User className="w-5 h-5" /><CardTitle>My Profile</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">View your account information.</p><p className="text-sm mt-2">{user?.email}</p></CardContent></Card>
      </div>
    </div>
  );
}