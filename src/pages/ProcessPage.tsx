import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, 
  Compass, 
  Code2, 
  ShieldCheck, 
  Rocket, 
  Sparkles,
  CheckCircle2,
  Clock,
  CheckCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProcessStepData {
  step: string;
  title: string;
  shortDesc: string;
  duration: string;
  goal: string;
  deliverables: string[];
  activities: string[];
}

export const ProcessPage: React.FC = () => {
  const { t } = useLanguage();
  const [selectedStep, setSelectedStep] = useState<number>(0);

  // 5 Step Static Fallback & Multilingual Binding
  const defaultSteps: ProcessStepData[] = [
    {
      step: '01',
      title: 'Discovery & Consultation',
      shortDesc: "Understand the client's business, goals, target audience, requirements and expectations.",
      duration: 'Week 01',
      goal: "Understand the client's business, goals, target audience, requirements and expectations through structured discovery workshops.",
      deliverables: [
        'Strategic Discovery Brief & Scope Alignment',
        'Requirements & Technical Feasibility Matrix',
        'Audience Persona & Competitor Benchmark'
      ],
      activities: [
        'Founding team consultation sessions with client leadership',
        'Target audience profiling & business model analysis',
        'Technical feasibility diagnosis and platform selection',
        'Definition of core success metrics and project KPIs'
      ]
    },
    {
      step: '02',
      title: 'Strategy & Planning',
      shortDesc: 'Define project scope, technology stack, deliverables, timeline and execution strategy.',
      duration: 'Week 01 - 02',
      goal: 'Define project scope, technology stack, deliverables, timeline and execution strategy with zero ambiguity.',
      deliverables: [
        'Detailed System Architecture Blueprint',
        'Sprint Milestones & Execution Roadmap',
        'Database Schema & API Specifications'
      ],
      activities: [
        'System architecture blueprinting and data modeling',
        'Technology stack selection (React, Node, Cloud, APIs)',
        'Sprint timeline scheduling with verifiable deliverables',
        'Resource allocation and transparent communication cadence'
      ]
    },
    {
      step: '03',
      title: 'Design & Development',
      shortDesc: 'Create modern UI/UX designs and develop the solution using appropriate technologies.',
      duration: 'Weeks 02 - 05',
      goal: 'Create modern UI/UX designs and develop the solution using modern, reliable technologies.',
      deliverables: [
        'Interactive Figma Prototypes & Design System',
        'Fully Modular Production-Grade Codebase',
        'Integrated Backend APIs & Cloud Databases'
      ],
      activities: [
        'High-converting UI/UX wireframes & interactive prototypes',
        'Modular frontend engineering adhering to modern web standards',
        'Backend API development, security hardening, and indexing',
        'Weekly client demonstration sprints with live staging URLs'
      ]
    },
    {
      step: '04',
      title: 'Testing & Refinement',
      shortDesc: 'Test functionality, responsiveness, performance and security. Fix issues and refine the product.',
      duration: 'Week 05 - 06',
      goal: 'Test functionality, responsiveness, performance and security. Fix issues and refine the product to highest standards.',
      deliverables: [
        'Multi-Device & Cross-Browser Responsive Audit',
        'Lighthouse Performance & SEO Clearance (95+)',
        'Security Hardening & Error Boundary Verification'
      ],
      activities: [
        'Cross-browser & mobile testing (360px-390px, tablet, desktop)',
        'Lighthouse performance tuning and asset optimization',
        'Security audits, input sanitization, and OWASP compliance',
        'Comprehensive bug resolution and final UI polish'
      ]
    },
    {
      step: '05',
      title: 'Launch & Support',
      shortDesc: 'Deploy the final solution, provide handover documentation and offer ongoing support where agreed.',
      duration: 'Week 06 & Beyond',
      goal: 'Deploy the final solution, provide handover documentation and offer ongoing support where agreed.',
      deliverables: [
        'Live Cloud Production URL with Custom SSL',
        'Full Repository Ownership & Credentials Handover',
        '30-Day Stabilization Warranty & Ongoing SLA'
      ],
      activities: [
        'Production server deployment with custom domain and SSL',
        'Full repository transfer, documentation and credentials handover',
        'Staff walkthroughs on management panels and CMS tools',
        'Post-launch telemetry monitoring and dedicated warranty support'
      ]
    }
  ];

  // Merge with translation keys if available
  const steps: ProcessStepData[] = defaultSteps.map((def, idx) => {
    const tStep = t.process?.steps?.[idx];
    const tDetail = t.processExtras?.stepsDetail?.[idx];
    return {
      step: def.step,
      title: (tStep as any)?.title || tStep?.name || def.title,
      shortDesc: tStep?.desc || def.shortDesc,
      duration: def.duration,
      goal: tDetail?.goal || def.goal,
      deliverables: tDetail?.deliverable ? [tDetail.deliverable, ...def.deliverables.slice(1)] : def.deliverables,
      activities: tDetail?.activities && tDetail.activities.length > 0 ? tDetail.activities : def.activities,
    };
  });

  const stepIcons = [
    <Search size={22} />,
    <Compass size={22} />,
    <Code2 size={22} />,
    <ShieldCheck size={22} />,
    <Rocket size={22} />
  ];

  const activeStep = steps[selectedStep] || steps[0];

  return (
    <div className="process-page" style={{ paddingTop: '7rem', paddingBottom: '6rem' }}>
      {/* 1. Header Section */}
      <section className="section" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge" style={{ marginBottom: '1.2rem' }}>
            <span className="badge-dot" />
            <span>{t.processExtras?.methodologyBadge || t.process?.badge || 'OUR WORKING METHODOLOGY'}</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
              fontWeight: 900,
              maxWidth: '920px',
              margin: '0 auto 1.2rem auto',
              lineHeight: 1.15
            }}
          >
            {t.processExtras?.methodologyTitle || t.process?.title || 'Our 5-Step Working Process'}
          </h1>
          <p
            style={{
              maxWidth: '750px',
              margin: '0 auto',
              fontSize: '1.12rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7
            }}
          >
            {t.processExtras?.methodologySubtitle || t.process?.subtitle || 'A structured, transparent 5-step methodology designed to turn ambitious concepts into reliable, production-grade solutions.'}
          </p>
        </div>
      </section>

      {/* 2. Connected 5-Step Timeline Cards Overview */}
      <section className="section" style={{ paddingTop: '0', paddingBottom: '3.5rem' }}>
        <div className="container">
          <div className="timeline-container">
            {/* Desktop Horizontal Line */}
            <div className="timeline-line-horizontal" />

            {/* Steps Grid / Timeline */}
            <div className="timeline-grid">
              {steps.map((step, index) => {
                const isSelected = selectedStep === index;
                return (
                  <div
                    key={step.step}
                    className={`timeline-step-card glass-card ${isSelected ? 'timeline-step-active' : ''}`}
                    onClick={() => setSelectedStep(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={`Step ${step.step}: ${step.title}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setSelectedStep(index);
                      }
                    }}
                  >
                    {/* Step Node Marker */}
                    <div className="timeline-node">
                      <div className="timeline-node-inner">
                        {step.step}
                      </div>
                    </div>

                    {/* Step Icon */}
                    <div className="timeline-step-icon">
                      {stepIcons[index % stepIcons.length]}
                    </div>

                    {/* Step Header */}
                    <div style={{ marginBottom: '0.6rem' }}>
                      <span className="timeline-step-label">
                        STEP {step.step}
                      </span>
                      <h3 className="timeline-step-title">
                        {step.title}
                      </h3>
                    </div>

                    {/* Step Short Description */}
                    <p className="timeline-step-desc">
                      {step.shortDesc}
                    </p>

                    {/* View Details Indicator */}
                    <div className="timeline-step-action">
                      <span>{isSelected ? 'Active Details' : 'View Deep Dive'}</span>
                      <ChevronRight size={14} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Active Step Deep-Dive Showcase Card */}
      <section className="section" style={{ paddingTop: '0', paddingBottom: '4rem' }}>
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.28 }}
              className="glass-card glow-card"
              style={{
                padding: 'clamp(1.8rem, 4vw, 3.2rem)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--border-highlight)',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2.5rem',
                  alignItems: 'flex-start',
                }}
              >
                {/* Left Side: Summary, Goal, Deliverables */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--accent-gradient)',
                        color: 'var(--accent-contrast)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 900,
                        fontSize: '1.5rem',
                        flexShrink: 0,
                        boxShadow: 'var(--shadow-accent)',
                      }}
                    >
                      {activeStep.step}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>
                          Phase {activeStep.step} of 0{steps.length}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-surface)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
                          <Clock size={12} />
                          {activeStep.duration}
                        </span>
                      </div>
                      <h2 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', fontWeight: 800 }}>
                        {activeStep.title}
                      </h2>
                    </div>
                  </div>

                  {/* Core Goal */}
                  <div
                    style={{
                      padding: '1.2rem 1.4rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '1.8rem',
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-primary)', display: 'block', marginBottom: '6px' }}>
                      Phase Objective & Goal:
                    </span>
                    <p style={{ fontSize: '0.98rem', color: 'var(--text-primary)', margin: 0, fontWeight: 600, lineHeight: 1.6 }}>
                      {activeStep.goal}
                    </p>
                  </div>

                  {/* Deliverables List */}
                  <div
                    style={{
                      padding: '1.4rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-highlight)',
                      marginBottom: '1.8rem',
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--accent-primary)', display: 'block', marginBottom: '10px' }}>
                      Key Phase Deliverables:
                    </span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {activeStep.deliverables.map((deliv, dIdx) => (
                        <li key={dIdx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                          <CheckCircle2 size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Stepper Navigation Buttons */}
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {selectedStep > 0 && (
                      <button
                        onClick={() => setSelectedStep(selectedStep - 1)}
                        className="btn btn-secondary"
                        style={{ padding: '0.65rem 1.4rem', fontSize: '0.88rem' }}
                      >
                        ← Step {steps[selectedStep - 1].step}
                      </button>
                    )}
                    {selectedStep < steps.length - 1 && (
                      <button
                        onClick={() => setSelectedStep(selectedStep + 1)}
                        className="btn btn-primary"
                        style={{ padding: '0.65rem 1.6rem', fontSize: '0.88rem' }}
                      >
                        Step {steps[selectedStep + 1].step} →
                      </button>
                    )}
                  </div>
                </div>

                {/* Right Side: Key Engineering Activities */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'clamp(1.5rem, 3vw, 2.2rem)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.2rem' }}>
                      <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                        Key Engineering Activities
                      </h3>
                    </div>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', margin: 0, padding: 0 }}>
                      {activeStep.activities.map((act: string, actIdx: number) => (
                        <li key={actIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <div style={{ marginTop: '3px', color: 'var(--accent-primary)', flexShrink: 0 }}>
                            <CheckCheck size={18} />
                          </div>
                          <span style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                            {act}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    style={{
                      marginTop: '2rem',
                      paddingTop: '1.2rem',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Ready to start this phase?
                    </span>
                    <Link
                      to="/start-project"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.88rem',
                        fontWeight: 700,
                        color: 'var(--accent-primary)',
                      }}
                    >
                      <span>Initiate Project</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* 4. Bottom Call To Action */}
      <section className="section" style={{ textAlign: 'center', paddingTop: '1rem' }}>
        <div className="container">
          <div
            className="glass-card glow-card"
            style={{
              padding: 'clamp(2.5rem, 5vw, 4rem)',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, rgba(255,140,50,0.08) 0%, rgba(17,19,24,0.9) 100%)',
              border: '1px solid var(--border-highlight)',
              maxWidth: '900px',
              margin: '0 auto',
            }}
          >
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 900, marginBottom: '1rem' }}>
              {t.processExtras?.ctaTitle || 'Ready to Bring Your Vision to Life?'}
            </h2>
            <p style={{ maxWidth: '640px', margin: '0 auto 2.2rem auto', color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7 }}>
              {t.processExtras?.ctaSubtitle || 'Experience our disciplined engineering methodology firsthand. Partner directly with founder engineers for predictable timelines and exceptional outcomes.'}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/start-project" className="btn btn-primary" style={{ padding: '0.9rem 2.4rem' }}>
                <Sparkles size={18} />
                <span>{t.processExtras?.ctaStartBtn || t.nav.startProject}</span>
              </Link>
              <Link to="/contact" className="btn btn-secondary" style={{ padding: '0.9rem 2.4rem' }}>
                <span>{t.processExtras?.ctaBookBtn || t.nav.contact}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline CSS Styles */}
      <style>{`
        .timeline-container {
          position: relative;
          width: 100%;
        }

        /* Desktop: Connected Horizontal Timeline */
        @media (min-width: 992px) {
          .timeline-line-horizontal {
            position: absolute;
            top: 32px;
            left: 5%;
            right: 5%;
            height: 2px;
            background: linear-gradient(90deg, var(--border-subtle) 0%, var(--accent-primary) 50%, var(--border-subtle) 100%);
            z-index: 1;
            pointer-events: none;
          }
          .timeline-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 16px;
            position: relative;
            z-index: 2;
          }
          .timeline-node {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.2rem;
          }
          .timeline-node-inner {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: var(--bg-surface);
            border: 2px solid var(--accent-primary);
            color: var(--accent-primary);
            font-weight: 900;
            font-size: 0.95rem;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--shadow-glow);
            transition: all 0.25s ease;
          }
          .timeline-step-active .timeline-node-inner {
            background: var(--accent-gradient);
            color: var(--accent-contrast);
            border-color: var(--accent-bright);
            transform: scale(1.12);
            box-shadow: var(--shadow-glow);
          }
        }

        /* Tablet & Mobile: Vertical Connected Timeline */
        @media (max-width: 991px) {
          .timeline-line-horizontal {
            display: none;
          }
          .timeline-grid {
            display: flex;
            flex-direction: column;
            gap: 1.2rem;
            position: relative;
            padding-left: 28px;
            border-left: 2px solid var(--border-highlight);
            margin-left: 12px;
          }
          .timeline-node {
            position: absolute;
            left: -40px;
            top: 22px;
          }
          .timeline-node-inner {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: var(--bg-surface);
            border: 2px solid var(--accent-primary);
            color: var(--accent-primary);
            font-weight: 900;
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--shadow-glow);
          }
          .timeline-step-active .timeline-node-inner {
            background: var(--accent-gradient);
            color: var(--accent-contrast);
            transform: scale(1.1);
          }
        }

        .timeline-step-card {
          padding: 1.6rem 1.2rem;
          border-radius: var(--radius-lg);
          background-color: var(--bg-card);
          border: 1px solid var(--border-subtle);
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          flex-direction: column;
          justifyContent: space-between;
          text-align: left;
        }

        .timeline-step-card:hover {
          transform: translateY(-4px);
          border-color: var(--border-highlight);
          background-color: var(--bg-card-hover);
        }

        .timeline-step-active {
          border-color: var(--accent-primary) !important;
          background-color: var(--accent-subtle) !important;
          box-shadow: var(--shadow-accent);
        }

        .timeline-step-icon {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background-color: var(--bg-surface);
          border: 1px solid var(--border-subtle);
          color: var(--accent-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          transition: all 0.2s ease;
        }

        .timeline-step-active .timeline-step-icon {
          background-color: var(--accent-subtle);
          border-color: var(--border-highlight);
        }

        .timeline-step-label {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--accent-primary);
          display: block;
          margin-bottom: 4px;
        }

        .timeline-step-title {
          font-size: 1.05rem;
          font-weight: 800;
          line-height: 1.3;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .timeline-step-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.55;
          margin-bottom: 1.2rem;
          flex-grow: 1;
        }

        .timeline-step-action {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--accent-primary);
          margin-top: auto;
          transition: gap 0.2s ease;
        }

        .timeline-step-card:hover .timeline-step-action {
          gap: 8px;
        }
      `}</style>
    </div>
  );
};

export default ProcessPage;
