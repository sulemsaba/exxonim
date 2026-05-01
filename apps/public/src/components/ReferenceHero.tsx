import type { HomeHeroContent } from "../types";

interface ReferenceHeroProps {
  content: HomeHeroContent;
}

export function ReferenceHero({ content }: ReferenceHeroProps) {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left column: Copy */}
          <div className="hero-copy" data-reveal>
            <p className="hero-eyebrow">{content.eyebrow}</p>
            <h1>{content.title}</h1>
            <p className="hero-text">{content.description}</p>
            <div className="hero-actions" style={{ display: "flex", flexWrap: "wrap" }}>
              <a
                className="landing-cta landing-cta--primary"
                href={content.cta.href}
              >
                {content.cta.label}
              </a>
            </div>
          </div>

          {/* Right column: Device visual */}
          <div className="hero-visual" data-reveal>
            <div className="device-shell">
              <div className="device-frame">
                <div className="device-camera"></div>
                <div className="device-screen">
                  <div className="device-slide is-active">
                    <span className="device-slide__label">Key services</span>
                    {content.highlights.length > 0 && (
                      <h2>What we support</h2>
                    )}
                    {content.highlights.map((item) => (
                      <div key={item.title} className="device-slide__caption">
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="device-deck"></div>
                <div className="device-trackpad"></div>
                <div className="device-base"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
