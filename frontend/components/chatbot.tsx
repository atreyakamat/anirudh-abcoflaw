"use client";

import { Bot, MessageCircle, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { submitInquiry } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const cannedReplies: Array<{ trigger: string; reply: string }> = [
  { trigger: 'price', reply: 'Consultations are booked through the intake form so the team can review your matter before confirmation.' },
  { trigger: 'book', reply: 'I can help collect your details and forward them to the booking workflow.' },
  { trigger: 'docs', reply: 'You can upload PDF, DOCX, JPG, or PNG documents up to 10 MB during booking.' },
  { trigger: 'hours', reply: 'Office hours are 9:00 AM to 6:00 PM, Sunday closed.' },
];

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', text: 'Hello. I can answer booking questions and collect a consultation request.' }]);

  const replyHint = useMemo(() => messages[messages.length - 1]?.text ?? '', [messages]);

  function handleQuestion(question: string) {
    const normalized = question.toLowerCase();
    const matched = cannedReplies.find((entry) => normalized.includes(entry.trigger));
    setMessages((current) => [...current, { role: 'user', text: question }, { role: 'assistant', text: matched?.reply ?? 'I can help with booking information or collect your consultation request.' }]);
  }

  async function submitChatInquiry() {
    const formData = new FormData();
    formData.append('fullName', name);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('preferredDate', new Date().toISOString().slice(0, 10));
    formData.append('preferredTime', '09:00');
    formData.append('description', description);
    formData.append('source', 'chatbot');
    await submitInquiry(formData);
    setMessages((current) => [...current, { role: 'assistant', text: 'Your inquiry has been sent for manual review.' }]);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 text-white shadow-2xl shadow-sky-500/30 transition hover:scale-105"
        aria-label="Open booking assistant"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {open ? (
        <section className="fixed bottom-24 right-6 z-50 w-[min(92vw,24rem)] rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-800 dark:bg-slate-950">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950"><Bot className="h-5 w-5" /></div>
            <div>
              <div className="text-sm font-semibold">Consultation Assistant</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">FAQ help, booking guidance, no legal advice</div>
            </div>
          </div>

          <div className="max-h-48 space-y-3 overflow-auto rounded-2xl bg-slate-50 p-3 text-sm dark:bg-slate-900">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={message.role === 'assistant' ? 'text-slate-700 dark:text-slate-200' : 'ml-auto max-w-[85%] rounded-2xl bg-sky-600 px-3 py-2 text-white'}>
                {message.text}
              </div>
            ))}
            <p className="text-xs text-slate-400">{replyHint}</p>
          </div>

          <div className="mt-4 grid gap-3">
            <Input placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} />
            <Input placeholder="Phone" value={phone} onChange={(event) => setPhone(event.target.value)} />
            <Input placeholder="Email" value={email} onChange={(event) => setEmail(event.target.value)} />
            <Textarea placeholder="How can I help with your booking?" value={description} onChange={(event) => setDescription(event.target.value)} />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => handleQuestion('What are your office hours?')}>Hours</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleQuestion('Can I book a consultation?')}>Book</Button>
              <Button type="button" variant="outline" size="sm" onClick={() => handleQuestion('Do you accept documents?')}>Documents</Button>
            </div>
            <Button type="button" onClick={submitChatInquiry}>Send inquiry</Button>
          </div>
        </section>
      ) : null}
    </>
  );
}
