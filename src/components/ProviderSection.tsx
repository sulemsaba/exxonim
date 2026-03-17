import type { ProviderSectionContent } from "../types";

interface ProviderSectionProps {
  content: ProviderSectionContent;
}

export function ProviderSection({ content }: ProviderSectionProps) {
  const repeatedLogos = [...content.logos, ...content.logos];

  return (
    <section className="provider-section" id="industries">
      <div className="container provider-section__inner">
        <div className="provider-heading" data-reveal>
          <span className="provider-kicker">{content.kicker}</span>
          <h2 className="provider-title">{content.title}</h2>
        </div>
        <div
          className="provider-marquee"
          aria-label="Client and partner logos"
          data-reveal
        >
          <div className="provider-track">
            {repeatedLogos.map((logo, index) => (
              <div
                key={`${logo.alt}-${index}`}
                className="provider-logo-card"
                aria-label={logo.alt}
                role="img"
              >
                <img
                  className="provider-logo-image"
                  src={logo.src}
                  alt={`${logo.alt} logo`}
                  loading={index < content.logos.length ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
