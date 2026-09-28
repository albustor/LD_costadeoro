'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, translations } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations['es'], fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('costa_de_oro_lang') as Language | null;
      if (saved && (saved === 'es' || saved === 'en')) {
        setLanguageState(saved);
      } else {
        // Auto-detect browser language
        const browserLang = navigator.language || (navigator as any).userLanguage || 'es';
        const detected: Language = browserLang.toLowerCase().startsWith('en') ? 'en' : 'es';
        setLanguageState(detected);
        localStorage.setItem('costa_de_oro_lang', detected);
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('costa_de_oro_lang', lang);
    }
  };

  const toggleLanguage = () => {
    const next: Language = language === 'es' ? 'en' : 'es';
    setLanguage(next);
  };

  const t = (key: keyof typeof translations['es'], fallback?: string): string => {
    const dict = translations[language] || translations.es;
    return dict[key] || fallback || (key as string);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
