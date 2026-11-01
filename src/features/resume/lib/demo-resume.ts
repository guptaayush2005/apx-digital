import type { ResumeData } from '../types';

/** Fictional sample content used to demonstrate resume sections and layout. */
export const demoResume: ResumeData = {
  name: 'Jordan Lee',
  targetTitle: 'Software Engineer',
  email: 'jordan.lee@example.com',
  phone: '+1 (555) 010-0199',
  location: 'Sample City, CA',
  website: 'https://jordanlee.example.com',
  linkedin: 'https://example.com/profile',
  github: 'https://example.com/code',
  summary: 'Software engineering student with hands-on experience building web applications, data tools, and user-focused digital products. Interested in translating clear requirements into reliable, accessible software.',
  objective: 'Software engineering student with hands-on experience building web applications, data tools, and user-focused digital products. Interested in translating clear requirements into reliable, accessible software.',
  photoUrl: '',
  themeColor: '#263d5b',
  experiences: [
    {
      id: 'demo-exp-engineering', role: 'Software Engineer Intern', companyPeriod: 'Example Labs · 2025',
      url: 'https://example.com/experience', urlLabel: 'Sample project note',
      bullets: [
        'Built responsive interface components for a sample customer dashboard using React and TypeScript.',
        'Worked with design and engineering teammates to improve navigation, accessibility, and page performance.',
      ],
    },
    {
      id: 'demo-exp-web', role: 'Web Development Volunteer', companyPeriod: 'Community Project · 2024',
      bullets: [
        'Created clear page layouts and reusable styles for a fictional community information site.',
        'Reviewed content with project volunteers and documented practical handoff notes.',
      ],
    },
    {
      id: 'demo-exp-assistant', role: 'Research Assistant', companyPeriod: 'Example University · 2023–2024',
      bullets: ['Organized sample survey data and prepared charts for a student research presentation.'],
    },
  ],
  education: [{
    degree: 'Bachelor of Science in Computer Science', institution: 'Example State University',
    yearHonor: '2022–2026', location: 'Sample City, CA', performance: 'GPA: 3.8/4.0 · Dean’s List (sample)',
  }],
  skills: [
    'TypeScript', 'JavaScript', 'Python', 'HTML', 'CSS', 'React', 'Next.js', 'Node.js',
    'REST APIs', 'PostgreSQL', 'Git', 'Responsive Design', 'Accessibility', 'Data Analysis',
  ],
  skillGroups: [
    { id: 'demo-skills-programming', category: 'Programming Languages', skills: ['TypeScript', 'JavaScript', 'Python'] },
    { id: 'demo-skills-frontend', category: 'Frontend Development', skills: ['HTML', 'CSS', 'React', 'Next.js', 'Responsive Design'] },
    { id: 'demo-skills-backend', category: 'Backend & Data', skills: ['Node.js', 'REST APIs', 'PostgreSQL'] },
    { id: 'demo-skills-tools', category: 'Developer Tools', skills: ['Git', 'Testing Fundamentals', 'Accessibility'] },
    { id: 'demo-skills-soft', category: 'Professional Skills', skills: ['Communication', 'Collaboration', 'Problem-Solving'] },
  ],
  projects: [
    {
      id: 'demo-project-dashboard', name: 'Customer Insights Dashboard',
      liveUrl: 'https://example.com/dashboard', githubUrl: 'https://example.com/dashboard-source',
      techStack: ['React', 'TypeScript', 'Charting', 'REST APIs'],
      bullets: [
        'Created a sample dashboard that organizes account activity into clear, accessible visual summaries.',
        'Added filtering and responsive layouts to help users review information across screen sizes.',
      ],
    },
    {
      id: 'demo-project-weather', name: 'Weather Pattern Explorer',
      liveUrl: 'https://example.com/weather', githubUrl: '',
      techStack: ['Python', 'Data Visualization', 'Public APIs'],
      bullets: ['Built a learning project that explores sample weather data through maps and charts.'],
    },
    {
      id: 'demo-project-community', name: 'Community Resource Portal',
      liveUrl: '', githubUrl: 'https://example.com/community-source',
      techStack: ['Next.js', 'CSS', 'Accessibility'],
      bullets: ['Designed a fictional portal with clear navigation, structured information, and reusable page sections.'],
    },
  ],
  research: [{
    id: 'demo-research-accessibility',
    title: 'Accessible Interface Patterns for Student Projects',
    publication: 'Example University Student Research Forum',
    paperId: 'Sample paper',
    details: ['Reviewed common interface patterns and summarized accessibility considerations for a student presentation.'],
  }],
  achievements: [
    { id: 'demo-award-campus', title: 'Campus Innovation Challenge', award: 'Finalist · Sample', details: ['Presented a prototype with a student team during a fictional campus challenge.'] },
    { id: 'demo-award-showcase', title: 'Student Projects Showcase', award: 'Presenter · Sample', details: ['Shared project goals, design decisions, and a demonstration with attendees.'] },
    { id: 'demo-award-volunteer', title: 'Community Technology Day', award: 'Volunteer recognition · Sample', details: ['Helped prepare digital resources for a sample community event.'] },
  ],
  certifications: [
    { id: 'demo-cert-cloud', name: 'Cloud Foundations', issuer: 'Example Learning', date: '2025', url: 'https://example.com/certificate' },
    { id: 'demo-cert-web', name: 'Web Accessibility Essentials', issuer: 'Sample Academy', date: '2024', url: 'https://example.com/accessibility' },
    { id: 'demo-cert-data', name: 'Data Analysis Fundamentals', issuer: 'Example Learning', date: '2024', url: '' },
  ],
  leadership: [
    { id: 'demo-leadership-club', role: 'Technology Club Mentor', organization: 'Example University', description: 'Helped peers plan workshops and share beginner-friendly learning resources.' },
    { id: 'demo-leadership-partner', role: 'Student Community Partner', organization: 'Sample Student Network', description: 'Collected student feedback and shared campus event information.' },
    { id: 'demo-leadership-volunteer', role: 'Volunteer', organization: 'Community Learning Group', description: 'Supported digital-literacy activities and community learning sessions.' },
  ],
};

export const blankResumeStarter: ResumeData = {
  name: '', targetTitle: '', email: '', phone: '', location: '', website: '',
  summary: '', objective: '', photoUrl: '', themeColor: '#263d5b',
  experiences: [], education: [], skills: [], skillGroups: [], projects: [],
  research: [], achievements: [], certifications: [], leadership: [],
};

export const copyResume = (resume: ResumeData): ResumeData => JSON.parse(JSON.stringify(resume)) as ResumeData;
