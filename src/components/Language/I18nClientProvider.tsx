'use client';

import { ReactNode } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

// This component wraps anything that needs i18n functionality
export default function I18nClientProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
} 