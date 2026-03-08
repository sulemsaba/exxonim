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

function getSystemTheme(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getInitialTheme(): Theme {
  if (typeof document === "undefined") {
    return "light";
  }

  const storedTheme = getStoredTheme();

  if (storedTheme) {
    return storedTheme;
  }

  return document.documentElement.dataset.theme === "dark"
    ? "dark"
    : getSystemTheme();
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [hasManualPreference, setHasManualPreference] = useState(
    () => getStoredTheme() !== null,
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event: MediaQueryListEvent) => {
      if (!hasManualPreference) {
        setTheme(event.matches ? "dark" : "light");
      }
    };

    if (!hasManualPreference) {
      setTheme(mediaQuery.matches ? "dark" : "light");
    }

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, [hasManualPreference]);

  useEffect(() => {
    try {
      if (hasManualPreference) {
        localStorage.setItem(STORAGE_KEY, theme);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }

      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Ignore storage failures and keep the active theme in memory.
    }
  }, [hasManualPreference, theme]);

  return {
    theme,
    toggleTheme: () => {
      setHasManualPreference(true);
      setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
    },
  };
}
