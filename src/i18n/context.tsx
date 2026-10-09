'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { en } from './locales/en';
import { fr } from './locales/fr';
import { ha } from './locales/ha';
import { yo } from './locales/yo';
import { sw } from './locales/sw';

export type SupportedLanguage = 'en' | 'fr' | 'ha' | 'yo' | 'sw';

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  flag: string;
  region: string;
}

export const LANGUAGES: LanguageInfo[] = [
  { code: 'en', name: 'English', flag: '🌐', region: 'Global' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', region: 'Afrique de l’Ouest & Centrale' },
  { code: 'ha', name: 'Harshen Hausa', flag: '🇳🇬', region: 'Arewacin Najeriya & Nijar' },
  { code: 'yo', name: 'Èdè Yorùbá', flag: '🇳🇬', region: 'Guusu-Iwọ-Oorun Naijiria' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪', region: 'Afrika Mashariki' },
];

const dictionaries: Record<SupportedLanguage, Record<string, string>> = {
  en,
  fr,
  ha,
  yo,
  sw,
};

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key, fallback) => fallback || key,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');

  useEffect(() => {
    const saved = localStorage.getItem('fairlance_lang') as SupportedLanguage;
    if (saved && ['en', 'fr', 'ha', 'yo', 'sw'].includes(saved)) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('fairlance_lang', lang);
  };

  const t = (key: string, fallback?: string): string => {
    const dict = dictionaries[language] || dictionaries.en;
    if (dict[key]) return dict[key];
    if (dictionaries.en[key]) return dictionaries.en[key];
    return fallback || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
