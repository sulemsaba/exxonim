import { useEffect, useState } from "react";
import type { Theme } from "../types";
import { PRIVACY_CONSENT_EVENT } from "../services/privacyService";

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

function clearStoredTheme() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Ignore storage failures and continue with in-memory theme state.
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
  const [canPersistPreference, setCanPersistPreference] = useState(true);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const handleConsentChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ preferencesEnabled?: boolean }>;
      const preferencesEnabled = Boolean(customEvent.detail?.preferencesEnabled);
      setCanPersistPreference(preferencesEnabled);

      if (!preferencesEnabled) {
        clearStoredTheme();
      }
    };

    window.addEventListener(PRIVACY_CONSENT_EVENT, handleConsentChange as EventListener);

    return () => {
      window.removeEventListener(PRIVACY_CONSENT_EVENT, handleConsentChange as EventListener);
    };
  }, []);

  useEffect(() => {
    if (!canPersistPreference) {
      clearStoredTheme();
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, theme);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Ignore storage failures and keep the active theme in memory.
    }
  }, [canPersistPreference, theme]);

  return {
    theme,
    toggleTheme: () => {
      setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
    },
  };
}
