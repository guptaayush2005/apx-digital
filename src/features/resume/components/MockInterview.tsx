'use client';

import { useState } from 'react';
import { Settings2, Mic, Send } from 'lucide-react';

export const MockInterview = () => {
  const [messages, setMessages] = useState([
    {
      speaker: 'ai',
      text: 'Welcome Alex! Let\'s simulate a System Design round for Vercel. Can you walk me through how you would architect a real-time analytics counter handling 100k events/sec with sub-50ms query latency?'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages((prev) => [...prev, { speaker: 'user', text: userMsg }]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          speaker: 'ai',
          text: 'Excellent architectural breakdown! Using Redis Sorted Sets and memory-mapped append-only logs avoids database locking. What replication and failover strategy would you employ if a Redis master node partitions?'
        }
      ]);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-4 glass-card rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Settings2 className="w-4 h-4 text-brand-500" /> Session Configuration
        </h3>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-neutral-400 mb-1">Target Position</label>
            <input
              type="text"
              defaultValue="Senior Backend & Distributed Systems"
              className="w-full bg-dark-850 p-2 rounded-lg border border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-1">Interview Round</label>
            <select className="w-full bg-dark-850 p-2 rounded-lg border border-white/10 text-white">
              <option>System Design & Scalability</option>
              <option>Behavioral & Leadership (STAR Method)</option>
              <option>Full-Stack Live Coding</option>
            </select>
          </div>
          <button className="w-full py-2 bg-brand-500 text-dark-950 font-semibold rounded-lg text-xs">
            Restart AI Simulation
          </button>
        </div>
      </div>

      <div className="lg:col-span-8 glass-card rounded-2xl p-6 flex flex-col h-[520px]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.speaker === 'user' ? 'justify-end' : ''}`}>
              {m.speaker === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-xs shrink-0">
                  AI
                </div>
              )}
              <div
                className={`p-3.5 rounded-xl border max-w-lg leading-relaxed ${
                  m.speaker === 'user'
                    ? 'bg-brand-500/10 border-brand-500/30 text-emerald-200'
                    : 'bg-dark-850 border-white/5 text-neutral-200'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-white/5 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your architectural response or click mic..."
            className="flex-1 bg-dark-850 text-xs px-3 py-2.5 rounded-lg border border-white/10 text-white focus:outline-none focus:border-brand-500"
          />
          <button
            onClick={() => alert('Speech-to-text listening...')}
            className="px-3 bg-dark-850 hover:bg-dark-700 rounded-lg border border-white/10 text-neutral-300"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            onClick={handleSend}
            className="px-4 bg-brand-500 text-dark-950 font-semibold text-xs rounded-lg flex items-center gap-1"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

