'use client';

import { Search } from 'lucide-react';

export const RecruiterHub = () => {
  const candidates = [
    {
      name: 'Candidate A',
      role: 'Software Engineer',
      atsMatch: '—',
      skills: ['React', 'TypeScript'],
      status: 'Sample only',
    },
    {
      name: 'Candidate B',
      role: 'Lead ML / AI Engineer',
      atsMatch: '94%',
      skills: ['PyTorch', 'CUDA', 'LLMOps', 'Python'],
      status: 'Shortlisted',
    },
    {
      name: 'Candidate C',
      role: 'Principal Cloud Architect',
      atsMatch: '91%',
      skills: ['AWS', 'Kubernetes', 'Terraform', 'Go'],
      status: 'Technical Screen',
    },
  ];

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Talent Pipeline & Ranking</h3>
          <p className="text-xs text-neutral-400">
            Fictional sample profiles are shown here; add verified candidate details before using this pipeline.
          </p>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            placeholder="Search candidate skills..."
            className="bg-dark-850 text-xs pl-8 pr-3 py-2 rounded-lg border border-white/10 text-white focus:outline-none focus:border-brand-500 w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 text-neutral-400">
            <tr>
              <th className="py-2.5">Candidate</th>
              <th>Target Role</th>
              <th>ATS Match</th>
              <th>Core Verified Skills</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-neutral-200">
            {candidates.map((cand, i) => (
              <tr key={i}>
                <td className="py-3.5 font-semibold text-white">{cand.name}</td>
                <td>{cand.role}</td>
                <td>
                  <span className="text-brand-500 font-bold font-mono">
                    {cand.atsMatch}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1 flex-wrap">
                    {cand.skills.map((s, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-white/5 text-neutral-300 text-[10px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <span className="px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 font-medium">
                    {cand.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => alert(`Opening dossier for ${cand.name}`)}
                    className="text-brand-500 hover:underline"
                  >
                    View Dossier
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

