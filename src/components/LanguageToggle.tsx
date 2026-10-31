import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe, Check } from 'lucide-react';

interface LanguageEntry {
  code: string;
  name: string;
  native: string;
}

const LANGUAGES: LanguageEntry[] = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'es', name: 'Spanish', native: 'Español' },
  { code: 'fr', name: 'French', native: 'Français' },
  { code: 'de', name: 'German', native: 'Deutsch' },
  { code: 'pt', name: 'Portuguese', native: 'Português' },
  { code: 'ar', name: 'Arabic', native: 'العربية' },
  { code: 'zh', name: 'Chinese Simplified', native: '简体中文' },
  { code: 'ja', name: 'Japanese', native: '日本語' },
  { code: 'ko', name: 'Korean', native: '한국어' },
  { code: 'ru', name: 'Russian', native: 'Русский' },
  { code: 'it', name: 'Italian', native: 'Italiano' },
];

export const LanguageToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage, currentMeta, isRtl } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-center w-9 h-9 rounded-full text-xs transition-all border shadow-sm relative group cursor-pointer"
        style={{
          backgroundColor: isOpen ? 'var(--accent-subtle)' : 'var(--bg-surface)',
          borderColor: isOpen ? 'var(--accent-primary)' : 'var(--border-subtle)',
          color: isOpen ? 'var(--accent-primary)' : 'var(--text-primary)',
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Select Language - Currently ${currentMeta.name}`}
        title={`Language: ${currentMeta.nativeName} (${currentMeta.name})`}
      >
        <Globe
          size={18}
          className="transition-transform duration-300 group-hover:rotate-12"
          style={{ color: isOpen ? 'var(--accent-primary)' : 'var(--accent-primary)' }}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Supported Languages"
          className="apx-lang-dropdown"
          style={{
            right: isRtl ? 'auto' : 0,
            left: isRtl ? 0 : 'auto',
          }}
        >
          {/* Header Title */}
          <div
            style={{
              padding: '6px 12px 8px 12px',
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--text-muted)',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              direction: 'ltr',
            }}
          >
            <span>SELECT LANGUAGE</span>
            <span
              style={{
                color: 'var(--accent-primary)',
                fontSize: '0.72rem',
                backgroundColor: 'var(--accent-subtle)',
                padding: '1px 7px',
                borderRadius: '999px',
              }}
            >
              12
            </span>
          </div>

          {/* Single Column Vertical Language List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {LANGUAGES.map((lang) => {
              const isSelected = language === lang.code;

              return (
                <button
                  key={lang.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setLanguage(lang.code as any);
                    setIsOpen(false);
                  }}
                  className={`apx-lang-item ${isSelected ? 'selected' : ''}`}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '8px',
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: isSelected ? 700 : 600,
                        fontSize: '0.92rem',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {lang.native}
                    </span>
                    {lang.name !== lang.native && (
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          fontWeight: 400,
                        }}
                      >
                        ({lang.name})
                      </span>
                    )}
                  </div>

                  {isSelected && (
                    <Check
                      size={16}
                      style={{ color: 'var(--accent-primary)', flexShrink: 0, marginInlineStart: '8px' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
