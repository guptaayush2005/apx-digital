import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  HelpCircle
} from 'lucide-react';
import { LinkedinIcon } from '../components/BrandIcons';

export const ContactPage: React.FC = () => {
  const { t, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage(t.contactExtras.validationName || 'Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          subject: formData.subject || 'Website Contact Form',
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMessage(data.error || t.contactExtras.errorDesc || t.contact.errorMessage);
      }
    } catch {
      setErrorMessage(t.contactExtras.errorDesc || t.contact.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = t.contactExtras.faqs || [];


  return (
    <div className="contact-page" style={{ paddingTop: '7rem', paddingBottom: '6rem' }}>
      {/* Header */}
      <section className="section" style={{ paddingTop: '2rem', paddingBottom: '3.5rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge" style={{ marginBottom: '1.5rem' }}>
            <span>{t.contact.badge}</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
              fontWeight: 900,
              maxWidth: '900px',
              margin: '0 auto 1.5rem auto',
            }}
          >
            {t.contact.title}
          </h1>
          <p
            style={{
              maxWidth: '750px',
              margin: '0 auto',
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
            }}
          >
            {t.contact.subtitle}
          </p>
        </div>
      </section>

      {/* Main Grid: Contact Channels + Direct Form */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'flex-start',
            }}
          >
            {/* Left: Verified Official Contact Channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.8rem' }}>
                  {t.contactExtras.channelDirectTitle}
                </h3>
                <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {t.contactExtras.channelDirectDesc}
                </p>
              </div>

              {/* Email Card */}
              <a
                href="mailto:guptaayush932589@gmail.com"
                className="glass-card"
                style={{
                  padding: '1.5rem 1.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--accent-subtle)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Mail size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                    {t.contact.emailUs}
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    guptaayush932589@gmail.com
                  </div>
                </div>
              </a>

              {/* Official LinkedIn Company Card */}
              <a
                href="https://www.linkedin.com/company/apx-digital-india/"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card glow-card"
                style={{
                  padding: '1.5rem 1.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(10,102,194,0.14)',
                    color: '#0A66C2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <LinkedinIcon size={24} color="#0A66C2" />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                    {t.contact.linkedinCompany}
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    APX Digital Official Company Page
                  </div>
                </div>
              </a>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/919519099011"
                target="_blank"
                rel="noreferrer"
                className="glass-card"
                style={{
                  padding: '1.5rem 1.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.2rem',
                }}
              >
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'rgba(37,211,102,0.12)',
                    color: '#25D366',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MessageSquare size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                    {t.contact.whatsappUs}
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    +91 9519099011
                  </div>
                </div>
              </a>

              {/* Response Time & Location Badge */}
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Clock size={18} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {language === 'en' ? 'Typical Response Window: 24 Hours' : 'प्रतिक्रिया समय: 24 घंटे के भीतर'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={18} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Greater Noida / Delhi NCR, India (Global Remote Delivery)
                  </span>
                </div>
              </div>

              {/* Leadership Social Links */}
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)', display: 'block', marginBottom: '0.8rem' }}>
                  {language === 'en' ? 'Direct Founder LinkedIn Profiles' : 'संस्थापकों के लिंक्डइन प्रोफाइल्स'}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <a
                    href="https://www.linkedin.com/in/ayush-gupta-844516330"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
                  >
                    <LinkedinIcon size={15} color="#0A66C2" />
                    <span>Ayush Gupta (Founder)</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/prince-singh-265767324/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
                  >
                    <LinkedinIcon size={15} color="#0A66C2" />
                    <span>Prince Singh (Partner)</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/komal-soni-profile"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}
                  >
                    <LinkedinIcon size={15} color="#0A66C2" />
                    <span>Komal Soni</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Functional Direct Message Form */}
            <div className="glass-card glow-card" style={{ padding: 'clamp(2rem, 4vw, 3rem)' }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                {t.contact.formTitle}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                {t.contactExtras.channelFounderDesc}
              </p>

              {submitted ? (
                <div
                  style={{
                    padding: '2.5rem',
                    textAlign: 'center',
                    backgroundColor: 'rgba(16,185,129,0.08)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(16,185,129,0.3)',
                  }}
                >
                  <div style={{ color: '#10B981', marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}>
                    <CheckCircle2 size={48} />
                  </div>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.8rem' }}>
                    {t.contactExtras.successTitle}
                  </h4>
                  <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                    {t.contact.successMessage}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-secondary"
                    style={{ padding: '0.6rem 1.4rem' }}
                  >
                    {t.contactExtras.sendBtn}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {errorMessage && (
                    <div
                      style={{
                        padding: '0.8rem 1rem',
                        marginBottom: '1.2rem',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#EF4444',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <AlertCircle size={16} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label" htmlFor="name">
                      {t.contact.nameLabel} *
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.contact.namePlaceholder}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      {t.contact.emailLabel} *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t.contact.emailPlaceholder}
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="subject">
                      {t.contact.subjectLabel}
                    </label>
                    <input
                      id="subject"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={t.contact.subjectPlaceholder}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="message">
                      {t.contact.messageLabel} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t.contact.messagePlaceholder}
                      className="form-textarea"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', marginTop: '0.5rem' }}
                  >
                    {isSubmitting ? (
                      <span>{t.contact.sendingBtn}</span>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>{t.contact.sendBtn}</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="section" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-subtle)', marginTop: '4rem' }}>
        <div className="container">
          <div className="section-header">
            <div className="badge" style={{ marginBottom: '1rem' }}>
              <HelpCircle size={14} />
              <span>{t.contactExtras.faqBadge}</span>
            </div>
            <h2>
              {t.contactExtras.faqTitle}
            </h2>
          </div>

          <div
            style={{
              maxWidth: '850px',
              margin: '0 auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '2rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
                  {faq.q}
                </h4>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
