'use client';

import { useLanguage } from '@/lib/LanguageContext';
import type { Language } from '@/lib/translations';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="languageToggle">
      <button
        className={`langBtn ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
        title="English"
      >
        EN
      </button>
      <button
        className={`langBtn ${language === 'ga' ? 'active' : ''}`}
        onClick={() => setLanguage('ga')}
        title="Gaeilge"
      >
        GA
      </button>
    </div>
  );
}
