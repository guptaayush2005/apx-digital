'use client';

import { useState } from 'react';
import { Mail, Sparkles, Copy, Check, Printer } from 'lucide-react';
import { useCareerStore } from '../lib/store';

export const CoverLetterGenerator = () => {
  const { resume } = useCareerStore();
  const [company, setCompany] = useState('Vercel');
  const [role, setRole] = useState('Staff Platform & Infrastructure Engineer');
  const [tone, setTone] = useState('Executive & Impact-Focused');
  const [copied, setCopied] = useState(false);

  const [letter, setLetter] = useState(
    `Dear Hiring Team at ${company},\n\nI am writing to express my strong enthusiasm for the ${role} position. Having closely followed ${company}'s trailblazing work in edge runtime systems and developer tooling, I have long admired your standard of engineering excellence.\n\nThroughout my career as a Full-Stack and Systems Engineer, I have prioritized high-throughput, fault-tolerant architectures. At my previous roles, I spearheaded edge computing migrations that reduced p99 latency by 38% for millions of daily active users, built canary deployment automation, and championed resilient microservices patterns.\n\nThe challenge of scaling global platforms while maintaining a seamless developer experience is exactly what drives my work. Given ${company}'s ambitious roadmap, I am excited about the opportunity to bring my hands-on systems expertise and architectural ownership to your team.\n\nThank you for your time and consideration. I look forward to the possibility of discussing how my experience aligns with your engineering goals.\n\nSincerely,\n${resume.name}\n${resume.email}`
  );

  const handleGenerate = () => {
    setLetter(
      `Dear Hiring Team at ${company},\n\nI am thrilled to submit my application for the ${role} position. With over 6 years specializing in high-throughput cloud architectures and modern developer frameworks, I am eager to contribute to ${company}'s cutting-edge systems.\n\nIn my previous role, I led the architectural overhaul of distributed cloud microservices, cutting response latencies by 42% and slashing deployment rollbacks by 74%. My background directly mirrors the requirements for the ${role} position—ranging from scalable backend systems to resilient event pipelines and engineering mentorship.\n\nI welcome the opportunity to connect and discuss how my track record of measurable technical execution will deliver immediate value to ${company}.\n\nWarm regards,\n${resume.name}\n${resume.email}`
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
      {/* Controls */}
      <div className="lg:col-span-5 glass-card rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-brand-500" /> Letter Parameters
        </h2>
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-neutral-400 mb-1">Target Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-dark-850 p-2 rounded-lg border border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-1">Target Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-dark-850 p-2 rounded-lg border border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-neutral-400 mb-1">Tone & Voice</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full bg-dark-850 p-2 rounded-lg border border-white/10 text-white"
            >
              <option>Executive & Impact-Focused</option>
              <option>Passionate & Startup-Aligned</option>
              <option>Technical & Concise</option>
            </select>
          </div>
          <button
            onClick={handleGenerate}
            className="w-full py-2 bg-brand-500 text-dark-950 font-bold rounded-lg flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> Generate Tailored Letter
          </button>
        </div>
      </div>

      {/* Editor & Preview */}
      <div className="lg:col-span-7 glass-card rounded-2xl p-6 flex flex-col space-y-4">
        <div className="flex justify-between items-center border-b border-white/10 pb-3">
          <span className="text-xs font-semibold text-neutral-300">Generated Cover Letter</span>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="text-xs px-2.5 py-1 bg-dark-850 hover:bg-dark-700 rounded border border-white/10 flex items-center gap-1 text-neutral-300"
            >
              {copied ? <Check className="w-3 h-3 text-brand-500" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button
              onClick={() => window.print()}
              className="text-xs px-2.5 py-1 bg-dark-850 hover:bg-dark-700 rounded border border-white/10 flex items-center gap-1 text-neutral-300"
            >
              <Printer className="w-3 h-3" /> Print
            </button>
          </div>
        </div>

        <textarea
          rows={14}
          value={letter}
          onChange={(e) => setLetter(e.target.value)}
          className="w-full bg-dark-850 border border-white/10 rounded-xl p-4 text-xs text-neutral-200 focus:outline-none focus:border-brand-500 leading-relaxed font-sans"
        />
      </div>
    </div>
  );
};

