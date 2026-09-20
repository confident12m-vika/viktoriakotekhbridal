import { useEffect, useState } from 'react';
import { translateText } from '../lib/translate.js';

export function useOnDemandTranslate(fields) {
  const lang = localStorage.getItem('vk_lang') || 'en';
  const [translated, setTranslated] = useState(null);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState('');

  const contentKey = Object.values(fields).join('|');
  useEffect(() => {
    setTranslated(null);
    setError('');
  }, [contentKey]);

  const toggle = async () => {
    if (translated) { setTranslated(null); return; }
    setTranslating(true);
    setError('');
    try {
      const keys = Object.keys(fields);
      const results = await Promise.all(keys.map(k => translateText(fields[k], lang)));
      const next = {};
      keys.forEach((k, i) => (next[k] = results[i]));
      setTranslated(next);
    } catch {
      setError('Translation unavailable.');
    }
    setTranslating(false);
  };

  return {
    shown: translated || fields,
    translated: Boolean(translated),
    translating,
    error,
    toggle,
    show: lang !== 'en',
  };
}