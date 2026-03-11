import { routes } from "../routes";

const focusAreas = [
  "BRELA",
  "TRA",
  "BOT",
  "OSHA",
] as const;

const workflowSteps = [
  {
    title: "Setup",
    detail: "Company and tax registration",
  },
  {
    title: "Filing",
    detail: "Application packs and statutory submissions",
  },
  {
    title: "Follow-through",
    detail: "Regulator coordination until release",
  },
] as const;

export function ReferenceHero() {
  return (
    <section className="reference-hero" aria-labelledby="reference-hero-title">
      <div className="container reference-hero__grid">
        <div className="reference-hero__copy" data-reveal>
          <p className="reference-hero__eyebrow">
            <span
              className="reference-hero__eyebrow-dot"
              aria-hidden="true"
            ></span>
            Registration, licensing, and consultation support
          </p>

          <h1 id="reference-hero-title" className="reference-hero__title">
            Setup. Filing. Follow-through. One workflow that keeps moving.
          </h1>

          <p className="reference-hero__lead">
            Exxonim helps businesses, NGOs, and institutions handle company
            registration, tax setup, licensing, and regulator-facing
            submissions without turning critical operations into admin drag.
          </p>

          <div className="reference-hero__actions">
            <a
              className="reference-hero__button reference-hero__button--primary"
              href={routes.contact}
            >
              Request Consultation
            </a>
            <a
              className="reference-hero__button reference-hero__button--secondary"
              href={routes.services}
            >
              Explore Services
            </a>
          </div>

          <div
            className="reference-hero__support"
            aria-label="Regulator touchpoints"
          >
            <span className="reference-hero__support-label">
              Regulator touchpoints
            </span>
            <div className="reference-hero__chips">
              {focusAreas.map((area) => (
                <span key={area} className="reference-hero__chip">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside
          className="reference-hero__visual"
          data-reveal
          aria-label="Exxonim workflow overview"
        >
          <div className="reference-hero__panel">
            <span className="reference-hero__panel-label">Workflow</span>

            <ol className="reference-hero__steps">
              {workflowSteps.map((step, index) => (
                <li key={step.title} className="reference-hero__step">
                  <span className="reference-hero__step-index" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <div className="reference-hero__step-copy">
                    <strong>{step.title}</strong>
                    <p>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>

            <p className="reference-hero__panel-note">
              <strong>Best fit:</strong> Founders, NGOs, SMEs, and regulated
              operators
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
