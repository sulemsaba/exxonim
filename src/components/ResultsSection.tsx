import { routes } from "../routes";

const checkpoints = [
  {
    title: "Intake confirmed",
    detail: "Requirements captured and service scope agreed.",
    status: "complete",
  },
  {
    title: "Documents reviewed",
    detail: "Application pack checked before submission.",
    status: "complete",
  },
  {
    title: "Authority follow-up",
    detail: "Submission is active and status is being monitored.",
    status: "active",
  },
  {
    title: "Final release",
    detail: "Approval, certificate, or filing confirmation is delivered.",
    status: "upcoming",
  },
] as const;

const caseExamples = [
  {
    title: "Fast-moving company setup",
    detail: "New ventures that need a clean start across registration and tax setup.",
  },
  {
    title: "Regulated approval support",
    detail: "Operators preparing documentation for sector-specific licensing.",
  },
  {
    title: "Backlog cleanup",
    detail: "Businesses catching up on statutory returns and employer registrations.",
  },
];

export function ResultsSection() {
  return (
    <section className="tracking-section dark-grid-section" id="track-consultation">
      <span className="section-anchor" id="case-examples" aria-hidden="true"></span>
      <div className="container">
        <div
          className="landing-section-heading landing-section-heading--center"
          data-reveal
        >
          <p className="section-pill section-pill--light">
            <span></span>Track your consultation
          </p>
          <h1>A clearer view of what happens after you reach out.</h1>
          <p>
            Exxonim keeps engagements structured around intake, review,
            submission, and follow-up so you are not left guessing where the
            work stands.
          </p>
        </div>

        <div className="tracking-grid">
          <article className="tracking-card tracking-card--primary" data-reveal>
            <div className="tracking-card__top">
              <div>
                <span className="tracking-card__eyebrow">Consultation follow-through</span>
                <strong>Typical workflow view</strong>
              </div>
              <span className="tracking-card__badge">Example process</span>
            </div>

            <p className="tracking-card__copy">
              This snapshot shows the usual progress across intake, document
              review, submission, and authority follow-up. Live updates for
              client work are shared directly by Exxonim during the engagement.
            </p>

            <div className="tracking-progress">
              {checkpoints.map((checkpoint) => (
                <article
                  key={checkpoint.title}
                  className={`tracking-progress__item tracking-progress__item--${checkpoint.status}`}
                >
                  <span className="tracking-progress__dot" aria-hidden="true"></span>
                  <div>
                    <strong>{checkpoint.title}</strong>
                    <p>{checkpoint.detail}</p>
                  </div>
                </article>
              ))}
            </div>

            <div className="tracking-card__actions">
              <a className="landing-cta landing-cta--primary" href={routes.contact}>
                Start a new request
              </a>
              <a className="landing-cta landing-cta--secondary" href="tel:+255794689099">
                Call Exxonim
              </a>
            </div>
          </article>

          <div className="tracking-stack">
            <article className="tracking-card" data-reveal>
              <span className="tracking-card__eyebrow">How it works</span>
              <div className="tracking-steps">
                <div className="tracking-steps__item">
                  <strong>1. Intake and scoping</strong>
                  <p>
                    We clarify the service, requirements, and target outcome
                    before work starts.
                  </p>
                </div>
                <div className="tracking-steps__item">
                  <strong>2. Preparation and submission</strong>
                  <p>
                    Documents are checked, gaps are flagged, and the filing pack
                    is prepared.
                  </p>
                </div>
                <div className="tracking-steps__item">
                  <strong>3. Follow-up and release</strong>
                  <p>
                    Exxonim tracks the outstanding step until approval,
                    confirmation, or certificate handover.
                  </p>
                </div>
              </div>
            </article>

            <article className="tracking-card" data-reveal>
              <span className="tracking-card__eyebrow">Case examples</span>
              <div className="case-grid">
                {caseExamples.map((item) => (
                  <article key={item.title} className="case-grid__item">
                    <strong>{item.title}</strong>
                    <p>{item.detail}</p>
                  </article>
                ))}
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
