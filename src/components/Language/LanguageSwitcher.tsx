"use client";

import { useTranslation } from "react-i18next";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import classNames from "classnames";

// Define supported languages with their display names
const supportedLanguages = [
  { code: "en", name: "English" },
  { code: "de", name: "Deutsch" },
  { code: "ar", name: "العربية" }, // Arabic
  { code: "fr", name: "Français" }, // French
  { code: "es", name: "Español" }, // Spanish
  { code: "zh", name: "中文" }, // Chinese
  { code: "ja", name: "日本語" }, // Japanese
  // Add more languages as needed
];

const normalizeLanguageCode = (code: string) => {
  // Normalize en-US, en-GB, etc., to 'en'
  if (code.startsWith("en")) {
    return "en";
  }
  return code;
};

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  console.table(i18n.language);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Set the initial language from localStorage or default to 'en'
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
    setIsDropdownOpen(false);
  };

  const currentLanguage = useMemo(
    () => supportedLanguages.find((lang) => lang.code === selectedLanguage),
    [selectedLanguage]
  );
  return (
    <div className="relative">
      <button
        className="flex items-center justify-center gap-2 border p-2 rounded-lg bg-gray-100 dark:bg-gray-900 cursor-pointer min-w-10"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="Toggle Language Menu"
        aria-expanded={isDropdownOpen}
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

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-32 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          role="menu"
        >
          <ul className="py-1">
            {supportedLanguages.map((lang) => (
              <li key={lang.code}>
                <button
                  className={classNames(
                    "w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer",
                    {
                      "text-gray-700 dark:text-gray-200":
                        selectedLanguage !== lang.code,
                      "text-blue-500 font-semibold":
                        selectedLanguage === lang.code,
                    }
                  )}
                  onClick={() => changeLanguage(lang.code)}
                  aria-label={`Switch to ${lang.name}`}
                >
                  <span>{lang.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
