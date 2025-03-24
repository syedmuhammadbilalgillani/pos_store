'use client';

import { ReactNode, useEffect } from 'react';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

// This component wraps anything that needs i18n functionality
export default function I18nClientProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize language from localStorage on client
    const storedLanguage = localStorage.getItem('preferredLanguage');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, []);
  
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}