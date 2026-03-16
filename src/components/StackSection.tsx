import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import type { StackItem } from "../types";

interface StackSectionProps {
  items: StackItem[];
}

type FeatureVisualKey =
  | "registration"
  | "tax"
  | "institutional"
  | "tracking";

type FeatureRow = {
  title: string;
  description: string;
  visualKey: FeatureVisualKey;
};

type FeatureVisualContent = {
  workstreamValue: string;
  counterpartLabel: string;
  counterpartValue: string;
  focusValue: string;
  summaryTitle: string;
  summaryBody: string;
};

type ExtendedStackItem = StackItem & {
  emphasis?: string;
  ctaHref?: string;
  ctaLabel?: string;
  featureRows?: FeatureRow[];
};

const defaultFeatureRows: FeatureRow[] = [
  {
    title: "Registration and Setup",
    description:
      "Company registration, business name registration, NGO or organization registration, and trademark filing support before operations begin.",
    visualKey: "registration",
  },
  {
    title: "Tax, Licensing, and Approvals",
    description:
      "TIN applications, business licensing, annual returns, and regulator-facing approvals prepared with clearer documentation and follow-up.",
    visualKey: "tax",
  },
  {
    title: "Institutional Support",
    description:
      "OSHA, NSSF, WCF, CRB / ERB, and related institutional registrations coordinated so compliance work stays current and submission-ready.",
    visualKey: "institutional",
  },
  {
    title: "Track Your Consultation",
    description:
      "See what is in intake, review, submission, and follow-up so the next action and current status stay visible all the way to release.",
    visualKey: "tracking",
  },
];

const featureVisualContentMap: Record<FeatureVisualKey, FeatureVisualContent> = {
  registration: {
    workstreamValue: "Registration and setup",
    counterpartLabel: "Client",
    counterpartValue: "Exxonim Consultation",
    focusValue: "Company, NGO, business name, and trademark setup",
    summaryTitle: "Clear setup steps, fewer avoidable corrections.",
    summaryBody:
      "We organize the registration path, documentation, and filing order so the work moves forward with less confusion and better visibility.",
  },
  tax: {
    workstreamValue: "Compliance and approvals",
    counterpartLabel: "Client",
    counterpartValue: "Exxonim Consultation",
    focusValue: "TIN, licensing, returns, and approvals",
    summaryTitle: "Clear next steps, fewer avoidable delays.",
    summaryBody:
      "We organize the filing path, documentation, and authority follow-up so the work moves forward with less back-and-forth and better visibility.",
  },
  institutional: {
    workstreamValue: "Institutional support",
    counterpartLabel: "Coverage",
    counterpartValue: "Employer and board registrations",
    focusValue: "OSHA, NSSF, WCF, CRB / ERB registrations",
    summaryTitle: "Institutional registrations stay organized.",
    summaryBody:
      "We keep employer-side and institutional filing work aligned so renewals, compliance, and submission follow-up stay practical.",
  },
  tracking: {
    workstreamValue: "Consultation tracking",
    counterpartLabel: "Reference",
    counterpartValue: "EXX-24091",
    focusValue: "Status checkpoints, follow-up, and next actions",
    summaryTitle: "Know what is complete and what comes next.",
    summaryBody:
      "We keep intake, review, submission, and authority follow-up visible so the next action stays clear from start to release.",
  },
};

