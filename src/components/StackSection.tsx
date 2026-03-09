import type { CSSProperties } from "react";
import type { StackItem } from "../types";

interface StackSectionProps {
  items: StackItem[];
}

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
    <section
      className="stack-section dark-grid-section"
      id="stacked-scroll"
      data-stack-container
    >
      <div className="stack-section__inner">
        {items.map((item, index) => (
          <article
            key={item.title}
            className="stack-card"
            data-stack-card
            style={{ "--stack-index": index } as CSSProperties}
          >
            <div className="stack-card__inner">
              <div className="container stack-card__content">
                <div className="stack-copy">
                  <p className="section-pill section-pill--dark">
                    <span></span>What We Solve
                  </p>
                  <h2>{item.title}</h2>
                  <p className="stack-subtitle">{item.subtitle}</p>
                  <div className="stack-note">{item.description}</div>
                  <a className="button button-light" href={item.ctaHref}>
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
  );
}
