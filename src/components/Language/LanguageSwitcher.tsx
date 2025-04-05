"use client";

import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define supported languages with their display names
const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "ar", name: "العربية" },
  { code: "fr", name: "Français" },
  { code: "es", name: "Español" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
];

const normalizeLanguageCode = (code: string) => {
  if (code.startsWith("en")) {
    return "en";
  }
  return code;
};

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  useEffect(() => {
    const preferredLanguage = localStorage.getItem("preferredLanguage") || "en";
    const normalizedLanguage = normalizeLanguageCode(preferredLanguage);
    i18n.changeLanguage(normalizedLanguage);
    setSelectedLanguage(normalizedLanguage);
  }, [i18n]);

  const changeLanguage = (lng: string) => {
    const normalizedLanguage = normalizeLanguageCode(lng);
    i18n.changeLanguage(normalizedLanguage);
    localStorage.setItem("preferredLanguage", normalizedLanguage);
    setSelectedLanguage(normalizedLanguage);
  };

  const currentLanguage = useMemo(
    () => supportedLanguages.find((lang) => lang.code === selectedLanguage),
    [selectedLanguage]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center gap-2 border p-2 rounded-lg bg-gray-100 dark:bg-gray-900 cursor-pointer min-w-10"
          aria-label="Toggle Language Menu"
        >
          <motion.span
            key={selectedLanguage}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-sm font-semibold"
          >
            {currentLanguage?.code.toUpperCase()}
          </motion.span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer ${
              selectedLanguage === lang.code
                ? "text-blue-500 font-semibold"
                : "text-gray-700 dark:text-gray-200"
            }`}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
