"use client";

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { fetchJSON } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from '@/components/ui/table';

export type ResourceField =
  | { name: string; label: string; type: 'text' | 'email' | 'url' | 'number' | 'date' | 'datetime-local'; placeholder?: string }
  | { name: string; label: string; type: 'textarea'; placeholder?: string }
  | { name: string; label: string; type: 'select'; options: Array<{ label: string; value: string }> }
  | { name: string; label: string; type: 'checkbox' };

export type ResourceColumn = { key: string; label: string; render?: (value: unknown, row: Record<string, unknown>) => React.ReactNode };

type ResourcePageProps = {
  resource: string;
  title: string;
  description: string;
  columns: ResourceColumn[];
  fields: ResourceField[];
  emptyState?: string;
};

function readValue(field: ResourceField, formState: Record<string, string | boolean>) {
  return formState[field.name] ?? (field.type === 'checkbox' ? false : '');
}

export function ResourcePage({ resource, title, description, columns, fields, emptyState }: ResourcePageProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [search, setSearch] = useState('');
  const [formState, setFormState] = useState<Record<string, string | boolean>>({});

  const queryKey = [resource, search];
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => fetchJSON<{ items: Record<string, unknown>[] }>(`/${resource}?search=${encodeURIComponent(search)}`),
  });

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => fetchJSON(`/${resource}`, { method: 'POST', body: JSON.stringify(payload) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [resource] });
      setOpen(false);
      setEditing(null);
      setFormState({});
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) => fetchJSON(`/${resource}/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [resource] });
      setOpen(false);
      setEditing(null);
      setFormState({});
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => fetchJSON(`/${resource}/${id}`, { method: 'DELETE' }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [resource] });
    },
  });

  const rows = useMemo(() => data?.items ?? [], [data]);

  function openCreate() {
    setEditing(null);
    setFormState({});
    setOpen(true);
  }

  function openEdit(row: Record<string, unknown>) {
    setEditing(row);
    setFormState(
      fields.reduce<Record<string, string | boolean>>((accumulator, field) => {
        const value = row[field.name];
        accumulator[field.name] = typeof value === 'boolean' ? value : String(value ?? '');
        return accumulator;
      }, {}),
    );
    setOpen(true);
  }

  function handleFieldChange(name: string, value: string | boolean) {
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function submit() {
    const payload = fields.reduce<Record<string, unknown>>((accumulator, field) => {
      const value = readValue(field, formState);
      accumulator[field.name] = field.type === 'checkbox' ? Boolean(value) : value;
      return accumulator;
    }, {});

    if (editing?.id && typeof editing.id === 'string') {
      updateMutation.mutate({ id: editing.id, payload });
      return;
    }

    createMutation.mutate(payload);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Input placeholder={`Search ${resource}`} value={search} onChange={(event) => setSearch(event.target.value)} className="max-w-sm" />
            <Button type="button" variant="outline" onClick={openCreate}>New {title.slice(0, -1)}</Button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800">
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map((column) => <TableHeadCell key={column.key}>{column.label}</TableHeadCell>)}
                  <TableHeadCell>Actions</TableHeadCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1}>Loading...</TableCell>
                  </TableRow>
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1}>{emptyState ?? `No ${resource} yet.`}</TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={String(row.id)}>
                      {columns.map((column) => (
                        <TableCell key={column.key}>
                          {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '-')}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => openEdit(row)}>Edit</Button>
                          <Button type="button" variant="ghost" size="sm" onClick={() => deleteMutation.mutate(String(row.id))}>Delete</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {open ? (
        <div className="fixed inset-0 z-50 bg-slate-950/30 backdrop-blur-sm">
          <div className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto border-l border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <div className="mb-6">
              <div className="text-lg font-semibold">{editing ? `Edit ${title.slice(0, -1)}` : `New ${title.slice(0, -1)}`}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400">Record will be saved through the REST API and audited on the backend.</div>
            </div>

            <div className="space-y-4">
              {fields.map((field) => (
                <label key={field.name} className="block space-y-2 text-sm font-medium">
                  <span>{field.label}</span>
                  {field.type === 'textarea' ? (
                    <Textarea value={String(formState[field.name] ?? '')} onChange={(event) => handleFieldChange(field.name, event.target.value)} placeholder={field.placeholder} />
                  ) : field.type === 'select' ? (
                    <select className="h-11 w-full rounded-2xl border border-slate-300 bg-white px-4 text-sm dark:border-slate-700 dark:bg-slate-950" value={String(formState[field.name] ?? '')} onChange={(event) => handleFieldChange(field.name, event.target.value)}>
                      <option value="">Select...</option>
                      {field.options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                    </select>
                  ) : field.type === 'checkbox' ? (
                    <input type="checkbox" checked={Boolean(formState[field.name] ?? false)} onChange={(event) => handleFieldChange(field.name, event.target.checked)} className="h-5 w-5 rounded border-slate-300" />
                  ) : (
                    <Input type={field.type} value={String(formState[field.name] ?? '')} onChange={(event) => handleFieldChange(field.name, event.target.value)} placeholder={field.placeholder} />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3">
              <Button type="button" onClick={submit}>{editing ? 'Update' : 'Create'}</Button>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
