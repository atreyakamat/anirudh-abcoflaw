"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { login } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const schema = z.object({
  username: z.string().min(2),
  password: z.string().min(4),
});

type LoginValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const form = useForm<LoginValues>({ resolver: zodResolver(schema) });

  async function handleSubmit(values: LoginValues) {
    try {
      await login(values.username, values.password);
      router.push('/admin');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Login failed');
    }
  }

  return (
    <main className="section-shell flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Use the static MVP credentials to enter the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <Input placeholder="Username" {...form.register('username')} />
            <Input placeholder="Password" type="password" {...form.register('password')} />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full">Login</Button>
            <p className="text-xs text-slate-500">Username: admin or receptionist. Password: admin123.</p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
