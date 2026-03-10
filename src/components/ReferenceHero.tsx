import { routes } from "../routes";

const focusAreas = [
  "Company Registration",
  "TIN Application",
  "Business Licensing",
  "CRB / ERB Registration",
  "OSHA Registration",
  "Business Plan Preparation",
] as const;

export function ReferenceHero() {
  return (
    <section className="reference-hero" aria-labelledby="reference-hero-title">
      <div className="container reference-hero__inner" data-reveal>
        <p className="reference-hero__eyebrow">
          Registration, licensing, and consultation support
        </p>

        <h1 id="reference-hero-title" className="reference-hero__title">
          The perfect merge between setup, compliance, and follow-through.
        </h1>

        <p className="reference-hero__lead">
          Exxonim brings company registration, tax filing, business licensing,
          and institutional support into one clear workflow for founders, NGOs,
          and regulated operators.
        </p>

        <div className="reference-hero__actions">
          <a className="reference-hero__button reference-hero__button--primary" href={routes.services}>
            See More Services
          </a>
          <a className="reference-hero__button reference-hero__button--secondary" href={routes.tracking}>
            Track Your Consultation
          </a>
        </div>

        <div className="reference-hero__chips" aria-label="Core service areas">
          {focusAreas.map((area) => (
            <span key={area} className="reference-hero__chip">
              {area}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
