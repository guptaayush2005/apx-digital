export interface ProjectItem {
  id: string;
  title: string;
  category: 'websites' | 'apps';
  categoryLabel: string;
  tagline: string;
  description: string;
  technologies: string[];
  features: string[];
  leadEngineer: string;
  liveUrl: string;
  githubUrl?: string;
  badge?: string;
  accentColor: string;
  clientType: string;
  image: string;
}

export const singleApprovedProject: ProjectItem = {
  id: 'ayush-service-center',
  title: 'Ayush Service Center — Store Management Website & Admin Dashboard',
  category: 'websites',
  categoryLabel: 'Web Platform & Store Management',
  tagline: 'Complete business website and dynamic store management platform built and deployed for a local store.',
  description: 'A full-stack business web platform built to give a local retail business an online presence and a real-time product management workflow. Features an authenticated Admin Dashboard to dynamically add, edit, and update store items and inventory without altering code, backed by Firebase Firestore NoSQL database and secure Firebase Authentication.',
  technologies: [
    'HTML5',
    'CSS3',
    'JavaScript',
    'Firebase Firestore',
    'Firebase Authentication',
    'Firebase Hosting',
    'Bootstrap UI',
    'Dynamic Admin Dashboard'
  ],
  features: [
    'Dynamic Admin Dashboard for dynamic product additions and inventory updates',
    'Firebase Firestore database integration for real-time catalog syncing',
    'Secure Firebase Authentication protecting administrative management routes',
    'High-performance production deployment on Firebase Hosting with custom SSL',
    'Mobile-first responsive catalog and store inquiry interface'
  ],
  leadEngineer: 'Ayush Gupta (Founder)',
  liveUrl: 'https://ayush-hardware-general-store.vercel.app/',
  badge: 'Live Client Deployment',
  accentColor: '#FF8C32',
  clientType: 'Production Client Project',
  image: '/projects/ayush-service-center.jpg'
};

// ONLY ONE PROJECT in the entire portfolio
export const portfolioData: ProjectItem[] = [singleApprovedProject];
