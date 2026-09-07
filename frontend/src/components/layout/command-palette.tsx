'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command } from 'cmdk';
import { api } from '@/lib/api/client';
import {
  Calendar,
  Users,
  FileText,
  CreditCard,
  BookOpen,
  Settings,
  Shield,
  Zap,
  Plus,
  Search,
  BarChart2,
  Loader2,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSearchResults(null);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await api.search.global(query.trim());
        setSearchResults(res.data?.data || res.data);
      } catch (err) {
        console.error('Command palette search error:', err);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!open) return null;

  const navigate = (path: string) => {
    onOpenChange(false);
    setQuery('');
    setSearchResults(null);
    router.push(path);
  };

  const hasSearchResults =
    searchResults &&
    ((searchResults.clients && searchResults.clients.length > 0) ||
      (searchResults.appointments && searchResults.appointments.length > 0) ||
      (searchResults.blogs && searchResults.blogs.length > 0) ||
      (searchResults.documents && searchResults.documents.length > 0));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-[15vh] p-4 transition-opacity animate-in fade-in"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-xl bg-card border rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <Command className="w-full">
          <div className="flex items-center border-b px-4 py-3 gap-3">
            {searching ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
            ) : (
              <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            )}
            <Command.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search clients, appointments, blogs, documents (Ctrl + K)..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              autoFocus
            />
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 border rounded bg-muted text-muted-foreground">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-[340px] overflow-y-auto p-2 space-y-1">
            <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
              No results found for &quot;{query}&quot;.
            </Command.Empty>

            {/* Dynamic Search Results */}
            {hasSearchResults && (
              <Command.Group heading="Database Search Results" className="px-2 py-1.5 text-xs font-semibold text-primary">
                {searchResults.clients?.map((client: any) => (
                  <Command.Item
                    key={`client-${client.id}`}
                    onSelect={() => navigate(`/clients/${client.id}`)}
                    className="flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <p className="font-medium">{client.firstName} {client.lastName}</p>
                        <p className="text-xs text-muted-foreground">{client.email} • {client.phone}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-semibold">Client</span>
                  </Command.Item>
                ))}

                {searchResults.appointments?.map((apt: any) => (
                  <Command.Item
                    key={`apt-${apt.id}`}
                    onSelect={() => navigate(`/appointments/${apt.id}`)}
                    className="flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <p className="font-medium truncate max-w-sm">{apt.description}</p>
                        <p className="text-xs text-muted-foreground">Ref: {apt.referenceNumber} • {apt.client?.firstName} {apt.client?.lastName}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 font-semibold">Booking</span>
                  </Command.Item>
                ))}

                {searchResults.blogs?.map((blog: any) => (
                  <Command.Item
                    key={`blog-${blog.id}`}
                    onSelect={() => navigate(`/blog/${blog.slug}`)}
                    className="flex items-center justify-between px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-pink-500 shrink-0" />
                      <div>
                        <p className="font-medium truncate max-w-sm">{blog.title}</p>
                        <p className="text-xs text-muted-foreground">Status: {blog.status}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-600 font-semibold">Article</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Navigation Options */}
            <Command.Group heading="Navigation" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
              <Command.Item
                onSelect={() => navigate('/dashboard')}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
              >
                <BarChart2 className="w-4 h-4 text-primary" />
                <span>Dashboard Overview</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/calendar')}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
              >
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Legal Calendar</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/appointments')}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
              >
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Appointments List</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/clients')}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
              >
                <Users className="w-4 h-4 text-emerald-500" />
                <span>Clients Directory</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/documents')}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
              >
                <FileText className="w-4 h-4 text-amber-500" />
                <span>Legal Documents</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/payments')}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
              >
                <CreditCard className="w-4 h-4 text-violet-500" />
                <span>Payments & Invoices</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/blogs')}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
              >
                <BookOpen className="w-4 h-4 text-pink-500" />
                <span>Blog CMS Articles</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/automations')}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
              >
                <Zap className="w-4 h-4 text-indigo-500" />
                <span>Automation Outbox</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/audit-logs')}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
              >
                <Shield className="w-4 h-4 text-cyan-500" />
                <span>Security Audit Logs</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/settings')}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
              >
                <Settings className="w-4 h-4 text-zinc-500" />
                <span>Firm Settings</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Quick Actions" className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
              <Command.Item
                onSelect={() => navigate('/book')}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
              >
                <Plus className="w-4 h-4 text-primary" />
                <span>New Consultation Booking</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/blogs/new')}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
              >
                <Plus className="w-4 h-4 text-primary" />
                <span>Create New Blog Article</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigate('/payments/new')}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-accent aria-selected:bg-accent"
              >
                <Plus className="w-4 h-4 text-primary" />
                <span>Record New Payment</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
