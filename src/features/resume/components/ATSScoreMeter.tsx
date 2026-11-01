'use client';

import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, FileSearch, Gauge, Lightbulb, ShieldCheck, Target } from 'lucide-react';
import { useCareerStore } from '../lib/store';
import { analyzeResume } from '../lib/ats-analysis';

const scoreLabel = (score: number) => score >= 80 ? 'Strong foundation' : score >= 60 ? 'Good progress' : score >= 40 ? 'Room to improve' : 'Add more resume detail';

export const ATSScoreMeter = () => {
  const { resume } = useCareerStore();
  const [jobDescription, setJobDescription] = useState('');
  const analysis = useMemo(() => analyzeResume(resume, jobDescription), [resume, jobDescription]);

  return <section className="ats-workspace" aria-labelledby="ats-title">
    <header className="ats-intro">
      <div>
        <span className="ats-eyebrow"><ShieldCheck size={14}/> Resume quality check</span>
        <h2 id="ats-title">Make your resume easier to find and read.</h2>
        <p>Review your current resume structure, then compare it with a role description. This on-device estimate updates as your resume changes.</p>
      </div>
      <span className="ats-private-note"><ShieldCheck size={14}/> Analysis stays in this browser</span>
    </header>

    <div className="ats-top-grid">
      <article className="ats-score-card">
        <div className="ats-score-ring" style={{ '--ats-score': analysis.score } as React.CSSProperties}>
          <div><strong>{analysis.score}</strong><span>out of 100</span></div>
        </div>
        <div className="ats-score-copy">
          <span className="ats-score-kicker">Resume score</span>
          <h3>{scoreLabel(analysis.score)}</h3>
          <p>{analysis.jobMatchAvailable ? 'Includes role-specific keyword coverage.' : 'Baseline score from the resume details currently available.'}</p>
        </div>
        <div className="ats-score-facts"><span><strong>{analysis.wordCount}</strong> words</span><span><strong>{analysis.bulletCount}</strong> achievement bullets</span></div>
      </article>

      <article className="ats-jd-card">
        <div className="ats-card-heading"><span className="ats-icon-box"><Target size={17}/></span><div><h3>Match a job description</h3><p>See which role requirements your resume already mentions.</p></div></div>
        <label className="ats-jd-label" htmlFor="ats-job-description">Paste the job description</label>
        <textarea id="ats-job-description" value={jobDescription} onChange={event => setJobDescription(event.target.value)} placeholder="Paste the role requirements here. Matching happens locally as you type." rows={5}/>
        <div className="ats-jd-footer"><span>{jobDescription.trim().length} characters</span>{analysis.jobMatchAvailable ? <strong className="ats-match-ready"><CheckCircle2 size={14}/> {analysis.breakdown.keywordMatch}% keyword coverage</strong> : <span>Add role text to calculate keyword coverage</span>}</div>
      </article>
    </div>

    <div className="ats-metric-grid" aria-label="Resume analysis scores">
      {[
        { label: 'Role keywords', value: analysis.breakdown.keywordMatch, detail: analysis.jobMatchAvailable ? `${analysis.matchedKeywords.length} matched` : 'Add a job description', icon: Target },
        { label: 'Section coverage', value: analysis.breakdown.sectionCoverage, detail: `${analysis.sectionChecks.filter(section => section.complete).length} of ${analysis.sectionChecks.length} sections`, icon: FileSearch },
        { label: 'Action verbs', value: analysis.breakdown.actionVerbStrength, detail: `${analysis.actionVerbCount} bullets start with an action`, icon: Gauge },
        { label: 'Measurable impact', value: analysis.breakdown.quantifiableMetrics, detail: `${analysis.quantifiedBulletCount} bullets include evidence`, icon: CheckCircle2 },
        { label: 'Formatting', value: analysis.breakdown.formattingQuality, detail: analysis.formattingAlerts.length ? `${analysis.formattingAlerts.length} checks to review` : 'Contact and sections look clear', icon: ShieldCheck },
        { label: 'Bullet readability', value: analysis.breakdown.readability, detail: analysis.bulletCount ? 'Based on achievement length' : 'Add achievement bullets', icon: Lightbulb },
      ].map(({ label, value, detail, icon: Icon }) => <article className="ats-metric-card" key={label}>
        <div className="ats-metric-top"><span className="ats-icon-box"><Icon size={16}/></span><span>{value === null ? '—' : `${value}%`}</span></div>
        <strong>{label}</strong><small>{detail}</small>
        <div className="ats-meter"><i style={{ width: `${value ?? 0}%` }}/></div>
      </article>)}
    </div>

    <div className="ats-detail-grid">
      <article className="ats-detail-card">
        <div className="ats-card-heading"><span className="ats-icon-box"><FileSearch size={17}/></span><div><h3>Section review</h3><p>Standard sections help recruiters scan the important details.</p></div></div>
        <div className="ats-section-list">{analysis.sectionChecks.map(section => <div key={section.label} className="ats-section-row"><span className={section.complete ? 'ats-check-icon complete' : 'ats-check-icon'}>{section.complete ? <CheckCircle2 size={16}/> : <AlertCircle size={16}/>}</span><span><strong>{section.label}</strong><small>{section.detail}</small></span><em>{section.complete ? 'Added' : 'Missing'}</em></div>)}</div>
      </article>

      <article className="ats-detail-card">
        <div className="ats-card-heading"><span className="ats-icon-box"><Lightbulb size={17}/></span><div><h3>Next improvements</h3><p>Use these prompts to strengthen your real experience.</p></div></div>
        {analysis.suggestions.length ? <ul className="ats-suggestions">{analysis.suggestions.slice(0, 6).map((suggestion, index) => <li key={`${index}-${suggestion}`}><span>{String(index + 1).padStart(2, '0')}</span>{suggestion}</li>)}</ul> : <div className="ats-empty-check"><CheckCircle2 size={18}/><span>Your current resume covers the main structural checks.</span></div>}
        {analysis.jobMatchAvailable && <div className="ats-keyword-block"><h4>Keywords to review</h4>{analysis.missingKeywords.length ? <div className="ats-keyword-list">{analysis.missingKeywords.map(keyword => <span className="missing" key={keyword}>{keyword}</span>)}</div> : <p>Every detected job-description keyword appears in your resume.</p>}</div>}
      </article>
    </div>
    <p className="ats-method-note">Scores are practical writing checks, not a guarantee of hiring outcomes. Only add keywords and metrics that accurately reflect your experience.</p>
  </section>;
};
