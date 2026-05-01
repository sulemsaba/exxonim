import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      // ========================================
      // FONTS
      // ========================================
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          '"SFMono-Regular"',
          '"Cascadia Code"',
          '"Consolas"',
          "monospace",
        ],
      },

      // ========================================
      // CUSTOM COLORS
      // ========================================
      colors: {
        // Brand / Accent
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          secondary: "var(--color-accent-secondary)",
          soft: "var(--color-accent-soft)",
          "soft-strong": "var(--color-accent-soft-strong)",
          contrast: "var(--color-accent-contrast)",
        },

        // Surface
        surface: {
          DEFAULT: "var(--color-surface)",
          soft: "var(--color-surface-soft)",
          elevated: "var(--color-surface-elevated)",
        },

        // Text
        text: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
          soft: "var(--color-text-soft)",
        },

        // Border
        border: {
          soft: "var(--color-border-soft)",
          strong: "var(--color-border-strong)",
        },

        // Navy scale
        navy: {
          950: "var(--navy-950)",
          900: "var(--navy-900)",
          800: "var(--navy-800)",
          700: "var(--navy-700)",
          650: "var(--navy-650)",
        },

        // Slate scale
        slate: {
          950: "var(--slate-950)",
          900: "var(--slate-900)",
          700: "var(--slate-700)",
          500: "var(--slate-500)",
        },

        // Page
        page: {
          DEFAULT: "var(--color-page)",
          strong: "var(--color-page-strong)",
          light: "var(--page-light)",
          "light-strong": "var(--page-light-strong)",
        },

        // Cinematic
        cinematic: {
          "bg-start": "var(--cinematic-bg-start)",
          "bg-end": "var(--cinematic-bg-end)",
          "orb-one": "var(--cinematic-orb-one)",
          "orb-two": "var(--cinematic-orb-two)",
          "card-bg": "var(--cinematic-card-bg)",
          "card-border": "var(--cinematic-card-border)",
          "card-shadow": "var(--cinematic-card-shadow)",
          "card-hover-border": "var(--cinematic-card-hover-border)",
        },

        overlay: "var(--color-overlay)",
        white: "#ffffff",
      },

      // ========================================
      // SHADOWS
      // ========================================
      boxShadow: {
        panel: "var(--shadow-panel)",
        "panel-strong": "var(--shadow-panel-strong)",
        hero: "var(--hero-shadow)",
        cinematic: "var(--cinematic-card-shadow)",
        "accent-glow": "0 16px 40px rgba(15, 92, 99, 0.24)",
        "accent-glow-dark": "0 16px 40px rgba(127, 188, 193, 0.22)",
      },

      // ========================================
      // BORDER RADIUS
      // ========================================
      borderRadius: {
        pill: "999px",
        "2xl": "1.7rem", // 27px
      },

      // ========================================
      // ANIMATIONS
      // ========================================
      animation: {
        "organic-drift-1": "organic-drift-1 25s ease-in-out infinite",
        "organic-drift-2": "organic-drift-2 30s ease-in-out infinite",
        "provider-marquee": "provider-marquee 34s linear infinite",
        "code-pan": "code-pan 12s linear infinite alternate",
        "whatsapp-pulse": "whatsapp-pulse 2s ease-out infinite",
        "reference-slide-primary":
          "reference-hero-slide-primary 14s ease-in-out infinite",
        "reference-slide-secondary":
          "reference-hero-slide-secondary 14s ease-in-out infinite",
        "phone-ring": "phone-ring 2s ease-in-out infinite",
        "call-shimmer": "call-shimmer 4.5s linear infinite",
        "call-ping": "call-ping 1.85s ease-out infinite",
        "tagline-float": "footer-tagline-float 5.8s ease-in-out infinite",
        "tagline-line": "footer-tagline-line 4.8s ease-in-out infinite",
      },

      keyframes: {
        "organic-drift-1": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-80px, 60px) scale(1.1)" },
          "66%": { transform: "translate(40px, -40px) scale(0.9)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
        "organic-drift-2": {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(60px, -80px) scale(0.95)" },
          "66%": { transform: "translate(-50px, 50px) scale(1.05)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
        "provider-marquee": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "code-pan": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-18%)" },
        },
        "whatsapp-pulse": {
          "0%": { transform: "scale(1)", opacity: "0.65" },
          "100%": { transform: "scale(1.45)", opacity: "0" },
        },
        "reference-hero-slide-primary": {
          "0%, 44%": { opacity: "1", transform: "scale(1)" },
          "50%, 94%": { opacity: "0", transform: "scale(1.02)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "reference-hero-slide-secondary": {
          "0%, 44%": { opacity: "0", transform: "scale(1.02)" },
          "50%, 94%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(1.02)" },
        },
        "phone-ring": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-10deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-10deg)" },
          "50%": { transform: "rotate(0deg)" },
        },
        "call-shimmer": {
          "0%": { transform: "translateX(0) skewX(-22deg)" },
          "100%": { transform: "translateX(420%) skewX(-22deg)" },
        },
        "call-ping": {
          "0%": { transform: "scale(0.92)", opacity: "0" },
          "30%": { opacity: "0.7" },
          "100%": { transform: "scale(1.42)", opacity: "0" },
        },
        "footer-tagline-float": {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(-2px)", opacity: "0.92" },
        },
        "footer-tagline-line": {
          "0%, 100%": { transform: "scaleX(0.45)", opacity: "0.14" },
          "50%": { transform: "scaleX(1)", opacity: "0.5" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
