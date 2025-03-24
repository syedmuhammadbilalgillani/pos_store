"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import classNames from "classnames";

const themes = [
  { value: "light", icon: "fas fa-sun text-yellow-500", label: "Light" },
  { value: "dark", icon: "fas fa-moon text-gray-300", label: "Dark" },
  { value: "system", icon: "fas fa-desktop text-blue-500", label: "System" },
] as const;

type Theme = (typeof themes)[number]["value"];

const getInitialTheme = (): Theme => {
  if (typeof window !== "undefined") {
    const storedTheme = Cookies.get("theme") as Theme;
    if (storedTheme && themes.some((t) => t.value === storedTheme)) {
      return storedTheme;
    }
  }
  return "system";
};

const ThemeSwitch = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const appliedTheme =
      theme === "system" ? (systemDark ? "dark" : "light") : theme;

    root.setAttribute("data-theme", appliedTheme);
    root.classList.toggle("dark", appliedTheme === "dark");

    localStorage.setItem("theme", appliedTheme);
    Cookies.set("theme", theme, { expires: 365 });
  }, [theme]);

  const handleThemeChange = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
    setIsDropdownOpen(false);
  };

  const currentTheme = useMemo(
    () => themes.find((t) => t.value === theme),
    [theme]
  );

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center gap-2 border p-2 rounded-lg bg-gray-100 dark:bg-gray-900 cursor-pointer w-10"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="Toggle Theme Menu"
        aria-expanded={isDropdownOpen}
      >
        <motion.i
          key={theme}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={currentTheme?.icon}
        />
      </button>

      {isDropdownOpen && (
        <div
          className="absolute right-0 mt-2 w-32 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          role="menu"
        >
          <ul className="py-1">
            {themes.map((themeOption) => (
              <li key={themeOption.value}>
                <button
                  className={classNames(
                    "w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer",
                    {
                      "text-gray-700 dark:text-gray-200":
                        theme !== themeOption.value,
                      "text-blue-500 font-semibold":
                        theme === themeOption.value,
                    }
                  )}
                  onClick={() => handleThemeChange(themeOption.value)}
                  aria-label={`Switch to ${themeOption.label} mode`}
                >
                  <i className={themeOption.icon}></i>
                  <span>{themeOption.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitch;
