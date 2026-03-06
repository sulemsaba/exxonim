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
  return (
    <section className="hero-section dark-grid-section">
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
          <div className="hero-motion" aria-hidden="true">
            <img
              className="hero-figure"
              src="https://asset.acho.io/new-aden-website/home/header-bg-per.png"
              alt=""
            />
            <div className="hero-motion__orb"></div>
            <div className="hero-motion__trail"></div>
          </div>

          <div className="device-shell">
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
                    <video
                      src={slide.videoSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                    ></video>
                  </div>
                  <div className="device-slide__caption">
                    <strong>{slide.title}</strong>
                    <span>{slide.description}</span>
                  </div>
                </div>
              ))}
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
