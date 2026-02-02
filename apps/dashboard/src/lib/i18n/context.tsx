"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { translations, Locale } from "./translations";

type Translations = typeof translations[Locale];

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const STORAGE_KEY = "snsmon-locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (savedLocale && translations[savedLocale]) {
      setLocaleState(savedLocale);
    }
    setIsInitialized(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
  }, []);

  const t = translations[locale];

  // Prevent hydration mismatch by not rendering until initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslation() {
  const { t, locale, setLocale } = useI18n();
  return { t, locale, setLocale };
}
