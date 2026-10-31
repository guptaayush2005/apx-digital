export type Language = 
  | 'en' 
  | 'hi' 
  | 'es' 
  | 'fr' 
  | 'de' 
  | 'pt' 
  | 'ar' 
  | 'zh' 
  | 'ja' 
  | 'ko' 
  | 'ru' 
  | 'it';

export interface LanguageMeta {
  code: Language;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'zh', name: 'Chinese', nativeName: '简体中文', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', dir: 'ltr' },
];

export interface Translations {
  nav: {
    home: string;
    about: string;
    services: string;
    portfolio: string;
    team: string;
    process: string;
    contact: string;
    buildResume?: string;
    startProject: string;
  };
  hero: {
    badge: string;
    headlinePart1: string;
    headlinePart2: string;
    subheadline: string;
    startProjectBtn: string;
    exploreWorkBtn: string;
    meetTeamBtn: string;
    stat1Label: string;
    stat2Label: string;
    stat3Label: string;
    stat4Label: string;
  };
  about: {
    badge: string;
    headline: string;
    tagline: string;
    whoWeAreTitle: string;
    whoWeAreText: string;
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
    valuesTitle: string;
    value1Title: string;
    value1Desc: string;
    value2Title: string;
    value2Desc: string;
    value3Title: string;
    value3Desc: string;
    value4Title: string;
    value4Desc: string;
    approachTitle: string;
    approachText: string;
    whyChooseTitle: string;
    whyChoose1Title: string;
    whyChoose1Desc: string;
    whyChoose2Title: string;
    whyChoose2Desc: string;
    whyChoose3Title: string;
    whyChoose3Desc: string;
    whyChoose4Title: string;
    whyChoose4Desc: string;
  };
  services: {
    badge: string;
    title: string;
    subtitle: string;
    deliverablesLabel: string;
    benefitsLabel: string;
    getQuoteBtn: string;
    discussBtn: string;
    items: {
      title: string;
      desc: string;
    }[];
  };
  portfolio: {
    badge: string;
    title: string;
    subtitle: string;
    viewProjectBtn: string;
    verifiedBadge: string;
    techStackLabel: string;
    keyDeliverablesLabel: string;
  };
  team: {
    badge: string;
    headline: string;
    subheadline: string;
    connectLinkedIn: string;
    roles: {
      founder: string;
      foundingPartner: string;
      foundingTeamMember: string;
    };
  };
  whyUs: {
    badge: string;
    title: string;
    subtitle: string;
    pillars: {
      title: string;
      desc: string;
    }[];
  };
  process: {
    badge: string;
    title: string;
    subtitle: string;
    steps: {
      step: string;
      name: string;
      desc: string;
    }[];
  };
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    emailUs: string;
    whatsappUs: string;
    phoneUs: string;
    linkedinCompany: string;
    followCompanyBtn: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendBtn: string;
    sendingBtn: string;
    successMessage: string;
    errorMessage: string;
  };
  startProject: {
    badge: string;
    title: string;
    subtitle: string;
    fullName: string;
    email: string;
    phone: string;
    company: string;
    service: string;
    servicePrompt: string;
    budget: string;
    budgetPrompt: string;
    timeline: string;
    timelinePrompt: string;
    description: string;
    descriptionPrompt: string;
    reference: string;
    referencePrompt: string;
    additionalReqs: string;
    additionalPrompt: string;
    submitBtn: string;
    submittingBtn: string;
    successTitle: string;
    successDesc: string;
    anotherInquiryBtn: string;
  };
  footer: {
    tagline: string;
    description: string;
    quickLinks: string;
    allServices: string;
    connectWithUs: string;
    officialEmail: string;
    rightsReserved: string;
    privacyPolicy: string;
    termsAndConditions: string;
    officialLinkedInPage: string;
  };
  aboutExtras: AboutExtras;
  teamExtras: TeamExtras;
  servicesExtras: ServicesExtras;
  processExtras: ProcessExtras;
  contactExtras: ContactExtras;
  startProjectExtras: StartProjectExtras;
  portfolioExtras: PortfolioExtras;
  chat: ChatTranslations;
  adminLoginExtras: AdminLoginExtras;
  resumeBuilder?: ResumeBuilderTranslations;
}

export interface ResumeBuilderTranslations {
  badge: string;
  title: string;
  shortDesc: string;
  homeHeading: string;
  homeSubtitle: string;
  ctaBtn: string;
  freeBadge: string;
  features: string[];
}

export interface AboutExtras {
  ourOriginsBadge: string;
  originStory: string;
  officialLinkedIn: string;
  principlesSubtitle: string;
  methodologyBadge: string;
  benefit1: string;
  benefit2: string;
  benefit3: string;
  viewProcessBtn: string;
  commitmentTitle: string;
  commitmentText: string;
  exploreCtaTitle: string;
  exploreCtaSubtitle: string;
}

export interface TeamMemberProfile {
  designation: string;
  education: string;
  summary: string;
  highlights: string[];
  keyProjects: string[];
  achievements: string[];
  categories?: any;
}

export interface TeamExtras {
  professionalHighlightsTitle: string;
  professionalBiographyTitle: string;
  educationTitle: string;
  coreSkillsTitle: string;
  keyProjectsTitle: string;
  achievementsTitle: string;
  certificationsTitle: string;
  verifiedDirectChannel: string;
  connectLinkedIn: string;
  members: {
    ayush: TeamMemberProfile;
    prince: TeamMemberProfile;
    komal: TeamMemberProfile;
  };
}

