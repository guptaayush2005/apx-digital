import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, FileText, CheckCircle2, ShieldCheck, Download, ArrowRight } from 'lucide-react';
import { useCareerStore } from '../features/resume/lib/store';
import { ResumeWorkspaceNav } from '../features/resume/components/ResumeWorkspaceNav';
import { ResumeBuilder } from '../features/resume/components/ResumeBuilder';
import { TemplateLibrary } from '../features/resume/components/TemplateLibrary';
import { ATSScoreMeter } from '../features/resume/components/ATSScoreMeter';
import { CareerTwin } from '../features/resume/components/CareerTwin';
import { JobKanban } from '../features/resume/components/JobKanban';
import { MockInterview } from '../features/resume/components/MockInterview';
import { PortfolioPreview } from '../features/resume/components/PortfolioPreview';
import { RecruiterHub } from '../features/resume/components/RecruiterHub';
import { GitHubAnalyzer } from '../features/resume/components/GitHubAnalyzer';
import { LinkedInOptimizer } from '../features/resume/components/LinkedInOptimizer';
import { CoverLetterGenerator } from '../features/resume/components/CoverLetterGenerator';
import { CareerCoach } from '../features/resume/components/CareerCoach';
import { SkillTracker } from '../features/resume/components/SkillTracker';
import { AnalyticsDashboard } from '../features/resume/components/AnalyticsDashboard';
import { Dashboard } from '../features/resume/components/Dashboard';

import '../features/resume/resume.css';

export const ResumeBuilderPage: React.FC = () => {
  const { activeTab, setActiveTab } = useCareerStore();

  useEffect(() => {
    // If URL has ?tab=... support direct tab deep-linking
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['builder', 'templates', 'ats', 'twin', 'jobs', 'dashboard', 'interview', 'portfolio', 'coverletter', 'github', 'linkedin', 'coach', 'skills', 'analytics', 'recruiter'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [setActiveTab]);

  const scrollToWorkspace = () => {
    setActiveTab('builder');
    const el = document.getElementById('resume-workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="resume-builder-page" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* 1. Introductory Hero Section (Free APX Digital Service) */}
      <section
        className="hero-section no-print"
        style={{
          paddingTop: '6rem',
          paddingBottom: '3.5rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="ambient-glow" style={{ top: '-120px', left: '50%', transform: 'translateX(-50%)', opacity: 0.6 }} />

        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: '850px', margin: '0 auto' }}>
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--accent-subtle)',
              border: '1px solid var(--border-highlight)',
              marginBottom: '1.5rem',
            }}
          >
            <Sparkles size={16} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.04em' }}>
              100% FREE APX DIGITAL CAREER SERVICE
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.3rem, 5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '1.25rem',
            }}
          >
            Build Your Professional Resume
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: '2rem',
              maxWidth: '680px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Create a recruiter-friendly resume with live preview, professional templates and PDF export.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}
          >
            <button
              type="button"
              onClick={scrollToWorkspace}
              className="btn btn-primary"
              style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                padding: '0.85rem 2.2rem',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              <span>Create My Resume — Free</span>
              <ArrowRight size={18} />
            </button>
          </motion.div>

          {/* Highlights strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.75rem',
              flexWrap: 'wrap',
              marginTop: '2.5rem',
              fontSize: '0.86rem',
              color: 'var(--text-muted)',
              fontWeight: 500,
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={15} style={{ color: '#10b981' }} />
              <span>ATS-Friendly Layouts</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FileText size={15} style={{ color: 'var(--accent-primary)' }} />
              <span>240+ Design Variations</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Download size={15} style={{ color: '#10b981' }} />
              <span>Instant Clean PDF Export</span>
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={15} style={{ color: '#10b981' }} />
              <span>100% Private (Saved In-Browser)</span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* 2. Main Career Workspace */}
      <section
        id="resume-workspace"
        className="resume-workspace-container"
        style={{
          paddingBottom: '5rem',
          position: 'relative',
        }}
      >
        <div className="container">
          {/* Workspace Sub-Navbar */}
          <ResumeWorkspaceNav />

          {/* Active Tab View */}
          <div className="resume-tab-content" style={{ minHeight: '600px' }}>
            {activeTab === 'builder' && <ResumeBuilder />}
            {activeTab === 'templates' && <TemplateLibrary />}
            {activeTab === 'ats' && <ATSScoreMeter />}
            {activeTab === 'twin' && <CareerTwin />}
            {activeTab === 'jobs' && <JobKanban />}
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'interview' && <MockInterview />}
            {activeTab === 'portfolio' && <PortfolioPreview />}
            {activeTab === 'recruiter' && <RecruiterHub />}
            {activeTab === 'github' && <GitHubAnalyzer />}
            {activeTab === 'linkedin' && <LinkedInOptimizer />}
            {activeTab === 'coverletter' && <CoverLetterGenerator />}
            {activeTab === 'coach' && <CareerCoach />}
            {activeTab === 'skills' && <SkillTracker />}
            {activeTab === 'analytics' && <AnalyticsDashboard />}
          </div>
        </div>
      </section>
    </div>
  );
};
