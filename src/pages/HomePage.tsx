import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ArrowRight, 
  Globe, 
  Smartphone, 
  Cpu, 
  Palette, 
  Mail
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LinkedinIcon } from '../components/BrandIcons';

export const HomePage: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const isLight = theme === 'light';
  const heroLogoSrc = isLight ? '/brand/apx-logo-light-hero.jpg' : '/brand/apx-logo-hero.jpg';

  // 4 Core Service Pillars for a clean, non-bloated teaser
  const coreCapabilities = [
    {
      icon: <Globe size={24} style={{ color: 'var(--accent-primary)' }} />,
      title: t.services.items[0]?.title || 'Website Development',
      desc: t.services.items[0]?.desc || 'High-performance business websites, landing pages, and e-commerce platforms engineered for conversion.',
    },
    {
      icon: <Smartphone size={24} style={{ color: 'var(--accent-primary)' }} />,
      title: t.services.items[1]?.title || 'App Development',
      desc: t.services.items[1]?.desc || 'Cross-platform mobile and web applications with reactive user interfaces and secure cloud architectures.',
    },
    {
      icon: <Cpu size={24} style={{ color: 'var(--accent-primary)' }} />,
      title: t.services.items[2]?.title || 'AI Solutions & Automation',
      desc: t.services.items[2]?.desc || 'Custom intelligent chatbots, workflow automation engines, and generative AI integrations.',
    },
    {
      icon: <Palette size={24} style={{ color: 'var(--accent-primary)' }} />,
      title: t.services.items[4]?.title || 'Graphic Design & Branding',
      desc: t.services.items[4]?.desc || 'Distinctive brand identities, logo marks, social media systems, and high-impact digital graphics.',
    },
  ];

  return (
    <div className="home-page" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Ambient Decorative Glows */}
      <div
        className="ambient-glow"
        style={{
          top: '-120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '750px',
          height: '520px',
          opacity: 0.6,
        }}
      />
      <div
        className="ambient-glow"
        style={{
          top: '35%',
          right: '-180px',
          width: '500px',
          height: '500px',
          opacity: 0.35,
        }}
      />

      {/* ========================================================= */}
      {/* 1. HERO SECTION WITH OFFICIAL APX DIGITAL LOGO            */}
      {/* ========================================================= */}
      <section
        className="section hero-section"
        style={{
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          paddingTop: '6.5rem',
          paddingBottom: '4rem',
          position: 'relative',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          
          {/* Official Company Logo Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65 }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2.2rem',
            }}
          >
            <div
              style={{
                position: 'relative',
                maxWidth: '440px',
                width: '92%',
                borderRadius: '20px',
                padding: '1.2rem 1.8rem',
                background: isLight 
                  ? 'radial-gradient(ellipse at center, #FFFFFF 0%, #EEF4FF 100%)' 
                  : 'radial-gradient(ellipse at center, rgba(16, 27, 61, 0.96) 0%, rgba(8, 9, 11, 0.98) 100%)',
                border: isLight 
                  ? '1px solid #DCE6F5' 
                  : '1px solid rgba(255, 140, 50, 0.28)',
                boxShadow: isLight
                  ? '0 20px 45px -10px rgba(21, 94, 239, 0.16), 0 0 35px rgba(99, 179, 255, 0.22)'
                  : '0 20px 45px -10px rgba(0, 0, 0, 0.38), 0 0 35px rgba(255, 140, 50, 0.16)',
                backdropFilter: 'blur(12px)',
                transition: 'all 0.3s ease',
              }}
            >
              <img
                src={heroLogoSrc}
                alt="APX Digital - Build • Create • Innovate"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  objectFit: 'contain',
                }}
              />
            </div>
          </motion.div>

          {/* Official Tagline Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ marginBottom: '1.5rem', display: 'inline-block' }}
          >
            <div className="badge">
              <span className="badge-dot" />
              <span style={{ letterSpacing: '0.12em' }}>APX DIGITAL • BUILD • CREATE • INNOVATE</span>
            </div>
          </motion.div>

          {/* Main Headline: "We Turn Ideas Into Digital Experiences." */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4.6rem)',
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              maxWidth: '1000px',
              margin: '0 auto 1.6rem auto',
            }}
          >
            {t.hero.headlinePart1}{' '}
            <span className="gradient-text">{t.hero.headlinePart2}</span>
          </motion.h1>

          {/* Short Introduction to APX Digital */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{
              fontSize: 'clamp(1.05rem, 1.8vw, 1.25rem)',
              color: 'var(--text-secondary)',
              maxWidth: '750px',
              margin: '0 auto 2.5rem auto',
              lineHeight: 1.7,
            }}
          >
            {t.hero.subheadline}
          </motion.p>

          {/* Start a Project and Explore Our Work Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            style={{
              display: 'flex',
              gap: '1.2rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '3.5rem',
            }}
          >
            <Link
              to="/start-project"
              className="btn btn-primary"
              style={{
                padding: '0.95rem 2.2rem',
                fontSize: '1rem',
                boxShadow: 'var(--shadow-glow)',
              }}
            >
              <span>{t.hero.startProjectBtn || 'Start a Project'}</span>
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/portfolio"
              className="btn btn-secondary"
              style={{
                padding: '0.95rem 2rem',
                fontSize: '1rem',
              }}
            >
              <span>{t.hero.exploreWorkBtn || 'Explore Our Work'}</span>
            </Link>
          </motion.div>

          {/* Genuine Company Highlights (Metrics Strip) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="glass-card"
            style={{
              maxWidth: '880px',
              margin: '0 auto',
              padding: '1.5rem 2.2rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div>
              <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>7+</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.hero.stat1Label || 'Client Projects Delivered'}</div>
            </div>
            <div>
              <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>100%</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.hero.stat2Label || 'Bespoke Modern Code'}</div>
            </div>
            <div>
              <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--accent-primary)' }}>3</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.hero.stat3Label || 'Technical Co-Founders'}</div>
            </div>
            <div>
              <div style={{ fontSize: '2.1rem', fontWeight: 900, color: 'var(--text-primary)' }}>24/7</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t.hero.stat4Label || 'Dedicated Support'}</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. MAIN SERVICE HIGHLIGHTS (CONCISE CAPABILITIES TEASER)  */}
      {/* ========================================================= */}
      <section className="section" style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.2rem' }}>
            <div className="badge" style={{ marginBottom: '0.9rem' }}>
              <span>{t.services.badge || 'SERVICES & SOLUTIONS'}</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 800, marginBottom: '0.9rem' }}>
              {t.services.title || 'What We Build & Engineer'}
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto' }}>
              {t.services.subtitle || 'End-to-end digital capabilities designed for modern brands and growing enterprises.'}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.6rem',
              marginBottom: '3rem',
            }}
          >
            {coreCapabilities.map((srv, idx) => (
              <div
                key={idx}
                className="glass-card glow-card"
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--accent-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.2rem',
                      border: '1px solid var(--border-highlight)',
                    }}
                  >
                    {srv.icon}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem' }}>
                    {srv.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {srv.desc}
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <Link
                    to="/services"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: 'var(--accent-primary)',
                      textDecoration: 'none',
                    }}
                  >
                    <span>View Service Details</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/services" className="btn btn-primary" style={{ padding: '0.85rem 2rem' }}>
              <span>Explore All 8 Services & Capabilities</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. SHORT CTA SECTION                                      */}
      {/* ========================================================= */}
      <section className="section" style={{ padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: '960px' }}>
          <div
            className="glass-card glow-card"
            style={{
              padding: 'clamp(2.2rem, 4.5vw, 3.8rem)',
              borderRadius: 'var(--radius-xl)',
              background: 'linear-gradient(135deg, var(--accent-subtle) 0%, var(--bg-card) 100%)',
              border: '1px solid var(--border-highlight)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div className="badge" style={{ marginBottom: '1rem' }}>
                <span>{t.contact.badge || 'READY TO BUILD'}</span>
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', fontWeight: 900, marginBottom: '0.9rem' }}>
                Ready to Turn Your Ideas Into Reality?
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
                Collaborate directly with our technical founders to design, develop, and launch high-impact digital experiences.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.4rem',
                marginBottom: '2.8rem',
              }}
            >
              {/* Direct Founder Email */}
              <a
                href="mailto:guptaayush932589@gmail.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255,140,50,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={20} style={{ color: 'var(--accent-primary)' }} />
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Direct Founder Email
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    guptaayush932589@gmail.com
                  </div>
                </div>
              </a>

              {/* Official LinkedIn */}
              <a
                href="https://www.linkedin.com/company/apx-digital-india/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(10,102,194,0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <LinkedinIcon size={20} color="#0A66C2" />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Official LinkedIn
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                    APX Digital Company Page
                  </div>
                </div>
              </a>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
              <Link
                to="/start-project"
                className="btn btn-primary"
                style={{
                  padding: '0.95rem 2.4rem',
                  fontSize: '0.98rem',
                  boxShadow: 'var(--shadow-glow)',
                }}
              >
                <span>{t.hero.startProjectBtn || 'Start a Project'}</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="btn btn-secondary"
                style={{
                  padding: '0.95rem 2rem',
                  fontSize: '0.98rem',
                }}
              >
                <span>Full Contact & Inquiry Form</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
