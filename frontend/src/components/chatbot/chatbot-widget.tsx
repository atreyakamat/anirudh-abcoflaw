'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'bot';
  text: string;
  intent?: string;
}

interface ChatSession {
  id: string;
  email?: string;
}

const quickActions = [
  { label: 'Book Consultation', action: 'book' },
  { label: 'View Practice Areas', action: 'areas' },
  { label: 'Office Hours', action: 'hours' },
  { label: 'Contact Us', action: 'contact' },
];

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: 'Hello! Welcome to AB & Co. Legal. I can help you with booking consultations, answering questions about our services, and guiding you to the right legal support. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && !session) {
      initSession();
    }
  }, [open, session]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initSession = async () => {
    try {
      const res = await fetch('/api/v1/chatbot/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'website' }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.data?.id) {
        setSession({ id: data.data.id, email: data.data.email });
      }
    } catch (err) {
      console.error('Failed to init chatbot session:', err);
    }
  };

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    const userMessage = text.trim();
    setInput('');
    setLoading(true);
    setShowQuickActions(false);

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);

    if (!session?.id) {
      await initSession();
    }

    try {
      const res = await fetch(`/api/v1/chatbot/sessions/${session?.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userMessage }),
        credentials: 'include',
      });

      const data = await res.json();

      if (data.data?.response) {
        setMessages(prev => [
          ...prev,
          {
            role: 'bot',
            text: data.data.response,
            intent: data.data.intent?.name,
          },
        ]);

        // If lead collection needed, show contact form
        if (data.data.shouldCollectContact && data.data.intent?.action === 'QUALIFY_LEAD') {
          setMessages(prev => [
            ...prev,
            {
              role: 'bot',
              text: "I'd be happy to help you book a consultation. Could you provide your contact details?",
            },
          ]);
        }
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          text: "I apologize, but I'm having trouble processing your request right now. Please try again or contact us directly at contact@lawpractice.com",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, session?.id]);

  const handleQuickAction = (action: string) => {
    const actionMap: Record<string, string> = {
      book: "I'd like to book a consultation",
      areas: 'What practice areas do you cover?',
      hours: 'What are your office hours?',
      contact: 'How can I contact you?',
    };
    sendMessage(actionMap[action] || action);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className={cn(
          'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105',
          open
            ? 'bg-destructive text-destructive-foreground rotate-90'
            : 'bg-primary text-primary-foreground'
        )}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4"
          style={{ height: 520 }}
        >
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Legal Assistant</h3>
                <p className="text-xs opacity-80">AB & Co. Legal</p>
              </div>
            </div>
            <button
              onClick={() => setShowQuickActions(!showQuickActions)}
              className="p-1 hover:bg-primary-foreground/20 rounded-full transition-colors"
              aria-label="Toggle quick actions"
            >
              {showQuickActions ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Actions */}
          {showQuickActions && (
            <div className="border-b bg-muted/50 p-3 flex flex-wrap gap-2">
              {quickActions.map(action => (
                <button
                  key={action.action}
                  onClick={() => handleQuickAction(action.action)}
                  className="text-xs px-3 py-1.5 bg-background border rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap',
                  m.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground rounded-br-md'
                    : 'bg-muted rounded-bl-md'
                )}
              >
                {m.text}
                {m.intent && m.role === 'bot' && (
                  <div className="text-xs opacity-60 mt-1 capitalize">{m.intent}</div>
                )}
              </div>
            ))}

            {loading && (
              <div className="max-w-[85%] rounded-2xl px-4 py-3 text-sm bg-muted rounded-bl-md flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-muted-foreground">Thinking...</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question..."
                className="flex-1 px-4 py-2.5 text-sm border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors"
                aria-label="Send message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Not a substitute for legal advice. For emergencies, call +91-9876543210.
            </p>
          </div>
        </div>
      )}
    </>
  );
}