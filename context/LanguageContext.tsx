'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import enTranslations from '@/locales/en.json';
import trTranslations from '@/locales/tr.json';

interface Translations {
  [key: string]: any;
}

interface LanguageContextType {
  locale: string;
  translations: Translations;
  changeLanguage: (newLocale: string) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const translations: Record<string, Translations> = {
  en: enTranslations,
  tr: trTranslations,
};

// Varsayılan dili Türkçe olarak değiştir
const DEFAULT_LOCALE = 'tr';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [locale, setLocale] = useState(DEFAULT_LOCALE);
  
  useEffect(() => {
    // Get locale from cookie or browser language
    const savedLocale = Cookies.get('locale');
    if (savedLocale && ['en', 'tr'].includes(savedLocale)) {
      setLocale(savedLocale);
    } else {
      // Use browser language if available and supported, otherwise use default
      const browserLang = navigator.language.split('-')[0];
      const newLocale = ['en', 'tr'].includes(browserLang) ? browserLang : DEFAULT_LOCALE;
      setLocale(newLocale);
      Cookies.set('locale', newLocale, { expires: 365 });
    }
  }, []);

  const changeLanguage = (newLocale: string) => {
    if (newLocale !== locale) {
      setLocale(newLocale);
      Cookies.set('locale', newLocale, { expires: 365 });
      
      // Trigger a storage event for other tabs
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('locale_change', Date.now().toString());
        window.dispatchEvent(new Event('storage'));
      }
      
      // Refresh the page to apply language change
      if (pathname) {
        router.refresh();
      }
    }
  };

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value = translations[locale];
    
    // Navigate through the nested keys
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Translation value is not a string for key: ${key}`);
      return key;
    }
    
    // Replace parameters if provided
    if (params) {
      return Object.entries(params).reduce(
        (str, [param, val]) => str.replace(new RegExp(`{${param}}`, 'g'), val),
        value
      );
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        translations: translations[locale],
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return {
    language: context.locale, // Geriye dönük uyumluluk için
    locale: context.locale,
    translations: context.translations,
    changeLanguage: context.changeLanguage,
    t: context.t
  };
}