import { routes } from "../routes";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { usePage } from "../hooks/usePage";
import type { CareerPageContent } from "../types";

export function CareerPage() {
  const { data: page, isPending, error } = usePage<CareerPageContent>("career");

  if (isPending) {
    return <LoadingSpinner label="Loading career page..." />;
  }

  if (error || !page) {
    return (
      <ErrorMessage
        title="Unable to load the career page."
        detail="Check that the page endpoint is available."
      />
    );
  }

  const content = page.content;

  return (
    <section className="page-shell dark-grid-section">
      <div className="container page-hero" id="career" data-reveal>
        <div className="landing-section-heading">
          <p className="section-pill section-pill--dark">
            <span></span>
            {content.hero.eyebrow}
          </p>
          <h1>{content.hero.title}</h1>
          <p>{content.hero.description}</p>
        </div>

        <div className="page-grid">
          <article className="page-card">
            <span className="page-card__eyebrow">Focus areas</span>
            <div className="page-list">
              {content.focus_areas.map((track) => (
                <div key={track} className="page-list__item">
                  <strong>{track}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="page-card">
            <span className="page-card__eyebrow">Current status</span>
            <strong>{content.status.label}</strong>
            <p>{content.status.description}</p>
            <div className="page-actions">
              <a
                className="landing-cta landing-cta--primary"
                href={content.status.primary.href}
              >
                {content.status.primary.label}
              </a>
              <a
                className="landing-cta landing-cta--secondary"
                href={content.status.secondary.href}
              >
                {content.status.secondary.label}
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
