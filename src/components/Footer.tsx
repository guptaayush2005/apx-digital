import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Mail, MessageSquare, ArrowUp, ShieldCheck, FileText, ExternalLink } from 'lucide-react';
import { LinkedinIcon } from './BrandIcons';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const isLight = theme === 'light';
  const footerLogoSrc = isLight ? '/brand/apx-logo-light-tight.jpg' : '/brand/apx-logo-tight.jpg';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        paddingTop: '4.5rem',
        paddingBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient glow */}
      <div
        className="ambient-glow"
        style={{
          top: '-150px',
          right: '-100px',
          opacity: 0.5,
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {/* Col 1: Brand Info */}
          <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '1.2rem' }}>
              <img
                src={footerLogoSrc}
                alt="APX Digital"
                style={{
                  height: '46px',
                  width: 'auto',
                  borderRadius: '8px',
                  display: 'block',
                  boxShadow: isLight ? '0 2px 10px rgba(21, 94, 239, 0.12)' : '0 2px 10px rgba(0, 0, 0, 0.2)',
                  border: isLight ? '1px solid #DCE6F5' : '1px solid rgba(255, 140, 50, 0.2)',
                }}
              />
            </Link>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '320px' }}>
              {t.footer.description}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.9rem', borderRadius: 'var(--radius-full)', background: 'var(--accent-subtle)', border: '1px solid var(--border-highlight)', width: 'fit-content' }}>
                <div className="badge-dot" />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.08em' }}>
                  BUILD. CREATE. INNOVATE.
                </span>
              </div>
              <a
                href="https://www.linkedin.com/company/apx-digital-india/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  width: 'fit-content',
                  transition: 'all 0.2s ease',
                }}
              >
                <LinkedinIcon size={16} color="#0A66C2" />
                <span>APX Digital on LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '1.2rem',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
              }}
            >
              {t.footer.quickLinks}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link to="/about" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  {t.nav.about}
                </Link>
              </li>
              <li>
                <Link to="/services" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  {t.nav.services}
                </Link>
              </li>
              <li>
                <Link to="/portfolio" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  {t.nav.portfolio}
                </Link>
              </li>
              <li>
                <Link to="/team" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  {t.nav.team || 'Our Team'}
                </Link>
              </li>
              <li>
                <Link to="/process" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  {t.nav.process || 'Our Process'}
                </Link>
              </li>
              <li>
                <Link to="/contact" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  {t.nav.contact || 'Contact Us'}
                </Link>
              </li>
              <li>
                <Link
                  to="/resume-builder"
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.92rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>{t.nav.buildResume || 'Build a Resume'}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '1.2rem',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
              }}
            >
              {t.footer.allServices}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <a
                  href="https://apx-resume-builder.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'var(--accent-primary)',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>Free Resume Builder</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 900,
                      backgroundColor: 'var(--accent-primary)',
                      color: 'var(--accent-contrast)',
                      padding: '1px 6px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    FREE TOOL
                  </span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <Link to="/services#web-dev" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  Website Development
                </Link>
              </li>
              <li>
                <Link to="/services#app-dev" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  App Development
                </Link>
              </li>
              <li>
                <Link to="/services#ai-solutions" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  AI Solutions & Automation
                </Link>
              </li>
              <li>
                <Link to="/services#video-editing" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  Video Editing & Motion
                </Link>
              </li>
              <li>
                <Link to="/services#graphic-design" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  Graphic Design & Branding
                </Link>
              </li>
              <li>
                <Link to="/services#presentation-design" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  Presentation Design
                </Link>
              </li>
              <li>
                <Link to="/services#digital-marketing" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  Digital Marketing Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Leadership & Contact */}
          <div>
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '1.2rem',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
              }}
            >
              {t.footer.connectWithUs}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a
                href="https://www.linkedin.com/company/apx-digital-india/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--text-primary)',
                  fontSize: '0.92rem',
                  fontWeight: 600,
                }}
              >
                <LinkedinIcon size={18} color="#0A66C2" />
                <span>APX Digital (Official Page)</span>
              </a>

              <a
                href="mailto:guptaayush932589@gmail.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                }}
              >
                <Mail size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                <span>guptaayush932589@gmail.com</span>
              </a>

              <a
                href="https://wa.me/919519099011"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: 'var(--text-secondary)',
                  fontSize: '0.92rem',
                }}
              >
                <MessageSquare size={16} style={{ color: '#25D366', flexShrink: 0 }} />
                <span>WhatsApp: +91 9519099011</span>
              </a>

              <div style={{ marginTop: '0.8rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem' }}>
                  Founding Profiles:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <a
                    href="https://www.linkedin.com/in/ayush-gupta-844516330"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <LinkedinIcon size={14} color="#0A66C2" />
                    <span>Ayush (Founder)</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/prince-singh-265767324/"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <LinkedinIcon size={14} color="#0A66C2" />
                    <span>Prince (Partner)</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/komal-soni-profile"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '0.8rem',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <LinkedinIcon size={14} color="#0A66C2" />
                    <span>Komal (Founding Team)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with legal & back to top */}
        <div
          style={{
            paddingTop: '2rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            {t.footer.rightsReserved}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.86rem' }}>
            <button
              onClick={() => setModalType('privacy')}
              style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}
            >
              {t.footer.privacyPolicy}
            </button>
            <button
              onClick={() => setModalType('terms')}
              style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}
            >
              {t.footer.termsAndConditions}
            </button>
            <button
              onClick={scrollToTop}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
              aria-label="Scroll back to top"
            >
              <span>Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Draft Legal Modals */}
      {modalType && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.75)',
            backdropFilter: 'blur(8px)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={() => setModalType(null)}
        >
          <div
            className="glass-card"
            style={{
              maxWidth: '640px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '2.5rem',
              backgroundColor: 'var(--bg-primary)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {modalType === 'privacy' ? <ShieldCheck size={24} style={{ color: 'var(--accent-primary)' }} /> : <FileText size={24} style={{ color: 'var(--accent-primary)' }} />}
                <h3 style={{ fontSize: '1.4rem' }}>
                  {modalType === 'privacy' ? 'APX Digital — Privacy Policy' : 'APX Digital — Terms & Conditions'}
                </h3>
              </div>
              <button
                onClick={() => setModalType(null)}
                style={{ fontSize: '1.2rem', color: 'var(--text-muted)', padding: '4px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {modalType === 'privacy' ? (
                <>
                  <p>
                    <strong>1. Information Collection:</strong> APX Digital collects contact details (such as full name, email address, phone number, and project specifications) exclusively submitted through our contact and project inquiry forms for communication and proposal generation.
                  </p>
                  <p>
                    <strong>2. Data Usage & Protection:</strong> We do not sell, rent, or distribute personal data to third parties. Information is used strictly by founders Ayush Gupta and Prince Singh to assess project feasibility and deliver digital services.
                  </p>
                  <p>
                    <strong>3. Local Storage:</strong> Our website uses client-side localStorage to remember your theme (dark/light) and preferred language (English/Hindi) for a seamless browsing experience.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <strong>1. Scope of Services:</strong> APX Digital delivers bespoke digital services including website development, app development, AI solutions, graphic branding, video editing, and presentation design agreed upon in formal project statements of work.
                  </p>
                  <p>
                    <strong>2. Intellectual Property:</strong> Upon full project settlement, all agreed custom deliverables and source code created specifically for the client are transferred to the client, while underlying re-usable engineering frameworks remain APX Digital property.
                  </p>
                  <p>
                    <strong>3. Confidentiality:</strong> Both parties maintain strict confidentiality regarding proprietary business logic, client datasets, and private operational information.
                  </p>
                </>
              )}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
              <button
                onClick={() => setModalType(null)}
                className="btn btn-primary"
                style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
