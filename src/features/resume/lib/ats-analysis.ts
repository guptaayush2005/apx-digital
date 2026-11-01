import type { ResumeData } from '../types';

export interface ATSSectionCheck {
  label: string;
  complete: boolean;
  detail: string;
}

export interface ATSAnalysis {
  score: number;
  breakdown: {
    keywordMatch: number | null;
    formattingQuality: number;
    actionVerbStrength: number;
    quantifiableMetrics: number;
    sectionCoverage: number;
    readability: number;
  };
  jobMatchAvailable: boolean;
  matchedKeywords: string[];
  missingKeywords: string[];
  actionVerbCount: number;
  quantifiedBulletCount: number;
  wordCount: number;
  bulletCount: number;
  formattingAlerts: string[];
  suggestions: string[];
  sectionChecks: ATSSectionCheck[];
  emailValid: boolean;
}

const STOP_WORDS = new Set(`a an and are as at be by can do for from had has have he her his how i if in into is it its may me more most must my of on or our out over she should so than that the their them then there these they this through to up us was we were what when where which who will with within without you your years year role team work experience skills responsibilities preferred required including strong ability knowledge plus using`.split(' '));
const ACTION_VERBS = new Set(`accelerated achieved adapted administered analyzed architected automated built championed collaborated consolidated created delivered designed developed devised directed drove enabled engineered established evaluated expanded improved increased initiated introduced launched led maintained managed mentored migrated modernized optimized organized owned partnered performed planned presented produced reduced refactored resolved scaled shipped simplified streamlined strengthened structured supported tested transformed`.split(' '));
const METRIC_PATTERN = /(?:\b\d+(?:\.\d+)?\s?%|\$\s?\d[\d,.]*\s?(?:k|m|b)?\b|\b\d+(?:\.\d+)?\s?(?:x|times|users|clients|customers|requests|records|engineers|hours|days|weeks|months|years|ms|seconds)\b)/i;
const TOKEN_PATTERN = /(?:c\+\+|c#|\.net|[a-z0-9]+(?:[+#./-][a-z0-9+#-]+)*)/gi;

function tokenize(value: string): string[] {
  return value.toLowerCase().match(TOKEN_PATTERN) ?? [];
}

function uniqueKeywords(value: string): string[] {
  const seen = new Set<string>();
  return tokenize(value).filter(token => {
    if (token.length < 3 && !['ai', 'go', 'r', 'c#', 'c++'].includes(token)) return false;
    if (/^\d/.test(token) || STOP_WORDS.has(token) || seen.has(token)) return false;
    seen.add(token);
    return true;
  });
}

export function getResumeSectionCoverage(resume: ResumeData): number {
  const sections = [
    Boolean(resume.name.trim() && resume.targetTitle.trim() && resume.email.trim()),
    Boolean((resume.objective || resume.summary || '').trim()),
    (resume.experiences ?? []).some(item => item.role.trim() || (item.bullets ?? []).some(Boolean)) || (resume.projects ?? []).some(item => item.name.trim()),
    (resume.education ?? []).some(item => item.degree.trim() || item.institution.trim()),
    (resume.skillGroups ?? []).some(group => group.skills.length > 0) || (resume.skills ?? []).length > 0,
    (resume.projects ?? []).some(item => item.name.trim()),
  ];
  return Math.round(sections.filter(Boolean).length / sections.length * 100);
}

export function analyzeResume(resume: ResumeData, jobDescription = ''): ATSAnalysis {
  const experiences = resume.experiences ?? [];
  const education = resume.education ?? [];
  const skillGroups = resume.skillGroups ?? [];
  const projects = resume.projects ?? [];
  const research = resume.research ?? [];
  const achievements = resume.achievements ?? [];
  const certifications = resume.certifications ?? [];
  const leadership = resume.leadership ?? [];
  const objective = (resume.objective || resume.summary || '').trim();

  const content = [
    resume.name, resume.targetTitle, resume.email, resume.phone, resume.location,
    resume.website, resume.linkedin, resume.github, objective,
    ...experiences.flatMap(item => [item.role, item.companyPeriod, ...(item.bullets ?? [])]),
    ...education.flatMap(item => [item.degree, item.institution, item.yearHonor, item.location, item.performance]),
    ...skillGroups.flatMap(group => [group.category, ...group.skills]),
    ...(resume.skills ?? []),
    ...projects.flatMap(item => [item.name, ...(item.techStack ?? []), ...(item.bullets ?? [])]),
    ...research.flatMap(item => [item.title, item.publication, ...(item.details ?? [])]),
    ...achievements.flatMap(item => [item.title, item.award, ...(item.details ?? [])]),
    ...certifications.flatMap(item => [item.name, item.issuer]),
    ...leadership.flatMap(item => [item.role, item.organization, item.description]),
  ].filter(Boolean).join('\n');
  const resumeTokens = new Set(tokenize(content));
  const bullets = [
    ...experiences.flatMap(item => item.bullets ?? []),
    ...projects.flatMap(item => item.bullets ?? []),
    ...research.flatMap(item => item.details ?? []),
    ...achievements.flatMap(item => item.details ?? []),
  ].map(item => item.trim()).filter(item => item.length > 15);
  const actionVerbCount = bullets.filter(bullet => ACTION_VERBS.has(tokenize(bullet)[0] ?? '')).length;
  const quantifiedBulletCount = bullets.filter(bullet => METRIC_PATTERN.test(bullet)).length;
  const actionVerbStrength = bullets.length ? Math.round(actionVerbCount / bullets.length * 100) : 0;
  const quantifiableMetrics = bullets.length ? Math.round(quantifiedBulletCount / bullets.length * 100) : 0;
  const words = tokenize(content);
  const averageBulletLength = bullets.length
    ? bullets.reduce((total, bullet) => total + tokenize(bullet).length, 0) / bullets.length
    : 0;
  const readability = bullets.length
    ? Math.max(20, Math.round(100 - Math.min(70, Math.abs(averageBulletLength - 18) * 2.8)))
    : 0;

  const sectionChecks: ATSSectionCheck[] = [
    { label: 'Contact details', complete: Boolean(resume.name.trim() && resume.targetTitle.trim() && resume.email.trim()), detail: 'Name, target title, and email address' },
    { label: 'Professional summary', complete: Boolean(objective), detail: 'A short introduction tailored to your target role' },
    { label: 'Experience or projects', complete: experiences.length > 0 || projects.length > 0, detail: 'Evidence of work, projects, or practical experience' },
    { label: 'Education', complete: education.length > 0, detail: 'Qualification and institution' },
    { label: 'Skills', complete: skillGroups.some(group => group.skills.length > 0) || (resume.skills ?? []).length > 0, detail: 'Specific tools and capabilities' },
    { label: 'Projects', complete: projects.length > 0, detail: 'Selected work with outcomes or links' },
  ];
  const sectionCoverage = Math.round(sectionChecks.filter(section => section.complete).length / sectionChecks.length * 100);

  const formattingAlerts: string[] = [];
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.email.trim());
  if (!resume.name.trim()) formattingAlerts.push('Add your name so recruiters can identify your resume.');
  if (!resume.email.trim()) formattingAlerts.push('Add an email address for recruiter contact.');
  else if (!emailValid) formattingAlerts.push('Check the format of your email address.');
  if (!objective) formattingAlerts.push('Add a concise professional summary or career objective.');
  if (!experiences.length && !projects.length) formattingAlerts.push('Add experience or projects to show evidence of your work.');
  if (!education.length) formattingAlerts.push('Add an education section with your qualification and institution.');
  if (!skillGroups.some(group => group.skills.length > 0) && !(resume.skills ?? []).length) formattingAlerts.push('Add relevant skills so ATS systems can match role requirements.');
  const formattingQuality = Math.max(0, 100 - formattingAlerts.length * 14);

  const jdProvided = jobDescription.trim().length > 0;
  const jdKeywords = jdProvided ? uniqueKeywords(jobDescription).slice(0, 24) : [];
  const matchedKeywords = jdKeywords.filter(keyword => resumeTokens.has(keyword));
  const missingKeywords = jdKeywords.filter(keyword => !resumeTokens.has(keyword));
  const keywordMatch = jdKeywords.length ? Math.round(matchedKeywords.length / jdKeywords.length * 100) : null;

  const baseScore = jdProvided
    ? (keywordMatch ?? 0) * 0.25 + sectionCoverage * 0.25 + formattingQuality * 0.2 + actionVerbStrength * 0.12 + quantifiableMetrics * 0.08 + readability * 0.1
    : sectionCoverage * 0.3 + formattingQuality * 0.25 + actionVerbStrength * 0.18 + quantifiableMetrics * 0.12 + readability * 0.15;

  const suggestions = [...formattingAlerts];
  if (bullets.length && actionVerbStrength < 55) suggestions.push('Start more achievement bullets with clear action verbs.');
  if (bullets.length && quantifiableMetrics < 35) suggestions.push('Add accurate scope or outcome measures where you can support them.');
  if (bullets.length && readability < 65) suggestions.push('Keep each achievement focused on one clear action and outcome.');
  if (missingKeywords.length) suggestions.push(`Review these job-description terms and add only the ones that accurately describe your experience: ${missingKeywords.slice(0, 5).join(', ')}.`);
  if (!jdProvided) suggestions.push('Paste a job description to see role-specific keyword coverage.');

  return {
    score: Math.max(0, Math.min(100, Math.round(baseScore))),
    breakdown: { keywordMatch, formattingQuality, actionVerbStrength, quantifiableMetrics, sectionCoverage, readability },
    jobMatchAvailable: Boolean(jdKeywords.length),
    matchedKeywords: matchedKeywords.slice(0, 15),
    missingKeywords: missingKeywords.slice(0, 12),
    actionVerbCount,
    quantifiedBulletCount,
    wordCount: words.length,
    bulletCount: bullets.length,
    formattingAlerts,
    suggestions,
    sectionChecks,
    emailValid,
  };
}
