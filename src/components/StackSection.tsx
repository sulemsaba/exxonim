import type { CSSProperties } from "react";
import type { StackItem } from "../types";

interface StackSectionProps {
  items: StackItem[];
}

const stackSectionStyles = String.raw`
  .stack-section {
    position: relative;
    padding: 0 0 4rem;
    overflow: visible;
  }

  .stack-section::before {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -4%;
    width: min(120rem, 160vw);
    height: 72rem;
    transform: translateX(-50%);
    border-radius: 50%;
    background:
      radial-gradient(circle at center, rgba(13, 102, 106, 0.12) 0 30%, transparent 31%),
      repeating-radial-gradient(circle at center, rgba(9, 68, 73, 0.08) 0 2px, transparent 3px 42px);
    opacity: 0.38;
    pointer-events: none;
  }

  .stack-section__inner {
    display: block;
    padding-bottom: 0;
  }

  .stack-card {
    position: sticky;
    top: var(--header-height);
    display: flex;
    align-items: stretch;
    min-height: calc(100vh - var(--header-height));
    z-index: calc(10 + var(--stack-index));
  }

  .stack-card__inner {
    position: relative;
    width: 100%;
    min-height: calc(100vh - var(--header-height));
    overflow: hidden;
    isolation: isolate;
    transform-origin: center top;
    will-change: transform, filter;
    background:
      radial-gradient(circle at top right, rgba(44, 139, 145, 0.18), transparent 32%),
      linear-gradient(180deg, #fbfefe, #e7f4f5);
  }

  .stack-card__inner::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.5), transparent 42%),
      radial-gradient(circle at bottom left, rgba(128, 184, 188, 0.12), transparent 28%);
    pointer-events: none;
    z-index: -1;
  }

  .stack-card:nth-child(2) .stack-card__inner {
    background:
      radial-gradient(circle at top right, rgba(44, 139, 145, 0.16), transparent 32%),
      linear-gradient(180deg, #f8fcfd, #deeff1);
  }

  .stack-card:nth-child(3) .stack-card__inner {
    background:
      radial-gradient(circle at top right, rgba(28, 118, 124, 0.16), transparent 32%),
      linear-gradient(180deg, #f6fbfb, #d5ebed);
  }

  .stack-card__content {
    display: grid;
    grid-template-columns: minmax(0, 1.02fr) minmax(0, 0.98fr);
    gap: clamp(2rem, 3vw, 3.6rem);
    align-items: center;
    width: min(1360px, calc(100% - 2rem));
    min-height: calc(100vh - var(--header-height));
    margin: 0 auto;
    padding: 2.9rem 0 3.4rem;
  }

  .stack-copy {
    color: rgba(17, 35, 37, 0.92);
  }

  .stack-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.7rem;
    margin: 0 0 1.4rem;
    padding: 0.72rem 1.15rem;
    border: 1px solid rgba(9, 68, 73, 0.16);
    border-radius: 999px;
    background: rgba(247, 252, 252, 0.74);
    color: rgba(17, 35, 37, 0.82);
    font-size: 0.92rem;
    font-weight: 800;
    letter-spacing: 0.01em;
    width: fit-content;
  }

  .stack-pill span {
    display: inline-block;
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    background: linear-gradient(180deg, #2f9aa1, #0d666a);
  }

  .stack-copy h2 {
    margin: 0;
    max-width: 16ch;
    font-family: var(--font-display);
    font-size: clamp(2.7rem, 4.2vw, 4.55rem);
    font-weight: 400;
    line-height: 0.94;
    letter-spacing: -0.045em;
    color: rgba(17, 35, 37, 0.96);
  }

  .stack-subtitle,
  .stack-note {
    line-height: 1.6;
  }

  .stack-subtitle {
    max-width: 26rem;
    margin: 0.9rem 0 0;
    font-size: clamp(1.08rem, 1.6vw, 1.32rem);
    font-weight: 800;
    color: rgba(17, 35, 37, 0.8);
  }

  .stack-note {
    max-width: 30rem;
    margin: 1.7rem 0 1.35rem;
    padding: 1.4rem 1.5rem;
    border-radius: 24px;
    border: 1px solid rgba(9, 68, 73, 0.12);
    background: rgba(247, 252, 252, 0.88);
    box-shadow: none;
    font-size: clamp(0.98rem, 1.45vw, 1.08rem);
    color: rgba(17, 35, 37, 0.78);
    text-shadow: none;
  }

  .stack-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    min-height: 3.25rem;
    padding: 0.9rem 1.3rem;
    border: 1px solid rgba(9, 68, 73, 0.12);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.86);
    color: rgba(17, 35, 37, 0.92);
    font-size: 0.95rem;
    font-weight: 700;
    text-decoration: none;
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      background-color 180ms ease,
      color 180ms ease;
  }

  .stack-cta:hover {
    transform: translateY(-1px);
    border-color: rgba(9, 68, 73, 0.2);
    background: #ffffff;
  }

  .stack-visual {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    align-self: stretch;
  }

  .stack-window {
    width: min(100%, 52rem);
    align-self: center;
    overflow: hidden;
    border: 1px solid rgba(9, 68, 73, 0.12);
    border-radius: 28px;
    background: rgba(252, 254, 254, 0.74);
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    box-shadow: 0 28px 80px rgba(9, 68, 73, 0.14);
  }

  .stack-window__top {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 1rem 1.15rem;
    border-bottom: 1px solid rgba(9, 68, 73, 0.08);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(241, 248, 249, 0.78));
  }

  .stack-window__heading {
    display: grid;
    gap: 0.14rem;
  }

  .stack-window__eyebrow {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(17, 35, 37, 0.48);
  }

  .stack-window__heading strong {
    font-size: 0.98rem;
    line-height: 1.1;
    color: rgba(17, 35, 37, 0.92);
  }

  .stack-window__tag {
    margin-left: auto;
    padding: 0.42rem 0.74rem;
    border-radius: 999px;
    background: rgba(13, 102, 106, 0.12);
    color: rgba(9, 68, 73, 0.82);
    font-size: 0.74rem;
    font-weight: 800;
    letter-spacing: 0.02em;
    white-space: nowrap;
  }

  .stack-window__body {
    min-height: 31rem;
    padding: 1.2rem;
    background:
      radial-gradient(circle at top right, rgba(44, 139, 145, 0.14), transparent 34%),
      linear-gradient(180deg, rgba(234, 246, 247, 0.94), rgba(243, 250, 250, 0.9));
  }

  .stack-window__body .device-board {
    height: 100%;
  }

  .stack-window__bar--reporting {
    width: 78%;
  }

  .stack-window__bar--decision {
    width: 71%;
  }

  .stack-window__bar--followthrough {
    width: 84%;
  }

  .window-dots {
    display: inline-flex;
    gap: 0.4rem;
  }

  .window-dots span {
    display: block;
    width: 0.85rem;
    height: 0.85rem;
    border-radius: 50%;
  }

  .window-dots span:nth-child(1) { background: #da4d44; }
  .window-dots span:nth-child(2) { background: #d8a625; }
  .window-dots span:nth-child(3) { background: #32b35b; }

  .device-board {
    display: grid;
    gap: 0.85rem;
    height: 100%;
  }

  .device-board__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.85rem;
  }

  .device-board__top strong {
    display: block;
    margin-top: 0.24rem;
    font-size: 1rem;
    line-height: 1.2;
    color: rgba(17, 35, 37, 0.92);
  }

  .device-board__eyebrow {
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(17, 35, 37, 0.52);
  }

  .device-board__pill {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.45rem 0.72rem;
    border-radius: 999px;
    background: rgba(13, 102, 106, 0.12);
    color: rgba(9, 68, 73, 0.86);
    font-size: 0.74rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .device-priority-grid,
  .device-owner-grid {
    display: grid;
    gap: 0.7rem;
  }

  .device-priority-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .device-priority-card,
  .device-kpi-card,
  .device-agenda-item,
  .device-progress-card,
  .device-owner-card,
  .device-roadmap__stage {
    border: 1px solid rgba(9, 68, 73, 0.1);
    background: rgba(255, 255, 255, 0.72);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.32);
  }

  .device-priority-card {
    display: grid;
    gap: 0.35rem;
    padding: 0.9rem;
    border-radius: 18px;
  }

  .device-priority-card span,
  .device-kpi-card span,
  .device-progress-card span,
  .device-owner-card span,
  .device-roadmap__stage span:last-child {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    color: rgba(17, 35, 37, 0.54);
  }

  .device-priority-card strong,
  .device-kpi-card strong,
  .device-agenda-item strong,
  .device-owner-card strong,
  .device-roadmap__stage strong {
    font-size: 0.95rem;
    color: rgba(17, 35, 37, 0.92);
  }

  .device-priority-card p,
  .device-owner-card p {
    margin: 0;
    font-size: 0.78rem;
    line-height: 1.45;
    color: rgba(17, 35, 37, 0.64);
  }

  .device-priority-card--accent {
    background:
      linear-gradient(180deg, rgba(13, 102, 106, 0.12), rgba(255, 255, 255, 0.84)),
      rgba(255, 255, 255, 0.82);
  }

  .device-kpi-row {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.7rem;
  }

  .device-kpi-card {
    display: grid;
    gap: 0.22rem;
    padding: 0.85rem 0.9rem;
    border-radius: 16px;
  }

  .device-cadence-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 0.8rem;
    flex: 1;
  }

  .device-agenda-list,
  .device-progress-list,
  .device-roadmap {
    display: grid;
    gap: 0.6rem;
  }

  .device-agenda-item {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 0.7rem;
    align-items: center;
    padding: 0.8rem 0.9rem;
    border-radius: 16px;
  }

  .device-agenda-item__day,
  .device-agenda-item__time {
    font-size: 0.72rem;
    font-weight: 700;
    color: rgba(17, 35, 37, 0.54);
  }

  .device-progress-card {
    display: grid;
    gap: 0.45rem;
    padding: 0.8rem 0.9rem;
    border-radius: 16px;
  }

  .device-progress-track {
    height: 0.5rem;
    border-radius: 999px;
    background: rgba(9, 68, 73, 0.1);
    overflow: hidden;
  }

  .device-progress-bar {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: linear-gradient(90deg, #2f9aa1, #0d666a);
  }

  .device-roadmap__stage {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 0.7rem;
    align-items: center;
    padding: 0.82rem 0.9rem;
    border-radius: 16px;
  }

  .device-roadmap__dot {
    width: 0.72rem;
    height: 0.72rem;
    border-radius: 50%;
    background: rgba(9, 68, 73, 0.18);
  }

  .device-roadmap__stage--done .device-roadmap__dot,
  .device-roadmap__stage--active .device-roadmap__dot {
    background: linear-gradient(180deg, #2f9aa1, #0d666a);
  }

  .device-owner-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .device-owner-card {
    display: grid;
    gap: 0.3rem;
    padding: 0.9rem;
    border-radius: 18px;
  }

  html[data-theme="dark"] .stack-section::before {
    background:
      radial-gradient(circle at center, rgba(44, 139, 145, 0.18) 0 30%, transparent 31%),
      repeating-radial-gradient(circle at center, rgba(92, 176, 181, 0.09) 0 2px, transparent 3px 42px);
  }

  html[data-theme="dark"] .stack-card__inner {
    border-color: rgba(255, 255, 255, 0.08);
    background:
      radial-gradient(circle at top right, rgba(44, 139, 145, 0.22), transparent 32%),
      linear-gradient(180deg, #0a2326, #061619);
    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.3);
  }

  html[data-theme="dark"] .stack-card__inner::before {
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.06), transparent 42%),
      radial-gradient(circle at bottom left, rgba(44, 139, 145, 0.12), transparent 28%);
  }

  html[data-theme="dark"] .stack-card:nth-child(2) .stack-card__inner {
    background:
      radial-gradient(circle at top right, rgba(44, 139, 145, 0.2), transparent 32%),
      linear-gradient(180deg, #0c2c2f, #081b1e);
  }

  html[data-theme="dark"] .stack-card:nth-child(3) .stack-card__inner {
    background:
      radial-gradient(circle at top right, rgba(27, 108, 113, 0.18), transparent 32%),
      linear-gradient(180deg, #10363a, #091d20);
  }

  html[data-theme="dark"] .stack-pill {
    border-color: rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    color: rgba(244, 247, 255, 0.92);
  }

  html[data-theme="dark"] .stack-copy h2 {
    color: rgba(244, 247, 255, 0.96);
  }

  html[data-theme="dark"] .stack-subtitle,
  html[data-theme="dark"] .stack-note {
    color: rgba(226, 232, 255, 0.72);
  }

  html[data-theme="dark"] .stack-note {
    border-color: rgba(255, 255, 255, 0.08);
    background: rgba(7, 24, 26, 0.9);
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.22);
  }

  html[data-theme="dark"] .stack-cta {
    color: rgba(244, 247, 255, 0.92);
    border-color: rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
  }

  html[data-theme="dark"] .stack-cta:hover {
    border-color: rgba(255, 255, 255, 0.18);
    background: rgba(255, 255, 255, 0.1);
  }

  html[data-theme="dark"] .device-board__top strong,
  html[data-theme="dark"] .device-priority-card strong,
  html[data-theme="dark"] .device-kpi-card strong,
  html[data-theme="dark"] .device-agenda-item strong,
  html[data-theme="dark"] .device-owner-card strong,
  html[data-theme="dark"] .device-roadmap__stage strong {
    color: rgba(244, 247, 255, 0.94);
  }

  html[data-theme="dark"] .device-board__eyebrow,
  html[data-theme="dark"] .device-priority-card span,
  html[data-theme="dark"] .device-kpi-card span,
  html[data-theme="dark"] .device-progress-card span,
  html[data-theme="dark"] .device-owner-card span,
  html[data-theme="dark"] .device-roadmap__stage span:last-child,
  html[data-theme="dark"] .device-agenda-item__day,
  html[data-theme="dark"] .device-agenda-item__time {
    color: rgba(226, 232, 255, 0.6);
  }

  html[data-theme="dark"] .device-priority-card,
  html[data-theme="dark"] .device-kpi-card,
  html[data-theme="dark"] .device-agenda-item,
  html[data-theme="dark"] .device-progress-card,
  html[data-theme="dark"] .device-owner-card,
  html[data-theme="dark"] .device-roadmap__stage {
    border-color: rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.05);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
  }

  html[data-theme="dark"] .device-priority-card--accent {
    background:
      linear-gradient(180deg, rgba(44, 139, 145, 0.18), rgba(255, 255, 255, 0.05)),
      rgba(255, 255, 255, 0.05);
  }

  html[data-theme="dark"] .device-board__pill {
    background: rgba(44, 139, 145, 0.18);
    color: rgba(244, 247, 255, 0.92);
  }

  html[data-theme="dark"] .device-priority-card p,
  html[data-theme="dark"] .device-owner-card p {
    color: rgba(226, 232, 255, 0.7);
  }

  html[data-theme="dark"] .device-progress-track {
    background: rgba(255, 255, 255, 0.08);
  }

  html[data-theme="dark"] .device-roadmap__dot {
    background: rgba(255, 255, 255, 0.18);
  }

  html[data-theme="dark"] .stack-window {
    border-color: rgba(255, 255, 255, 0.08);
    background: rgba(7, 24, 26, 0.78);
    box-shadow: 0 28px 80px rgba(0, 0, 0, 0.3);
  }

  html[data-theme="dark"] .stack-window__top {
    border-bottom-color: rgba(255, 255, 255, 0.06);
    background: linear-gradient(180deg, rgba(14, 35, 38, 0.9), rgba(7, 24, 26, 0.8));
  }

  html[data-theme="dark"] .stack-window__eyebrow {
    color: rgba(198, 224, 226, 0.56);
  }

  html[data-theme="dark"] .stack-window__heading strong {
    color: rgba(239, 247, 247, 0.94);
  }

  html[data-theme="dark"] .stack-window__tag {
    background: rgba(44, 139, 145, 0.18);
    color: #86cfd3;
  }

  html[data-theme="dark"] .stack-window__body {
    background:
      radial-gradient(circle at top right, rgba(44, 139, 145, 0.18), transparent 34%),
      linear-gradient(180deg, rgba(10, 35, 38, 0.96), rgba(8, 27, 30, 0.94));
  }

  @media (max-width: 1120px) {
    .stack-card__content {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 1279px) {
    .stack-copy h2 {
      max-width: none;
      letter-spacing: -0.035em;
    }

    .stack-card {
      min-height: auto;
      position: relative;
      top: auto;
    }

    .stack-card__inner {
      min-height: auto;
    }

    .stack-card__content {
      min-height: auto;
      padding: 1.5rem 0 2rem;
    }

    .stack-window__body {
      min-height: 18rem;
    }
  }

  @media (max-width: 640px) {
    .stack-card__content {
      width: min(1360px, calc(100% - 1rem));
    }

    .stack-note {
      padding: 1.15rem;
    }

    .stack-copy h2 {
      font-size: clamp(2.45rem, 13vw, 3.55rem);
      line-height: 0.95;
    }

    .device-board__top,
    .device-cadence-grid,
    .device-priority-grid,
    .device-kpi-row,
    .device-owner-grid {
      grid-template-columns: 1fr;
    }

    .device-board__top {
      display: grid;
    }

    .stack-window__top {
      display: grid;
      align-items: flex-start;
    }

    .stack-window__tag {
      margin-left: 0;
      justify-self: flex-start;
    }
  }
`;

