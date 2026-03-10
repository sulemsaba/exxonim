import { useEffect, useState } from "react";
import type { Theme } from "../types";

const STORAGE_KEY = "exxonim-theme";
const LEGACY_STORAGE_KEY = "koro-theme";

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedTheme =
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);

    return storedTheme === "dark" || storedTheme === "light"
      ? storedTheme
      : null;
  } catch {
    return null;
  }
}

function getInitialTheme(): Theme {
  if (typeof document === "undefined") {
    return "dark";
  }

  const storedTheme = getStoredTheme();

  if (storedTheme) {
    return storedTheme;
  }

  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
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
