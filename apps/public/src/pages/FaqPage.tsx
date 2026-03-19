import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import { routes } from "../routes";
import type { FaqPageContent } from "../types";

export function FaqPage() {
  const { data: page, isPending, error } = usePage<FaqPageContent>("faq");
  useResolvedPageSeo(page, routes.faq);

  if (isPending) {
    return <LoadingSpinner label="Loading FAQ..." />;
  }

  if (error || !page) {
    return (
      <ErrorMessage
        title="Unable to load the FAQ."
        detail="Check that the page endpoint is available."
      />
    );
  }

  const content = page.content;

  return (
    <section className="page-shell light-section">
      <div className="container page-hero" id="faq" data-reveal>
        <div className="faq-shell">
          <div className="faq-shell__header">
            <p className="section-pill section-pill--light">
              <span></span>
              {content.hero.eyebrow}
            </p>
            <h1>{content.hero.title}</h1>
            <p>{content.hero.description}</p>
          </div>

          <div className="faq-grid">
            {content.items.map((item) => (
              <article key={item.question} className="faq-card" data-reveal>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
