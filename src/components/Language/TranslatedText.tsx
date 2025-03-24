'use client';

import { useTranslation } from 'react-i18next';

interface TranslatedTextProps {
  textKey: string;
  ns?: string;
  className?: string;
}

export default function TranslatedText({ textKey, ns, className }: TranslatedTextProps) {
  const { t } = useTranslation(ns);
  
  return <span className={`${className} `}>{t(textKey)}</span>;
} 