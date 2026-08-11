import { useState, useEffect, useRef } from 'react';
import { translations } from './translations';

const DEFAULT_LANG = 'en';
const STORAGE_KEY = 'vk_lang';

export function useTranslation() {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key) =>
    translations[lang]?.[key] ?? translations[DEFAULT_LANG]?.[key] ?? key;

  return { t, lang, setLang };
}

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'العربية' },
  { code: 'es', label: 'Español' },
  { code: 'ru', label: 'Русский' },
];

/* ── زرار الكرة الأرضية مع قائمة منسدلة ── */
export function LangSwitcher({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  /* إغلاق لو ضغط برّه */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  const current = LANGS.find(l => l.code === lang);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* زرار الكرة الأرضية */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Change language"
        style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.25)',
          color: 'rgba(255,255,255,0.85)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '6px 10px',
          borderRadius: '2px',
          fontSize: '13px',
          transition: '0.2s',
          whiteSpace: 'nowrap',
        }}
      >
        {/* أيقونة الكرة الأرضية SVG */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span style={{ fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase' }}>
          {current?.code.toUpperCase()}
        </span>
        <span style={{ fontSize: '9px', opacity: 0.6 }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* القائمة المنسدلة */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          background: 'rgba(8,8,8,0.97)',
          border: '1px solid rgba(201,168,76,0.25)',
          minWidth: '130px',
          zIndex: 2000,
          backdropFilter: 'blur(10px)',
        }}>
          {LANGS.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false); }}
              style={{
                display: 'block',
                width: '100%',
                background: lang === l.code ? 'rgba(201,168,76,0.12)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                color: lang === l.code ? '#c9a84c' : 'rgba(255,255,255,0.7)',
                padding: '11px 16px',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '12px',
                letterSpacing: '1px',
                fontFamily: "'Jost', sans-serif",
                transition: '0.2s',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── نسخة الموبايل — تظهر جوه القائمة الجانبية ── */
export function LangSwitcherMobile({ lang, setLang, onClose }) {
  return (
    <div style={{
      marginTop: '24px',
      paddingTop: '20px',
      borderTop: '1px solid rgba(255,255,255,0.07)',
    }}>
      <p style={{
        fontSize: '9px',
        letterSpacing: '3px',
        color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase',
        marginBottom: '12px',
      }}>Language</p>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {LANGS.map(l => (
          <button
            key={l.code}
            onClick={() => { setLang(l.code); onClose(); }}
            style={{
              background: lang === l.code ? '#c9a84c' : 'transparent',
              border: '1px solid ' + (lang === l.code ? '#c9a84c' : 'rgba(255,255,255,0.2)'),
              color: lang === l.code ? '#0a0a0a' : 'rgba(255,255,255,0.65)',
              padding: '7px 14px',
              cursor: 'pointer',
              fontSize: '11px',
              letterSpacing: '1.5px',
              fontFamily: "'Jost', sans-serif",
              transition: '0.2s',
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}