import { routes } from "../routes";
import type { TrackingSectionContent } from "../types";

interface ResultsSectionProps {
  content: TrackingSectionContent;
}

export function ResultsSection({ content }: ResultsSectionProps) {
  const checkpoints = content.checkpoints;
  const caseExamples = content.case_examples;
  const workflowSteps = content.workflow_steps;

  return (
    <section className="tracking-section dark-grid-section" id="track-consultation">
      <span className="section-anchor" id="case-examples" aria-hidden="true"></span>
      <div className="container">
        <div
          className="landing-section-heading landing-section-heading--center"
          data-reveal
        >
          <p className="section-pill section-pill--light">
            <span></span>
            {content.eyebrow}
          </p>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>

        <div className="tracking-grid">
          <article className="tracking-card tracking-card--primary" data-reveal>
            <div className="tracking-card__top">
              <div>
                <span className="tracking-card__eyebrow">Workflow overview</span>
                <strong>Current process view</strong>
              </div>
              <span className="tracking-card__badge">Example process</span>
            </div>

            <p className="tracking-card__copy">{content.description}</p>

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
              <a
                className="landing-cta landing-cta--primary"
                href={routes.requestConsultation}
              >
                Start a new request
              </a>
              <a className="landing-cta landing-cta--secondary" href={routes.tracking}>
                Track consultation
              </a>
            </div>
          </article>

          <div className="tracking-stack">
            <article className="tracking-card" data-reveal>
              <span className="tracking-card__eyebrow">How it works</span>
              <div className="tracking-steps">
                {workflowSteps.map((step) => (
                  <div key={step.title} className="tracking-steps__item">
                    <strong>{step.title}</strong>
                    <p>{step.detail}</p>
                  </div>
                ))}
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
