'use client';

import React, { useRef, useState } from 'react';
import { Bot, Send, User, Loader2, Paperclip, X, FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const ACCEPT = '.pdf,image/png,image/jpeg,image/webp';
const MAX_PDF = 10 * 1024 * 1024;
const MAX_IMG = 3 * 1024 * 1024;

export default function AIChatPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Salom! Men «Qarz Nazorati» servisining sun'iy intellekt yordamchisiman. Moliyaviy ahvolingiz, qarzlardan qutulish bo'yicha savol bering yoki shartnomani (PDF, PNG, JPG) yuklang, men uni tahlil qilaman." }
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef(null);

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    e.target.value = ''; // чтобы можно было выбрать тот же файл повторно
    if (!f) return;
    const isPdf = f.type === 'application/pdf' || /\.pdf$/i.test(f.name);
    const isImg = ['image/png', 'image/jpeg', 'image/webp'].includes(f.type);
    if (!isPdf && !isImg) return setFileError("Faqat PDF, PNG yoki JPG fayllari mumkin.");
    if (isPdf && f.size > MAX_PDF) return setFileError("PDF fayl 10 MB dan oshmasligi kerak.");
    if (isImg && f.size > MAX_IMG) return setFileError("Rasm 3 MB dan oshmasligi kerak.");
    setFileError('');
    setFile(f);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !file) || loading) return;

    const userMessage = input.trim();
    const attached = file;
    setInput('');
    setFile(null);
    setFileError('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, fileName: attached?.name }]);
    setLoading(true);
    setAnalyzing(!!attached);

    try {
      const form = new FormData();
      form.append('text', userMessage);
      form.append('numbers', JSON.stringify({ income: 10000000, totalPayments: 4200000 }));
      if (attached) form.append('file', attached);

      // Content-Type не указываем: браузер сам поставит multipart с boundary
      const res = await fetch('/api/ai', { method: 'POST', body: form });
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
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
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
              <div className={`p-4 rounded-2xl max-w-xl text-sm leading-relaxed whitespace-pre-wrap break-words ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-100' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'}`}>
                {msg.fileName && (
                  <div className="flex items-center gap-2 mb-2 px-2.5 py-1.5 rounded-lg bg-white/20 text-xs font-medium">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="truncate">{msg.fileName}</span>
                  </div>
                )}
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
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                {analyzing ? "Shartnoma tahlil qilinmoqda..." : "O'ylayapman..."}
              </div>
            </div>
          )}
        </div>

        {/* Поле ввода + вложение */}
        <form onSubmit={sendMessage} className="p-4 border-t border-slate-200 bg-white">
          {(file || fileError) && (
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {file && (
                <div className="flex items-center gap-2 pl-3 pr-1.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-medium max-w-full">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate max-w-[240px]">{file.name}</span>
                  <button type="button" onClick={() => setFile(null)} aria-label="Faylni olib tashlash"
                    className="p-1 rounded-lg hover:bg-blue-100">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              {fileError && <span className="text-xs text-red-600">{fileError}</span>}
            </div>
          )}
          <div className="flex gap-3">
            <input ref={fileRef} type="file" accept={ACCEPT} onChange={pickFile} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={loading}
              aria-label="Shartnoma yuklash" title="Shartnoma yuklash (PDF, PNG, JPG)"
              className="px-3.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition flex items-center justify-center">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={file ? "Savol yozing yoki shunchaki yuboring..." : "Moliyaviy savolingizni yozing..."}
              className="flex-1 min-w-0 p-3.5 border border-slate-200 rounded-xl text-sm focus:outline-blue-600 bg-slate-50"
            />
            <button
              type="submit"
              disabled={loading || (!input.trim() && !file)}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 rounded-xl font-medium transition flex items-center justify-center shadow-lg shadow-blue-200"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>

      </main>
    </div>
  );
}
