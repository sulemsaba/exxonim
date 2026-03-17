import heroImagePrimary from "../assets/clients/Freelance Creative Portfolio Website (1).png";
import heroImageSecondary from "../assets/clients/Freelance Creative Portfolio Website (1).png";
import type { HomeHeroContent } from "../types";

interface ReferenceHeroProps {
  content: HomeHeroContent;
}

export function ReferenceHero({ content }: ReferenceHeroProps) {
  return (
    <section className="reference-hero" aria-labelledby="reference-hero-title">
      <div className="container">
        <div className="reference-hero__frame">
          <div className="reference-hero__media" data-reveal>
            <img
              className="reference-hero__image reference-hero__image--primary"
              src={heroImagePrimary}
              alt=""
              loading="eager"
            />
            <img
              className="reference-hero__image reference-hero__image--secondary"
              src={heroImageSecondary}
              alt=""
              loading="eager"
            />
            <div className="reference-hero__scrim" aria-hidden="true"></div>

            <div className="reference-hero__content">
              <p className="reference-hero__eyebrow">{content.eyebrow}</p>

              <h1 id="reference-hero-title" className="reference-hero__title">
                {content.title}
              </h1>

              <p className="reference-hero__lead">{content.description}</p>

              <div className="reference-hero__actions">
                <a
                  className="reference-hero__button reference-hero__button--primary"
                  href={content.cta.href}
                >
                  {content.cta.label}
                  <span aria-hidden="true">-&gt;</span>
                </a>
              </div>
            </div>
          </div>

          <div className="reference-hero__stats" data-reveal>
            {content.highlights.map((item) => (
              <article key={item.title} className="reference-hero__stat">
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
