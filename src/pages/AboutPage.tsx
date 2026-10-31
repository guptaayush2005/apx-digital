import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sparkles, 
  Target, 
  Compass, 
  Lightbulb, 
  CheckCircle2, 
  ShieldCheck, 
  Rocket, 
  HeartHandshake, 
  ArrowRight,
  Code,
  Workflow
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LinkedinIcon } from '../components/BrandIcons';

export const AboutPage: React.FC = () => {
  const { t } = useLanguage();

  const values = [
    {
      icon: <Lightbulb size={28} />,
      title: t.about.value1Title,
      desc: t.about.value1Desc,
    },
    {
      icon: <ShieldCheck size={28} />,
      title: t.about.value2Title,
      desc: t.about.value2Desc,
    },
    {
      icon: <Sparkles size={28} />,
      title: t.about.value3Title,
      desc: t.about.value3Desc,
    },
    {
      icon: <HeartHandshake size={28} />,
      title: t.about.value4Title,
      desc: t.about.value4Desc,
    },
  ];

  return (
    <div className="about-page" style={{ paddingTop: '7rem', paddingBottom: '5rem' }}>
      {/* Header Banner */}
      <section className="section" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="badge"
            style={{ marginBottom: '1.5rem' }}
          >
            <span>{t.about.badge}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
              fontWeight: 900,
              marginBottom: '1.5rem',
            }}
          >
            {t.about.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              maxWidth: '750px',
              margin: '0 auto',
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
          >
            {t.about.tagline}
          </motion.p>
        </div>
      </section>

      {/* Who We Are & The Story */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '4rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="badge" style={{ marginBottom: '1.2rem' }}>
                <Rocket size={14} />
                <span>{t.aboutExtras.ourOriginsBadge}</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', marginBottom: '1.5rem', fontWeight: 800 }}>
                {t.about.whoWeAreTitle}
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                {t.about.whoWeAreText}
              </p>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
                {t.aboutExtras.originStory}
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <a
                  href="https://www.linkedin.com/company/apx-digital-india/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.65rem 1.4rem' }}
                >
                  <LinkedinIcon size={16} color="#0A66C2" />
                  <span>{t.aboutExtras.officialLinkedIn}</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            <div
              className="glass-card glow-card"
              style={{
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
              }}
            >
              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-subtle)',
                    color: 'var(--accent-primary)',
                    flexShrink: 0,
                  }}
                >
                  <Target size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                    {t.about.missionTitle}
                  </h3>
                  <p style={{ fontSize: '0.96rem', lineHeight: 1.65 }}>
                    "{t.about.missionText}"
                  </p>
                </div>
              </div>

              <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
                <div
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(56, 189, 248, 0.12)',
                    color: '#38BDF8',
                    flexShrink: 0,
                  }}
                >
                  <Compass size={26} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 700 }}>
                    {t.about.visionTitle}
                  </h3>
                  <p style={{ fontSize: '0.96rem', lineHeight: 1.65 }}>
                    "{t.about.visionText}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div className="badge" style={{ marginBottom: '1rem' }}>
              <span>{t.about.valuesTitle}</span>
            </div>
            <h2>
              {t.about.valuesTitle}
            </h2>
            <p>
              {t.aboutExtras.principlesSubtitle}
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25 }}
                className="glass-card"
                style={{ padding: '2.2rem' }}
              >
                <div style={{ color: 'var(--accent-primary)', marginBottom: '1.2rem' }}>
                  {val.icon}
                </div>
                <h3 style={{ fontSize: '1.28rem', marginBottom: '0.8rem', fontWeight: 700 }}>
                  {val.title}
                </h3>
                <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Approach Client Projects */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div className="badge" style={{ marginBottom: '1.2rem' }}>
                <Workflow size={14} />
                <span>{t.aboutExtras.methodologyBadge}</span>
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', marginBottom: '1.5rem', fontWeight: 800 }}>
                {t.about.approachTitle}
              </h2>
              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                {t.about.approachText}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.96rem' }}>
                    {t.aboutExtras.benefit1}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.96rem' }}>
                    {t.aboutExtras.benefit2}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle2 size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.96rem' }}>
                    {t.aboutExtras.benefit3}
                  </span>
                </div>
              </div>

              <Link to="/process" className="btn btn-secondary">
                <span>{t.aboutExtras.viewProcessBtn}</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            <div
              className="glass-card"
              style={{
                padding: '2.5rem',
                borderLeft: '4px solid var(--accent-primary)',
              }}
            >
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', fontWeight: 800 }}>
                {t.aboutExtras.commitmentTitle}
              </h3>
              <p style={{ fontSize: '0.98rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                {t.aboutExtras.commitmentText}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-primary)' }}>
                  <Code size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>Ayush Gupta & Prince Singh</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Co-Founders, APX Digital</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>
            {t.aboutExtras.exploreCtaTitle}
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 2.5rem auto' }}>
            {t.aboutExtras.exploreCtaSubtitle}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/services" className="btn btn-primary">
              <span>{t.nav.services}</span>
              <ArrowRight size={16} />
            </Link>
            <Link to="/team" className="btn btn-secondary">
              <span>{t.nav.team}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
