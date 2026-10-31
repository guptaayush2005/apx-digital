import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { singleApprovedProject } from '../data/portfolioData';
import { 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Globe, 
  ArrowRight, 
  Database, 
  Lock, 
  Server
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BackendProject {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  category: string;
  technologies: string[];
  thumbnail_url: string;
  gallery_images: string[];
  live_url?: string;
  github_url?: string;
  case_study_url?: string;
  completion_date?: string;
  is_featured: boolean;
  status: 'Published' | 'Draft';
}

export const PortfolioPage: React.FC = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<BackendProject[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<BackendProject | null>(null);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
          setProjects(data.projects);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch dynamic portfolio:', err);
      });
  }, []);

  // Filter categories
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter((p) => p.category === selectedCategory);

  // If dynamic projects are not loaded yet, or only 1 project is in DB
  const primaryProject = projects.length > 0 ? projects[0] : null;

  return (
    <div className="portfolio-page" style={{ paddingTop: '7rem', paddingBottom: '6rem' }}>
      {/* Header */}
      <section className="section" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge" style={{ marginBottom: '1.5rem' }}>
            <span>{t.portfolio.badge}</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
              fontWeight: 900,
              maxWidth: '920px',
              margin: '0 auto 1.5rem auto',
            }}
          >
            {t.portfolio.title}
          </h1>
          <p
            style={{
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
              maxWidth: '720px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            {t.portfolio.subtitle}
          </p>
        </div>
      </section>

      {/* Flagship Verified Single Project Showcase */}
      <section className="section" style={{ paddingTop: '1rem', paddingBottom: '3rem' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card glow-card"
            style={{
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '1px solid var(--border-highlight)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
            }}
          >
            {/* Project Image Banner */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxHeight: '480px',
                overflow: 'hidden',
                backgroundColor: '#0c0d11',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <img
                src={primaryProject ? primaryProject.thumbnail_url : singleApprovedProject.image}
                alt={primaryProject ? primaryProject.title : singleApprovedProject.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  display: 'block',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(8,9,11,0.1) 0%, rgba(8,9,11,0.7) 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  left: '1.5rem',
                  display: 'flex',
                  gap: '0.6rem',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'rgba(16, 185, 129, 0.9)',
                    color: '#ffffff',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <ShieldCheck size={14} />
                  <span>{t.portfolio.verifiedBadge}</span>
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: 'var(--accent-primary)',
                    color: 'var(--accent-contrast)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Globe size={14} />
                  <span>{t.portfolioExtras?.singleProject?.categoryLabel || primaryProject?.category || singleApprovedProject.categoryLabel}</span>
                </div>
              </div>
            </div>

            {/* Project Details Content */}
            <div style={{ padding: 'clamp(2rem, 4vw, 3.5rem)' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  marginBottom: '1.5rem',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: 'clamp(1.6rem, 3.2vw, 2.5rem)',
                      fontWeight: 800,
                      lineHeight: 1.3,
                      marginBottom: '0.8rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {t.portfolioExtras?.singleProject?.title || primaryProject?.title || singleApprovedProject.title}
                  </h2>
                  <p
                    style={{
                      fontSize: '1.1rem',
                      color: 'var(--accent-primary)',
                      fontWeight: 600,
                    }}
                  >
                    {t.portfolioExtras?.singleProject?.tagline || primaryProject?.short_description || singleApprovedProject.tagline}
                  </p>
                </div>

                <a
                  href={primaryProject?.live_url || singleApprovedProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    padding: '0.85rem 1.8rem',
                    fontSize: '0.95rem',
                    boxShadow: 'var(--shadow-glow)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>{t.portfolio.viewProjectBtn}</span>
                  <ExternalLink size={16} />
                </a>
              </div>

              {/* Detailed Narrative */}
              <div
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  color: 'var(--text-secondary)',
                  marginBottom: '2.5rem',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {t.portfolioExtras?.singleProject?.description || primaryProject?.full_description || singleApprovedProject.description}
              </div>

              {/* Grid: Architecture & Features */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '2.5rem',
                  marginBottom: '2.5rem',
                }}
              >
                {/* Deliverables / Architecture */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--text-muted)',
                      marginBottom: '1.2rem',
                    }}
                  >
                    <Layers size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span>{t.portfolio.keyDeliverablesLabel}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    {(t.portfolioExtras?.singleProject?.features || singleApprovedProject.features).map((feature, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          fontSize: '0.95rem',
                          color: 'var(--text-secondary)',
                          lineHeight: 1.5,
                        }}
                      >
                        <CheckCircle2
                          size={18}
                          style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }}
                        />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      color: 'var(--text-muted)',
                      marginBottom: '1.2rem',
                    }}
                  >
                    <Database size={16} style={{ color: 'var(--accent-primary)' }} />
                    <span>{t.portfolio.techStackLabel}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {(primaryProject?.technologies || singleApprovedProject.technologies).map((tech) => (
                      <span
                        key={tech}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--text-primary)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-primary)',
                          }}
                        />
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div
                    style={{
                      marginTop: '2rem',
                      padding: '1.2rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'rgba(255, 140, 50, 0.06)',
                      border: '1px solid var(--border-highlight)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                      <Lock size={15} style={{ color: 'var(--accent-primary)' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                        {t.portfolioExtras?.singleProject?.clientType || 'Production Client Project'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {t.portfolio.subtitle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  paddingTop: '2rem',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <Server size={16} />
                  <span>{t.team.roles.founder}: <strong>Ayush Gupta</strong></span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <Link to="/start-project" className="btn btn-secondary" style={{ padding: '0.75rem 1.4rem' }}>
                    <span>{t.services.discussBtn}</span>
                    <ArrowRight size={14} />
                  </Link>
                  <a
                    href={primaryProject?.live_url || singleApprovedProject.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 1.4rem' }}
                  >
                    <span>{t.portfolio.viewProjectBtn}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dynamic Projects Grid (When Multiple Projects Published) */}
      {projects.length > 1 && (
        <section className="section" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
          <div className="container" style={{ maxWidth: '1100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800 }}>All Published Case Studies</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  Explore dynamic software solutions and digital agency projects delivered by APX Digital.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: selectedCategory === cat ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      backgroundColor: selectedCategory === cat ? 'rgba(255, 140, 50, 0.15)' : 'var(--bg-surface)',
                      color: selectedCategory === cat ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  className="glass-card glow-card"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedProject(proj)}
                >
                  <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={proj.thumbnail_url}
                      alt={proj.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    {proj.is_featured && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          backgroundColor: 'var(--accent-primary)',
                          color: '#08090B',
                          fontSize: '0.72rem',
                          fontWeight: 800,
                        }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                        {proj.category}
                      </span>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '4px', marginBottom: '8px' }}>
                        {proj.title}
                      </h4>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {proj.short_description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {proj.completion_date || 'APX Digital Client'}
                      </span>
                      {proj.live_url && (
                        <a
                          href={proj.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            color: 'var(--accent-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            textDecoration: 'none',
                          }}
                        >
                          <span>View Live</span>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Project Quick View Modal */}
      {selectedProject && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.5rem',
          }}
          onClick={() => setSelectedProject(null)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '700px',
              backgroundColor: 'var(--bg-card)',
              borderRadius: '20px',
              border: '1px solid var(--border-highlight)',
              boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ height: '260px', position: 'relative' }}>
              <img
                src={selectedProject.thumbnail_url}
                alt={selectedProject.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ padding: '2rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 800, textTransform: 'uppercase' }}>
                {selectedProject.category}
              </span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', marginBottom: '1rem' }}>
                {selectedProject.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {selectedProject.full_description || selectedProject.short_description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.8rem' }}>
                {selectedProject.technologies.map((t) => (
                  <span
                    key={t}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button
                  onClick={() => setSelectedProject(null)}
                  style={{
                    padding: '0.7rem 1.4rem',
                    borderRadius: '8px',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                {selectedProject.live_url && (
                  <a
                    href={selectedProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '0.7rem 1.4rem' }}
                  >
                    <span>Inspect Project</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CTA Box */}
      <section className="section" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div
            className="glass-card"
            style={{
              padding: 'clamp(2.5rem, 5vw, 4rem)',
              borderRadius: 'var(--radius-xl)',
              maxWidth: '850px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, var(--accent-subtle) 0%, var(--bg-card) 100%)',
              border: '1px solid var(--border-highlight)',
            }}
          >
            <h3 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginBottom: '1rem' }}>
              {t.processExtras?.readyTitle || 'Ready to Build Your Digital Experience?'}
            </h3>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '580px', margin: '0 auto 2rem auto' }}>
              {t.processExtras?.readySubtitle || 'Every great digital transformation begins with an exploratory conversation. Connect with our founders today to discuss your vision.'}
            </p>
            <Link to="/start-project" className="btn btn-primary" style={{ padding: '0.9rem 2.2rem' }}>
              <span>{t.nav.startProject}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
