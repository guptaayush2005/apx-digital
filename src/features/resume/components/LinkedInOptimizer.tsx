'use client';

import { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';
import { LinkedinIcon as Linkedin } from '../../../components/BrandIcons';

export const LinkedInOptimizer = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const [headline, setHeadline] = useState(
    'Staff Full-Stack Engineer | Distributed Systems & AI Platforms | 42% Throughput Acceleration | Next.js • Go • Kubernetes'
  );
  const [about, setAbout] = useState(
    `I am a Staff Software Engineer and Systems Architect passionate about building bulletproof cloud infrastructure and intuitive developer platforms.\n\nOver the past 6+ years, I have architected edge computing platforms serving millions of daily requests, reduced API latencies by over 40%, and scaled microservices across global multi-region deployments.\n\nCore Competencies:\n• Distributed Systems (Go, Node.js, Raft, Kafka, Redis)\n• Cloud & DevOps (Docker, Kubernetes, AWS, Terraform, CI/CD)\n• Modern Frontend Architecture (TypeScript, Next.js, React, Tailwind CSS)\n\nAlways open to discussing high-concurrency architecture, generative AI systems, and technical leadership opportunities.`
  );

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Linkedin className="w-5 h-5 text-blue-500" /> LinkedIn Profile Optimizer
          </h2>
          <p className="text-xs text-neutral-400">
            Generate high-visibility headlines, executive summaries, and searchable recruiter keywords.
          </p>
        </div>
        <button
          onClick={() => alert('LinkedIn profile content regenerated using executive tone!')}
          className="px-3.5 py-1.5 text-xs font-semibold bg-brand-500 text-dark-950 rounded-lg flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> AI Rewrite Profile
        </button>
      </div>

      <div className="space-y-5">
        {/* Headline */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-neutral-300">
              Target Headline (Optimized for Recruiter Search)
            </label>
            <button
              onClick={() => copyToClipboard(headline, 'headline')}
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1"
            >
              {copied === 'headline' ? <Check className="w-3 h-3 text-brand-500" /> : <Copy className="w-3 h-3" />}
              {copied === 'headline' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            rows={2}
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="w-full text-xs bg-dark-850 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-brand-500 leading-relaxed"
          />
        </div>

        {/* About Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-neutral-300">
              "About" Section Story & Value Proposition
            </label>
            <button
              onClick={() => copyToClipboard(about, 'about')}
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1"
            >
              {copied === 'about' ? <Check className="w-3 h-3 text-brand-500" /> : <Copy className="w-3 h-3" />}
              {copied === 'about' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            rows={10}
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full text-xs bg-dark-850 border border-white/10 rounded-xl p-3.5 text-neutral-200 focus:outline-none focus:border-brand-500 leading-relaxed font-sans"
          />
        </div>
      </div>
    </div>
  );
};

