import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LANGUAGE,
  SUPPORTED_LANGUAGES,
  translate,
  isSupportedLanguage
} from "./translator";

const STORAGE_KEY = "app-language";

const TranslationContext = createContext(null);

function getInitialLanguage() {
  if (typeof window === "undefined") return DEFAULT_LANGUAGE;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (isSupportedLanguage(saved)) return saved;

  const browserLanguage = navigator.language?.toLowerCase();

  // Bengali browser/device preference.
  if (browserLanguage?.startsWith("bn")) return "bn";

  return DEFAULT_LANGUAGE;
}

export function TranslationProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = (nextLanguage) => {
    if (!isSupportedLanguage(nextLanguage)) return;

    setLanguageState(nextLanguage);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    }
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = language === "bn" ? "bn" : "en";
      document.documentElement.dir = "ltr";
    }
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languages: SUPPORTED_LANGUAGES,
      t: (key, variables) => translate(key, language, variables)
    }),
    [language]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);

  if (!context) {
    throw new Error(
      "useTranslation must be used inside <TranslationProvider>."
    );
  }

  return context;
}
