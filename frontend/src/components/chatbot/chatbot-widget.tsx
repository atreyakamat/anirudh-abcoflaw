'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message { role: 'user' | 'bot'; text: string; }

const faqMap: Record<string, string> = {
  'book': 'To book a consultation, click the "Book Consultation" button on the top navigation or visit the /book page. You can select your preferred date, time, and practice area.',
  'fee': 'Consultation fees vary by practice area and are communicated upon booking confirmation. No payment is required until your appointment is confirmed.',
  'hours': 'Our office is open Monday to Saturday, 9:00 AM to 6:00 PM. We are closed on Sundays.',
  'phone': 'You can reach us at +91-9876543210 or email contact@lawpractice.com.',
  'areas': 'We practice in Corporate Law, Family Law, Property Law, Employment Law, Criminal Law, and Civil Litigation.',
  'location': 'Our office is located at 123 Legal Street, Suite 100, Mumbai, India.',
  'cancel': 'To cancel or reschedule an appointment, please contact us at +91-9876543210 or login to the client portal.',
};

const fallback = "I'm here to help with general questions about our legal services. I can help with:\n\n• Booking a consultation\n• Practice areas\n• Office hours and contact info\n• General FAQ\n\nFor specific legal advice, please book a consultation.";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', text: 'Hello! How can I help you today? I can answer questions about our legal services, booking, and office information.' }]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), [messages]);

  const send = () => {
    if (!input.trim()) return;
    const q = input.toLowerCase();
    setMessages((m) => [...m, { role: 'user', text: input }]);
    setInput('');
    setTimeout(() => {
      const match = Object.entries(faqMap).find(([k]) => q.includes(k));
      setMessages((m) => [...m, { role: 'bot', text: match ? match[1] : fallback }]);
    }, 500);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)} className={cn('fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all', open ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground hover:scale-105')}>
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-background border rounded-xl shadow-2xl flex flex-col overflow-hidden" style={{ height: 480 }}>
          <div className="bg-primary text-primary-foreground p-4 font-medium flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Legal Assistant</div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => <div key={i} className={cn('max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap', m.role === 'user' ? 'ml-auto bg-primary text-primary-foreground' : 'bg-muted')}>{m.text}</div>)}
            <div ref={bottomRef} />
          </div>
          <div className="border-t p-3 flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type your question..." className="flex-1 px-3 py-2 text-sm border rounded-lg bg-background" />
            <button onClick={send} className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"><Send className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </>
  );
}