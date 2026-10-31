import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { servicesData } from '../data/servicesData';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Lock,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

export const StartProjectPage: React.FC = () => {
  const { t, language } = useLanguage();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    timeline: '',
    description: '',
    reference: '',
    additionalReqs: '',
    _gotcha: '', // Honeypot field for spam prevention
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check URL query params for pre-selected service
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const serviceParam = params.get('service');
    if (serviceParam) {
      setFormData((prev) => ({ ...prev, service: serviceParam }));
    }
  }, [location.search]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Spam honeypot check
    if (formData._gotcha) {
      console.warn('Bot detected via honeypot');
      return;
    }

    // Validation
    if (!formData.fullName.trim()) {
      setErrorMessage(t.startProjectExtras.errorFillRequired || 'Please provide your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage(t.contactExtras.validationEmail || 'Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage(t.startProjectExtras.errorFillRequired || 'Please provide a valid phone/WhatsApp number.');
      return;
    }
    if (!formData.service) {
      setErrorMessage(t.startProjectExtras.errorSelectService || 'Please choose a primary required service.');
      return;
    }
    if (!formData.budget) {
      setErrorMessage(t.startProjectExtras.errorFillRequired || 'Please select an estimated budget range.');
      return;
    }
    if (!formData.timeline) {
      setErrorMessage(t.startProjectExtras.errorFillRequired || 'Please select a delivery timeline.');
      return;
    }
    if (!formData.description.trim()) {
      setErrorMessage(t.contactExtras.validationMessage || 'Please describe your project scope and goals.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company || '',
          service: formData.service,
          budget: formData.budget,
          timeline: formData.timeline,
          description: formData.description,
          reference: formData.reference || '',
          additionalReqs: formData.additionalReqs || '',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF8C32', '#FFB15C', '#FFFFFF', '#10B981'],
        });
      } else {
        setErrorMessage(data.error || t.contactExtras.errorDesc || 'Failed to submit proposal. Please try again.');
      }
    } catch {
      setErrorMessage(t.contactExtras.errorDesc || 'Network error. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const budgetOptions = t.startProjectExtras.budgetTiers || [
    '₹15,000 – ₹35,000 ($200 – $450) — Starter / MVP',
    '₹35,000 – ₹75,000 ($450 – $950) — Growth Business',
    '₹75,000 – ₹1,50,000 ($950 – $1,800) — Custom Platform / AI',
    '₹1,50,000+ ($1,800+) — Enterprise / Full Digital Suite',
  ];

  const timelineOptions = t.startProjectExtras.timelineOptions || [
    'Urgent (< 2 Weeks)',
    'Standard (2 – 4 Weeks)',
    'Comprehensive (1 – 2 Months)',
    'Flexible / Milestone Driven',
  ];

  return (
    <div className="start-project-page" style={{ paddingTop: '7rem', paddingBottom: '6rem' }}>
      {/* Header */}
      <section className="section" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="badge" style={{ marginBottom: '1.5rem' }}>
            <Sparkles size={14} />
            <span>{t.startProject.badge}</span>
          </div>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
              fontWeight: 900,
              maxWidth: '900px',
              margin: '0 auto 1.5rem auto',
            }}
          >
            {t.startProject.title}
          </h1>
          <p
            style={{
              maxWidth: '750px',
              margin: '0 auto',
              fontSize: '1.15rem',
              color: 'var(--text-secondary)',
            }}
          >
            {t.startProject.subtitle}
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <div className="glass-card glow-card" style={{ padding: 'clamp(2rem, 5vw, 3.8rem)' }}>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 1rem',
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(16,185,129,0.12)',
                    color: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.8rem auto',
                    boxShadow: '0 0 30px rgba(16,185,129,0.25)',
                  }}
                >
                  <CheckCircle2 size={44} />
                </div>

                <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                  {t.startProject.successTitle}
                </h2>

                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
                  {t.startProject.successDesc}
                </p>

                <div
                  style={{
                    padding: '1.5rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '2.5rem',
                    textAlign: 'left',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '4px', color: 'var(--accent-primary)' }}>
                    {language === 'en' ? 'Next Steps:' : 'आगे के चरण:'}
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    {language === 'en'
                      ? '1. Founder Ayush Gupta will review your technical specifications.\n2. We will prepare an architectural summary and estimated timeline.\n3. We will email or WhatsApp you to schedule an initial discovery alignment call.'
                      : '1. संस्थापक आयुष गुप्ता आपकी आवश्यकताओं की समीक्षा करेंगे।\n2. हम एक अनुमानित वास्तुकला योजना तैयार करेंगे।\n3. हम परिचयात्मक चर्चा के लिए आपसे संपर्क करेंगे।'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      company: '',
                      service: '',
                      budget: '',
                      timeline: '',
                      description: '',
                      reference: '',
                      additionalReqs: '',
                      _gotcha: '',
                    });
                  }}
                  className="btn btn-secondary"
                  style={{ padding: '0.85rem 2rem' }}
                >
                  {t.startProject.anotherInquiryBtn}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Honeypot Spam Protection Field */}
                <input
                  type="text"
                  name="_gotcha"
                  value={formData._gotcha}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                {errorMessage && (
                  <div
                    style={{
                      padding: '1rem',
                      marginBottom: '1.8rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#EF4444',
                      fontSize: '0.94rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <AlertCircle size={18} />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Section 1: Contact Details */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.2rem', color: 'var(--accent-primary)' }}>
                    1. {t.startProjectExtras.step1Title}
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="fullName">
                        {t.startProject.fullName}
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Ayush Gupta"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="email">
                        {t.startProject.email}
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="phone">
                        {t.startProject.phone}
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 9519099011"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="company">
                        {t.startProject.company}
                      </label>
                      <input
                        id="company"
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Nexus Innovations"
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Service & Scope */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.2rem', color: 'var(--accent-primary)' }}>
                    2. {t.startProjectExtras.step2Title}
                  </h3>

                  <div className="form-group">
                    <label className="form-label" htmlFor="service">
                      {t.startProject.service}
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">{t.startProject.servicePrompt}</option>
                      {servicesData.map((s, idx) => (
                        <option key={s.id} value={s.title.en}>
                          {t.services.items[idx]?.title || s.title.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
                    <div className="form-group">
                      <label className="form-label" htmlFor="budget">
                        {t.startProject.budget}
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">{t.startProject.budgetPrompt}</option>
                        {budgetOptions.map((b, i) => (
                          <option key={i} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="timeline">
                        {t.startProject.timeline}
                      </label>
                      <select
                        id="timeline"
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="form-select"
                        required
                      >
                        <option value="">{t.startProject.timelinePrompt}</option>
                        {timelineOptions.map((tm, i) => (
                          <option key={i} value={tm}>
                            {tm}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="description">
                      {t.startProject.description}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={5}
                      value={formData.description}
                      onChange={handleChange}
                      placeholder={t.startProject.descriptionPrompt}
                      className="form-textarea"
                      required
                    />
                  </div>
                </div>

                {/* Section 3: References & Constraints */}
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.2rem', color: 'var(--accent-primary)' }}>
                    3. {t.startProjectExtras.step3Title}
                  </h3>

                  <div className="form-group">
                    <label className="form-label" htmlFor="reference">
                      {t.startProject.reference}
                    </label>
                    <input
                      id="reference"
                      type="text"
                      name="reference"
                      value={formData.reference}
                      onChange={handleChange}
                      placeholder={t.startProject.referencePrompt}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="additionalReqs">
                      {t.startProject.additionalReqs}
                    </label>
                    <textarea
                      id="additionalReqs"
                      name="additionalReqs"
                      rows={3}
                      value={formData.additionalReqs}
                      onChange={handleChange}
                      placeholder={t.startProject.additionalPrompt}
                      className="form-textarea"
                    />
                  </div>
                </div>

                {/* Privacy Assurance Notice */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '1rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--bg-surface)',
                    marginBottom: '1.8rem',
                    fontSize: '0.86rem',
                    color: 'var(--text-muted)',
                  }}
                >
                  <Lock size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
                  <span>
                    {t.startProjectExtras.privacyNotice}
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '1.1rem', fontSize: '1.05rem', fontWeight: 800 }}
                >
                  {isSubmitting ? (
                    <span>{t.startProject.submittingBtn}</span>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>{t.startProject.submitBtn}</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
