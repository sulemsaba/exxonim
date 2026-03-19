import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import { routes } from "../routes";
import type { ContactPageContent } from "../types";

export function ContactPage() {
  const { data: page, isPending, error } = usePage<ContactPageContent>("contact");
  useResolvedPageSeo(page, routes.contact);

  if (isPending) {
    return <LoadingSpinner label="Loading contact page..." />;
  }

  if (error || !page) {
    return (
      <ErrorMessage
        title="Unable to load the contact page."
        detail="Check that the page endpoint is available."
      />
    );
  }

  const content = page.content;

  return (
    <section className="page-shell light-section">
      <div className="container page-hero" id="contact" data-reveal>
        <div className="landing-section-heading">
          <p className="section-pill section-pill--light">
            <span></span>
            {content.hero.eyebrow}
          </p>
          <h1>{content.hero.title}</h1>
          <p>{content.hero.description}</p>
        </div>

        <div className="contact-grid">
          {content.cards.map((card) => (
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
  );
}
