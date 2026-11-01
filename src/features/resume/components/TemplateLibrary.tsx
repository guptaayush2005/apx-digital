'use client';

import { useMemo, useState } from 'react';
import { ArrowUpRight, Camera, Check, FileText, Search, Sparkles } from 'lucide-react';
import { templates, type TemplateCategory, type TemplatePhotoMode } from '../lib/templates';
import { useCareerStore } from '../lib/store';

const categories: Array<'All templates' | TemplateCategory> = ['All templates', 'ATS essentials', 'Modern', 'Executive', 'Creative', 'Academic'];
const photoFilters: Array<{ label: string; value: 'all' | TemplatePhotoMode }> = [
  { label: 'All styles', value: 'all' },
  { label: 'Without photo', value: 'without' },
  { label: 'With photo', value: 'with' },
];
function TemplatePreview({ template }: { template: (typeof templates)[number] }) {
  const sideSections = ['Skills', 'Education'];
  const mainSections = ['Profile', 'Experience', 'Projects', 'Education', 'Skills', 'Achievements'];

  return <div className={`template-preview-stage layout-${template.layout}`}>
    <article className={`template-preview-page${template.photoMode === 'with' ? ' includes-photo' : ''}`} style={{ '--preview-accent': template.accent, '--preview-font': template.font } as React.CSSProperties}>
      {template.layout === 'sidebar' && <aside className="template-preview-sidebar">
        {template.photoMode === 'with' && <span className="template-preview-avatar">YN</span>}
        <span className="template-preview-side-rule long"/><span className="template-preview-side-rule"/>
        {sideSections.map(section => <div className="template-preview-side-section" key={section}><strong>{section}</strong><i/><i/><i/></div>)}
      </aside>}
      <main className="template-preview-content">
        <header className={`template-preview-header${template.layout === 'editorial' ? ' editorial' : ''}`}>
          {template.layout !== 'sidebar' && template.photoMode === 'with' && <span className="template-preview-avatar">YN</span>}
          <div className="template-preview-name"><span>Your Name</span><small>Professional title</small></div>
          <div className="template-preview-contact"><i/><i/><i/></div>
        </header>
        {mainSections.map(section => <section className="template-preview-section" key={section}>
          <h3>{section}</h3><i/><i/><i/>
          {section === 'Experience' && <div className="template-preview-bullets"><b/><b/></div>}
        </section>)}
      </main>
      {template.layout === 'editorial' && <span className="template-preview-page-number">01</span>}
    </article>
    <span className="template-preview-count">A4 preview</span>
  </div>;
}

export function TemplateLibrary() {
  const [filter, setFilter] = useState<(typeof categories)[number]>('All templates');
  const [photoFilter, setPhotoFilter] = useState<(typeof photoFilters)[number]['value']>('all');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('Recommended');
  const { selectedTemplate, setSelectedTemplate, setActiveTab, setResume } = useCareerStore();

  const results = useMemo(() => {
    let list = templates.filter(template =>
      (filter === 'All templates' || template.category === filter)
      && (photoFilter === 'all' || template.photoMode === photoFilter)
      && `${template.name} ${template.style} ${template.category}`.toLowerCase().includes(query.toLowerCase()),
    );
    if (sort === 'Name A–Z') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'ATS-first') list = [...list].sort((a, b) => Number(b.category === 'ATS essentials') - Number(a.category === 'ATS essentials'));
    return list;
  }, [filter, photoFilter, query, sort]);

  const applyTemplate = (template: (typeof templates)[number]) => {
    setSelectedTemplate(template.id);
    setResume({ themeColor: template.accent });
    setActiveTab('builder');
  };

  const resetFilters = () => {
    setFilter('All templates');
    setPhotoFilter('all');
    setQuery('');
    setSort('Recommended');
  };

  return <section className="template-library">
    <header className="template-library-hero">
      <div>
        <p className="template-library-eyebrow"><Sparkles size={14}/> APX RESUME TEMPLATES</p>
        <h1>Choose a look. Make it yours.</h1>
        <p className="template-library-description">Preview every layout before you start. All designs come in photo and no-photo versions.</p>
      </div>
      <div className="template-count-card"><strong>{templates.length}</strong><span>ready-to-edit<br/>resume designs</span></div>
    </header>

    <div className="template-library-controls">
      <div className="template-filter-line" aria-label="Filter templates by category">
        {categories.map(category => <button key={category} className={`template-filter${filter === category ? ' active' : ''}`} aria-pressed={filter === category} onClick={() => setFilter(category)}>{category}</button>)}
      </div>
      <div className="template-photo-filters" aria-label="Filter templates by photo option">
        {photoFilters.map(option => {
          const count = option.value === 'all' ? templates.length : templates.filter(template => template.photoMode === option.value).length;
          return <button key={option.value} className={`template-photo-filter${photoFilter === option.value ? ' active' : ''}`} aria-pressed={photoFilter === option.value} onClick={() => setPhotoFilter(option.value)}>
            {option.value !== 'all' && <Camera size={13}/>} {option.label}<span>{count}</span>
          </button>;
        })}
      </div>
      <div className="template-search-sort">
        <label className="template-search"><Search size={15}/><input aria-label="Search templates" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search 100+ templates"/></label>
        <select aria-label="Sort templates" value={sort} onChange={event => setSort(event.target.value)}><option>Recommended</option><option>Name A–Z</option><option>ATS-first</option></select>
      </div>
    </div>

    <div className="template-results-meta"><p><strong>{results.length}</strong> designs <span>·</span> all matching templates are shown</p><p><Camera size={13}/> Photo choice is yours</p></div>

    <div className="template-grid">
      {results.map(template => <article key={template.id} className={`template-card${selectedTemplate === template.id ? ' selected' : ''}`}>
        <TemplatePreview template={template}/>
        <div className="template-card-info">
          <div className="template-card-heading"><div><span className="template-card-category">{template.category}</span><h2>{template.name}</h2></div>{selectedTemplate === template.id && <span className="template-selected-mark" aria-label="Current template"><Check size={15}/></span>}</div>
          <p>{template.style}</p>
          <button className="template-use-button" onClick={() => applyTemplate(template)}>Use this template <ArrowUpRight size={15}/></button>
        </div>
      </article>)}
    </div>

    {results.length === 0 && <div className="template-empty"><FileText size={22}/><strong>No templates found</strong><span>Try a different name or filter.</span><button onClick={resetFilters}>Reset filters</button></div>}
    <p className="template-library-footer">Built for quick scanning, readable sections, and straightforward PDF export.</p>
  </section>;
}
