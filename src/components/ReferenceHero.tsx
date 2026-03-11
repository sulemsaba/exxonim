import { routes } from "../routes";

const focusAreas = [
  "BRELA",
  "TRA",
  "BOT",
  "CRB / ERB",
  "OSHA",
  "NSSF / WCF",
] as const;

const operationalNotes = [
  {
    label: "Best fit",
    value: "Founders, NGOs, SMEs, and regulated operators",
  },
  {
    label: "Workflow",
    value: "One desk from intake to regulator follow-through",
  },
] as const;

const workflowTags = [
  "Company setup",
  "Tax registration",
  "Licensing prep",
] as const;

export function ReferenceHero() {
  return (
    <section className="reference-hero" aria-labelledby="reference-hero-title">
      <div className="container reference-hero__grid">
        <div className="reference-hero__copy" data-reveal>
          <p className="reference-hero__eyebrow">
            <span className="reference-hero__eyebrow-dot" aria-hidden="true"></span>
            Registration, licensing, and consultation support
          </p>

          <h1 id="reference-hero-title" className="reference-hero__title">
            Setup. Filing. Follow-through. One workflow that keeps moving.
          </h1>

          <p className="reference-hero__lead">
            Exxonim helps businesses, NGOs, and institutions handle company
            registration, tax setup, licensing, and regulator-facing submissions
            without turning critical operations into admin drag.
          </p>

          <div className="reference-hero__actions">
            <a className="reference-hero__button reference-hero__button--primary" href={routes.contact}>
              Request Consultation
            </a>
            <a className="reference-hero__button reference-hero__button--secondary" href={routes.services}>
              Explore Services
            </a>
          </div>

          <div className="reference-hero__chips" aria-label="Core service areas">
            {focusAreas.map((area) => (
              <span key={area} className="reference-hero__chip">
                {area}
              </span>
            ))}
          </div>

          <div className="reference-hero__notes" aria-label="How Exxonim supports clients">
            {operationalNotes.map((note) => (
              <article key={note.label} className="reference-hero__note">
                <span>{note.label}</span>
                <strong>{note.value}</strong>
              </article>
            ))}
          </div>
        </div>

        <div className="reference-hero__visual" data-reveal aria-hidden="true">
          <span className="reference-hero__status">Active now</span>
          <div className="reference-hero__mesh"></div>
          <div className="reference-hero__glow reference-hero__glow--top"></div>
          <div className="reference-hero__glow reference-hero__glow--bottom"></div>
          <div className="reference-hero__shape reference-hero__shape--one"></div>
          <div className="reference-hero__shape reference-hero__shape--two"></div>
          <div className="reference-hero__shape reference-hero__shape--three"></div>

          <article className="reference-hero__overlay">
            <div className="reference-hero__overlay-media">
              <span className="reference-hero__overlay-play"></span>
            </div>

            <div className="reference-hero__overlay-copy">
              <span className="reference-hero__overlay-label">Operational desk</span>
              <strong>Registration, tax setup, and licensing prep in one queue.</strong>

              <div className="reference-hero__overlay-tags">
                {workflowTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
