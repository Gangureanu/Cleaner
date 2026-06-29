'use client';

import { useLanguage } from '../../lib/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="languageToggle">
      <select
        className="languageSelect"
        value={language}
        onChange={(event) => setLanguage(event.target.value as 'en' | 'ga')}
        aria-label="Select language"
      >
        <option value="en">English</option>
        <option value="ga">Gaeilge</option>
      </select>
    </div>
  );
}
