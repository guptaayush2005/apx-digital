export type Role = 'STUDENT' | 'RECRUITER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  headline?: string;
  bio?: string;
  githubUsername?: string;
  linkedinUrl?: string;
  portfolioSlug?: string;
}

export interface ResumeData {
  name: string;
  targetTitle: string;
  email: string;
  phone?: string;
  location?: string;
  /** Legacy combined contact value, split into phone and location on migration. */
  phoneLocation?: string;
  website: string;
  summary: string;
  /** An objective can be used in place of the professional summary. */
  objective?: string;
  linkedin?: string;
  github?: string;
  photoUrl?: string;
  themeColor: string;
  experiences: {
    id: string;
    role: string;
    companyPeriod: string;
    url?: string;
    urlLabel?: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    yearHonor: string;
    location?: string;
    performance?: string;
  }[];
  skills: string[];
  skillGroups?: { id: string; category: string; skills: string[] }[];
  projects?: { id: string; name: string; liveUrl: string; githubUrl: string; techStack: string[]; bullets: string[] }[];
  research?: { id: string; title: string; publication: string; paperId: string; details: string[] }[];
  achievements?: { id: string; title: string; award: string; details: string[] }[];
  certifications?: { id: string; name: string; issuer: string; date: string; url: string }[];
  leadership?: { id: string; role: string; organization: string; description: string }[];
}

export interface ATSResult {
  score: number;
  breakdown: {
    keywordMatch: number;
    formattingQuality: number;
    actionVerbStrength: number;
    quantifiableMetrics: number;
  };
  missingKeywords: string[];
  matchedKeywords: string[];
  actionVerbCount: number;
  quantifiedBulletCount: number;
  formattingAlerts: string[];
  suggestedImprovements: string[];
}

export type ApplicationStatus = 'WISHLIST' | 'APPLIED' | 'SCREENING' | 'TECHNICAL_INTERVIEW' | 'OFFER' | 'REJECTED';

export interface JobApplication {
  id: string;
  companyName: string;
  positionTitle: string;
  salaryRange?: string;
  status: ApplicationStatus;
  appliedDate: string;
  matchScore?: number;
  notes?: string;
}

