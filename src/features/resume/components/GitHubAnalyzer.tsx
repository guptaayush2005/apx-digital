'use client';

import { useState } from 'react';
import { Star, CheckCircle2, Search } from 'lucide-react';
import { GithubIcon as Github } from '../../../components/BrandIcons';

export const GitHubAnalyzer = () => {
  const [username, setUsername] = useState('sample-developer');
  const [analyzed, setAnalyzed] = useState(true);

  const stats = {
    totalRepos: 24,
    totalStars: 218,
    commitsThisYear: 1420,
    topLanguages: [
      { name: 'TypeScript', percentage: 54, color: '#3178c6' },
      { name: 'Python', percentage: 22, color: '#3572A5' },
      { name: 'Go', percentage: 14, color: '#00ADD8' },
      { name: 'Rust', percentage: 10, color: '#dea584' },
    ],
    verifiedCapabilities: [
      'Production Microservices & Distributed Architecture',
      'High-throughput Edge Computing & Serverless Functions',
      'Clean Code & Automated Test Coverage (>85%)',
      'Active Open-Source Contributor & Package Maintainer'
    ]
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Github className="w-5 h-5 text-brand-500" /> GitHub Repository & Code Analyzer
          </h2>
          <p className="text-xs text-neutral-400">
            Extracts verifiable engineering evidence, commit patterns, and skill credibility from public GitHub activity.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="github username..."
              className="bg-dark-850 text-xs pl-8 pr-3 py-2 rounded-lg border border-white/10 text-white focus:outline-none focus:border-brand-500"
            />
          </div>
          <button
            onClick={() => setAnalyzed(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-brand-500 text-dark-950 rounded-lg hover:bg-brand-600 transition-colors"
          >
            Inspect
          </button>
        </div>
      </div>

      {analyzed && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-dark-850 rounded-xl border border-white/5">
              <span className="text-[11px] text-neutral-400 uppercase font-medium">Public Repos</span>
              <div className="text-2xl font-bold text-white mt-1">{stats.totalRepos}</div>
              <span className="text-[10px] text-emerald-400 mt-1 inline-block">18 actively maintained</span>
            </div>
            <div className="p-4 bg-dark-850 rounded-xl border border-white/5">
              <span className="text-[11px] text-neutral-400 uppercase font-medium">Earned Stars</span>
              <div className="text-2xl font-bold text-white mt-1 flex items-center gap-1.5">
                {stats.totalStars} <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              </div>
              <span className="text-[10px] text-emerald-400 mt-1 inline-block">Top 8% developer</span>
            </div>
            <div className="p-4 bg-dark-850 rounded-xl border border-white/5">
              <span className="text-[11px] text-neutral-400 uppercase font-medium">Annual Commits</span>
              <div className="text-2xl font-bold text-white mt-1">{stats.commitsThisYear}</div>
              <span className="text-[10px] text-emerald-400 mt-1 inline-block">High velocity & consistency</span>
            </div>
            <div className="p-4 bg-dark-850 rounded-xl border border-white/5">
              <span className="text-[11px] text-neutral-400 uppercase font-medium">Code Quality Tier</span>
              <div className="text-2xl font-bold text-brand-500 mt-1">A+ Tier</div>
              <span className="text-[10px] text-neutral-400 mt-1 inline-block">Standardized lint & CI</span>
            </div>
          </div>

          {/* Languages & Capabilities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-dark-850 rounded-xl border border-white/5 space-y-3">
              <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Language Distribution
              </h3>
              <div className="space-y-2.5 text-xs">
                {stats.topLanguages.map((lang, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-neutral-300">
                      <span>{lang.name}</span>
                      <span className="font-mono text-neutral-400">{lang.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 bg-dark-850 rounded-xl border border-white/5 space-y-3">
              <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                AI-Verified Technical Proof Points
              </h3>
              <ul className="space-y-2.5 text-xs text-neutral-300">
                {stats.verifiedCapabilities.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

