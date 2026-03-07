import { useEffect, useState } from "react";
import type { Theme } from "../types";

const STORAGE_KEY = "exxonim-theme";
const LEGACY_STORAGE_KEY = "koro-theme";

function getInitialTheme(): Theme {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTheme(getInitialTheme());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem(STORAGE_KEY, theme);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Ignore storage failures and keep the active theme in memory.
    }
  }, [isReady, theme]);

  return {
    theme,
    toggleTheme: () => {
      setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
    },
  };
}
