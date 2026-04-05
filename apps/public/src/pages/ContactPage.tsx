import { LoadBoundary } from "../components/LoadBoundary";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import { routes } from "../routes";
import type { ContactPageContent } from "../types";

export function ContactPage() {
  const { data: page, isPending, error } = usePage<ContactPageContent>("contact");
  useResolvedPageSeo(page, routes.contact);

  const content = page?.content;

  return (
    <LoadBoundary
      error={error}
      errorDetail="The contact page content could not be loaded right now."
      errorTitle="Unable to load the contact page."
      isPending={isPending}
      isReady={Boolean(content)}
      loadingLabel="Loading contact page..."
    >
      {() => (
        <section className="page-shell light-section">
          <div className="container page-hero" id="contact" data-reveal>
            <div className="landing-section-heading">
              <p className="section-pill section-pill--light">
                <span></span>
                {content!.hero.eyebrow}
              </p>
              <h1>{content!.hero.title}</h1>
              <p>{content!.hero.description}</p>
            </div>

            <div className="contact-grid">
              {content!.cards.map((card) => (
                <article key={card.label} className="page-card">
                  <span className="page-card__eyebrow">{card.label}</span>
                  <strong>{card.value}</strong>
                  <p>{card.description}</p>
                  <a className="landing-cta landing-cta--secondary" href={card.action.href}>
                    {card.action.label}
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}
    </LoadBoundary>
  );
}
