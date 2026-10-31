import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Home, ArrowRight, AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '8rem 1.5rem',
      }}
    >
      <div className="glass-card" style={{ maxWidth: '560px', padding: '3.5rem 2rem' }}>
        <div style={{ color: 'var(--accent-primary)', marginBottom: '1.2rem', display: 'flex', justifyContent: 'center' }}>
          <AlertTriangle size={54} />
        </div>
        <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--accent-primary)', lineHeight: 1 }}>
          404
        </div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginTop: '1rem', marginBottom: '1rem' }}>
          {language === 'en' ? 'Page Not Found' : 'पेज नहीं मिला'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
          {language === 'en'
            ? 'The digital experience or page you requested could not be located. It may have moved or been updated.'
            : 'आपके द्वारा अनुरोधित पेज नहीं मिल सका। यह स्थानांतरित या अपडेट हो सकता है।'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>{t.nav.home}</span>
          </Link>
          <Link to="/contact" className="btn btn-secondary">
            <span>{t.nav.contact}</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
