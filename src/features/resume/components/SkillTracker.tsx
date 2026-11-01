'use client';

import { Cpu, Award, CheckCircle } from 'lucide-react';

export const SkillTracker = () => {
  const skillCategories = [
    {
      category: 'Core Distributed Systems',
      skills: [
        { name: 'Microservices & gRPC', level: 95 },
        { name: 'Redis & Caching Protocols', level: 92 },
        { name: 'Kafka & Event Pipelines', level: 88 },
        { name: 'Database Sharding & SQL', level: 90 },
      ]
    },
    {
      category: 'Frontend & Edge Compute',
      skills: [
        { name: 'Next.js 14 & React Server Components', level: 96 },
        { name: 'TypeScript & Type-Safety', level: 98 },
        { name: 'Tailwind CSS & Design Systems', level: 94 },
        { name: 'WebAssembly & V8 Runtime', level: 82 },
      ]
    },
    {
      category: 'Cloud Infrastructure & DevOps',
      skills: [
        { name: 'Docker & Containerization', level: 94 },
        { name: 'Kubernetes Cluster Orchestration', level: 86 },
        { name: 'AWS (ECS, S3, CloudFront, Lambda)', level: 90 },
        { name: 'Terraform & Infrastructure as Code', level: 84 },
      ]
    }
  ];

  const certificates = [
    {
      title: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      date: 'Issued Jan 2025 • Expires Jan 2028',
      verified: true
    },
    {
      title: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Cloud Native Computing Foundation (CNCF)',
      date: 'Issued Aug 2024 • Expires Aug 2027',
      verified: true
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Skill Gauges */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-brand-500" /> Skill Competency Matrix & Evidence
          </h2>
          <p className="text-xs text-neutral-400">
            Self-assessed and GitHub/Quiz verified competency scores across engineering disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {skillCategories.map((cat, idx) => (
            <div key={idx} className="p-4 bg-dark-850 rounded-xl border border-white/5 space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider text-brand-400">
                {cat.category}
              </h3>
              <div className="space-y-3">
                {cat.skills.map((skill, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-300">
                      <span>{skill.name}</span>
                      <span className="font-mono text-neutral-400">{skill.level}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-dark-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-500 rounded-full transition-all"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Certificates */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-brand-500" /> Verified Credentials & Certificates
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {certificates.map((cert, cIdx) => (
            <div key={cIdx} className="p-4 bg-dark-850 rounded-xl border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{cert.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Verified
                </span>
              </div>
              <div className="text-neutral-400">{cert.issuer}</div>
              <div className="text-[11px] text-neutral-500">{cert.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