function renderStackVisual(index: number, item: StackItem) {
  const viewLabel =
    index === 0
      ? "Executive focus"
      : index === 1
        ? "Management system"
        : "Transformation control";

  switch (index) {
    case 0:
      return (
        <div className="stack-window stack-window--strategy">
          <div className="stack-window__top">
            <div className="window-dots" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="stack-window__heading">
              <span className="stack-window__eyebrow">{viewLabel}</span>
              <strong>{item.windowTitle}</strong>
            </div>
            <span className="stack-window__tag">{item.windowTag}</span>
          </div>
          <div className="stack-window__body">
            <div className="device-board device-board--priorities">
              <div className="device-board__top">
                <div>
                  <span className="device-board__eyebrow">Board Priorities</span>
                  <strong>12-week leadership agenda</strong>
                </div>
                <span className="device-board__pill">3 decisions this month</span>
              </div>
              <div className="device-priority-grid">
                <article className="device-priority-card device-priority-card--accent">
                  <span>Priority 01</span>
                  <strong>Margin protection</strong>
                  <p>Reset pricing discipline and protect profitable client work.</p>
                </article>
                <article className="device-priority-card">
                  <span>Priority 02</span>
                  <strong>Commercial focus</strong>
                  <p>Direct leadership attention to the strongest pipeline segments.</p>
                </article>
                <article className="device-priority-card">
                  <span>Priority 03</span>
                  <strong>Decision speed</strong>
                  <p>Remove approval drift so teams stop waiting for executive clarity.</p>
                </article>
              </div>
              <div className="device-kpi-row">
                <div className="device-kpi-card">
                  <span>Strategic choices</span>
                  <strong>4 open</strong>
                </div>
                <div className="device-kpi-card">
                  <span>Owners named</span>
                  <strong>100%</strong>
                </div>
                <div className="device-kpi-card">
                  <span>Review forum</span>
                  <strong>Tuesday</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    case 1:
      return (
        <div className="stack-window stack-window--operations">
          <div className="stack-window__top">
            <div className="window-dots" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="stack-window__heading">
              <span className="stack-window__eyebrow">{viewLabel}</span>
              <strong>{item.windowTitle}</strong>
            </div>
            <span className="stack-window__tag">{item.windowTag}</span>
          </div>
          <div className="stack-window__body">
            <div className="device-board device-board--cadence">
              <div className="device-board__top">
                <div>
                  <span className="device-board__eyebrow">Operating Cadence</span>
                  <strong>Management rhythm redesign</strong>
                </div>
                <span className="device-board__pill">Weekly cycle</span>
              </div>
              <div className="device-cadence-grid">
                <div className="device-agenda-list">
                  <div className="device-agenda-item">
                    <span className="device-agenda-item__day">Mon</span>
                    <strong>Executive priorities</strong>
                    <span className="device-agenda-item__time">45 min</span>
                  </div>
                  <div className="device-agenda-item">
                    <span className="device-agenda-item__day">Wed</span>
                    <strong>Pipeline and delivery</strong>
                    <span className="device-agenda-item__time">60 min</span>
                  </div>
                  <div className="device-agenda-item">
                    <span className="device-agenda-item__day">Fri</span>
                    <strong>Decision clearing</strong>
                    <span className="device-agenda-item__time">30 min</span>
                  </div>
                </div>
                <div className="device-progress-list">
                  <div className="device-progress-card">
                    <span>Reporting quality</span>
                    <div className="device-progress-track">
                      <span className="device-progress-bar stack-window__bar--reporting"></span>
                    </div>
                  </div>
                  <div className="device-progress-card">
                    <span>Decision turnaround</span>
                    <div className="device-progress-track">
                      <span className="device-progress-bar stack-window__bar--decision"></span>
                    </div>
                  </div>
                  <div className="device-progress-card">
                    <span>Execution follow-through</span>
                    <div className="device-progress-track">
                      <span className="device-progress-bar stack-window__bar--followthrough"></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="stack-window stack-window--delivery">
          <div className="stack-window__top">
            <div className="window-dots" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="stack-window__heading">
              <span className="stack-window__eyebrow">{viewLabel}</span>
              <strong>{item.windowTitle}</strong>
            </div>
            <span className="stack-window__tag">{item.windowTag}</span>
          </div>
          <div className="stack-window__body">
            <div className="device-board device-board--delivery">
              <div className="device-board__top">
                <div>
                  <span className="device-board__eyebrow">Transformation Office</span>
                  <strong>Governance and delivery control</strong>
                </div>
                <span className="device-board__pill">90-day sequence</span>
              </div>
              <div className="device-roadmap">
                <div className="device-roadmap__stage device-roadmap__stage--done">
                  <span className="device-roadmap__dot"></span>
                  <strong>Steering group aligned</strong>
                  <span>Done</span>
                </div>
                <div className="device-roadmap__stage device-roadmap__stage--active">
                  <span className="device-roadmap__dot"></span>
                  <strong>Workstreams in motion</strong>
                  <span>Active</span>
                </div>
                <div className="device-roadmap__stage">
                  <span className="device-roadmap__dot"></span>
                  <strong>Benefits review locked</strong>
                  <span>Next</span>
                </div>
              </div>
              <div className="device-owner-grid">
                <article className="device-owner-card">
                  <span>Commercial reset</span>
                  <strong>Managing director</strong>
                  <p>Owns revenue focus, client mix, and weekly tradeoffs.</p>
                </article>
                <article className="device-owner-card">
                  <span>Operating redesign</span>
                  <strong>Functional leads</strong>
                  <p>Drives cadence, reporting standards, and issue escalation.</p>
                </article>
              </div>
            </div>
          </div>
        </div>
      );
  }
}

export function StackSection({ items }: StackSectionProps) {
  return (
    <>
      <style>{stackSectionStyles}</style>
      <section className="stack-section" id="stacked-scroll" data-stack-container>
        <div className="stack-section__inner">
          {items.map((item, index) => (
            <article
              key={item.title}
              className="stack-card"
              data-stack-card
              style={{ "--stack-index": index } as CSSProperties}
            >
              <div className="stack-card__inner">
                <div className="stack-card__content">
                  <div className="stack-copy">
                    <p className="stack-pill">
                      <span></span>What We Solve
                    </p>
                    <h2>{item.title}</h2>
                    <p className="stack-subtitle">{item.subtitle}</p>
                    <div className="stack-note">{item.description}</div>
                    <a className="stack-cta" href={item.ctaHref}>
                      {item.ctaLabel}
                    </a>
                  </div>

                  <div className="stack-visual">
                    {renderStackVisual(index, item)}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
