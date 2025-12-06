import React, { useState } from 'react';
import { askGeminiTutor } from '../services/geminiService';
import { Sparkles, Send, Loader2, Bot, User } from 'lucide-react';

export const AITutor: React.FC = () => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([
      {role: 'ai', content: "Bonjour ! Je suis MedEdu-AI. Posez-moi une question sur les catécholamines, les récepteurs ou un cas clinique."}
  ]);
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = query;
    setMessages(prev => [...prev, {role: 'user', content: userMsg}]);
    setQuery('');
    setLoading(true);

    const answer = await askGeminiTutor(userMsg, "Chat libre");
    setMessages(prev => [...prev, {role: 'ai', content: answer}]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white md:rounded-2xl md:shadow-sm md:border md:border-slate-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-primary-600 p-4 text-white flex items-center gap-3 shadow-sm">
         <div className="p-2 bg-white/20 rounded-full">
            <Sparkles className="w-5 h-5" />
         </div>
         <div>
            <h2 className="font-bold">Assistant IA</h2>
            <p className="text-xs text-primary-100 opacity-90">Expert en Pharmacologie</p>
         </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
         {messages.map((m, i) => (
             <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'ai' ? 'bg-primary-100 text-primary-600' : 'bg-slate-200 text-slate-600'}`}>
                    {m.role === 'ai' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                 </div>
                 <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm ${
                     m.role === 'ai' 
                     ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-none' 
                     : 'bg-primary-600 text-white rounded-tr-none'
                 }`}>
                     {m.role === 'ai' 
                        ? <div dangerouslySetInnerHTML={{ __html: m.content.replace(/\n/g, '<br/>') }} />
                        : m.content
                     }
                 </div>
             </div>
         ))}
         {loading && (
             <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-600" />
                 </div>
                 <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary-500" />
                    <span className="text-xs text-slate-500">Réflexion en cours...</span>
                 </div>
             </div>
         )}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-100">
        <form onSubmit={handleAsk} className="flex gap-2">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 bg-slate-100 border-0 rounded-xl px-4 py-3 text-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
            <button 
                type="submit" 
                disabled={!query.trim() || loading}
                className="bg-primary-600 text-white p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 active:scale-95 transition-all"
            >
                <Send className="w-5 h-5" />
            </button>
        </form>
      </div>
    </div>
  );
};
