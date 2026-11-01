'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { ResumeData } from '../types';
import { useCareerStore } from '../lib/store';
import { blankResumeStarter, copyResume, demoResume } from '../lib/demo-resume';
import { DEFAULT_TEMPLATE_ID, templates } from '../lib/templates';
import {
  Activity, AlignLeft, ArrowLeft, ArrowRight, Award, BookOpen, BriefcaseBusiness,
  Check, CheckCircle2, ChevronDown, Circle, Code2, Download, FileText, GraduationCap,
  Lightbulb, Plus, Sparkles, Trophy, UserRound, UsersRound, WandSparkles, X,
} from 'lucide-react';

const steps = [
  { label: 'Personal info', icon: UserRound, description: 'Add the contact details and links you want recruiters to find.' },
  { label: 'Career objective', icon: AlignLeft, description: 'Introduce your direction, strengths, and the role you are working toward.' },
  { label: 'Education', icon: GraduationCap, description: 'Show your qualification, institution, dates, and academic highlights.' },
  { label: 'Technical skills', icon: Code2, description: 'Group your skills into clear categories so they are easy to scan.' },
  { label: 'Experience', icon: BriefcaseBusiness, description: 'Describe what you owned, how you did it, and the impact you can prove.' },
  { label: 'Projects', icon: Code2, description: 'Give important projects their own space, links, tools, and outcomes.' },
  { label: 'Research', icon: BookOpen, description: 'Add publications, papers, conference work, or independent research.' },
  { label: 'Achievements', icon: Trophy, description: 'Highlight hackathons, awards, ranks, and meaningful milestones.' },
  { label: 'Certifications', icon: Award, description: 'List credentials with the issuer, date, and a verification link.' },
  { label: 'Leadership', icon: UsersRound, description: 'Include campus roles, volunteering, and community leadership.' },
  { label: 'Review', icon: CheckCircle2, description: 'Check your sections, evidence coverage, and final resume layout.' },
];

const inputClass = 'builder-input';
const labelClass = 'builder-label';
const newId = () => crypto.randomUUID();
const splitLines = (value: string) => value.split('\n').map(item => item.trim()).filter(Boolean);
const splitComma = (value: string) => value.split(',').map(item => item.trim()).filter(Boolean);
const normalizeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : `https://${value}`;

function TextField({ label, value, onChange, placeholder, wide = false, hint, type = 'text' }: {
  label: string; value?: string; onChange: (value: string) => void; placeholder?: string;
  wide?: boolean; hint?: string; type?: string;
}) {
  return <label className={`${labelClass}${wide ? ' field-wide' : ''}`}>{label}{hint && <span className="label-hint">{hint}</span>}
    <input className={inputClass} type={type} value={value ?? ''} onChange={event => onChange(event.target.value)} placeholder={placeholder}/>
  </label>;
}

function TextAreaField({ label, value, onChange, placeholder, rows = 4, hint, wide = false }: {
  label: string; value?: string; onChange: (value: string) => void; placeholder?: string;
  rows?: number; hint?: string; wide?: boolean;
}) {
  return <label className={`${labelClass}${wide ? ' field-wide' : ''}`}>{label}{hint && <span className="label-hint">{hint}</span>}
    <textarea className={`${inputClass} summary-input`} rows={rows} value={value ?? ''} onChange={event => onChange(event.target.value)} placeholder={placeholder}/>
  </label>;
}

function EntryCard({ title, index, onRemove, children }: { title: string; index: number; onRemove: () => void; children: ReactNode }) {
  return <article className="experience-editor"><div className="experience-card-heading"><span className="experience-index">{String(index + 1).padStart(2, '0')}</span><span>{title} {index + 1}</span><button aria-label={`Remove ${title.toLowerCase()} ${index + 1}`} onClick={onRemove}><X size={15}/></button></div>{children}</article>;
}

function ResumeLink({ href, children }: { href: string; children: ReactNode }) {
  if (!href) return <>{children}</>;
  return <a href={normalizeUrl(href)} target="_blank" rel="noreferrer">{children}</a>;
}

