'use client';

import { ArrowRight, Award, BriefcaseBusiness, CheckCircle2, FileText, Gauge, Layers3, Mic2, Sparkles, Target } from 'lucide-react';
import { useCareerStore, type TabType } from '../lib/store';
import { getResumeSectionCoverage, analyzeResume } from '../lib/ats-analysis';
import { templates } from '../lib/templates';

const quickLinks: { tab: TabType; label: string; description: string; icon: typeof FileText }[] = [
  { tab: 'templates', label: 'Browse templates', description: 'Choose from 242 editable designs', icon: Layers3 },
  { tab: 'ats', label: 'Check ATS fit', description: 'Review keywords and structure', icon: Gauge },
  { tab: 'jobs', label: 'Track applications', description: 'Keep your search organized', icon: BriefcaseBusiness },
  { tab: 'interview', label: 'Practice interviews', description: 'Prepare for your next conversation', icon: Mic2 },
];

export function Dashboard() {
  const { resume, applications, selectedTemplate, setActiveTab } = useCareerStore();
  const completion = getResumeSectionCoverage(resume);
  const ats = analyzeResume(resume);
  const template = templates.find(item => item.id === selectedTemplate);
  const activeApplications = applications.filter(app => app.status !== 'REJECTED' && app.status !== 'WISHLIST');
  const scoredApplications = applications.filter(app => typeof app.matchScore === 'number');
  const averageMatch = scoredApplications.length
    ? Math.round(scoredApplications.reduce((sum, app) => sum + (app.matchScore ?? 0), 0) / scoredApplications.length)
    : null;
  const firstName = resume.name.trim().split(/\s+/)[0];

  return <section className="dashboard-page" aria-labelledby="dashboard-title">
    <header className="dashboard-hero">
      <div className="dashboard-hero-copy">
        <span className="dashboard-eyebrow"><Sparkles size={14}/> Your career workspace</span>
        <h1 id="dashboard-title">Build momentum{firstName ? `, ${firstName}` : ''}.</h1>
        <p>One clear place to shape your resume, prepare for opportunities, and track what comes next.</p>
        <div className="dashboard-hero-actions"><button className="dashboard-primary" onClick={() => setActiveTab('builder')}><FileText size={16}/> Continue resume <ArrowRight size={15}/></button><button className="dashboard-secondary" onClick={() => setActiveTab('templates')}>Explore templates</button></div>
      </div>
      <div className="dashboard-hero-art" aria-hidden="true"><div className="dashboard-art-orbit orbit-one"/><div className="dashboard-art-orbit orbit-two"/><div className="dashboard-art-page"><i/><i/><i/><i/><i/></div><span className="dashboard-art-spark"><Sparkles size={18}/></span></div>
    </header>

    <div className="dashboard-metrics">
      <article className="dashboard-metric"><span className="dashboard-metric-icon green"><CheckCircle2 size={17}/></span><div><small>Resume completeness</small><strong>{completion}%</strong><span>Core sections filled</span></div><div className="dashboard-mini-meter"><i style={{ width: `${completion}%` }}/></div></article>
      <article className="dashboard-metric"><span className="dashboard-metric-icon navy"><Gauge size={17}/></span><div><small>Resume readiness</small><strong>{ats.score}<em>/100</em></strong><span>Local structure estimate</span></div><div className="dashboard-mini-meter"><i style={{ width: `${ats.score}%` }}/></div></article>
      <article className="dashboard-metric"><span className="dashboard-metric-icon amber"><BriefcaseBusiness size={17}/></span><div><small>Active applications</small><strong>{activeApplications.length}</strong><span>In your job tracker</span></div><button className="dashboard-metric-link" onClick={() => setActiveTab('jobs')}>Open tracker <ArrowRight size={13}/></button></article>
      <article className="dashboard-metric"><span className="dashboard-metric-icon violet"><Target size={17}/></span><div><small>Average role match</small><strong>{averageMatch === null ? '—' : `${averageMatch}%`}</strong><span>{scoredApplications.length ? 'Across scored applications' : 'Add a job to get started'}</span></div><button className="dashboard-metric-link" onClick={() => setActiveTab('ats')}>Check a role <ArrowRight size={13}/></button></article>
    </div>

    <div className="dashboard-content-grid">
      <article className="dashboard-panel dashboard-resume-panel">
        <div className="dashboard-panel-heading"><div><span className="dashboard-section-eyebrow">Your document</span><h2>Resume in progress</h2></div><button className="dashboard-text-link" onClick={() => setActiveTab('builder')}>Open builder <ArrowRight size={14}/></button></div>
        <div className="dashboard-resume-card">
          <div className="dashboard-resume-preview" aria-hidden="true"><span>{(resume.name || 'Your Name').split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()}</span><i/><i/><i/><i/><i/><small>{template?.name ?? 'APX Classic'}</small></div>
          <div className="dashboard-resume-info"><span className="dashboard-document-label"><FileText size={13}/> Current resume</span><h3>{resume.targetTitle || 'Untitled resume'}</h3><p>{resume.name || 'Add your name'}{resume.email ? ` · ${resume.email}` : ''}</p><div className="dashboard-document-meta"><span>{template?.name ?? 'APX Classic'}</span><span>Saved in this browser</span></div><div className="dashboard-document-actions"><button className="dashboard-primary" onClick={() => setActiveTab('builder')}>Edit resume <ArrowRight size={14}/></button><button className="dashboard-secondary" onClick={() => setActiveTab('templates')}>Change template</button></div></div>
        </div>
      </article>

      <article className="dashboard-panel dashboard-checklist-panel">
        <div className="dashboard-panel-heading"><div><span className="dashboard-section-eyebrow">A clear next step</span><h2>Resume checklist</h2></div><span className="dashboard-checklist-count">{ats.sectionChecks.filter(item => item.complete).length}/{ats.sectionChecks.length}</span></div>
        <div className="dashboard-checklist">{ats.sectionChecks.map(section => <div className="dashboard-check-row" key={section.label}><span className={section.complete ? 'done' : ''}>{section.complete ? <CheckCircle2 size={16}/> : <span className="dashboard-check-empty"/>}</span><span>{section.label}</span>{!section.complete && <button onClick={() => setActiveTab('builder')}>Add</button>}</div>)}</div>
        <button className="dashboard-checklist-cta" onClick={() => setActiveTab('ats')}>Review resume quality <ArrowRight size={14}/></button>
      </article>
    </div>

    <div className="dashboard-lower-grid">
      <article className="dashboard-panel dashboard-tools-panel">
        <div className="dashboard-panel-heading"><div><span className="dashboard-section-eyebrow">Move your search forward</span><h2>Career tools</h2></div><span className="dashboard-tools-count"><Award size={14}/> Built around your next move</span></div>
        <div className="dashboard-quick-links">{quickLinks.map(({ tab, label, description, icon: Icon }) => <button key={tab} className="dashboard-quick-link" onClick={() => setActiveTab(tab)}><span><Icon size={17}/></span><strong>{label}</strong><small>{description}</small><ArrowRight className="dashboard-quick-arrow" size={15}/></button>)}</div>
      </article>
      <article className="dashboard-panel dashboard-apps-panel">
        <div className="dashboard-panel-heading"><div><span className="dashboard-section-eyebrow">Your pipeline</span><h2>Recent applications</h2></div><button className="dashboard-text-link" onClick={() => setActiveTab('jobs')}>See all <ArrowRight size={14}/></button></div>
        {applications.length ? <div className="dashboard-app-list">{applications.slice(0, 4).map(app => <div className="dashboard-app-row" key={app.id}><span className="dashboard-company-mark">{app.companyName.slice(0, 1).toUpperCase()}</span><span><strong>{app.positionTitle}</strong><small>{app.companyName}</small></span><em>{app.status.replaceAll('_', ' ').toLowerCase()}</em></div>)}</div> : <div className="dashboard-empty-apps"><BriefcaseBusiness size={18}/><p>Your job tracker is ready when you are.</p><button onClick={() => setActiveTab('jobs')}>Add an application</button></div>}
      </article>
    </div>
    <p className="dashboard-local-note">Your resume and workspace are currently saved in this browser.</p>
  </section>;
}
