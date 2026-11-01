'use client';

import { useState } from 'react';
import { Compass, CheckCircle2, Circle, Sparkles } from 'lucide-react';

export const CareerCoach = () => {
  const [milestones, setMilestones] = useState([
    {
      id: 1,
      title: 'Complete Distributed Systems & Consensus Mastery',
      category: 'Technical Foundation',
      isCompleted: true,
      timeframe: 'Target: Q1 2026',
      notes: 'Implemented Raft protocol and Redis cluster failovers with benchmark reports.'
    },
    {
      id: 2,
      title: 'Publish High-Traffic Open Source Library on npm/GitHub',
      category: 'Public Proof of Work',
      isCompleted: true,
      timeframe: 'Target: Q2 2026',
      notes: 'Released edge streaming utility with over 200+ stars on GitHub.'
    },
    {
      id: 3,
      title: 'Crack 5 System Design Interviews (Staff Level)',
      category: 'Interview Readiness',
      isCompleted: false,
      timeframe: 'Target: Q3 2026',
      notes: 'Practice live scenarios: Distributed rate limiting, Uber dispatch, TinyURL.'
    },
    {
      id: 4,
      title: 'Secure Staff Software Engineer Offer ($220k+ Base)',
      category: 'Career Outcome',
      isCompleted: false,
      timeframe: 'Target: Q4 2026',
      notes: 'Negotiate equity grants and sign-on incentives.'
    }
  ]);

  const toggleMilestone = (id: number) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isCompleted: !m.isCompleted } : m))
    );
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-500" /> AI Career Coach & Milestone Roadmap
          </h2>
          <p className="text-xs text-neutral-400">
            Strategic career progression plan customized for promotion to Staff & Principal Engineer.
          </p>
        </div>
        <button
          onClick={() => alert('Roadmap recalibrated against current market hiring signals!')}
          className="px-3.5 py-1.5 text-xs font-semibold bg-brand-500 text-dark-950 rounded-lg flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Re-sync Roadmap
        </button>
      </div>

      <div className="relative pl-6 border-l-2 border-dark-700 space-y-6">
        {milestones.map((m) => (
          <div key={m.id} className="relative group">
            {/* Milestone icon marker */}
            <button
              onClick={() => toggleMilestone(m.id)}
              className="absolute -left-[31px] top-1 p-0.5 rounded-full bg-dark-900 focus:outline-none"
            >
              {m.isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-brand-500" />
              ) : (
                <Circle className="w-5 h-5 text-neutral-500 hover:text-white" />
              )}
            </button>

            <div className="p-4 bg-dark-850 rounded-xl border border-white/5 group-hover:border-brand-500/30 transition-all space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-brand-500 font-semibold">
                  {m.category}
                </span>
                <span className="text-[11px] text-neutral-400 font-medium">{m.timeframe}</span>
              </div>
              <h3
                className={`text-sm font-bold ${
                  m.isCompleted ? 'text-neutral-400 line-through' : 'text-white'
                }`}
              >
                {m.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{m.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

