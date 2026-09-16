import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from './translations';

const DEFAULT_LANG = 'en';
const STORAGE_KEY = 'vk_lang';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() =>
    localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG
  );

  const setLang = (l) => {
    setLangState(l);
    localStorage.setItem(STORAGE_KEY, l);
    document.documentElement.dir  = l === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = l;
  };

  useEffect(() => {
    document.documentElement.dir  = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, []);

  const t = (key) =>
    translations[lang]?.[key] ?? translations[DEFAULT_LANG]?.[key] ?? key;

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}