const stackSectionStyles = String.raw`
  .scroll-snap-wrapper {
    --stack-bg:
      linear-gradient(
        180deg,
        var(--color-surface) 0%,
        var(--color-page) 52%,
        var(--color-page-strong) 100%
      );
    --stack-surface: var(--color-surface);
    --stack-surface-strong: var(--color-page-strong);
    --stack-surface-soft: var(--color-surface-soft);
    --stack-surface-deep:
      linear-gradient(180deg, rgba(15, 92, 99, 0.96) 0%, rgba(8, 24, 27, 0.98) 100%);
    --stack-border: var(--color-border-soft);
    --stack-border-strong: var(--color-border-strong);
    --stack-text: var(--color-text);
    --stack-text-soft: var(--color-text-muted);
    --stack-muted: var(--color-text-soft);
    --stack-accent: var(--color-accent);
    --stack-accent-strong: var(--color-accent-hover);
    --stack-accent-soft: var(--color-accent-soft);
    --stack-accent-soft-strong: var(--color-accent-soft-strong);
    --stack-accent-contrast: var(--color-accent-contrast);
    --stack-contrast-text: rgba(247, 251, 251, 0.96);
    --stack-highlight-line: rgba(247, 247, 244, 0.58);
    --stack-glow: var(--glow-accent);
    --stack-glow-strong: rgba(15, 92, 99, 0.22);
    --stack-shadow: var(--shadow-panel);
    --stack-shadow-hover: var(--shadow-panel-strong);
    --stack-card-shadow: 0 16px 36px rgba(8, 31, 35, 0.1);
    --stack-card-shadow-hover: 0 22px 50px rgba(8, 31, 35, 0.14);
    --stack-panel-start: var(--color-surface);
    --stack-panel-end: var(--color-page-strong);
    --stack-compose-start: var(--color-surface);
    --stack-compose-mid: var(--color-page);
    --stack-compose-end: var(--color-page-strong);
    --stack-compose-orb: rgba(15, 92, 99, 0.18);
    --stack-compose-orb-soft: rgba(127, 188, 193, 0.18);
    --stack-rail:
      linear-gradient(180deg, var(--color-surface) 0%, var(--color-page-strong) 100%);
    --stack-pill-bg: var(--color-accent-soft);
    --stack-pill-text: var(--color-accent);
    --stack-input-bg: rgba(15, 92, 99, 0.06);
    --stack-message-bg: var(--color-surface);
    --stack-message-border: var(--color-border-strong);
    position: relative;
    background: var(--stack-bg);
    overflow-x: clip;
    overflow-y: visible;
    isolation: isolate;
  }

  html[data-theme="dark"] .scroll-snap-wrapper {
    --stack-bg:
      linear-gradient(
        180deg,
        rgba(4, 23, 25, 1) 0%,
        rgba(6, 40, 44, 1) 54%,
        rgba(4, 18, 20, 1) 100%
      );
    --stack-surface: var(--color-surface);
    --stack-surface-strong: var(--color-page-strong);
    --stack-surface-soft: var(--color-surface-soft);
    --stack-surface-deep:
      linear-gradient(180deg, rgba(17, 43, 48, 0.96) 0%, rgba(7, 21, 24, 0.98) 100%);
    --stack-border: var(--color-border-soft);
    --stack-border-strong: var(--color-border-strong);
    --stack-text: var(--color-text);
    --stack-text-soft: var(--color-text-muted);
    --stack-muted: var(--color-text-soft);
    --stack-accent: var(--color-accent);
    --stack-accent-strong: var(--color-accent-hover);
    --stack-accent-soft: var(--color-accent-soft);
    --stack-accent-soft-strong: var(--color-accent-soft-strong);
    --stack-accent-contrast: var(--color-accent-contrast);
    --stack-contrast-text: rgba(237, 244, 242, 0.96);
    --stack-highlight-line: rgba(255, 255, 255, 0.12);
    --stack-glow: var(--glow-accent);
    --stack-glow-strong: rgba(127, 188, 193, 0.22);
    --stack-shadow: var(--shadow-panel);
    --stack-shadow-hover: var(--shadow-panel-strong);
    --stack-card-shadow: 0 16px 36px rgba(0, 0, 0, 0.28);
    --stack-card-shadow-hover: 0 24px 56px rgba(0, 0, 0, 0.36);
    --stack-panel-start: var(--color-surface-soft);
    --stack-panel-end: var(--color-page);
    --stack-compose-start: var(--color-surface-soft);
    --stack-compose-mid: var(--color-page-strong);
    --stack-compose-end: var(--color-page);
    --stack-compose-orb: rgba(127, 188, 193, 0.14);
    --stack-compose-orb-soft: rgba(15, 92, 99, 0.16);
    --stack-rail:
      linear-gradient(180deg, var(--color-surface-soft), var(--color-page-strong));
    --stack-pill-bg: var(--color-accent-soft);
    --stack-pill-text: rgba(237, 244, 242, 0.9);
    --stack-input-bg: rgba(255, 255, 255, 0.08);
    --stack-message-bg: var(--color-surface);
    --stack-message-border: var(--color-border-strong);
  }

  .stack-snap-item {
    position: relative;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    min-height: 100vh;
    background: var(--stack-bg);
    transform-origin: center top;
    will-change: transform;
    transition: none;
    isolation: isolate;
  }

  @media (min-width: 1024px) {
    .stack-snap-item {
      position: sticky;
      top: calc(var(--stack-index) * 40px);
    }
  }

  .stack-inner-container {
    max-width: 1320px;
    margin: 0 auto;
    min-height: 100vh;
    padding: 6.5rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  @media (max-width: 1023px) {
    .stack-snap-item {
      width: 100%;
      margin-left: 0;
      min-height: auto;
    }

    .stack-inner-container {
      min-height: auto;
      padding: 4rem 1rem;
    }
  }

  .statement-layout,
  .feature-layout {
    display: grid;
    align-items: center;
    gap: 4rem;
  }

  .statement-layout {
    grid-template-columns: minmax(0, 1.05fr) minmax(420px, 560px);
  }

  .feature-layout {
    grid-template-columns: minmax(420px, 620px) minmax(0, 1fr);
  }

  @media (max-width: 1023px) {
    .statement-layout,
    .feature-layout {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  .copy-block {
    max-width: 650px;
  }

  .stack-title {
    margin: 0;
    color: var(--stack-text);
    font-size: clamp(2.5rem, 5vw, 4.8rem);
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: -0.04em;
  }

  .stack-subtitle {
    margin: 1.4rem 0 0;
    color: var(--stack-text);
    font-size: clamp(1.25rem, 2vw, 1.65rem);
    line-height: 1.45;
    font-weight: 600;
    max-width: 58rem;
  }

  .stack-desc {
    margin: 1.6rem 0 0;
    color: var(--stack-text-soft);
    font-size: clamp(1rem, 1.2vw, 1.15rem);
    line-height: 1.75;
    max-width: 44rem;
  }

  .stack-emphasis {
    margin: 1rem 0 0;
    color: var(--stack-text);
    font-size: clamp(1.05rem, 1.35vw, 1.35rem);
    line-height: 1.5;
    font-style: italic;
    font-weight: 600;
  }

  .stack-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2.2rem;
  }

  .stack-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 50px;
    padding: 0 1.2rem;
    border-radius: 999px;
    text-decoration: none;
    font-size: 0.98rem;
    font-weight: 500;
    line-height: 1;
    border: 1px solid transparent;
    transition:
      transform 180ms ease,
      background 180ms ease,
      box-shadow 180ms ease,
      border-color 180ms ease,
      color 180ms ease;
  }

  .stack-cta--primary {
    background: linear-gradient(135deg, var(--stack-accent) 0%, var(--stack-accent-strong) 100%);
    color: var(--stack-accent-contrast);
    border-color: var(--stack-accent-soft);
    box-shadow: var(--stack-card-shadow);
  }

  .stack-cta--primary:hover,
  .stack-cta--primary:focus-visible {
    transform: translateY(-2px);
    background: linear-gradient(135deg, var(--stack-accent-strong) 0%, var(--stack-accent) 100%);
    border-color: var(--stack-accent-soft-strong);
    box-shadow: var(--stack-card-shadow-hover);
  }

  .stack-cta__arrow {
    display: inline-flex;
    margin-left: 0.65rem;
    font-size: 1.1rem;
    line-height: 1;
  }

  .study-visual-shell {
    width: 100%;
    max-width: 560px;
    min-height: 520px;
    padding: 2.2rem;
    border-radius: 34px;
    background: linear-gradient(180deg, var(--stack-surface-strong), var(--stack-surface-soft));
    border: 1px solid var(--stack-border);
    box-shadow: inset 0 1px 0 var(--stack-highlight-line), var(--stack-shadow);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  }

  .study-visual-track {
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 1.25rem;
    overflow: hidden;
  }

  .study-card {
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--stack-border);
    box-shadow: var(--stack-card-shadow);
    flex: 0 0 auto;
    transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease, color 180ms ease;
  }

  .study-card--light {
    width: 188px;
    min-height: 412px;
    background: linear-gradient(180deg, var(--stack-panel-start), var(--stack-panel-end));
    color: var(--stack-text);
    padding: 1rem 1rem 1.2rem;
  }

  .study-card--dark {
    width: 198px;
    min-height: 432px;
    background: var(--stack-surface-deep);
    color: var(--stack-contrast-text);
    padding: 1rem 1rem 1.2rem;
  }

  .study-card--narrow {
    width: 116px;
    min-height: 430px;
    background: var(--stack-surface-deep);
    color: var(--stack-contrast-text);
    padding: 0.9rem 0.75rem 1rem;
  }

  .study-topline {
    width: 3.6rem;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
    opacity: 0.7;
    margin-bottom: 1rem;
  }

  .study-brand {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.9;
  }

  .study-small {
    margin-top: 0.75rem;
    font-size: 0.72rem;
    line-height: 1.45;
    opacity: 0.7;
  }

  .study-big {
    margin-top: 2rem;
    font-size: 1.08rem;
    line-height: 1.15;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  .study-paragraph {
    margin-top: 1rem;
    font-size: 0.84rem;
    line-height: 1.5;
    opacity: 0.82;
  }

  .study-divider {
    width: 100%;
    height: 1px;
    background: currentColor;
    opacity: 0.12;
    margin: 1rem 0;
  }

  .study-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 22px;
    padding: 0 0.45rem;
    border-radius: 6px;
    background: var(--stack-accent-soft);
    color: var(--stack-accent-strong);
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .study-list {
    margin-top: 0.8rem;
    display: grid;
    gap: 0.75rem;
  }

  .study-list-item {
    font-size: 0.68rem;
    line-height: 1.45;
    opacity: 0.88;
  }

  .study-narrow-title {
    margin-top: 1rem;
    font-size: 0.9rem;
    line-height: 1.2;
    font-weight: 700;
  }

  .study-narrow-copy {
    margin-top: 0.7rem;
    font-size: 0.66rem;
    line-height: 1.5;
    opacity: 0.78;
  }

  .feature-visual-stage {
    width: 100%;
    max-width: 620px;
    min-height: 520px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .feature-visual-stage__inner {
    width: 100%;
    min-height: 520px;
  }

  @keyframes feature-visual-fade {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .compose-visual {
    width: 100%;
    max-width: 620px;
    min-height: 520px;
    border-radius: 32px;
    overflow: hidden;
    position: relative;
    background:
      radial-gradient(circle at top right, var(--stack-compose-orb) 0%, var(--stack-compose-orb-soft) 14%, transparent 36%),
      linear-gradient(135deg, var(--stack-compose-start) 0%, var(--stack-compose-mid) 48%, var(--stack-compose-end) 100%);
    border: 1px solid var(--stack-border);
    box-shadow: var(--stack-shadow);
    transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  }

  .compose-visual::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(135deg, transparent 0 74%, var(--stack-accent-soft-strong) 74% 76%, transparent 76%),
      radial-gradient(circle at 90% 10%, var(--stack-highlight-line), transparent 34%);
    pointer-events: none;
  }

  .compose-rail {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 5rem;
    background: var(--stack-rail);
    border-right: 1px solid var(--stack-border);
  }

  .compose-card {
    position: absolute;
    left: 5.5rem;
    top: 3.2rem;
    width: min(68%, 420px);
    min-height: 360px;
    border-radius: 28px;
    background: linear-gradient(180deg, var(--stack-panel-start), var(--stack-panel-end));
    box-shadow: var(--stack-card-shadow);
    border: 1px solid var(--stack-border);
    padding: 1.4rem 1.4rem 1.3rem;
    transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  }

  .compose-title {
    font-size: 0.98rem;
    font-weight: 700;
    color: var(--stack-text);
  }

  .compose-label {
    margin-top: 1.2rem;
    font-size: 0.82rem;
    color: var(--stack-muted);
  }

  .compose-pill {
    display: inline-flex;
    align-items: center;
    margin-top: 0.55rem;
    min-height: 30px;
    padding: 0 0.9rem;
    border-radius: 999px;
    background: var(--stack-pill-bg);
    color: var(--stack-pill-text);
    font-size: 0.82rem;
    font-weight: 600;
  }

  .compose-row {
    margin-top: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 0.7rem;
    border-bottom: 1px solid var(--stack-border);
    font-size: 0.9rem;
    color: var(--stack-text);
  }

  .compose-subject {
    margin-top: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 0.86rem;
    color: var(--stack-text-soft);
  }

  .compose-input {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 0 0.9rem;
    border-radius: 999px;
    background: var(--stack-input-bg);
    color: var(--stack-text);
    font-size: 0.88rem;
  }

  .compose-message {
    margin-top: 1.15rem;
    padding: 1.1rem 1rem;
    border: 1.5px solid var(--stack-message-border);
    border-radius: 22px;
    background: var(--stack-message-bg);
  }

  .compose-message h4 {
    margin: 0 0 0.7rem;
    font-size: 1rem;
    color: var(--stack-text);
  }

  .compose-message p {
    margin: 0;
    color: var(--stack-text-soft);
    font-size: 0.88rem;
    line-height: 1.55;
  }

  .compose-visual--support,
  .compose-visual--tracking {
    min-height: 520px;
    padding: 1.3rem;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(170px, 210px);
    gap: 1rem;
    align-items: stretch;
  }

  .compose-visual--support .compose-rail,
  .compose-visual--tracking .compose-rail {
    display: none;
  }

  .compose-visual--support .compose-card,
  .compose-visual--tracking .compose-card {
    position: relative;
    left: auto;
    top: auto;
    width: 100%;
    min-height: 100%;
  }

  .compose-visual__side-panel {
    border-radius: 28px;
    border: 1px solid var(--stack-border);
    background: linear-gradient(180deg, var(--stack-panel-start), var(--stack-panel-end));
    box-shadow: var(--stack-card-shadow);
    padding: 1rem 0.95rem;
    display: grid;
    align-content: start;
    gap: 0.8rem;
  }

  .compose-visual__side-label {
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--stack-muted);
  }

  .compose-visual__side-item {
    display: grid;
    gap: 0.22rem;
    padding-top: 0.72rem;
    border-top: 1px solid var(--stack-border);
  }

  .compose-visual__side-item:first-of-type {
    border-top: 0;
    padding-top: 0;
  }

  .compose-visual__side-item strong {
    color: var(--stack-text);
    font-size: 0.92rem;
    line-height: 1.3;
  }

  .compose-visual__side-item span {
    color: var(--stack-text-soft);
    font-size: 0.78rem;
    line-height: 1.5;
  }

  .support-chip-grid {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
  }

  .support-chip {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 30px;
    padding: 0 0.8rem;
    border-radius: 999px;
    background: var(--stack-accent-soft);
    color: var(--stack-accent-strong);
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .tracking-preview-list {
    margin-top: 1rem;
    display: grid;
    gap: 0.78rem;
  }

  .tracking-preview-step {
    display: grid;
    grid-template-columns: 18px 1fr;
    gap: 0.75rem;
    align-items: start;
  }

  .tracking-preview-step__dot {
    width: 12px;
    height: 12px;
    margin-top: 0.3rem;
    border-radius: 999px;
    background: var(--stack-accent-soft);
    box-shadow: inset 0 0 0 1px var(--stack-border-strong);
  }

  .tracking-preview-step.is-complete .tracking-preview-step__dot {
    background: var(--stack-accent-strong);
    box-shadow: 0 0 0 4px var(--stack-accent-soft);
  }

  .tracking-preview-step.is-active .tracking-preview-step__dot {
    background: var(--stack-accent);
    box-shadow: 0 0 0 5px var(--stack-accent-soft);
  }

  .tracking-preview-step strong {
    display: block;
    color: var(--stack-text);
    font-size: 0.9rem;
    line-height: 1.35;
  }

  .tracking-preview-step span {
    display: block;
    margin-top: 0.24rem;
    color: var(--stack-text-soft);
    font-size: 0.8rem;
    line-height: 1.55;
  }

  .feature-side {
    width: 100%;
    max-width: 570px;
    min-height: 520px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .feature-list {
    margin-top: 0.4rem;
    display: block;
    border-top: 1px solid var(--stack-border);
  }

  .feature-accordion__item {
    border-bottom: 1px solid var(--stack-border);
    background: transparent;
    transition: background 180ms ease;
  }

  .feature-accordion__item[data-state="open"] {
    background: var(--stack-surface-strong);
  }

  .feature-accordion__trigger {
    width: 100%;
    display: grid;
    grid-template-columns: 46px 1fr 28px;
    align-items: center;
    gap: 1rem;
    min-height: 5.4rem;
    padding: 1.1rem 0;
    border: 0;
    background: transparent;
    text-align: left;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
  }

  .feature-accordion__trigger:focus-visible {
    outline: none;
  }

  .feature-accordion__badge {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: var(--stack-surface-soft);
    color: var(--stack-text);
    border: 1px solid var(--stack-border);
    font-size: 0.95rem;
    font-weight: 700;
    transition: background 180ms ease, border-color 180ms ease, color 180ms ease, box-shadow 180ms ease;
  }

  .feature-accordion__item[data-state="open"] .feature-accordion__badge {
    background: var(--stack-accent);
    border-color: var(--stack-accent-soft-strong);
    color: var(--stack-accent-contrast);
    box-shadow: 0 0 0 4px var(--stack-accent-soft);
  }

  .feature-accordion__title-wrap {
    min-width: 0;
  }

  .feature-accordion__title {
    display: block;
    color: var(--stack-text);
    font-size: clamp(1.55rem, 2vw, 1.95rem);
    line-height: 1.2;
    font-weight: 700;
  }

  .feature-accordion__panel {
    height: 7.1rem;
    padding: 0 0 1.15rem calc(46px + 1rem);
    overflow: hidden;
  }

  .feature-accordion__panel[hidden] {
    display: none;
  }

  .feature-accordion__panel-inner {
    max-width: 34rem;
    height: 100%;
  }

  .feature-accordion__copy p {
    margin: 0;
    color: var(--stack-text-soft);
    font-size: 1.02rem;
    line-height: 1.6;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .feature-accordion__chevron {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--stack-muted);
    line-height: 1;
    transition: color 180ms ease;
  }

  .feature-accordion__item[data-state="open"] .feature-accordion__chevron {
    color: var(--stack-accent);
  }

  .feature-accordion__chevron svg {
    width: 1.15rem;
    height: 1.15rem;
    transition: transform 180ms ease;
  }

  .feature-accordion__item[data-state="open"] .feature-accordion__chevron svg {
    transform: rotate(90deg);
  }

  @media (max-width: 1023px) {
    .study-visual-shell,
    .compose-visual,
    .feature-visual-stage {
      max-width: 100%;
      min-height: auto;
    }

    .study-visual-shell {
      padding: 1.25rem;
    }

    .study-visual-track {
      gap: 0.9rem;
    }

    .study-card--light {
      width: 160px;
      min-height: 360px;
    }

    .study-card--dark {
      width: 170px;
      min-height: 380px;
    }

    .study-card--narrow {
      width: 100px;
      min-height: 380px;
    }

    .compose-visual {
      aspect-ratio: 1.15 / 1;
    }

    .compose-visual--support,
    .compose-visual--tracking {
      aspect-ratio: auto;
      grid-template-columns: 1fr;
      padding: 1rem;
    }

    .compose-card {
      left: 4rem;
      top: 2.3rem;
      width: calc(100% - 6rem);
      min-height: 320px;
    }

    .compose-visual--support .compose-card,
    .compose-visual--tracking .compose-card {
      left: auto;
      top: auto;
      width: 100%;
      min-height: auto;
    }

    .feature-side {
      max-width: 100%;
      min-height: auto;
    }

    .feature-visual-stage {
      display: none;
    }

    .feature-accordion__title {
      font-size: 1.7rem;
    }

    .stack-actions {
      margin-top: 1.8rem;
    }
  }
`;