export function ResumeBuilder() {
  const { resume, setResume, selectedTemplate, setSelectedTemplate, setActiveTab } = useCareerStore();
  const [step, setStep] = useState(0);
  const template = templates.find(item => item.id === selectedTemplate) ?? templates.find(item => item.id === DEFAULT_TEMPLATE_ID)!;
  const templateBaseId = template.id.replace(/-(?:no-photo|photo)$/, '');
  const accent = resume.themeColor || template.accent;
  const showPhoto = template.photoMode === 'with';
  const experiences = resume.experiences ?? [];
  const education = resume.education ?? [];
  const skills = resume.skills ?? [];
  const projects = resume.projects ?? [];
  const research = resume.research ?? [];
  const achievements = resume.achievements ?? [];
  const certifications = resume.certifications ?? [];
  const leadership = resume.leadership ?? [];
  const objective = resume.objective ?? resume.summary ?? '';
  const skillGroups = useMemo(() => resume.skillGroups?.length
    ? resume.skillGroups
    : skills.length ? [{ id: 'general-skills', category: 'Technical skills', skills }] : [], [resume.skillGroups, skills]);
  const allBullets = [...experiences.flatMap(item => item.bullets ?? []), ...projects.flatMap(item => item.bullets ?? []), ...research.flatMap(item => item.details ?? [])].filter(Boolean);
  const evidenceBullets = allBullets.filter(item => /\d|%|\$|\b(users|customers|teams|projects|minutes|hours|days|weeks|months|years|records|requests)\b/i.test(item));
  const proofCoverage = allBullets.length ? Math.round(evidenceBullets.length / allBullets.length * 100) : 0;
  const completenessItems = [
    Boolean(resume.name && resume.targetTitle && resume.email), Boolean(objective), education.length > 0,
    skillGroups.some(group => group.skills.length > 0), experiences.some(item => item.role),
    projects.length > 0, research.length > 0, achievements.length > 0, certifications.length > 0, leadership.length > 0,
  ];
  const completeness = Math.round(completenessItems.filter(Boolean).length / completenessItems.length * 100);

  const switchResume = (profile: ResumeData, label: string, templateId: string) => {
    const hasResumeContent = Boolean(resume.email || resume.phone || resume.location || resume.phoneLocation || resume.website || resume.objective || resume.summary)
      || experiences.length > 0 || education.length > 0 || projects.length > 0 || skillGroups.length > 0
      || research.length > 0 || achievements.length > 0 || certifications.length > 0 || leadership.length > 0;
    if (hasResumeContent && JSON.stringify(resume) !== JSON.stringify(profile)
      && !window.confirm(`Replace the current resume with ${label}?`)) return;
    setResume(copyResume(profile));
    setSelectedTemplate(templateId);
    setStep(0);
  };

  const uploadPhoto = (file?: File) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      window.alert('Choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > 1024 * 1024) {
      window.alert('Choose an image smaller than 1 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') setResume({ photoUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const setSkillGroups = (groups: typeof skillGroups) => setResume({ skillGroups: groups, skills: groups.flatMap(group => group.skills) });
  const updateExperience = (id: string, patch: Partial<(typeof experiences)[number]>) => setResume({ experiences: experiences.map(item => item.id === id ? { ...item, ...patch } : item) });
  const addExperience = () => setResume({ experiences: [...experiences, { id: newId(), role: '', companyPeriod: '', url: '', urlLabel: '', bullets: [''] }] });
  const addEducation = () => setResume({ education: [...education, { degree: '', institution: '', yearHonor: '', location: '', performance: '' }] });
  const addProject = () => setResume({ projects: [...projects, { id: newId(), name: '', liveUrl: '', githubUrl: '', techStack: [], bullets: [''] }] });
  const addResearch = () => setResume({ research: [...research, { id: newId(), title: '', publication: '', paperId: '', details: [''] }] });
  const addAchievement = () => setResume({ achievements: [...achievements, { id: newId(), title: '', award: '', details: [''] }] });
  const addCertification = () => setResume({ certifications: [...certifications, { id: newId(), name: '', issuer: '', date: '', url: '' }] });
  const addLeadership = () => setResume({ leadership: [...leadership, { id: newId(), role: '', organization: '', description: '' }] });

  const renderStep = () => {
    if (step === 0) return <div className="field-grid">
      <TextField label="Full name" value={resume.name} onChange={name => setResume({ name })} placeholder="e.g. Jordan Lee"/>
      <TextField label="Target job title" value={resume.targetTitle} onChange={targetTitle => setResume({ targetTitle })} placeholder="e.g. Software Engineer"/>
      <TextField label="Email address" type="email" value={resume.email} onChange={email => setResume({ email })} placeholder="you@example.com"/>
      <TextField label="Phone number" type="tel" value={resume.phone} onChange={phone => setResume({ phone })} placeholder="+1 (555) 010-0199"/>
      <TextField label="Location" value={resume.location} onChange={location => setResume({ location })} placeholder="City, Country"/>
      <TextField label="Portfolio or personal website" value={resume.website} onChange={website => setResume({ website })} placeholder="yourportfolio.com"/>
      <TextField label="LinkedIn profile" value={resume.linkedin} onChange={linkedin => setResume({ linkedin })} placeholder="linkedin.com/in/yourname"/>
      <TextField label="GitHub profile" value={resume.github} onChange={github => setResume({ github })} placeholder="github.com/yourname"/>
      <div className="photo-control field-wide"><div><strong>Resume profile photo</strong><small>Optional. It appears only with a “Photo” template. Use a clear head-and-shoulders crop.</small></div><div className="photo-control-actions">{resume.photoUrl && <img src={resume.photoUrl} alt="Selected resume portrait"/>}<label className="photo-upload">Upload photo<input type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload profile photo" onChange={event => { uploadPhoto(event.currentTarget.files?.[0]); event.currentTarget.value = ''; }}/></label>{resume.photoUrl && <button type="button" className="photo-toggle" onClick={() => setResume({ photoUrl: '' })}>Remove photo</button>}</div></div>
      <div className="ai-tip field-wide"><Lightbulb size={17}/><span><strong>Photo-ready by design</strong> The photo is optional and appears in the live preview and export when enabled.</span></div>
    </div>;

    if (step === 1) return <div className="step-content"><div className="ai-tip"><Lightbulb size={17}/><span><strong>Objective, not a biography</strong> Write 2–4 lines about the role you want, strengths you bring, and the kind of contribution you can make.</span></div><TextAreaField label="Career objective" value={objective} onChange={value => setResume({ objective: value, summary: value })} placeholder="Early-career engineer interested in…" rows={8} wide/><button className="ai-write-button" onClick={() => setResume({ objective: `Motivated ${resume.targetTitle || 'professional'} seeking to contribute strengths in [your strongest skills] to [the kind of team or work you want]. Bring experience in [relevant project or experience] and a focus on [measurable value you can offer].`, summary: `Motivated ${resume.targetTitle || 'professional'} seeking to contribute strengths in [your strongest skills] to [the kind of team or work you want]. Bring experience in [relevant project or experience] and a focus on [measurable value you can offer].` })}><WandSparkles size={15}/> Draft an editable starter</button><span className="label-hint">The starter uses fill-in prompts so it never invents your experience.</span></div>;

    if (step === 2) return <div className="step-content experience-list">{education.map((item, index) => <EntryCard key={`${item.institution}-${index}`} title="Education" index={index} onRemove={() => setResume({ education: education.filter((_, i) => i !== index) })}><div className="field-grid"><TextField label="Degree / qualification" value={item.degree} onChange={value => setResume({ education: education.map((row, i) => i === index ? { ...row, degree: value } : row) })}/><TextField label="School / institution" value={item.institution} onChange={value => setResume({ education: education.map((row, i) => i === index ? { ...row, institution: value } : row) })}/><TextField label="Dates / graduation year" value={item.yearHonor} onChange={value => setResume({ education: education.map((row, i) => i === index ? { ...row, yearHonor: value } : row) })}/><TextField label="Location" value={item.location} onChange={value => setResume({ education: education.map((row, i) => i === index ? { ...row, location: value } : row) })}/><TextField label="Academic performance / honors" value={item.performance} onChange={value => setResume({ education: education.map((row, i) => i === index ? { ...row, performance: value } : row) })} wide placeholder="GPA, distinction, scholarship, etc."/></div></EntryCard>)}<button className="add-entry" onClick={addEducation}><Plus size={16}/> Add education</button></div>;

    if (step === 3) return <div className="step-content experience-list">{skillGroups.map((group, index) => <EntryCard key={group.id} title="Skill group" index={index} onRemove={() => setSkillGroups(skillGroups.filter(item => item.id !== group.id))}><div className="field-grid"><TextField label="Category" value={group.category} onChange={category => setSkillGroups(skillGroups.map(item => item.id === group.id ? { ...item, category } : item))} placeholder="Programming, Frontend, Analytics…" wide/><TextAreaField label="Skills" value={group.skills.join(', ')} onChange={value => setSkillGroups(skillGroups.map(item => item.id === group.id ? { ...item, skills: splitComma(value) } : item))} hint="Separate with commas" placeholder="TypeScript, React, SQL…" rows={3} wide/></div><div className="skill-chip-list">{group.skills.map(skill => <span key={skill}>{skill}</span>)}</div></EntryCard>)}<button className="add-entry" onClick={() => setSkillGroups([...skillGroups, { id: newId(), category: '', skills: [] }])}><Plus size={16}/> Add skill category</button><div className="ai-tip"><Sparkles size={16}/><span><strong>Use job-description language</strong> Keep categories focused and include only skills you can confidently discuss.</span></div></div>;

    if (step === 4) return <div className="step-content experience-list">{experiences.map((item, index) => <EntryCard key={item.id} title="Role" index={index} onRemove={() => setResume({ experiences: experiences.filter(row => row.id !== item.id) })}><div className="field-grid"><TextField label="Role / position" value={item.role} onChange={value => updateExperience(item.id, { role: value })}/><TextField label="Organization & dates" value={item.companyPeriod} onChange={value => updateExperience(item.id, { companyPeriod: value })} placeholder="Organization · 2024–Present"/><TextField label="Organization / proof link" value={item.url} onChange={value => updateExperience(item.id, { url: value })} placeholder="LinkedIn, internship proof, or company page"/><TextField label="Link label" value={item.urlLabel} onChange={value => updateExperience(item.id, { urlLabel: value })} placeholder="LinkedIn, Proof post…"/><TextAreaField label="Achievements & responsibilities" value={(item.bullets ?? []).join('\n')} onChange={value => updateExperience(item.id, { bullets: splitLines(value) })} hint="One detail per line. Add tools, scope, evidence, and outcome." rows={5} wide/></div></EntryCard>)}<button className="add-entry" onClick={addExperience}><Plus size={16}/> Add experience or entrepreneurship</button><div className="ai-tip"><Lightbulb size={17}/><span><strong>Evidence-first writing</strong> For each line, add a clear action, scope or tool, and an outcome you can back up. The proof check on the preview flags bullets that may need evidence.</span></div></div>;

    if (step === 5) return <div className="step-content experience-list">{projects.map((item, index) => <EntryCard key={item.id} title="Project" index={index} onRemove={() => setResume({ projects: projects.filter(row => row.id !== item.id) })}><div className="field-grid"><TextField label="Project name" value={item.name} onChange={value => setResume({ projects: projects.map(row => row.id === item.id ? { ...row, name: value } : row) })}/><TextField label="Technology stack" value={(item.techStack ?? []).join(', ')} onChange={value => setResume({ projects: projects.map(row => row.id === item.id ? { ...row, techStack: splitComma(value) } : row) })} placeholder="React, Python, PostgreSQL"/><TextField label="Live project URL" value={item.liveUrl} onChange={value => setResume({ projects: projects.map(row => row.id === item.id ? { ...row, liveUrl: value } : row) })}/><TextField label="GitHub repository" value={item.githubUrl} onChange={value => setResume({ projects: projects.map(row => row.id === item.id ? { ...row, githubUrl: value } : row) })}/><TextAreaField label="What you built & its impact" value={(item.bullets ?? []).join('\n')} onChange={value => setResume({ projects: projects.map(row => row.id === item.id ? { ...row, bullets: splitLines(value) } : row) })} hint="One detail per line" rows={4} wide/></div></EntryCard>)}<button className="add-entry" onClick={addProject}><Plus size={16}/> Add project</button></div>;

    if (step === 6) return <div className="step-content experience-list">{research.map((item, index) => <EntryCard key={item.id} title="Research" index={index} onRemove={() => setResume({ research: research.filter(row => row.id !== item.id) })}><div className="field-grid"><TextField label="Paper / research title" value={item.title} onChange={value => setResume({ research: research.map(row => row.id === item.id ? { ...row, title: value } : row) })} wide/><TextField label="Publication / conference" value={item.publication} onChange={value => setResume({ research: research.map(row => row.id === item.id ? { ...row, publication: value } : row) })}/><TextField label="Paper ID / DOI" value={item.paperId} onChange={value => setResume({ research: research.map(row => row.id === item.id ? { ...row, paperId: value } : row) })}/><TextAreaField label="Contribution or findings" value={(item.details ?? []).join('\n')} onChange={value => setResume({ research: research.map(row => row.id === item.id ? { ...row, details: splitLines(value) } : row) })} rows={4} wide/></div></EntryCard>)}<button className="add-entry" onClick={addResearch}><Plus size={16}/> Add research or publication</button></div>;

    if (step === 7) return <div className="step-content experience-list">{achievements.map((item, index) => <EntryCard key={item.id} title="Achievement" index={index} onRemove={() => setResume({ achievements: achievements.filter(row => row.id !== item.id) })}><div className="field-grid"><TextField label="Hackathon / achievement" value={item.title} onChange={value => setResume({ achievements: achievements.map(row => row.id === item.id ? { ...row, title: value } : row) })}/><TextField label="Rank / award" value={item.award} onChange={value => setResume({ achievements: achievements.map(row => row.id === item.id ? { ...row, award: value } : row) })}/><TextAreaField label="Details" value={(item.details ?? []).join('\n')} onChange={value => setResume({ achievements: achievements.map(row => row.id === item.id ? { ...row, details: splitLines(value) } : row) })} rows={3} wide/></div></EntryCard>)}<button className="add-entry" onClick={addAchievement}><Plus size={16}/> Add achievement or event</button></div>;

    if (step === 8) return <div className="step-content experience-list">{certifications.map((item, index) => <EntryCard key={item.id} title="Certification" index={index} onRemove={() => setResume({ certifications: certifications.filter(row => row.id !== item.id) })}><div className="field-grid"><TextField label="Certification / event" value={item.name} onChange={value => setResume({ certifications: certifications.map(row => row.id === item.id ? { ...row, name: value } : row) })}/><TextField label="Issuer" value={item.issuer} onChange={value => setResume({ certifications: certifications.map(row => row.id === item.id ? { ...row, issuer: value } : row) })}/><TextField label="Date" value={item.date} onChange={value => setResume({ certifications: certifications.map(row => row.id === item.id ? { ...row, date: value } : row) })}/><TextField label="Credential URL" value={item.url} onChange={value => setResume({ certifications: certifications.map(row => row.id === item.id ? { ...row, url: value } : row) })}/></div></EntryCard>)}<button className="add-entry" onClick={addCertification}><Plus size={16}/> Add certification</button></div>;

    if (step === 9) return <div className="step-content experience-list">{leadership.map((item, index) => <EntryCard key={item.id} title="Leadership role" index={index} onRemove={() => setResume({ leadership: leadership.filter(row => row.id !== item.id) })}><div className="field-grid"><TextField label="Role" value={item.role} onChange={value => setResume({ leadership: leadership.map(row => row.id === item.id ? { ...row, role: value } : row) })}/><TextField label="Organization / campus" value={item.organization} onChange={value => setResume({ leadership: leadership.map(row => row.id === item.id ? { ...row, organization: value } : row) })}/><TextAreaField label="What you led or contributed" value={item.description} onChange={value => setResume({ leadership: leadership.map(row => row.id === item.id ? { ...row, description: value } : row) })} rows={4} wide/></div></EntryCard>)}<button className="add-entry" onClick={addLeadership}><Plus size={16}/> Add leadership or campus role</button></div>;

    const checks = [
      ['Personal information', Boolean(resume.name && resume.targetTitle && resume.email)], ['Career objective', Boolean(objective)],
      ['Education', education.length > 0], ['Technical skills', skillGroups.some(group => group.skills.length > 0)],
      ['Experience', experiences.length > 0], ['Projects', projects.length > 0], ['Research & publications', research.length > 0],
      ['Achievements', achievements.length > 0], ['Certifications', certifications.length > 0], ['Leadership', leadership.length > 0],
    ];
    return <div className="review-panel"><div className="review-score"><span>{completeness}%</span><div><strong>{completeness > 80 ? 'A strong foundation' : 'Your resume is taking shape'}</strong><small>Saved automatically in this browser.</small></div></div><div className="review-checks">{checks.map(([label, done], index) => { const Icon = steps[index].icon; return <button key={label as string} onClick={() => setStep(index)}><Icon size={16}/><span>{label as string}</span>{done ? <CheckCircle2 size={17} className="review-done"/> : <Circle size={17} className="review-pending"/>}</button>; })}</div><div className="proof-check"><div><span>Impact proof check</span><strong>{proofCoverage}%</strong></div><p>{allBullets.length ? `${evidenceBullets.length} of ${allBullets.length} details include a number, scale, or concrete evidence. Add proof where it is accurate.` : 'Add experience, project, or research details to see how many include measurable evidence.'}</p></div><button className="finish-button" onClick={() => window.print()}><Download size={16}/> Print or save as PDF</button></div>;
  };

  return <div className="resume-workflow">
    <div className="builder-intro"><div><div className="builder-kicker"><Sparkles size={13}/> APX RESUME</div><h2>Let’s build a resume that opens doors.</h2><p>Explore a fictional sample to see each section, or start with a blank resume. Replace all sample content with your own details.</p></div><div className="builder-intro-actions"><button className="demo-profile-button" onClick={() => switchResume(demoResume, 'the sample resume', DEFAULT_TEMPLATE_ID)}><FileText size={14}/> Load sample resume</button><button className="demo-profile-secondary" onClick={() => switchResume(blankResumeStarter, 'a blank resume', DEFAULT_TEMPLATE_ID)}><UserRound size={14}/> Start blank</button><button className="template-change" onClick={() => setActiveTab('templates')}><span className="mini-doc" style={{ '--doc-accent': accent } as CSSProperties}><i/><i/><i/></span><span><small>YOUR TEMPLATE</small><strong>{template.name}</strong></span><ChevronDown size={15}/></button></div></div>

    <div className="progress-card"><div className="step-track" aria-label="Resume progress">{steps.map(({ label, icon: Icon }, index) => <button key={label} className={`step-item${index === step ? ' current' : ''}${index < step ? ' complete' : ''}`} onClick={() => setStep(index)} aria-current={index === step ? 'step' : undefined}><span className="step-bubble">{index < step ? <Check size={14}/> : <Icon size={14}/>}</span><span>{label}</span></button>)}</div><div className="progress-meter"><span style={{ width: `${Math.max(completeness, 8)}%` }}/></div><div className="progress-caption"><span><strong>{completeness}%</strong> profile completeness</span><span>Step {step + 1} of {steps.length}</span></div></div>

    <div className="builder-layout"><section className="editor-column" aria-label="Resume editor"><div className="editor-panel"><div className="editor-heading"><div><span className="editor-step-label">STEP {String(step + 1).padStart(2, '0')} OF {String(steps.length).padStart(2, '0')}</span><h3>{steps[step].label}</h3><p>{steps[step].description}</p></div><div className="editor-progress-number">{String(step + 1).padStart(2, '0')}<span>/{String(steps.length).padStart(2, '0')}</span></div></div>{renderStep()}<div className="editor-footer"><button className="step-back" onClick={() => setStep(current => Math.max(0, current - 1))} disabled={step === 0}><ArrowLeft size={15}/> Back</button>{step < steps.length - 1 ? <button className="step-next" onClick={() => setStep(current => Math.min(steps.length - 1, current + 1))}>Continue <ArrowRight size={15}/></button> : <button className="step-next" onClick={() => setActiveTab('templates')}>Change design <ArrowRight size={15}/></button>}</div></div><div className="privacy-strip"><Activity size={14}/><span>Your resume is automatically saved in this browser.</span><span className="save-dot"><i/>Saved</span></div></section>

    <section className="preview-column" aria-label="Live resume preview">
      <div className="preview-toolbar"><div><strong>Live preview</strong><span>Updates as you write · {template.name}</span></div><div className="preview-actions"><button onClick={() => setActiveTab('templates')}>Change template</button><button className="preview-download" onClick={() => window.print()}><Download size={14}/> Download PDF</button></div></div>
      <div className="resume-paper-wrap"><article id="printable-resume" className={`resume-paper template-${template.layout} template-family-${templateBaseId} template-mode-${template.photoMode}`} style={{ '--resume-accent': accent, '--resume-font': template.font } as CSSProperties}>
        <header className={`resume-paper-header${showPhoto ? ' has-profile-photo' : ''}`}>
          {showPhoto && (resume.photoUrl
            ? <img className="resume-profile-photo" src={resume.photoUrl} alt={`${resume.name || 'Resume'} profile portrait`}/>
            : <span className="resume-photo-placeholder" aria-label="Photo placeholder">{(resume.name || 'Your Name').split(/\s+/).slice(0, 2).map(name => name[0]).join('').toUpperCase()}</span>)}
          <div className="resume-header-copy"><h1>{resume.name || 'Your name'}</h1><p>{resume.targetTitle || 'Your professional title'}</p><div className="resume-contact">
            {resume.location && <span>{resume.location}</span>}
            {resume.phone && <><i>·</i><span>{resume.phone}</span></>}
            {resume.email && <><i>·</i><span><strong>Email:</strong> {resume.email}</span></>}
            {resume.linkedin && <><i>·</i><span><strong>LinkedIn:</strong> <ResumeLink href={resume.linkedin}>{resume.linkedin}</ResumeLink></span></>}
            {resume.github && <><i>·</i><span><strong>GitHub:</strong> <ResumeLink href={resume.github}>{resume.github}</ResumeLink></span></>}
            {resume.website && <><i>·</i><span><strong>Portfolio:</strong> <ResumeLink href={resume.website}>{resume.website}</ResumeLink></span></>}
          </div></div>
        </header>
        {objective && <section className="resume-paper-section"><h2>Career objective</h2><p>{objective}</p></section>}
        {education.length > 0 && <section className="resume-paper-section"><h2>Education</h2>{education.map((item, index) => <div className={`resume-role${templateBaseId === 'apx-classic' ? ' resume-education' : ''}`} key={`${item.degree}-${index}`}><div className="resume-role-title"><strong>{templateBaseId === 'apx-classic' ? item.institution : item.degree}</strong><span>{item.yearHonor}</span></div><p>{templateBaseId === 'apx-classic' && item.degree ? <em>{item.degree}</em> : item.institution}{templateBaseId !== 'apx-classic' && item.location ? ` · ${item.location}` : ''}{item.performance ? ` · ${item.performance}` : ''}</p>{templateBaseId === 'apx-classic' && item.location && <p>{item.location}</p>}</div>)}</section>}
        {skillGroups.some(group => group.skills.length) && <section className="resume-paper-section"><h2>Technical skills</h2><div className="resume-skill-groups">{skillGroups.filter(group => group.skills.length).map(group => <p key={group.id}><strong>{group.category || 'Skills'}:</strong> {group.skills.join(', ')}</p>)}</div></section>}
        {experiences.length > 0 && <section className="resume-paper-section"><h2>Experience & entrepreneurship</h2>{experiences.filter(item => item.role || item.companyPeriod).map(item => <div className="resume-role" key={item.id}><div className="resume-role-title"><strong>{item.role}</strong><span>{item.companyPeriod}{item.url && <> · <ResumeLink href={item.url}>{item.urlLabel || 'Link'}</ResumeLink></>}</span></div><ul>{(item.bullets ?? []).filter(Boolean).map((bullet, index) => <li key={index}>{bullet}</li>)}</ul></div>)}</section>}
        {projects.length > 0 && <section className="resume-paper-section"><h2>Projects</h2>{projects.filter(item => item.name).map(item => <div className="resume-role" key={item.id}><div className="resume-role-title"><strong>{item.name}</strong><span>{item.liveUrl && <ResumeLink href={item.liveUrl}>Live</ResumeLink>}{item.liveUrl && item.githubUrl ? ' · ' : ''}{item.githubUrl && <ResumeLink href={item.githubUrl}>GitHub</ResumeLink>}</span></div>{(item.techStack ?? []).length > 0 && <p>Technology: {item.techStack.join(', ')}</p>}<ul>{(item.bullets ?? []).filter(Boolean).map((bullet, index) => <li key={index}>{bullet}</li>)}</ul></div>)}</section>}
        {research.length > 0 && <section className="resume-paper-section"><h2>Research & publications</h2>{research.filter(item => item.title).map(item => <div className="resume-role" key={item.id}><div className="resume-role-title"><strong>{item.title}</strong><span>{item.paperId}</span></div><p>{item.publication}</p><ul>{(item.details ?? []).filter(Boolean).map((detail, index) => <li key={index}>{detail}</li>)}</ul></div>)}</section>}
        {achievements.length > 0 && <section className="resume-paper-section"><h2>Hackathons & achievements</h2>{achievements.filter(item => item.title).map(item => <div className="resume-role" key={item.id}><div className="resume-role-title"><strong>{item.title}</strong><span>{item.award}</span></div><ul>{(item.details ?? []).filter(Boolean).map((detail, index) => <li key={index}>{detail}</li>)}</ul></div>)}</section>}
        {certifications.length > 0 && <section className="resume-paper-section"><h2>Certifications & technical events</h2>{certifications.filter(item => item.name).map(item => <div className="resume-role" key={item.id}><div className="resume-role-title"><strong><ResumeLink href={item.url}>{item.name}</ResumeLink></strong><span>{item.date}</span></div><p>{item.issuer}</p></div>)}</section>}
        {leadership.length > 0 && <section className="resume-paper-section"><h2>Leadership & campus roles</h2>{leadership.filter(item => item.role || item.organization).map(item => <div className="resume-role" key={item.id}><div className="resume-role-title"><strong>{item.role}</strong><span>{item.organization}</span></div><p>{item.description}</p></div>)}</section>}
      </article></div>
      <div className="proof-check preview-proof-check"><div><span>Impact proof check</span><strong>{proofCoverage}%</strong></div><p>{allBullets.length ? `${evidenceBullets.length} of ${allBullets.length} details include measurable evidence.` : 'Add experience or project details to see your proof coverage.'}</p></div>
      <div className="preview-tip"><CheckCircle2 size={15}/><span><strong>ATS-friendly structure</strong> — consistent headings, readable text, and a clean one-column layout.</span></div><div className="accent-picker"><span>Template colour</span>{['#263d5b', '#2d63a8', '#218264', '#c47a38', '#7758a8'].map(color => <button key={color} aria-label={`Set template colour ${color}`} className={accent === color ? 'active' : ''} style={{ backgroundColor: color }} onClick={() => setResume({ themeColor: color })}/>)}</div>
    </section></div>
  </div>;
}
