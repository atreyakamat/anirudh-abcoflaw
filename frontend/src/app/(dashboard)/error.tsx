'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard Error Boundary caught exception:', error);
  }, [error]);

  return (
    <div className="p-8 text-center bg-card border rounded-2xl max-w-lg mx-auto my-12 shadow-xs space-y-4">
      <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h2 className="text-xl font-bold tracking-tight">Could Not Load Dashboard View</h2>
      <p className="text-sm text-muted-foreground">
        We could not load the requested dashboard module. Please refresh or try again.
      </p>

      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 text-sm inline-flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" /> Refresh Module
      </button>
    </div>
  );
}
