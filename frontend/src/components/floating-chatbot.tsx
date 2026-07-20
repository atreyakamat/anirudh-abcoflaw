'use client';

import { useState } from 'react';
import { MessageSquare, X, Send, Bot, User as UserIcon } from 'lucide-react';

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; content: string }[]>([
    { role: 'bot', content: 'Hello! I am the AB & Co Legal assistant. How can I help you today? I can answer FAQs or help you book a consultation.' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    
    // Simulate bot thinking then replying
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'bot', content: 'Thanks for reaching out! Our AI capabilities are currently being upgraded, but you can book a consultation directly through the form above.' }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-slate-900 text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-110 hover:-translate-y-1 transition-all duration-300 z-50 flex items-center justify-center cursor-pointer ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        aria-label="Open chat"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
      </button>

      {/* Chat Window Container */}
      <div 
        className={`fixed bottom-6 right-6 w-[380px] h-[550px] max-h-[80vh] max-w-[calc(100vw-3rem)] flex flex-col bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl z-50 transition-all duration-500 origin-bottom-right overflow-hidden ${isOpen ? 'scale-100 opacity-100 pointer-events-auto translate-y-0' : 'scale-90 opacity-0 pointer-events-none translate-y-8'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-slate-900 text-white shadow-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <Bot className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg leading-tight tracking-tight">Legal Assistant</h3>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"></span>
                Online
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === 'user' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-200 text-slate-600'}`}>
                {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-3 rounded-2xl max-w-[75%] shadow-sm text-sm ${msg.role === 'user' ? 'bg-yellow-600 text-white rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/60 border-t border-slate-200/50 backdrop-blur-md">
          <form onSubmit={handleSend} className="flex items-center gap-2 relative">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a legal question..." 
              className="flex-1 pl-4 pr-12 py-3 bg-white border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-600/50 focus:border-yellow-600 transition-all text-sm text-slate-900 shadow-inner"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className="absolute right-1 p-2 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:hover:bg-slate-900 cursor-pointer flex items-center justify-center w-10 h-10 shadow-sm"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
