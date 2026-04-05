import { LoadBoundary } from "../components/LoadBoundary";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import { routes } from "../routes";
import type { FaqPageContent } from "../types";

export function FaqPage() {
  const { data: page, isPending, error } = usePage<FaqPageContent>("faq");
  useResolvedPageSeo(page, routes.faq);

  const content = page?.content;

  return (
    <LoadBoundary
      error={error}
      errorDetail="The FAQ content could not be loaded right now."
      errorTitle="Unable to load the FAQ."
      isPending={isPending}
      isReady={Boolean(content)}
      loadingLabel="Loading FAQ..."
    >
      {() => (
        <section className="page-shell light-section">
          <div className="container page-hero" id="faq" data-reveal>
            <div className="faq-shell">
              <div className="faq-shell__header">
                <p className="section-pill section-pill--light">
                  <span></span>
                  {content!.hero.eyebrow}
                </p>
                <h1>{content!.hero.title}</h1>
                <p>{content!.hero.description}</p>
              </div>

              <div className="faq-grid">
                {content!.items.map((item) => (
                  <article key={item.question} className="faq-card" data-reveal>
                    <h3>{item.question}</h3>
                    <p>{item.answer}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </LoadBoundary>
  );
}