export interface ServicesExtras {
  spectrumBadge?: string;
  spectrumTitle?: string;
  spectrumSubtitle?: string;
  deliverablesTitle?: string;
  keyBenefitsTitle?: string;
  techStackTitle?: string;
  whyChooseBadge?: string;
  whyChooseTitle?: string;
  whyPoints?: {
    title: string;
    desc: string;
  }[];
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaBtn?: string;
  ctaConsult?: string;
  engineeredWithTitle?: string;
  customReqTitle?: string;
  customReqDesc?: string;
  startCustomBtn?: string;
  detailed?: {
    id: string;
    tagline: string;
    description: string;
    features: string[];
    deliverables: string[];
    benefits: string[];
  }[];
}

export interface ProcessStep {
  step: string;
  title: string;
  duration: string;
  goal: string;
  activities: string[];
  deliverables: string[];
}

export interface ProcessExtras {
  methodologyBadge?: string;
  methodologyTitle?: string;
  methodologySubtitle?: string;
  corePrinciplesBadge?: string;
  corePrinciplesTitle?: string;
  principles?: {
    title: string;
    desc: string;
  }[];
  steps?: ProcessStep[];
  guaranteeBadge?: string;
  guaranteeTitle?: string;
  guaranteeDesc?: string;
  guaranteePoints?: string[];
  ctaTitle?: string;
  ctaSubtitle?: string;
  ctaStartBtn?: string;
  ctaBookBtn?: string;
  phaseLabel?: string;
  readyTitle?: string;
  readySubtitle?: string;
  initiateBtn?: string;
  stepsDetail?: any[];
}

export interface ContactExtras {
  faqBadge?: string;
  faqTitle?: string;
  faqs?: {
    q: string;
    a: string;
  }[];
  channelDirectTitle?: string;
  channelDirectDesc?: string;
  channelFounderTitle?: string;
  channelFounderDesc?: string;
  channelChatTitle?: string;
  channelChatDesc?: string;
  validationName?: string;
  validationEmail?: string;
  validationSubject?: string;
  validationMessage?: string;
  successTitle?: string;
  successDesc?: string;
  errorDesc?: string;
  sendBtn?: string;
  sendingBtn?: string;
  sentBtn?: string;
  channelsTitle?: string;
  channelsSubtitle?: string;
  faqsTitle?: string;
  validationError?: string;
  submissionError?: string;
  networkError?: string;
}

export interface StartProjectExtras {
  badge?: string;
  title?: string;
  subtitle?: string;
  step1Title?: string;
  step1Desc?: string;
  step2Title?: string;
  step2Desc?: string;
  step3Title?: string;
  step3Desc?: string;
  serviceOptions?: string[];
  budgetTiers?: string[];
  timelineOptions?: string[];
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  companyLabel?: string;
  companyPlaceholder?: string;
  detailsLabel?: string;
  detailsPlaceholder?: string;
  nextBtn?: string;
  prevBtn?: string;
  submitBtn?: string;
  submittingBtn?: string;
  submittedTitle?: string;
  submittedDesc?: string;
  returnHomeBtn?: string;
  errorSelectService?: string;
  errorFillRequired?: string;
  nextStepsTitle?: string;
  nextStepsDesc?: string;
  servicesList?: string[];
  privacyNotice?: string;
  errors?: any;
}

export interface PortfolioSingleProject {
  title: string;
  category?: string;
  categoryLabel?: string;
  tagline?: string;
  client?: string;
  duration?: string;
  impact?: string;
  description: string;
  overviewTitle?: string;
  featuresTitle?: string;
  technologiesTitle?: string;
  architectureTitle?: string;
  architectureDesc?: string;
  features: string[];
  highlights?: string[];
  deliverables?: string[];
  clientType?: string;
  verifiedBadge?: string;
  livePreview?: string;
  statusBadge?: string;
  verifiedNotice?: string;
  backBtn?: string;
  viewDetailsBtn?: string;
}

export interface PortfolioExtras {
  singleProject: PortfolioSingleProject;
}

export interface ChatTranslations {
  welcome?: string;
  placeholder?: string;
  offline?: string;
  liveSupport?: string;
  typing?: string;
  quick1?: string;
  quick2?: string;
  quick3?: string;
  quick4?: string;
  clearChat?: string;
  close?: string;
  aiBadge?: string;
  liveBadge?: string;
  connectLiveBtn?: string;
  switchAiBtn?: string;
  liveWaiting?: string;
  liveConnected?: string;
  aiTitle?: string;
  aiSubtitle?: string;
  liveTitle?: string;
  liveSubtitle?: string;
  tabAi?: string;
  tabLive?: string;
  thinking?: string;
  pills?: string[];
  liveHeading?: string;
  liveSubheading?: string;
  nameLabel?: string;
  namePlaceholder?: string;
  emailLabel?: string;
  emailPlaceholder?: string;
  startLiveBtn?: string;
  connecting?: string;
  waitingAgent?: string;
  agentOnline?: string;
  agentOffline?: string;
  liveInputPlaceholder?: string;
}

export interface AdminLoginExtras {
  title?: string;
  subtitle?: string;
  usernameLabel?: string;
  passwordLabel?: string;
  loginBtn?: string;
  loggingInBtn?: string;
  credentialsHint?: string;
  firstLoginNotice?: string;
  newPasswordTitle?: string;
  newPasswordSubtitle?: string;
  newPasswordLabel?: string;
  confirmPasswordLabel?: string;
  updatePasswordBtn?: string;
  closeBtn?: string;
  errorEmpty?: string;
  errorMismatch?: string;
  errorLength?: string;
  badge?: string;
  usernamePlaceholder?: string;
  passwordPlaceholder?: string;
  submitBtn?: string;
  submittingBtn?: string;
  securityNote?: string;
}