function renderStudyVisual(index: number) {
  if (index === 0) {
    return (
      <div className="study-visual-shell">
        <div className="study-visual-track">
          <div className="study-card study-card--light">
            <div className="study-topline" />
            <div className="study-brand">Exxonim</div>
            <div className="study-small">Registration Overview</div>
            <div className="study-big">
              Company, business name, NGO, and trademark setup support.
            </div>
            <div className="study-paragraph">
              Structure first. Delays later become easier to prevent.
            </div>
          </div>

          <div className="study-card study-card--dark">
            <div className="study-topline" />
            <div className="study-brand">Exxonim</div>
            <div className="study-divider" />
            <div className="study-paragraph">
              Clear documentation, coordinated follow-up, and fewer avoidable
              corrections during setup.
            </div>
            <div className="study-divider" />
            <span className="study-tag">Launch ready</span>
            <div className="study-list">
              <div className="study-list-item">
                • Company registration support
              </div>
              <div className="study-list-item">
                • Business name registration
              </div>
              <div className="study-list-item">
                • NGO / organization registration
              </div>
              <div className="study-list-item">
                • Trademark filing support
              </div>
            </div>
          </div>

          <div className="study-card study-card--narrow">
            <div className="study-topline" />
            <div className="study-brand">File</div>
            <div className="study-narrow-title">Next-step visibility</div>
            <div className="study-narrow-copy">
              Better preparation before submission, review, and launch.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="study-visual-shell">
      <div className="study-visual-track">
        <div className="study-card study-card--light">
          <div className="study-topline" />
          <div className="study-brand">Exxonim</div>
          <div className="study-small">Business Readiness Pack</div>
          <div className="study-big">
            Compliance, licensing, and institutional support you can act on.
          </div>
          <div className="study-paragraph">
            Prepared documents move faster under review.
          </div>
        </div>

        <div className="study-card study-card--dark">
          <div className="study-topline" />
          <div className="study-brand">Exxonim</div>
          <div className="study-divider" />
          <div className="study-paragraph">
            Submission-ready support across tax, licensing, registrations, and
            operating approvals.
          </div>
          <div className="study-divider" />
          <span className="study-tag">Operational readiness</span>
          <div className="study-list">
            <div className="study-list-item">• TIN application support</div>
            <div className="study-list-item">• Annual statutory returns</div>
            <div className="study-list-item">• OSHA / NSSF / WCF support</div>
            <div className="study-list-item">• Business plan preparation</div>
          </div>
        </div>

        <div className="study-card study-card--narrow">
          <div className="study-topline" />
          <div className="study-brand">Review</div>
          <div className="study-narrow-title">Prepared for decision</div>
          <div className="study-narrow-copy">
            Lender, authority, and internal review readiness.
          </div>
        </div>
      </div>
    </div>
  );
}

function renderTaxApprovalsVisual() {
  return (
    <div className="compose-visual">
      <div className="compose-rail" />
      <div className="compose-card">
        <div className="compose-title">Service Coordination</div>

        <div className="compose-label">Current workstream</div>
        <div className="compose-pill">Compliance and approvals</div>

        <div className="compose-row">
          <span>Client</span>
          <span>Exxonim Consultation</span>
        </div>

        <div className="compose-subject">
          <span>Focus</span>
          <span className="compose-input">TIN, licensing, returns, and approvals</span>
        </div>

        <div className="compose-message">
          <h4>Clear next steps, fewer avoidable delays.</h4>
          <p>
            We organize the filing path, documentation, and authority follow-up
            so the work moves forward with less back-and-forth and better
            visibility.
          </p>
        </div>
      </div>
    </div>
  );
}

function renderInstitutionalSupportVisual() {
  return (
    <div className="compose-visual compose-visual--support">
      <div className="compose-card">
        <div className="compose-title">Institutional Support</div>

        <div className="compose-label">Active registrations</div>
        <div className="compose-pill">OSHA, NSSF, WCF, CRB / ERB</div>

        <div className="compose-message">
          <h4>Employer-side registrations stay organized.</h4>
          <p>
            We keep institutional registrations aligned across workforce,
            sector, and compliance bodies so the business stays ready for
            review, filing, and renewal.
          </p>
        </div>

        <div className="support-chip-grid">
          <span className="support-chip">OSHA</span>
          <span className="support-chip">NSSF</span>
          <span className="support-chip">WCF</span>
          <span className="support-chip">CRB / ERB</span>
        </div>
      </div>

      <div className="compose-visual__side-panel">
        <div className="compose-visual__side-label">Status board</div>
        <div className="compose-visual__side-item">
          <strong>Employer setup</strong>
          <span>Workforce and compensation registrations prepared.</span>
        </div>
        <div className="compose-visual__side-item">
          <strong>Sector boards</strong>
          <span>Professional and contractor registrations tracked clearly.</span>
        </div>
        <div className="compose-visual__side-item">
          <strong>Renewal visibility</strong>
          <span>Keep follow-up practical before deadlines drift.</span>
        </div>
      </div>
    </div>
  );
}

function renderTrackingConsultationVisual() {
  return (
    <div className="compose-visual compose-visual--tracking">
      <div className="compose-card">
        <div className="compose-title">Consultation Tracking</div>

        <div className="compose-label">Reference</div>
        <div className="compose-pill">EXX-24091</div>

        <div className="tracking-preview-list">
          <div className="tracking-preview-step is-complete">
            <span className="tracking-preview-step__dot" />
            <div>
              <strong>Intake confirmed</strong>
              <span>Requirements captured and service scope agreed.</span>
            </div>
          </div>

          <div className="tracking-preview-step is-complete">
            <span className="tracking-preview-step__dot" />
            <div>
              <strong>Documents reviewed</strong>
              <span>Submission pack checked before it goes active.</span>
            </div>
          </div>

          <div className="tracking-preview-step is-active">
            <span className="tracking-preview-step__dot" />
            <div>
              <strong>Authority follow-up</strong>
              <span>Current status is visible and next action is clear.</span>
            </div>
          </div>

          <div className="tracking-preview-step">
            <span className="tracking-preview-step__dot" />
            <div>
              <strong>Final release</strong>
              <span>Approval, certificate, or confirmation is handed over.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="compose-visual__side-panel">
        <div className="compose-visual__side-label">Current note</div>
        <div className="compose-visual__side-item">
          <strong>Next-step visibility</strong>
          <span>Know what is complete, active, and still outstanding.</span>
        </div>
        <div className="compose-visual__side-item">
          <strong>Practical follow-up</strong>
          <span>Less guessing while the consultation is moving.</span>
        </div>
      </div>
    </div>
  );
}

function renderFeatureVisual(visualKey: FeatureVisualKey) {
  const content = featureVisualContentMap[visualKey];

  return (
    <div className="compose-visual">
      <div className="compose-rail" />
      <div className="compose-card">
        <div className="compose-title">Service Coordination</div>

        <div className="compose-label">Current workstream</div>
        <div className="compose-pill">{content.workstreamValue}</div>

        <div className="compose-row">
          <span>{content.counterpartLabel}</span>
          <span>{content.counterpartValue}</span>
        </div>

        <div className="compose-subject">
          <span>Focus</span>
          <span className="compose-input">{content.focusValue}</span>
        </div>

        <div className="compose-message">
          <h4>{content.summaryTitle}</h4>
          <p>{content.summaryBody}</p>
        </div>
      </div>
    </div>
  );
}

function FeatureChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M7 4.5L13 10L7 15.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function renderComposeVisual() {
  return renderTaxApprovalsVisual();
}

function renderStatementCard(item: ExtendedStackItem, index: number) {
  return (
    <div className="statement-layout">
      <div className="copy-block">
        <h2 className="stack-title">{item.title}</h2>
        <p className="stack-subtitle">{item.subtitle}</p>
        <p className="stack-desc">{item.description}</p>
        {item.emphasis ? <p className="stack-emphasis">{item.emphasis}</p> : null}

        <div className="stack-actions">
          <a href={item.ctaHref || "#"} className="stack-cta stack-cta--primary">
            {item.ctaLabel || "Request Consultation"}
            <span className="stack-cta__arrow">→</span>
          </a>
        </div>
      </div>

      {renderStudyVisual(index)}
    </div>
  );
}

function renderFeatureCard(item: ExtendedStackItem) {
  const rows =
    item.featureRows && item.featureRows.length > 0
      ? item.featureRows
      : defaultFeatureRows;

  return (
    <div className="feature-layout">
      {renderComposeVisual()}

      <div className="feature-side">
        <div className="feature-list">
          {rows.map((row, idx) => {
            const active = idx === 0;

            return (
              <div
                key={`${row.title}-${idx}`}
                className={`feature-row ${active ? "is-active" : ""}`}
              >
                <div className="feature-badge">{idx + 1}</div>

                <div className="feature-text">
                  <h3>{row.title}</h3>
                  {row.description ? <p>{row.description}</p> : null}
                </div>

                <div className="feature-icon">{active ? "^" : "›"}</div>
              </div>
            );
          })}
        </div>

        <div className="stack-actions">
          <a href={item.ctaHref || "#"} className="stack-cta stack-cta--primary">
            {item.ctaLabel || "Explore Services"}
            <span className="stack-cta__arrow">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function FeatureAccordionCard({ item }: { item: ExtendedStackItem }) {
  const rows =
    item.featureRows && item.featureRows.length > 0
      ? item.featureRows
      : defaultFeatureRows;
  const accordionId = useId();
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);
  const safeActiveFeatureIndex = Math.min(selectedFeatureIndex, rows.length - 1);
  const activeRow = rows[safeActiveFeatureIndex];

  return (
    <div className="feature-layout">
      <div className="feature-visual-stage">
        <div className="feature-visual-stage__inner">
          {renderFeatureVisual(activeRow.visualKey)}
        </div>
      </div>

      <div className="feature-side">
        <div className="feature-list">
          {rows.map((row, idx) => {
            const active = idx === safeActiveFeatureIndex;
            const panelId = `${accordionId}-feature-panel-${idx}`;

            return (
              <div
                key={`${row.title}-${idx}`}
                className="feature-accordion__item"
                data-accordion-item=""
                data-index={idx + 1}
                data-state={active ? "open" : "closed"}
              >
                <button
                  type="button"
                  className="feature-accordion__trigger"
                  aria-expanded={active}
                  aria-controls={panelId}
                  onClick={() => setSelectedFeatureIndex(idx)}
                >
                  <span className="feature-accordion__badge" aria-hidden="true">
                    {idx + 1}
                  </span>

                  <span className="feature-accordion__title-wrap">
                    <span className="feature-accordion__title">{row.title}</span>
                  </span>

                  <span className="feature-accordion__chevron" aria-hidden="true">
                    <FeatureChevronIcon />
                  </span>
                </button>

                <div
                  className="feature-accordion__panel"
                  id={panelId}
                  hidden={!active}
                >
                  <div className="feature-accordion__panel-inner">
                    <div className="feature-accordion__copy">
                      <p>{row.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="stack-actions">
          <a href={item.ctaHref || "#"} className="stack-cta stack-cta--primary">
            {item.ctaLabel || "Explore Services"}
            <span className="stack-cta__arrow">{"\u2192"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function StackSection({ items }: StackSectionProps) {
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateCards = () => {
      const cards = cardsRef.current.filter(Boolean) as HTMLElement[];

      if (window.innerWidth < 1024) {
        cards.forEach((card) => {
          card.style.transform = "";
        });
        return;
      }

      cards.forEach((card, i) => {
        let totalScale = 1;

        for (let j = i + 1; j < cards.length; j += 1) {
          const nextCard = cards[j];
          const nextTop = nextCard.getBoundingClientRect().top;
          const stickyPos = j * 40;
          const viewportHeight = window.innerHeight;

          let progress =
            (viewportHeight - nextTop) / (viewportHeight - stickyPos);

          progress = Math.max(0, Math.min(1, progress));

          const eased = 1 - Math.pow(1 - progress, 3);
          totalScale -= eased * 0.045;
        }

        totalScale = Math.max(totalScale, 0.88);
        card.style.transform = `translate3d(0, 0, 0) scale(${totalScale})`;
      });
    };

    const requestTick = () => {
      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        updateCards();
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);

    updateCards();

    return () => {
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{stackSectionStyles}</style>

      <section className="scroll-snap-wrapper">
        {items.map((rawItem, index) => {
          const item = rawItem as ExtendedStackItem;
          const isMiddle = index === 1;

          return (
            <article
              key={`${item.title}-${index}`}
              className="stack-snap-item"
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              style={{ "--stack-index": String(index) } as CSSProperties}
            >
              <div className="stack-inner-container">
                {isMiddle ? (
                  <FeatureAccordionCard item={item} />
                ) : (
                  renderStatementCard(item, index)
                )}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
