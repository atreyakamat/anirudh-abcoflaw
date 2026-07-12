'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Setting } from '@/types';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [edits, setEdits] = useState<Record<string, any>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => { const res = await api.settings.list(); return res.data.data as Setting[]; },
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) => api.settings.update(key, value),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['settings'] }); toast.success('Setting updated'); },
  });

  const grouped = settings?.reduce<Record<string, Setting[]>>((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {}) || {};

  if (isLoading) return <div className="animate-pulse space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-muted rounded-xl" />)}</div>;

  return (
    <div className="space-y-6 animate-in">
      <h1 className="text-2xl font-bold">Settings</h1>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="border rounded-xl p-4">
          <h2 className="text-lg font-medium mb-3 capitalize">{category.replace(/_/g, ' ')}</h2>
          <div className="space-y-3">
            {items.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-4">
                <label className="text-sm font-medium min-w-[200px]">{s.key.replace(/_/g, ' ')}</label>
                <input
                  type={typeof s.value === 'boolean' ? 'checkbox' : typeof s.value === 'number' ? 'number' : 'text'}
                  className="flex-1 max-w-md px-3 py-2 text-sm border rounded-lg bg-background"
                  value={edits[s.key] ?? s.value}
                  checked={typeof s.value === 'boolean' ? (edits[s.key] ?? s.value) : undefined}
                  onChange={(e) => {
                    const val = typeof s.value === 'boolean' ? e.target.checked : typeof s.value === 'number' ? Number(e.target.value) : e.target.value;
                    setEdits((prev) => ({ ...prev, [s.key]: val }));
                  }}
                />
                {edits[s.key] !== undefined && edits[s.key] !== s.value && (
                  <button onClick={() => { updateMutation.mutate({ key: s.key, value: edits[s.key] }); setEdits((prev) => { const n = { ...prev }; delete n[s.key]; return n; }); }} className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90">Save</button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}