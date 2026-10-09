'use client';

import React, { useState } from 'react';
import { Bot, Send, User, Loader2, Sparkles, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Salom! Men «Qarz Nazorati» servisining sun'iy intellekt yordamchisiman. Moliyaviy ahvolingiz, shartnomalar yoki qarzlardan qutulish bo'yicha istalgan savolingizni bering." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: userMessage, numbers: { income: 10000000, totalPayments: 4200000 } })
      });
      const data = await res.json();
      const aiReply = data.result || data.error || 'Javob olishda xatolik yuz berdi.';
      setMessages(prev => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Server bilan aloqa uzildi.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      <main className="flex-1 flex flex-col h-full max-w-4xl mx-auto border-x border-slate-200 bg-white">
        
        {/* Шапка чата */}
        <header className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 hover:bg-slate-100 rounded-xl transition text-slate-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900">AI Moliyaviy Yordamchi</h1>
              <span className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online (Llama 3.3)
              </span>
            </div>
          </div>
        </header>

        {/* История сообщений */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`p-4 rounded-2xl max-w-xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-100' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 bg-slate-100 rounded-2xl text-sm text-slate-500 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> O'ylayapman...
              </div>
            </div>
          )}
        </div>

        {/* Поле ввода сообщения */}
        <form onSubmit={sendMessage} className="p-4 border-t border-slate-200 bg-white flex gap-3">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Moliyaviy savolingizni yozing..."
            className="flex-1 p-3.5 border border-slate-200 rounded-xl text-sm focus:outline-blue-600 bg-slate-50"
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 rounded-xl font-medium transition flex items-center justify-center shadow-lg shadow-blue-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

      </main>
    </div>
  );
}