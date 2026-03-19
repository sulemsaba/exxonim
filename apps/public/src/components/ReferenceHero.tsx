import type { HomeHeroContent } from "../types";

interface ReferenceHeroProps {
  content: HomeHeroContent;
}

const heroStyles = `
  .hero-section {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 60px 20px;
    text-align: center;
  }

  .hero-section__container {
    max-width: 900px;
    margin: 0 auto;
  }

  .hero-section__eyebrow {
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.9;
    margin: 0 0 20px 0;
  }

  .hero-section__title {
    font-size: clamp(2rem, 8vw, 4rem);
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 20px 0;
  }

  .hero-section__description {
    font-size: 18px;
    opacity: 0.95;
    margin: 0 0 40px 0;
    line-height: 1.6;
  }

  .hero-section__cta {
    display: inline-block;
    padding: 15px 40px;
    background: white;
    color: #667eea;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .hero-section__cta:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .hero-section__highlights {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 30px;
    margin-top: 60px;
    padding-top: 40px;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }

  .hero-section__highlight {
    text-align: center;
  }

  .hero-section__highlight strong {
    display: block;
    font-size: 32px;
    margin-bottom: 8px;
  }

  .hero-section__highlight p {
    margin: 0;
    font-size: 14px;
    opacity: 0.9;
  }
`;

export function ReferenceHero({ content }: ReferenceHeroProps) {
  return (
    <>
      <style>{heroStyles}</style>
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
