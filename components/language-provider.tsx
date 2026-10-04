"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import en from "@/lib/translations/en";
import bn from "@/lib/translations/bn";
import hi from "@/lib/translations/hi";

export type Language = "en" | "bn" | "hi";

const dictionaries = {
  en,
  bn,
  hi,
};

type TranslationKey = keyof typeof en;

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
};

const LanguageContext =
  createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<Language>("en");

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      "divyajyoti-language"
    );

    if (
      savedLanguage === "en" ||
      savedLanguage === "bn" ||
      savedLanguage === "hi"
    ) {
      setLanguageState(savedLanguage);
    }

    setMounted(true);
  }, []);

  const setLanguage = useCallback(
    (nextLanguage: Language) => {
      setLanguageState(nextLanguage);

      localStorage.setItem(
        "divyajyoti-language",
        nextLanguage
      );

      document.documentElement.lang =
        nextLanguage;
    },
    []
  );

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  const t = useCallback(
    (key: TranslationKey) => {
      return dictionaries[language][key] ??
        dictionaries.en[key];
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, setLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider"
    );
  }

  return context;
}