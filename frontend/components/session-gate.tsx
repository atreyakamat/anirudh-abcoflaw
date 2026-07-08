"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getPortalMe } from '@/lib/api';

type GateMode = 'staff' | 'portal';

type SessionGateProps = {
  mode: GateMode;
  allowedRoles: string[];
  redirectTo: string;
  children: React.ReactNode;
};

export function SessionGate({ mode, allowedRoles, redirectTo, children }: SessionGateProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loader = mode === 'portal' ? getPortalMe : getCurrentUser;

    loader()
      .then((response: any) => {
        const user = response.user ?? response.client ?? null;
        if (!user || !allowedRoles.includes(user.role)) {
          router.replace(redirectTo);
          return;
        }
        setReady(true);
      })
      .catch(() => {
        router.replace(redirectTo);
      });
  }, [allowedRoles, mode, redirectTo, router]);

  if (!ready) {
    return <div className="section-shell py-24 text-sm text-slate-500">Checking session...</div>;
  }

  return <>{children}</>;
}
