import type { HeroMetric, HeroSlide } from "../types";

interface HeroSectionProps {
  slides: HeroSlide[];
  metrics: HeroMetric[];
  activeSlideIndex: number;
}

export function HeroSection({
  slides,
  metrics,
  activeSlideIndex,
}: HeroSectionProps) {
  const activeSlide = slides[activeSlideIndex] ?? slides[0];

  return (
    <section className="landing-hero" id="about">
      <div className="container landing-hero__grid">
        <div className="landing-hero__copy" data-reveal>
          <p className="section-pill section-pill--dark">
            <span></span>Registration, licensing, and compliance support
          </p>
          <h1>Launch faster. Stay compliant. Keep operations moving.</h1>
          <p className="landing-hero__lead">
            Exxonim helps businesses, NGOs, and institutions handle setup, tax
            registration, regulatory filings, and business support with clearer
            timelines and fewer avoidable delays.
          </p>
          <div className="landing-actions">
            <a className="landing-cta landing-cta--primary" href="#contact">
              Get Consultation
            </a>
            <a className="landing-cta landing-cta--secondary" href="#services">
              Explore Services
            </a>
          </div>
          <div className="landing-chip-row" aria-label="Regulatory focus areas">
            <span className="landing-chip">BRELA</span>
            <span className="landing-chip">TRA</span>
            <span className="landing-chip">BOT</span>
            <span className="landing-chip">CRB / ERB</span>
            <span className="landing-chip">OSHA</span>
            <span className="landing-chip">NSSF / WCF</span>
          </div>
        </div>

        <div className="landing-hero__visual" data-reveal>
          <article className="hero-feature-card">
            <div className="hero-feature-card__top">
              <div>
                <span className="hero-feature-card__eyebrow">
                  Featured service desk
                </span>
                <strong>{activeSlide.title}</strong>
              </div>
              <span className="hero-feature-card__status">Open</span>
            </div>

            <p className="hero-feature-card__copy">{activeSlide.description}</p>

            <div className="hero-service-list" aria-label="Featured services">
              {slides.map((slide, index) => (
                <article
                  key={slide.label}
                  className={
                    index === activeSlideIndex
                      ? "hero-service-list__item is-active"
                      : "hero-service-list__item"
                  }
                >
                  <span>{slide.label}</span>
                  <strong>{slide.title}</strong>
                </article>
              ))}
            </div>
          </article>

          <div className="hero-side-grid">
            <article className="hero-side-card">
              <span className="hero-side-card__label">Typical support</span>
              <strong>End-to-end filing coordination</strong>
              <p>
                We organize documents, prepare submissions, and keep follow-up
                moving until the process reaches a real outcome.
              </p>
            </article>

            <article className="hero-side-card">
              <span className="hero-side-card__label">Best fit</span>
              <strong>Founders, SMEs, NGOs, and regulated operators</strong>
              <p>
                Use Exxonim when setup, licensing, or statutory work is
                important enough to do once and do right.
              </p>
            </article>
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
