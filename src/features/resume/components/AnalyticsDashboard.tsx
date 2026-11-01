'use client';

import { BarChart3, BriefcaseBusiness, FileCheck2, Gauge, Target } from 'lucide-react';
import { useCareerStore } from '../lib/store';
import { analyzeResume, getResumeSectionCoverage } from '../lib/ats-analysis';
import type { ApplicationStatus } from '../types';

const stages: { status: ApplicationStatus; label: string }[] = [
  { status: 'APPLIED', label: 'Applied' },
  { status: 'SCREENING', label: 'Screening' },
  { status: 'TECHNICAL_INTERVIEW', label: 'Interview' },
  { status: 'OFFER', label: 'Offer' },
];

export const AnalyticsDashboard = () => {
  const { resume, applications } = useCareerStore();
  const ats = analyzeResume(resume);
  const completion = getResumeSectionCoverage(resume);
  const scoredApplications = applications.filter(application => typeof application.matchScore === 'number');
  const averageMatch = scoredApplications.length
    ? Math.round(scoredApplications.reduce((sum, application) => sum + (application.matchScore ?? 0), 0) / scoredApplications.length)
    : null;
  const activeApplications = applications.filter(application => !['REJECTED', 'WISHLIST'].includes(application.status)).length;
  const maxStageCount = Math.max(1, ...stages.map(stage => applications.filter(application => application.status === stage.status).length));

  const stats = [
    { label: 'Resume completeness', value: `${completion}%`, detail: 'Core sections filled', icon: FileCheck2, progress: completion },
    { label: 'ATS readiness', value: `${ats.score}/100`, detail: 'Current resume structure', icon: Gauge, progress: ats.score },
    { label: 'Active applications', value: String(activeApplications), detail: `${applications.length} total in your pipeline`, icon: BriefcaseBusiness, progress: applications.length ? Math.round(activeApplications / applications.length * 100) : 0 },
    { label: 'Average role match', value: averageMatch === null ? '—' : `${averageMatch}%`, detail: scoredApplications.length ? 'Across scored applications' : 'Add a role to see your match', icon: Target, progress: averageMatch ?? 0 },
  ];

  return <section className="analytics-workspace" aria-labelledby="analytics-title">
    <header className="analytics-intro"><span><BarChart3 size={15}/> Workspace analytics</span><h2 id="analytics-title">A clear view of your career progress.</h2><p>Metrics are calculated from the resume and applications saved in this browser.</p></header>
    <div className="analytics-stat-grid">{stats.map(({ label, value, detail, icon: Icon, progress }) => <article className="analytics-stat-card" key={label}><div className="analytics-stat-top"><span className="analytics-stat-icon"><Icon size={17}/></span><span>{label}</span></div><strong>{value}</strong><small>{detail}</small><div className="analytics-progress"><i style={{ width: `${progress}%` }}/></div></article>)}</div>
    <article className="analytics-pipeline-card"><div className="analytics-card-heading"><div><span>APPLICATION PIPELINE</span><h3>Progress by stage</h3></div><span className="analytics-total"><strong>{applications.length}</strong> tracked</span></div>
      {applications.length ? <div className="analytics-stage-list">{stages.map(stage => {
        const count = applications.filter(application => application.status === stage.status).length;
        const percent = Math.round(count / applications.length * 100);
        return <div className="analytics-stage" key={stage.status}><div className="analytics-stage-heading"><span>{stage.label}</span><strong>{count}<small> · {percent}%</small></strong></div><div className="analytics-stage-track"><i style={{ width: `${count ? Math.max(5, count / maxStageCount * 100) : 0}%` }}/></div></div>;
      })}</div> : <div className="analytics-empty"><BriefcaseBusiness size={20}/><strong>No applications to analyze yet</strong><span>Add an opportunity in Job applications to see your pipeline.</span></div>}
    </article>
    <p className="analytics-note">Views, downloads, and historical trends will appear when those events are recorded. No activity figures are estimated.</p>
  </section>;
};
