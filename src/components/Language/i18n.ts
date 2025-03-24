'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import all locale files
import commonEN from './locales/en/common.json';
import commonDE from './locales/de/common.json';
import commonAR from './locales/ar/common.json';
import commonFR from './locales/fr/common.json';
import commonES from './locales/es/common.json';
import commonZH from './locales/zh/common.json';
import commonJA from './locales/ja/common.json';

// Initialize i18next
i18n
  .use(LanguageDetector) // Add language detector
  .use(initReactI18next)
  .init({
    defaultNS: 'common',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      // Order of language detection methods
      order: ['localStorage', 'navigator', 'htmlTag'],
      // Use localStorage for persistence
      lookupLocalStorage: 'preferredLanguage',
    },
    resources: {
      en: {
        common: commonEN,
      },
      de: {
        common: commonDE,
      },
      ar: {
        common: commonAR,
      },
      fr: {
        common: commonFR,
      },
      es: {
        common: commonES,
      },
      zh: {
        common: commonZH,
      },
      ja: {
        common: commonJA,
      },
    },
  });

export default i18n;