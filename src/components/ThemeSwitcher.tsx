"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    const root = document.documentElement;
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const appliedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

    root.setAttribute("data-theme", appliedTheme);
    root.classList.toggle("dark", appliedTheme === "dark");

    localStorage.setItem("theme", appliedTheme);
    Cookies.set("theme", theme, { expires: 365 });
  }, [theme]);

  const handleThemeChange = (selectedTheme: Theme) => {
    setTheme(selectedTheme);
  };

  const currentTheme = useMemo(
    () => themes.find((t) => t.value === theme),
    [theme]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center justify-center gap-2 border p-2 rounded-lg bg-gray-100 dark:bg-gray-900 cursor-pointer w-10"
          aria-label="Toggle Theme Menu"
        >
          <motion.i
            key={theme}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={currentTheme?.icon}
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => handleThemeChange(themeOption.value)}
            className={`cursor-pointer ${
              theme === themeOption.value
                ? "text-blue-500 font-semibold"
                : "text-gray-700 dark:text-gray-200"
            }`}
          >
            <i className={`${themeOption.icon} mr-2`} />
            {themeOption.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitch;
