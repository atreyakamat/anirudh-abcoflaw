"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { Upload } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { submitInquiry } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const bookingSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email address'),
  preferredDate: z.string().min(1, 'Select a preferred date'),
  preferredTime: z.string().min(1, 'Select a preferred time'),
  description: z.string().min(10, 'Tell us briefly what you need help with'),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const [fileName, setFileName] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      preferredDate: '',
      preferredTime: '',
      description: '',
    },
  });

  async function onSubmit(values: BookingFormValues) {
    const payload = new FormData();
    payload.append('fullName', values.fullName);
    payload.append('phone', values.phone);
    payload.append('email', values.email);
    payload.append('preferredDate', values.preferredDate);
    payload.append('preferredTime', values.preferredTime);
    payload.append('description', values.description);
    payload.append('source', 'website');

    const fileInput = document.querySelector<HTMLInputElement>('#booking-document');
    if (fileInput?.files?.[0]) {
      payload.append('document', fileInput.files[0]);
    }

    await submitInquiry(payload);
    setSuccessMessage('Your consultation request has been submitted for review.');
    form.reset();
    if (fileInput) {
      fileInput.value = '';
      setFileName('');
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Book a Consultation</CardTitle>
        <CardDescription>Requests are reviewed manually and never auto-confirmed.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
            <Input placeholder="Full name" {...form.register('fullName')} />
            <Input placeholder="Phone number" {...form.register('phone')} />
            <Input placeholder="Email address" type="email" {...form.register('email')} />
            <Input placeholder="Preferred date" type="date" {...form.register('preferredDate')} />
            <Input placeholder="Preferred time" type="time" {...form.register('preferredTime')} />
            <div className="md:col-span-2">
              <Textarea placeholder="Describe your matter" {...form.register('description')} />
            </div>
          </div>

          <div className="md:col-span-2 flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
            <label htmlFor="booking-document" className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900">
              <Upload className="h-4 w-4" />
              Upload document
            </label>
            <input
              id="booking-document"
              type="file"
              accept=".pdf,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')}
            />
            <p className="text-sm text-slate-500 dark:text-slate-400">PDF, DOCX, JPG, PNG up to 10 MB</p>
            {fileName ? <p className="text-sm font-medium text-slate-900 dark:text-white">{fileName}</p> : null}
          </div>

          <div className="md:col-span-2 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">{successMessage || 'Submission creates an inquiry in Pending Review status.'}</p>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
