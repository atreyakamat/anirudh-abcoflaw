"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { clientPortalLogin } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const schema = z.object({
  phone: z.string().min(7),
  email: z.string().email().optional().or(z.literal('')),
});

type LoginValues = z.infer<typeof schema>;

export default function PortalLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const form = useForm<LoginValues>({ resolver: zodResolver(schema) });

  async function handleSubmit(values: LoginValues) {
    try {
      await clientPortalLogin(values.phone, values.email || undefined);
      router.push('/portal');
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : 'Portal login failed');
    }
  }

  return (
    <main className="section-shell flex min-h-[70vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Client Portal</CardTitle>
          <CardDescription>Use your registered phone and email to access your case timeline.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <Input placeholder="Phone" {...form.register('phone')} />
            <Input placeholder="Email" type="email" {...form.register('email')} />
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" className="w-full">Enter portal</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
