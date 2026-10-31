import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { servicesData } from '../data/servicesData';
import { 
  Globe, 
  Smartphone, 
  Cpu, 
  Film, 
  Palette, 
  Presentation, 
  Megaphone,
  Share2,
  FileText,
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Layers,
  TrendingUp,
  ExternalLink
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.hash]);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe size={28} />;
      case 'Smartphone': return <Smartphone size={28} />;
      case 'Cpu': return <Cpu size={28} />;
      case 'Film': return <Film size={28} />;
      case 'Palette': return <Palette size={28} />;
      case 'Presentation': return <Presentation size={28} />;
      case 'Megaphone': return <Megaphone size={28} />;
      case 'Share2': return <Share2 size={28} />;
      case 'FileText': return <FileText size={28} />;
      default: return <Layers size={28} />;
    }
  };

  return (
    <div className="services-page" style={{ paddingTop: '7rem', paddingBottom: '6rem' }}>
      {/* Services Header */}
      <section className="section" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge" style={{ marginBottom: '1.5rem' }}>
            <span>{t.services.badge}</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 900,
              maxWidth: '900px',
              margin: '0 auto 1.5rem auto',
            }}
          >
            {t.services.title}
          </h1>
          <p
            style={{
              maxWidth: '750px',
              margin: '0 auto 2.5rem auto',
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
            }}
          >
            {t.services.subtitle}
          </p>

          {/* Quick jump navigation chips */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.6rem',
              justifyContent: 'center',
              maxWidth: '1000px',
              margin: '0 auto',
            }}
          >
            {servicesData.map((s, idx) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-card)',
                  border: s.isTool ? '1px solid var(--border-highlight)' : '1px solid var(--border-subtle)',
                  color: s.isTool ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  transition: 'all 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{t.services.items[idx]?.title || s.title.en}</span>
                {s.isTool && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--accent-contrast)',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                      letterSpacing: '0.04em',
                    }}
                  >
                    FREE
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Services Detailed List */}
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {servicesData.map((service, index) => {
            const detail = t.servicesExtras?.detailed?.[index];
            const isTool = service.isTool;
            const title = isTool && t.resumeBuilder?.title ? t.resumeBuilder.title : (t.services.items[index]?.title || service.title.en);
            const tagline = detail?.tagline || service.tagline.en;
            const description = isTool && t.resumeBuilder?.shortDesc ? t.resumeBuilder.shortDesc : (detail?.description || t.services.items[index]?.desc || service.description.en);
            const features = isTool && t.resumeBuilder?.features ? t.resumeBuilder.features : (detail?.features || service.features.en);
            const deliverables = detail?.deliverables || service.deliverables.en;
            const benefits = detail?.benefits || service.benefits.en;

            return (
              <div
                key={service.id}
                id={service.id}
                className="glass-card glow-card"
                style={{
                  padding: 'clamp(2rem, 4vw, 3.5rem)',
                  scrollMarginTop: '100px',
                  border: service.isTool ? '1px solid var(--border-highlight)' : undefined,
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '3rem',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Left Column: Title, Icon, Description & Features */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.2rem' }}>
                      <div
                        style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--accent-subtle)',
                          border: '1px solid var(--border-highlight)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--accent-primary)',
                        }}
                      >
                        {getServiceIcon(service.iconName)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            0{index + 1}
                          </span>
                          {service.isTool && (
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'var(--accent-primary)',
                                color: 'var(--accent-contrast)',
                                fontSize: '0.72rem',
                                fontWeight: 900,
                                letterSpacing: '0.06em',
                              }}
                            >
                              FREE TOOL
                            </span>
                          )}
                        </div>
                        <h2 style={{ fontSize: 'clamp(1.7rem, 3vw, 2.3rem)', fontWeight: 800 }}>
                          {title}
                        </h2>
                      </div>
                    </div>

                    <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem' }}>
                      {tagline}
                    </p>

                    <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '2rem' }}>
                      {description}
                    </p>

                    {/* Offerings Grid */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ fontSize: '0.92rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.9rem' }}>
                        {t.servicesExtras?.spectrumTitle || 'Core Service Spectrum'}
                      </h4>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                          gap: '0.6rem',
                        }}
                      >
                        {features.map((f: string, fIdx: number) => (
                          <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
                            <span>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tech Stack Chips */}
                    <div>
                      <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                        {t.servicesExtras?.engineeredWithTitle || 'Engineered With'}
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {service.technologies.map((tech) => (
                          <span
                            key={tech}
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              padding: '3px 10px',
                              borderRadius: 'var(--radius-sm)',
                              backgroundColor: 'var(--bg-surface)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Deliverables, Benefits & Action Buttons */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      padding: '2rem',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.8rem',
                    }}
                  >
                    {/* Deliverables */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                        <CheckCircle2 size={18} />
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {t.services.deliverablesLabel}
                        </h4>
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {deliverables.map((item: string, idx: number) => (
                          <li key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

                    {/* Benefits */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', color: '#10B981' }}>
                        <TrendingUp size={18} />
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {t.services.benefitsLabel}
                        </h4>
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {benefits.map((item: string, idx: number) => (
                          <li key={idx} style={{ display: 'flex', gap: '8px', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            <span style={{ color: '#10B981', fontWeight: 700 }}>✓</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Conversion CTAs */}
                    <div
                      style={{
                        paddingTop: '1.2rem',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.8rem',
                      }}
                    >
                      {service.isTool ? (
                        <a
                          href={service.toolUrl || "https://apx-resume-builder.vercel.app/"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                          style={{
                            width: '100%',
                            fontSize: '0.95rem',
                            padding: '0.85rem 1.6rem',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-glow)',
                          }}
                        >
                          <Sparkles size={18} />
                          <span>Create Your Free Resume →</span>
                          <ExternalLink size={16} />
                        </a>
                      ) : (
                        <>
                          <Link
                            to={`/start-project?service=${encodeURIComponent(service.title.en)}`}
                            className="btn btn-primary"
                            style={{ flex: '1 1 180px', fontSize: '0.88rem', padding: '0.75rem 1rem' }}
                          >
                            <Sparkles size={16} />
                            <span>{t.services.getQuoteBtn}</span>
                          </Link>

                          <Link
                            to={`/contact?subject=${encodeURIComponent('Inquiry: ' + service.title.en)}`}
                            className="btn btn-secondary"
                            style={{ flex: '1 1 180px', fontSize: '0.88rem', padding: '0.75rem 1rem' }}
                          >
                            <MessageSquare size={16} />
                            <span>{t.services.discussBtn}</span>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Consultation Banner */}
      <section className="section" style={{ textAlign: 'center', paddingTop: '2rem' }}>
        <div className="container">
          <div
            className="glass-card"
            style={{
              padding: '3rem 2rem',
              maxWidth: '850px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--accent-subtle) 100%)',
            }}
          >
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>
              {t.servicesExtras?.customReqTitle || 'Have a Custom or Multi-Disciplinary Requirement?'}
            </h3>
            <p style={{ maxWidth: '640px', margin: '0 auto 2rem auto', fontSize: '1.02rem', color: 'var(--text-secondary)' }}>
              {t.servicesExtras?.customReqDesc || 'We regularly build bespoke digital ecosystems combining custom software engineering, automated workflows, and high-impact visual design.'}
            </p>
            <Link to="/start-project" className="btn btn-primary" style={{ padding: '0.9rem 2.2rem' }}>
              <span>{t.servicesExtras?.startCustomBtn || 'Start a Custom Project'}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
