import type { HeroMetric, HeroSlide } from "../types";

interface HeroSectionProps {
  slides: HeroSlide[];
  metrics: HeroMetric[];
  activeSlideIndex: number;
}

function renderConsultingVisual(index: number) {
  switch (index) {
    case 0:
      return (
        <div className="device-board device-board--priorities">
          <div className="device-board__top">
            <div>
              <span className="device-board__eyebrow">Board Priorities</span>
              <strong>12-week decision agenda</strong>
            </div>
            <span className="device-board__pill">3 critical issues</span>
          </div>
          <div className="device-priority-grid">
            <article className="device-priority-card device-priority-card--accent">
              <span>Priority 01</span>
              <strong>Cash discipline</strong>
              <p>Stop leakage and tighten collection cadence.</p>
            </article>
            <article className="device-priority-card">
              <span>Priority 02</span>
              <strong>Sales focus</strong>
              <p>Concentrate commercial effort on the strongest pipeline.</p>
            </article>
            <article className="device-priority-card">
              <span>Priority 03</span>
              <strong>Decision rights</strong>
              <p>Clarify approvals so execution stops waiting.</p>
            </article>
          </div>
          <div className="device-kpi-row">
            <div className="device-kpi-card">
              <span>Escalations</span>
              <strong>7</strong>
            </div>
            <div className="device-kpi-card">
              <span>Owners assigned</span>
              <strong>100%</strong>
            </div>
            <div className="device-kpi-card">
              <span>Weekly review</span>
              <strong>Friday</strong>
            </div>
          </div>
        </div>
      );
    case 1:
      return (
        <div className="device-board device-board--cadence">
          <div className="device-board__top">
            <div>
              <span className="device-board__eyebrow">Operating Cadence</span>
              <strong>Management rhythm</strong>
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
                <strong>Decision review</strong>
                <span className="device-agenda-item__time">30 min</span>
              </div>
            </div>
            <div className="device-progress-list">
              <div className="device-progress-card">
                <span>Sales pipeline</span>
                <div className="device-progress-track">
                  <span className="device-progress-bar device-progress-bar--sales"></span>
                </div>
              </div>
              <div className="device-progress-card">
                <span>Client delivery</span>
                <div className="device-progress-track">
                  <span className="device-progress-bar device-progress-bar--delivery"></span>
                </div>
              </div>
              <div className="device-progress-card">
                <span>Collections</span>
                <div className="device-progress-track">
                  <span className="device-progress-bar device-progress-bar--collections"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <div className="device-board device-board--delivery">
          <div className="device-board__top">
            <div>
              <span className="device-board__eyebrow">Transformation Office</span>
              <strong>Execution control</strong>
            </div>
            <span className="device-board__pill">Quarter plan</span>
          </div>
          <div className="device-roadmap">
            <div className="device-roadmap__stage device-roadmap__stage--done">
              <span className="device-roadmap__dot"></span>
              <strong>Governance aligned</strong>
              <span>Done</span>
            </div>
            <div className="device-roadmap__stage device-roadmap__stage--active">
              <span className="device-roadmap__dot"></span>
              <strong>Workstreams moving</strong>
              <span>In progress</span>
            </div>
            <div className="device-roadmap__stage">
              <span className="device-roadmap__dot"></span>
              <strong>Benefits review</strong>
              <span>Next</span>
            </div>
          </div>
          <div className="device-owner-grid">
            <article className="device-owner-card">
              <span>Commercial reset</span>
              <strong>Amina</strong>
              <p>Pipeline quality and close discipline.</p>
            </article>
            <article className="device-owner-card">
              <span>Ops redesign</span>
              <strong>Joseph</strong>
              <p>Cadence, reporting, and accountability.</p>
            </article>
          </div>
        </div>
      );
  }
}

export function HeroSection({
  slides,
  metrics,
  activeSlideIndex,
}: HeroSectionProps) {
  return (
    <section className="hero-section dark-grid-section" id="about">
      <div className="container hero-grid">
        <div className="hero-copy" data-reveal>
          <h1>Business Consulting for Teams Under Real Pressure</h1>
          <p className="hero-text">
            Exxonim works with founders, executives, and operating leaders who
            need clearer priorities, stronger management systems, and
            transformation programs that keep moving after the workshop ends.
          </p>
          <div className="hero-actions">
            <a className="button button-light" href="#contact">
              Book a consultation
            </a>
            <a className="button button-ghost-light" href="#stacked-scroll">
              See our approach
            </a>
          </div>
        </div>

        <div className="hero-visual" data-reveal>
          <div className="device-shell">
            <div className="device-frame">
              <span className="device-camera" aria-hidden="true"></span>
              <div className="device-screen">
                {slides.map((slide, index) => (
                  <div
                    key={slide.label}
                    className={
                      index === activeSlideIndex
                        ? "device-slide is-active"
                        : "device-slide"
                    }
                  >
                    <div className="device-slide__label">{slide.label}</div>
                    <div className="device-media">
                      {renderConsultingVisual(index)}
                    </div>
                    <div className="device-slide__caption">
                      <strong>{slide.title}</strong>
                      <span>{slide.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="device-deck" aria-hidden="true">
              <div className="device-trackpad"></div>
            </div>
            <div className="device-base"></div>
          </div>
        </div>
      </div>

      <div className="container metric-row" data-reveal>
        {metrics.map((metric) => (
          <article key={metric.title} className="metric-card">
            <div className="metric-icon">
              <span className={metric.iconClass}></span>
            </div>
            <div>
              <h3>{metric.title}</h3>
              <p>{metric.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
