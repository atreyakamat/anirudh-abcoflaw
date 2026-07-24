'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Setting } from '@/types';
import { Clock, Calendar, ShieldCheck, Mail, Share2, Bell, Save, CheckCircle2, Sliders, Globe } from 'lucide-react';

const CATEGORY_METADATA: Record<string, { label: string; icon: any; description: string }> = {
  office_hours: {
    label: 'Office Hours',
    icon: Clock,
    description: 'Configure standard consultation working hours and weekly off days.',
  },
  appointment: {
    label: 'Appointments',
    icon: Calendar,
    description: 'Set default consultation slot intervals and appointment durations.',
  },
  branding: {
    label: 'Firm Branding',
    icon: ShieldCheck,
    description: 'Public identity, lawyer titles, and practice naming.',
  },
  contact: {
    label: 'Contact Info',
    icon: Mail,
    description: 'Official communication addresses, phone numbers, and physical location.',
  },
  social: {
    label: 'Social Links',
    icon: Share2,
    description: 'Connect social media handles for public footer and consultation emails.',
  },
  notifications: {
    label: 'Notifications',
    icon: Bell,
    description: 'System reminder triggers, notification timing, and automated alerts.',
  },
};

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [activeCategory, setActiveCategory] = useState<string>('office_hours');
  const [edits, setEdits] = useState<Record<string, any>>({});

  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await api.settings.list();
      return res.data.data as Setting[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: any }) => api.settings.update(key, value),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success(`Setting '${variables.key.replace(/_/g, ' ')}' updated successfully!`);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update setting');
    },
  });

  const grouped = settings?.reduce<Record<string, Setting[]>>((acc, s) => {
    const cat = s.category || 'general';
    (acc[cat] = acc[cat] || []).push(s);
    return acc;
  }, {}) || {};

  const categories = Object.keys(grouped);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="h-8 w-48 bg-slate-200/50 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-64 bg-white/40 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl animate-pulse" />
          <div className="md:col-span-3 h-96 bg-white/40 backdrop-blur-md border border-white/40 shadow-sm rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  const currentCategoryKey = categories.includes(activeCategory) ? activeCategory : categories[0] || 'office_hours';
  const currentItems = grouped[currentCategoryKey] || [];
  const meta = CATEGORY_METADATA[currentCategoryKey] || { label: currentCategoryKey.replace(/_/g, ' '), icon: Sliders, description: 'Manage configuration options.' };
  const CategoryIcon = meta.icon;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 mt-1">Configure practice parameters, office hours, and automated features.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Category Selector Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-3 space-y-1">
            {categories.map((catKey) => {
              const catMeta = CATEGORY_METADATA[catKey] || { label: catKey.replace(/_/g, ' '), icon: Sliders };
              const Icon = catMeta.icon;
              const isActive = currentCategoryKey === catKey;

              return (
                <button
                  key={catKey}
                  onClick={() => setActiveCategory(catKey)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 translate-x-1'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="capitalize">{catMeta.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3">
          <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 md:p-8 space-y-6">
            
            {/* Header section for category */}
            <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
              <div className="p-3 bg-slate-900/5 text-slate-900 rounded-2xl border border-slate-900/10">
                <CategoryIcon className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-serif text-slate-900 capitalize">{meta.label}</h2>
                <p className="text-sm text-slate-500">{meta.description}</p>
              </div>
            </div>

            {/* List of Settings */}
            <div className="space-y-6">
              {currentItems.map((setting) => {
                const rawVal = setting.value;
                const editedVal = edits[setting.key];
                const currentVal = editedVal !== undefined ? editedVal : rawVal;
                const isDirty = editedVal !== undefined && editedVal !== rawVal;
                const isBoolean = typeof rawVal === 'boolean' || rawVal === 'true' || rawVal === 'false';
                const isNumber = typeof rawVal === 'number' || (!isNaN(Number(rawVal)) && rawVal !== '');

                return (
                  <div 
                    key={setting.key}
                    className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-slate-200 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm capitalize">
                          {setting.key.replace(/_/g, ' ')}
                        </span>
                        {setting.isPublic && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200/50">
                            <Globe className="w-2.5 h-2.5" /> Public
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono">key: {setting.key}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {isBoolean ? (
                        <button
                          type="button"
                          onClick={() => {
                            const boolVal = typeof currentVal === 'boolean' ? !currentVal : currentVal === 'true' ? false : true;
                            setEdits((prev) => ({ ...prev, [setting.key]: boolVal }));
                          }}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                            (typeof currentVal === 'boolean' ? currentVal : currentVal === 'true')
                              ? 'bg-slate-900'
                              : 'bg-slate-200'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              (typeof currentVal === 'boolean' ? currentVal : currentVal === 'true')
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            }`}
                          />
                        </button>
                      ) : (
                        <input
                          type={isNumber ? 'number' : 'text'}
                          value={currentVal}
                          onChange={(e) => {
                            const val = isNumber ? Number(e.target.value) : e.target.value;
                            setEdits((prev) => ({ ...prev, [setting.key]: val }));
                          }}
                          className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 min-w-[200px]"
                        />
                      )}

                      {isDirty && (
                        <button
                          onClick={() => {
                            updateMutation.mutate({ key: setting.key, value: currentVal });
                            setEdits((prev) => {
                              const next = { ...prev };
                              delete next[setting.key];
                              return next;
                            });
                          }}
                          disabled={updateMutation.isPending}
                          className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                        >
                          {updateMutation.isPending ? <CheckCircle2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}