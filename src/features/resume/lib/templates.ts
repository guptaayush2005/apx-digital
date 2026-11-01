export type TemplateCategory = 'ATS essentials' | 'Modern' | 'Executive' | 'Creative' | 'Academic';
export type TemplatePhotoMode = 'with' | 'without';
export type ResumeTemplate = {
  id: string;
  name: string;
  category: TemplateCategory;
  accent: string;
  layout: 'single' | 'sidebar' | 'editorial';
  font: string;
  style: string;
  photoMode: TemplatePhotoMode;
};

const looks = [
  { name: 'Aurora', accent: '#39795f', layout: 'single' as const, font: 'Inter', style: 'The clean, confident classic' },
  { name: 'Monograph', accent: '#9b7651', layout: 'editorial' as const, font: 'Georgia', style: 'Editorial with quiet character' },
  { name: 'Signal', accent: '#536ca3', layout: 'sidebar' as const, font: 'Inter', style: 'A crisp technical profile' },
  { name: 'Atelier', accent: '#bd716c', layout: 'editorial' as const, font: 'Georgia', style: 'Expressive, thoughtfully composed' },
  { name: 'Northstar', accent: '#478397', layout: 'single' as const, font: 'Inter', style: 'Structured for your next move' },
  { name: 'Forma', accent: '#8563aa', layout: 'sidebar' as const, font: 'Inter', style: 'An elegant two-column canvas' },
  { name: 'Fieldnote', accent: '#8d8147', layout: 'editorial' as const, font: 'Georgia', style: 'Warm, precise, memorable' },
  { name: 'Carbon', accent: '#576574', layout: 'single' as const, font: 'Inter', style: 'Minimal by design' },
  { name: 'Blueprint', accent: '#3376a2', layout: 'sidebar' as const, font: 'Inter', style: 'Built for builders' },
  { name: 'Sunday', accent: '#aa7045', layout: 'editorial' as const, font: 'Georgia', style: 'A softer kind of standout' },
  { name: 'Meridian', accent: '#4c8067', layout: 'single' as const, font: 'Inter', style: 'Balanced from every angle' },
  { name: 'Afterglow', accent: '#a25772', layout: 'sidebar' as const, font: 'Inter', style: 'Modern with a human touch' },
  { name: 'Index', accent: '#637386', layout: 'single' as const, font: 'Inter', style: 'Clear, considered, complete' },
  { name: 'Studio', accent: '#8b5c9f', layout: 'editorial' as const, font: 'Georgia', style: 'Designed for creative minds' },
  { name: 'Cobalt', accent: '#435fa7', layout: 'sidebar' as const, font: 'Inter', style: 'Confident signal, zero noise' },
  { name: 'Evergreen', accent: '#5a7b4a', layout: 'single' as const, font: 'Inter', style: 'Grounded and forward-looking' },
  { name: 'Archive', accent: '#8f674f', layout: 'editorial' as const, font: 'Georgia', style: 'A timeless professional story' },
  { name: 'Flux', accent: '#378476', layout: 'sidebar' as const, font: 'Inter', style: 'Energy with a clear structure' },
  { name: 'Plainspoken', accent: '#9c614d', layout: 'single' as const, font: 'Inter', style: 'Your work, stated beautifully' },
  { name: 'Contour', accent: '#75629f', layout: 'editorial' as const, font: 'Georgia', style: 'A distinct line through your work' },
  { name: 'Daybreak', accent: '#9b793c', layout: 'single' as const, font: 'Inter', style: 'Bright, focused, quietly assured' },
  { name: 'Sonder', accent: '#a96768', layout: 'editorial' as const, font: 'Georgia', style: 'A thoughtful story of your work' },
  { name: 'Waypoint', accent: '#4d7969', layout: 'sidebar' as const, font: 'Inter', style: 'Clear direction, strong details' },
  { name: 'Obsidian', accent: '#515965', layout: 'single' as const, font: 'Inter', style: 'Modern restraint with sharp edges' },
];

const categories: TemplateCategory[] = ['ATS essentials', 'Modern', 'Executive', 'Creative', 'Academic'];

const baseTemplates: Omit<ResumeTemplate, 'photoMode'>[] = [
  ...looks.flatMap((look, family) => categories.map((category, variant) => ({
    id: family === 0 && variant === 1 ? 'aurora' : `${look.name.toLowerCase()}-${category.toLowerCase().replaceAll(' ', '-')}`,
    name: family === 0 && variant === 1 ? 'Aurora' : `${look.name} ${category === 'ATS essentials' ? 'ATS' : category}`,
    category,
    accent: look.accent,
    layout: variant === 4 ? 'single' as const : look.layout,
    font: variant === 2 || variant === 4 ? 'Georgia' : look.font,
    style: variant === 0 ? 'ATS-first. Every line earns its place.' : look.style,
  }))),
  {
    id: 'apx-classic', name: 'APX Classic', category: 'ATS essentials',
    accent: '#263d5b', layout: 'single', font: 'Arial',
    style: 'A clean, compact layout for clear, ATS-friendly reading.',
  },
];

/** 121 distinct designs, each available as a photo and no-photo version. */
export const templates: ResumeTemplate[] = baseTemplates.flatMap((template) => [
  { ...template, id: `${template.id}-no-photo`, name: `${template.name} · No photo`, photoMode: 'without' },
  { ...template, id: `${template.id}-photo`, name: `${template.name} · Photo`, photoMode: 'with' },
]);

export const DEFAULT_TEMPLATE_ID = 'apx-classic-no-photo';
