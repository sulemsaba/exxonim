import { useEffect, useState } from "react";
import type { Theme } from "../types";

const STORAGE_KEY = "exxonim-theme";
const LEGACY_STORAGE_KEY = "koro-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const savedTheme =
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);

    return savedTheme === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem(STORAGE_KEY, theme);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Ignore storage failures and keep the active theme in memory.
    }
  }, [theme]);

  return {
    theme,
    toggleTheme: () => {
      setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
    },
  };
}
