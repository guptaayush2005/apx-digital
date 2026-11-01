'use client';

import { useCareerStore } from '../lib/store';
import { ExternalLink, Sparkles } from 'lucide-react';

export const PortfolioPreview = () => {
  const { resume } = useCareerStore();

  return (
    <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Apple-Styled Hosted Portfolio</h2>
          <p className="text-xs text-neutral-400">
            Live URL:{' '}
            <span className="text-brand-500 font-mono inline-flex items-center gap-1">
              careeros.example.com/@jordanlee <ExternalLink className="w-3 h-3" />
            </span>
          </p>
        </div>
        <button
          onClick={() => alert('Portfolio published to edge network!')}
          className="px-4 py-1.5 text-xs bg-brand-500 text-dark-950 font-bold rounded-lg flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" /> Deploy Updates
        </button>
      </div>

      <div className="p-8 bg-dark-900 rounded-2xl border border-white/5 space-y-6">
        <div>
          <span className="text-xs uppercase font-mono font-medium text-brand-500 tracking-wider">
            Portfolio Showcase
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            {resume.name}
          </h3>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl leading-relaxed">
            {resume.summary}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 bg-dark-850 rounded-xl border border-white/5 hover:border-brand-500/30 transition-all">
            <h4 className="text-sm font-bold text-white">Edge Compute Isolation Engine</h4>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              High-throughput serverless runtime powered by V8 isolates, cutting cold-start latency down to under 5ms.
            </p>
            <div className="flex gap-2 mt-3">
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-300">Rust</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-300">WebAssembly</span>
            </div>
          </div>

          <div className="p-5 bg-dark-850 rounded-xl border border-white/5 hover:border-brand-500/30 transition-all">
            <h4 className="text-sm font-bold text-white">Distributed KV Consensus Layer</h4>
            <p className="text-xs text-neutral-400 mt-1.5 leading-relaxed">
              Persistent memory layer utilizing Raft consensus with automated snapshot compaction and replication.
            </p>
            <div className="flex gap-2 mt-3">
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-300">Go</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-neutral-300">gRPC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

