import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { teamData } from '../data/teamData';
import { 
  Mail, 
  GraduationCap, 
  Award, 
  Code2, 
  Briefcase,
  Sparkles,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { LinkedinIcon, GithubIcon } from '../components/BrandIcons';
import { motion } from 'framer-motion';

export const TeamPage: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="team-page" style={{ paddingTop: '7rem', paddingBottom: '6rem' }}>
      {/* Header */}
      <section className="section" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge" style={{ marginBottom: '1.5rem' }}>
            <span>{t.team.badge}</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
              fontWeight: 900,
              maxWidth: '900px',
              margin: '0 auto 1.5rem auto',
            }}
          >
            {t.team.headline}
          </h1>
          <p
            style={{
              maxWidth: '740px',
              margin: '0 auto',
              fontSize: '1.2rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
          >
            {t.team.subheadline}
          </p>
        </div>
      </section>

      {/* Team Profiles List */}
      <section className="section" style={{ paddingTop: '1rem' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
          {teamData.map((member, index) => {
            const mKey = member.id as 'ayush' | 'prince' | 'komal';
            const mExtras = t.teamExtras?.members?.[mKey];
            const memberRole = mExtras?.designation || member.officialRole;
            const memberHighlights = mExtras?.highlights || (language === 'hi' ? member.professionalHighlights?.hi : member.professionalHighlights?.en) || [];
            const memberSummary = mExtras?.summary || (language === 'hi' ? member.summary.hi : member.summary.en);
            const memberEducation = mExtras?.education || (language === 'hi' ? member.education.hi : member.education.en);
            const memberKeyProjects = mExtras?.keyProjects || (language === 'hi' ? member.keyProjects.hi : member.keyProjects.en) || [];
            const memberAchievements = mExtras?.achievements || (language === 'hi' ? member.achievements.hi : member.achievements.en) || [];

            return (
              <motion.div
                key={member.id}
                id={member.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card glow-card"
                style={{
                  padding: 'clamp(2rem, 4vw, 3.5rem)',
                  overflow: 'hidden',
                }}
              >
                <div
                  className="team-profile-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(300px, 38%) 1fr',
                    gap: '2.5rem',
                    alignItems: 'flex-start',
                  }}
                >
                  {/* Member Left Column: Photo, Name/Role, Socials, Highlights, Verified Contact */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* 1 & 2. Photograph with Name & Designation */}
                    <div
                      style={{
                        width: '100%',
                        height: '390px',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: 'var(--bg-surface)',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          objectPosition: 'top center',
                          transition: 'transform 0.4s ease',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(8,9,11,0.9) 0%, rgba(8,9,11,0.2) 50%, transparent 100%)',
                        }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '1.2rem',
                          left: '1.2rem',
                          right: '1.2rem',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            letterSpacing: '0.08em',
                            color: 'var(--accent-contrast)',
                            background: 'var(--accent-gradient)',
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-sm)',
                            display: 'inline-block',
                            marginBottom: '6px',
                          }}
                        >
                          {memberRole}
                        </span>
                        <h2 style={{ fontSize: '1.75rem', color: '#FFFFFF', fontWeight: 900, lineHeight: 1.2 }}>
                          {member.name}
                        </h2>
                      </div>
                    </div>

                    {/* 3. Social & Contact Actions */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {member.socials.linkedin && (
                        <a
                          href={member.socials.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary"
                          style={{ flex: '1 1 auto', fontSize: '0.85rem', padding: '0.65rem 1rem', gap: '6px' }}
                        >
                          <LinkedinIcon size={16} color="#0A66C2" />
                          <span>{t.team.connectLinkedIn}</span>
                        </a>
                      )}

                      {member.socials.github && (
                        <a
                          href={member.socials.github}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary"
                          style={{ fontSize: '0.85rem', padding: '0.65rem 0.9rem' }}
                          title="GitHub Profile"
                        >
                          <GithubIcon size={16} />
                        </a>
                      )}

                      {member.socials.email && (
                        <a
                          href={`mailto:${member.socials.email}`}
                          className="btn btn-secondary"
                          style={{ fontSize: '0.85rem', padding: '0.65rem 0.9rem' }}
                          title="Send Direct Email"
                        >
                          <Mail size={16} style={{ color: 'var(--accent-primary)' }} />
                        </a>
                      )}
                    </div>

                    {/* 4. Professional Highlights card */}
                    {memberHighlights.length > 0 && (
                      <div
                        className="glass-card"
                        style={{
                          padding: '1.35rem 1.4rem',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--bg-surface)',
                          border: '1px solid var(--border-highlight)',
                          boxShadow: 'var(--shadow-sm)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.85rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.6rem' }}>
                          <Sparkles size={17} style={{ color: 'var(--accent-primary)' }} />
                          <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                            {t.teamExtras.professionalHighlightsTitle}
                          </h3>
                        </div>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '9px' }}>
                          {memberHighlights.map((highlight: string, hIdx: number) => (
                            <li
                              key={hIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '9px',
                                fontSize: '0.86rem',
                                lineHeight: 1.5,
                                color: 'var(--text-secondary)',
                              }}
                            >
                              <CheckCircle2 size={15} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* 5. Additional verified profile information */}
                    {member.socials.whatsapp && (
                      <div
                        style={{
                          padding: '0.75rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'rgba(37, 211, 102, 0.08)',
                          border: '1px solid rgba(37, 211, 102, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <span style={{ fontSize: '0.8rem', color: '#25D366', fontWeight: 700 }}>
                          {t.teamExtras.verifiedDirectChannel}
                        </span>
                        <a
                          href={member.socials.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            color: '#25D366',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span>WhatsApp</span>
                          <ArrowUpRight size={13} />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Member Details Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                    {/* Bio Summary */}
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.8rem', color: 'var(--text-primary)' }}>
                        {t.teamExtras.professionalBiographyTitle}
                      </h3>
                      <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                        {memberSummary}
                      </p>
                    </div>

                    {/* Education */}
                    <div
                      style={{
                        padding: '1.2rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                      }}
                    >
                      <div style={{ color: 'var(--accent-primary)', marginTop: '2px' }}>
                        <GraduationCap size={22} />
                      </div>
                      <div>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', display: 'block', marginBottom: '2px' }}>
                          {t.teamExtras.educationTitle}
                        </span>
                        <p style={{ fontSize: '0.94rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {memberEducation}
                        </p>
                      </div>
                    </div>

                    {/* Skills Grid */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                        <Code2 size={18} style={{ color: 'var(--accent-primary)' }} />
                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
                          {t.teamExtras.coreSkillsTitle}
                        </h4>
                      </div>

                      {member.categorizedSkills ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {member.categorizedSkills.map((cat, cIdx) => (
                            <div key={cIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  fontWeight: 700,
                                  color: 'var(--accent-primary)',
                                  minWidth: '135px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.04em',
                                }}
                              >
                                {language === 'hi' ? cat.category.hi : cat.category.en}:
                              </span>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                {cat.skills.map((skill) => (
                                  <span
                                    key={skill}
                                    style={{
                                      fontSize: '0.8rem',
                                      fontWeight: 600,
                                      padding: '3px 10px',
                                      borderRadius: 'var(--radius-full)',
                                      backgroundColor: 'var(--bg-surface)',
                                      color: 'var(--text-primary)',
                                      border: '1px solid var(--border-subtle)',
                                    }}
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {member.technicalSkills.map((skill) => (
                            <span
                              key={skill}
                              style={{
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                padding: '4px 12px',
                                borderRadius: 'var(--radius-full)',
                                backgroundColor: 'var(--bg-surface)',
                                color: 'var(--text-primary)',
                                border: '1px solid var(--border-subtle)',
                              }}
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Key Projects */}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                        <Briefcase size={18} style={{ color: '#38BDF8' }} />
                        <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
                          {t.teamExtras.keyProjectsTitle}
                        </h4>
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {memberKeyProjects.map((proj: string, pIdx: number) => (
                          <li key={pIdx} style={{ display: 'flex', gap: '10px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                            <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>•</span>
                            <span>{proj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Achievements */}
                    {memberAchievements.length > 0 && (
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                          <Award size={18} style={{ color: '#F59E0B' }} />
                          <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
                            {t.teamExtras.achievementsTitle}
                          </h4>
                        </div>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {memberAchievements.map((ach: string, aIdx: number) => (
                            <li key={aIdx} style={{ display: 'flex', gap: '10px', fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                              <span style={{ color: '#F59E0B' }}>★</span>
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Certifications */}
                    {member.certifications.length > 0 && (
                      <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>
                          {t.teamExtras.certificationsTitle}:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {member.certifications.map((cert) => (
                            <span
                              key={cert}
                              style={{
                                fontSize: '0.76rem',
                                padding: '3px 10px',
                                borderRadius: 'var(--radius-sm)',
                                backgroundColor: 'var(--accent-subtle)',
                                color: 'var(--accent-primary)',
                                border: '1px solid var(--border-highlight)',
                              }}
                            >
                              {cert}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* Official Company Profile Banner */}
          <div
            className="glass-card glow-card"
            style={{
              padding: '2.5rem',
              borderRadius: 'var(--radius-xl)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.2rem',
              background: 'linear-gradient(135deg, var(--accent-subtle) 0%, var(--bg-card) 100%)',
              border: '1px solid var(--border-highlight)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LinkedinIcon size={24} color="#0A66C2" />
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                {t.footer.officialLinkedInPage}
              </h3>
            </div>
            <p style={{ maxWidth: '600px', color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.6 }}>
              {t.contact.linkedinCompany}
            </p>
            <a
              href="https://www.linkedin.com/company/apx-digital-india/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ padding: '0.8rem 2rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <LinkedinIcon size={16} color="currentColor" />
              <span>{t.contact.followCompanyBtn}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
