'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Bot, User as UserIcon, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; content: string }[]>([
    { 
      role: 'bot', 
      content: 'Hello. I am the AB & Co. Legal Information Assistant. I can help answer general questions about office procedures, practice areas, or scheduling an appointment.' 
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const currentInput = input.toLowerCase();
    setInput('');
    
    setTimeout(() => {
      let botReply = 'Thank you for your question. For specific legal guidance regarding your matter, please request a formal consultation with Advocate Anirudha Sinai Borkar.';
      
      if (currentInput.includes('fee') || currentInput.includes('cost') || currentInput.includes('price')) {
        botReply = 'The standard initial consultation fee is ₹2,500 for a 60-minute session. Payment is requested prior to appointment confirmation.';
      } else if (currentInput.includes('address') || currentInput.includes('office') || currentInput.includes('location')) {
        botReply = 'Our office is located in Porvorim, North Goa (near Panaji). Consultations are conducted by prior appointment.';
      } else if (currentInput.includes('hour') || currentInput.includes('time') || currentInput.includes('open')) {
        botReply = 'Office hours are Monday through Friday, 10:00 to 17:00 IST. Consultations are scheduled by prior appointment.';
      }

      setMessages(prev => [...prev, { role: 'bot', content: botReply }]);
    }, 800);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 p-3.5 sm:p-4 rounded-full bg-slate-900 text-white shadow-xl hover:scale-105 transition-all duration-300 z-50 flex items-center justify-center cursor-pointer border border-slate-700 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open Legal Information Assistant"
      >
        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
      </button>

      {/* Chat Window Container */}
      <div 
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] sm:h-[560px] max-h-[80vh] flex flex-col bg-white border border-slate-200 shadow-2xl rounded-2xl z-50 transition-all duration-300 origin-bottom-right overflow-hidden ${isOpen ? 'scale-100 opacity-100 pointer-events-auto translate-y-0' : 'scale-90 opacity-0 pointer-events-none translate-y-8'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 text-white shadow-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
              <Bot className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base leading-tight">Information Assistant</h3>
              <p className="text-[10px] text-slate-400">AB & Co. Legal • Porvorim, Goa</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="Close assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Disclaimer Header Notice */}
        <div className="bg-yellow-50 border-b border-yellow-200/60 p-2.5 px-3 flex items-start gap-2 text-[11px] text-yellow-900 leading-snug">
          <ShieldAlert className="w-4 h-4 text-yellow-700 shrink-0 mt-0.5" />
          <p>
            <strong>General Info Only:</strong> Responses do not constitute legal advice or an advocate-client relationship. Do not input confidential case documents or credentials.
          </p>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-md flex-shrink-0 flex items-center justify-center text-xs font-bold ${msg.role === 'user' ? 'bg-yellow-600 text-white' : 'bg-slate-900 text-yellow-500'}`}>
                {msg.role === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>
              <div className={`p-3 rounded-xl max-w-[80%] text-xs leading-relaxed ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Footer */}
        <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[11px]">
          <span className="text-slate-500">Need specific advice?</span>
          <Link href="/book" onClick={() => setIsOpen(false)} className="font-bold text-yellow-700 hover:underline">
            Request Appointment &rarr;
          </Link>
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form onSubmit={handleSend} className="flex items-center gap-2 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask an administrative question..." 
              className="flex-1 pl-3.5 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-yellow-600 text-xs text-slate-900"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-1 p-1.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

