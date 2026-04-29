import type { HomeHeroContent } from "../types";

interface ReferenceHeroProps {
  content: HomeHeroContent;
}


export function ReferenceHero({ content }: ReferenceHeroProps) {
  return (
    <>
<section className="hero-section">
        <div className="hero-section__container">
          <p className="hero-section__eyebrow">{content.eyebrow}</p>
          <h1 className="hero-section__title">{content.title}</h1>
          <p className="hero-section__description">{content.description}</p>
          <a href={content.cta.href} className="hero-section__cta">
            {content.cta.label}
          </a>
          
          <div className="hero-section__highlights">
            {content.highlights.map((item) => (
              <div key={item.title} className="hero-section__highlight">
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
