import { useState, useEffect } from 'react';
import { translations } from './translations';

// اللغة الافتراضية
const DEFAULT_LANG = 'en';
const STORAGE_KEY = 'vk_lang';

// hook مشترك للترجمة
export function useTranslation() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    // RTL للعربية
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) => {
    return translations[lang]?.[key] ?? translations[DEFAULT_LANG]?.[key] ?? key;
  };

  return { t, lang, setLang };
}

// زرار تبديل اللغة
export function LangSwitcher({ lang, setLang }) {
  const LANGS = [
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'ع' },
    { code: 'es', label: 'ES' },
    { code: 'ru', label: 'RU' },
  ];

  return (
    <div style={{
      display: 'flex',
      gap: '4px',
      alignItems: 'center',
    }}>
      {LANGS.map(l => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          style={{
            background: lang === l.code ? 'var(--gold, #c9a84c)' : 'transparent',
            color: lang === l.code ? '#0a0a0a' : 'rgba(255,255,255,0.6)',
            border: '1px solid ' + (lang === l.code ? '#c9a84c' : 'rgba(255,255,255,0.2)'),
            padding: '4px 8px',
            fontSize: '10px',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: '0.2s',
            fontFamily: "'Jost', sans-serif",
            fontWeight: '400',
            minWidth: '30px',
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}