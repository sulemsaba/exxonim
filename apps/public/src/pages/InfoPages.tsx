import { routes } from "../routes";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import type { ContentSection, InfoPageContent } from "../types";

const infoPageStyles = String.raw`
  .info-page {
    padding: 1.75rem 0 5.5rem;
  }

  .info-page__header {
    display: grid;
    gap: 1rem;
    max-width: 48rem;
    margin-bottom: 2rem;
  }

  .info-page__header h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 4.8vw, 4.5rem);
    font-weight: 500;
    line-height: 0.95;
    letter-spacing: -0.06em;
  }

  .info-page__header p:last-child {
    margin: 0;
    font-size: 1.02rem;
    line-height: 1.72;
    color: rgba(17, 35, 37, 0.74);
  }

  .info-page__grid {
    display: grid;
    gap: 1.25rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .info-page__section {
    display: grid;
    gap: 0.9rem;
    min-height: 100%;
    padding: 1.45rem;
    border: 1px solid var(--cinematic-card-border);
    border-radius: 1.7rem;
    background: var(--cinematic-card-bg);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: var(--cinematic-card-shadow);
  }

  .info-page__section h2 {
    margin: 0;
    font-size: 1.18rem;
    line-height: 1.35;
  }

  .info-page__section p {
    margin: 0;
    color: rgba(17, 35, 37, 0.74);
    line-height: 1.74;
  }

  .info-page__list {
    display: grid;
    gap: 0.7rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .info-page__list li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.75rem;
    align-items: start;
    color: rgba(17, 35, 37, 0.74);
    line-height: 1.7;
  }

  .info-page__list li::before {
    content: "+";
    color: var(--color-accent);
    font-weight: 800;
  }

  .info-page__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: auto;
  }

  html[data-theme="dark"] .info-page__header p:last-child,
  html[data-theme="dark"] .info-page__section p,
  html[data-theme="dark"] .info-page__list li {
    color: rgba(237, 242, 255, 0.76);
  }

  @media (max-width: 900px) {
    .info-page__grid {
      grid-template-columns: 1fr;
    }
  }
`;

interface ContentPageProps {
  eyebrow: string;
  title: string;
  description: string;
  sections: ContentSection[];
  nextStep?: InfoPageContent["next_step"];
}

function ContentPage({
  eyebrow,
  title,
  description,
  sections,
  nextStep,
}: ContentPageProps) {
  return (
    <>
      <style>{infoPageStyles}</style>
      <section className="info-page light-section">
        <div className="container">
          <header className="info-page__header">
            <p className="section-pill section-pill--light">
              <span></span>
              {eyebrow}
            </p>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>

          <div className="info-page__grid">
            {sections.map((section) => (
              <section key={section.title} className="info-page__section">
                <h2>{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets?.length ? (
                  <ul className="info-page__list">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}

            {nextStep ? (
              <section className="info-page__section">
                <h2>{nextStep.title}</h2>
                <p>{nextStep.description}</p>
                <div className="info-page__actions">
                  {nextStep.primary_action ? (
                    <a
                      className="landing-cta landing-cta--primary"
                      href={nextStep.primary_action.href}
                    >
                      {nextStep.primary_action.label}
                    </a>
                  ) : null}
                  {nextStep.secondary_action ? (
                    <a
                      className="landing-cta landing-cta--secondary"
                      href={nextStep.secondary_action.href}
                    >
                      {nextStep.secondary_action.label}
                    </a>
                  ) : null}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}

interface InfoPageRouteProps {
  slug: string;
  canonicalPath: string;
  loadingLabel: string;
}

function InfoPageRoute({
  slug,
  canonicalPath,
  loadingLabel,
}: InfoPageRouteProps) {
  const { data: page, isPending, error } = usePage<InfoPageContent>(slug);
  useResolvedPageSeo(page, canonicalPath);

  if (isPending) {
    return <LoadingSpinner label={loadingLabel} />;
  }

  if (error || !page) {
    return (
      <ErrorMessage
        title="Unable to load the page."
        detail="Check that the page endpoint is available."
      />
    );
  }

  return (
    <ContentPage
      eyebrow={page.content.hero.eyebrow}
      title={page.content.hero.title}
      description={page.content.hero.description}
      sections={page.content.sections}
      nextStep={page.content.next_step}
    />
  );
}

export function SupportPage() {
  return (
    <InfoPageRoute
      slug="support"
      canonicalPath={routes.support}
      loadingLabel="Loading support page..."
    />
  );
}

export function TermsPage() {
  return (
    <InfoPageRoute
      slug="terms"
      canonicalPath={routes.terms}
      loadingLabel="Loading terms..."
    />
  );
}

export function PrivacyPage() {
  return (
    <InfoPageRoute
      slug="privacy"
      canonicalPath={routes.privacy}
      loadingLabel="Loading privacy policy..."
    />
  );
}

export function NotFoundPage() {
  return (
    <InfoPageRoute
      slug="404"
      canonicalPath={routes.notFound}
      loadingLabel="Loading page..."
    />
  );
}
