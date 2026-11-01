import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ResumeData, ATSResult, JobApplication } from '../types';
import { copyResume, demoResume } from './demo-resume';
import { DEFAULT_TEMPLATE_ID } from './templates';

export type TabType =
  | 'dashboard'
  | 'builder'
  | 'ats'
  | 'jobs'
  | 'interview'
  | 'portfolio'
  | 'recruiter'
  | 'github'
  | 'linkedin'
  | 'coverletter'
  | 'coach'
  | 'skills'
  | 'analytics'
  | 'templates'
  | 'twin';

interface CareerOSState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  
  resume: ResumeData;
  setResume: (resume: Partial<ResumeData>) => void;
  updateExperience: (id: string, bullets: string[]) => void;
  
  atsResult: ATSResult;
  setAtsResult: (result: ATSResult) => void;

  applications: JobApplication[];
  addApplication: (application: Omit<JobApplication, 'id'>) => void;
  removeApplication: (id: string) => void;
  moveApplication: (id: string, status: JobApplication['status']) => void;
  selectedTemplate: string;
  setSelectedTemplate: (id: string) => void;
}

export const useCareerStore = create<CareerOSState>()(persist((set) => ({
  activeTab: 'dashboard',
  setActiveTab: (activeTab) => set({ activeTab }),
  selectedTemplate: DEFAULT_TEMPLATE_ID,
  setSelectedTemplate: (selectedTemplate) => set({ selectedTemplate }),

  resume: copyResume(demoResume),

  setResume: (partial) =>
    set((state) => ({ resume: { ...state.resume, ...partial } })),

  updateExperience: (id, bullets) =>
    set((state) => ({
      resume: {
        ...state.resume,
        experiences: state.resume.experiences.map((exp) =>
          exp.id === id ? { ...exp, bullets } : exp
        )
      }
    })),

  atsResult: {
    score: 94,
    breakdown: {
      keywordMatch: 95,
      formattingQuality: 100,
      actionVerbStrength: 92,
      quantifiableMetrics: 89
    },
    missingKeywords: ['gcp', 'terraform', 'graphql'],
    matchedKeywords: ['typescript', 'next.js', 'node.js', 'postgresql', 'redis', 'docker', 'kubernetes', 'aws'],
    actionVerbCount: 14,
    quantifiedBulletCount: 8,
    formattingAlerts: [],
    suggestedImprovements: ['Incorporate more explicit distributed database benchmarks to maximize score.']
  },

  setAtsResult: (atsResult) => set({ atsResult }),

  applications: [],

  addApplication: (application) =>
    set((state) => ({ applications: [{ ...application, id: `application-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }, ...state.applications] })),

  removeApplication: (id) =>
    set((state) => ({ applications: state.applications.filter((app) => app.id !== id) })),

  moveApplication: (id, status) =>
    set((state) => ({
      applications: state.applications.map((app) =>
        app.id === id ? { ...app, status } : app
      )
    }))
}), {
  name: 'careeros-workspace-v1',
  version: 7,
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ resume: state.resume, applications: state.applications, selectedTemplate: state.selectedTemplate }),
  migrate: (persistedState, version) => {
    const state = persistedState as Partial<CareerOSState>;
    const sampleApplicationIds = new Set(['app-1', 'app-2', 'app-3', 'app-4', 'app-5']);
    if (version < 7 && state.applications?.length && state.applications.every((application) => sampleApplicationIds.has(application.id))) {
      state.applications = [];
    }
    const savedResume = state.resume;
    const priorPhotoSample = savedResume?.photoUrl?.endsWith('profile.jpg') ?? false;
    const priorDetailedSample = savedResume?.targetTitle === 'Aspiring Software Engineer & AI Developer'
      && savedResume.experiences?.length === 3 && savedResume.education?.length === 1
      && savedResume.projects?.length === 3 && savedResume.research?.length === 1
      && savedResume.achievements?.length === 5 && savedResume.certifications?.length === 7
      && savedResume.leadership?.length === 5;
    if (version < 5 && (priorPhotoSample || priorDetailedSample)) {
      state.resume = copyResume(demoResume);
      state.selectedTemplate = DEFAULT_TEMPLATE_ID;
    }
    const resume = state.resume;
    if (version < 6 && resume) {
      const legacyContact = resume.phoneLocation?.split(/[·|]/).map(part => part.trim()).filter(Boolean) ?? [];
      const legacyPhone = legacyContact.find(part => /\+?\d[\d\s().-]{6,}/.test(part));
      const legacyLocation = legacyContact.filter(part => part !== legacyPhone).join(' · ');
      if (!resume.phone && legacyPhone) resume.phone = legacyPhone;
      if (!resume.location && legacyLocation) resume.location = legacyLocation;
      delete resume.phoneLocation;
      if (state.selectedTemplate && !state.selectedTemplate.endsWith('-photo') && !state.selectedTemplate.endsWith('-no-photo')) {
        state.selectedTemplate = `${state.selectedTemplate}-no-photo`;
      }
      if (!state.selectedTemplate) state.selectedTemplate = DEFAULT_TEMPLATE_ID;
    }
    return state;
  },
}));
