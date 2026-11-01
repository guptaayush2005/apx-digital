import React, { useState } from 'react';
import { useCareerStore, type TabType } from '../lib/store';
import {
  FileText,
  Layers3,
  Orbit,
  Gauge,
  BriefcaseBusiness,
  ChevronDown,
  Sparkles,
  Download,
  Mic2,
  Globe2,
  Mail,
  Compass,
  Cpu,
  BarChart3,
  Users,
  LayoutDashboard,
  CheckCircle2
} from 'lucide-react';
import { GithubIcon as Github, LinkedinIcon as Linkedin } from '../../../components/BrandIcons';

const tools: { id: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'ats', label: 'ATS Resume Check', icon: Gauge },
  { id: 'jobs', label: 'Job Applications Tracker', icon: BriefcaseBusiness },
  { id: 'interview', label: 'Interview Practice', icon: Mic2 },
  { id: 'coverletter', label: 'Cover Letter Generator', icon: Mail },
  { id: 'portfolio', label: 'Web Portfolio Preview', icon: Globe2 },
  { id: 'github', label: 'GitHub Profile Analyzer', icon: Github },
  { id: 'linkedin', label: 'LinkedIn Profile Optimizer', icon: Linkedin },
  { id: 'coach', label: 'Career Roadmap & Coach', icon: Compass },
  { id: 'skills', label: 'Skills Growth Tracker', icon: Cpu },
  { id: 'analytics', label: 'Career Analytics', icon: BarChart3 },
  { id: 'recruiter', label: 'Recruiter Hub', icon: Users },
];

export const ResumeWorkspaceNav: React.FC = () => {
  const { activeTab, setActiveTab } = useCareerStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const mainTabs: { id: TabType; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'builder', label: 'Resume Builder', icon: FileText },
    { id: 'templates', label: 'Templates (240+)', icon: Layers3 },
    { id: 'ats', label: 'ATS Score Check', icon: Gauge },
    { id: 'twin', label: 'Career Twin', icon: Orbit },
    { id: 'jobs', label: 'Job Tracker', icon: BriefcaseBusiness },
    { id: 'dashboard', label: 'Workspace Hub', icon: LayoutDashboard },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="apx-resume-subnav no-print"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        padding: '0.85rem 1.25rem',
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: '2rem',
        position: 'sticky',
        top: '80px',
        zIndex: 40,
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Left: Tab selection */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          flexWrap: 'wrap',
        }}
      >
        {mainTabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => {
                setActiveTab(id);
                setDropdownOpen(false);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.55rem 0.95rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? 'var(--text-on-accent, #ffffff)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                border: isActive ? '1px solid transparent' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
              }}
              className="apx-subnav-btn"
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          );
        })}

        {/* More Tools Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.55rem 0.95rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.88rem',
              fontWeight: tools.some((t) => t.id === activeTab) ? 700 : 500,
              color: tools.some((t) => t.id === activeTab) ? 'var(--accent-primary)' : 'var(--text-secondary)',
              backgroundColor: tools.some((t) => t.id === activeTab) ? 'var(--accent-subtle)' : 'transparent',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 0.18s ease',
            }}
          >
            <Sparkles size={15} style={{ color: 'var(--accent-primary)' }} />
            <span>More Career Tools</span>
            <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                minWidth: '240px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                zIndex: 60,
              }}
            >
              {tools.map(({ id, label, icon: ToolIcon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveTab(id);
                    setDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.84rem',
                    fontWeight: activeTab === id ? 700 : 500,
                    color: activeTab === id ? 'var(--accent-primary)' : 'var(--text-primary)',
                    backgroundColor: activeTab === id ? 'var(--accent-subtle)' : 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== id) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== id) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <ToolIcon size={15} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.85rem',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={14} style={{ color: '#10b981' }} />
          <span>Saved in browser</span>
        </span>

        <button
          type="button"
          onClick={handlePrint}
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0.55rem 1.15rem',
            fontSize: '0.86rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-md)',
          }}
          title="Print or export your resume directly as a clean PDF"
        >
          <Download size={15} />
          <span>Download PDF</span>
        </button>
      </div>
    </div>
  );
};
