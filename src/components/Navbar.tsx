import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { Menu, X, ArrowUpRight, Sparkles, ShieldCheck, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLight = theme === 'light';
  const navLogoSrc = isLight ? '/brand/apx-logo-light-tight.jpg' : '/brand/apx-logo-tight.jpg';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.3s ease',
          backgroundColor: isScrolled ? 'var(--bg-nav)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 clamp(1rem, 2vw, 2rem)',
            gap: '0.8rem',
            whiteSpace: 'nowrap',
          }}
        >
          {/* 1. Brand Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            aria-label="APX Digital Home"
          >
            <img
              src={navLogoSrc}
              alt="APX Digital"
              style={{
                height: '38px',
                width: 'auto',
                borderRadius: '8px',
                display: 'block',
                boxShadow: isLight ? '0 2px 8px rgba(21, 94, 239, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.18)',
                border: isLight ? '1px solid #DCE6F5' : '1px solid rgba(255, 140, 50, 0.2)',
              }}
            />
          </Link>

          {/* 2. Desktop Navigation Bar: ONE SINGLE HORIZONTAL LINE */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 'clamp(0.35rem, 0.8vw, 0.95rem)',
              whiteSpace: 'nowrap',
              flexShrink: 1,
            }}
            className="desktop-nav"
          >
            {/* 1. Home */}
            <NavLink
              to="/"
              className={({ isActive }) => `apx-nav-link ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <span>{t.nav.home || 'Home'}</span>
                  {isActive && <motion.div layoutId="navActiveLine" className="apx-nav-indicator" />}
                </>
              )}
            </NavLink>

            {/* 2. About */}
            <NavLink
              to="/about"
              className={({ isActive }) => `apx-nav-link ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <span>{t.nav.about || 'About'}</span>
                  {isActive && <motion.div layoutId="navActiveLine" className="apx-nav-indicator" />}
                </>
              )}
            </NavLink>

            {/* 3. Services */}
            <NavLink
              to="/services"
              className={({ isActive }) => `apx-nav-link ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <span>{t.nav.services || 'Services'}</span>
                  {isActive && <motion.div layoutId="navActiveLine" className="apx-nav-indicator" />}
                </>
              )}
            </NavLink>

            {/* 4. Our Work */}
            <NavLink
              to="/portfolio"
              className={({ isActive }) => `apx-nav-link ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <span>{t.nav.portfolio || 'Our Work'}</span>
                  {isActive && <motion.div layoutId="navActiveLine" className="apx-nav-indicator" />}
                </>
              )}
            </NavLink>

            {/* 5. Our Team */}
            <NavLink
              to="/team"
              className={({ isActive }) => `apx-nav-link ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <span>{t.nav.team || 'Our Team'}</span>
                  {isActive && <motion.div layoutId="navActiveLine" className="apx-nav-indicator" />}
                </>
              )}
            </NavLink>

            {/* 6. Our Process */}
            <NavLink
              to="/process"
              className={({ isActive }) => `apx-nav-link ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <span>{t.nav.process || 'Our Process'}</span>
                  {isActive && <motion.div layoutId="navActiveLine" className="apx-nav-indicator" />}
                </>
              )}
            </NavLink>

            {/* 7. Contact Us */}
            <NavLink
              to="/contact"
              className={({ isActive }) => `apx-nav-link ${isActive ? 'active' : ''}`}
            >
              {({ isActive }) => (
                <>
                  <span>{t.nav.contact || 'Contact Us'}</span>
                  {isActive && <motion.div layoutId="navActiveLine" className="apx-nav-indicator" />}
                </>
              )}
            </NavLink>

            {/* 8. Build a Resume — Normal Nav Link Immediately After Contact Us */}
            <a
              href="https://apx-resume-builder.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="apx-nav-link"
              title="Build a Resume with APX Digital"
            >
              <span>{t.nav.buildResume || 'Build a Resume'}</span>
            </a>
          </nav>

          {/* 3. Desktop Actions: 9. Language | 10. Theme | 11. Admin | 12. Start Project */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '0.65rem',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
            className="desktop-actions"
          >
            {/* 9. Language Selector */}
            <LanguageToggle />

            {/* 10. Theme Toggle */}
            <ThemeToggle />

            {/* 11. Admin Login */}
            <Link
              to="/admin/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
              }}
              className="admin-login-nav-btn"
              aria-label="Admin Portal Login"
              title="Admin Login"
            >
              <ShieldCheck size={18} />
            </Link>

            {/* 12. Start a Project */}
            <Link
              to="/start-project"
              className="btn btn-primary"
              style={{
                fontSize: '0.86rem',
                fontWeight: 800,
                height: '38px',
                padding: '0 1.15rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                borderRadius: 'var(--radius-full)',
                whiteSpace: 'nowrap',
              }}
            >
              <span>{t.nav.startProject || 'Start a Project'}</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>

          {/* 4. Mobile Controls & Hamburger Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0,
            }}
            className="mobile-actions-bar"
          >
            <LanguageToggle />
            <ThemeToggle />
            <Link
              to="/admin/login"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                textDecoration: 'none',
                flexShrink: 0,
              }}
              aria-label="Admin Portal Login"
              title="Admin Login"
            >
              <ShieldCheck size={17} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'var(--bg-primary)',
              zIndex: 999,
              padding: '1.25rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            {/* Exact 1-8 Sequence in Mobile Drawer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', paddingTop: '0.25rem' }}>
              {/* 1. Home */}
              <NavLink
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-drawer-link"
              >
                <span>{t.nav.home || 'Home'}</span>
                <ArrowUpRight size={18} style={{ opacity: 0.4 }} />
              </NavLink>

              {/* 2. About */}
              <NavLink
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-drawer-link"
              >
                <span>{t.nav.about || 'About'}</span>
                <ArrowUpRight size={18} style={{ opacity: 0.4 }} />
              </NavLink>

              {/* 3. Services */}
              <NavLink
                to="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-drawer-link"
              >
                <span>{t.nav.services || 'Services'}</span>
                <ArrowUpRight size={18} style={{ opacity: 0.4 }} />
              </NavLink>

              {/* 4. Our Work */}
              <NavLink
                to="/portfolio"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-drawer-link"
              >
                <span>{t.nav.portfolio || 'Our Work'}</span>
                <ArrowUpRight size={18} style={{ opacity: 0.4 }} />
              </NavLink>

              {/* 5. Our Team */}
              <NavLink
                to="/team"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-drawer-link"
              >
                <span>{t.nav.team || 'Our Team'}</span>
                <ArrowUpRight size={18} style={{ opacity: 0.4 }} />
              </NavLink>

              {/* 6. Our Process */}
              <NavLink
                to="/process"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-drawer-link"
              >
                <span>{t.nav.process || 'Our Process'}</span>
                <ArrowUpRight size={18} style={{ opacity: 0.4 }} />
              </NavLink>

              {/* 7. Contact Us */}
              <NavLink
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-drawer-link"
              >
                <span>{t.nav.contact || 'Contact Us'}</span>
                <ArrowUpRight size={18} style={{ opacity: 0.4 }} />
              </NavLink>

              {/* 8. Build a Resume — Normal Link Immediately After Contact Us */}
              <a
                href="https://apx-resume-builder.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-drawer-link"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span>{t.nav.buildResume || 'Build a Resume'}</span>
                </div>
                <ArrowUpRight size={18} style={{ opacity: 0.4 }} />
              </a>
            </div>

            {/* 9-12 Items in Drawer Footer: Language, Theme, Admin, Start Project */}
            <div
              style={{
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                marginTop: '1rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Language & Theme
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* 9. Language Selector */}
                  <LanguageToggle />
                  {/* 10. Theme Toggle */}
                  <ThemeToggle />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.65rem' }}>
                {/* 11. Admin Login */}
                <Link
                  to="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary"
                  style={{
                    flex: 1,
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    gap: '6px',
                  }}
                >
                  <ShieldCheck size={17} />
                  <span>Admin</span>
                </Link>

                {/* 12. Start a Project */}
                <Link
                  to="/start-project"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{
                    flex: 1.6,
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.88rem',
                    fontWeight: 800,
                    gap: '6px',
                  }}
                >
                  <Sparkles size={16} />
                  <span>{t.nav.startProject || 'Start a Project'}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        /* Desktop Navigation Links */
        .apx-nav-link {
          position: relative;
          padding: 6px 9px;
          font-size: 0.86rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.18s ease;
          letter-spacing: 0.01em;
          display: inline-flex;
          align-items: center;
          white-space: nowrap;
          border-radius: var(--radius-sm);
        }

        .apx-nav-link:hover {
          color: var(--text-primary);
          background-color: var(--bg-surface);
        }

        .apx-nav-link.active {
          color: var(--accent-primary);
          font-weight: 700;
        }

        .apx-nav-indicator {
          position: absolute;
          bottom: -2px;
          left: 6px;
          right: 6px;
          height: 2px;
          border-radius: 2px;
          background: var(--accent-gradient);
        }

        /* Mobile Drawer Links */
        .mobile-drawer-link {
          font-size: 1rem;
          font-weight: 700;
          padding: 0.65rem 0.9rem;
          border-radius: var(--radius-md);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justifyContent: space-between;
          text-decoration: none;
          transition: background-color 0.18s;
        }

        .mobile-drawer-link:hover {
          background-color: var(--bg-surface);
        }

        .mobile-drawer-link.active {
          color: var(--accent-primary);
          background-color: var(--accent-subtle);
        }

        /* Clean breakpoint: Single line on desktop (≥1180px), clean mobile drawer below */
        @media (min-width: 1180px) {
          .desktop-nav { display: flex !important; }
          .desktop-actions { display: flex !important; }
          .mobile-actions-bar { display: none !important; }
        }
        @media (max-width: 1179px) {
          .desktop-nav { display: none !important; }
          .desktop-actions { display: none !important; }
          .mobile-actions-bar { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
