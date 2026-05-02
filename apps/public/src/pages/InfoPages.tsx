import { routes } from "../routes";
import { LoadBoundary } from "../components/LoadBoundary";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import type { ContentSection, InfoPageContent } from "../types";


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
<section className="relative bg-[linear-gradient(180deg,rgba(248,242,232,0.72)_0%,rgba(235,226,211,0.6)_100%)] backdrop-blur-[8px] dark:bg-[#071b1d]">
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

  return (
    <LoadBoundary
      error={error}
      errorDetail="This page could not be loaded right now."
      errorTitle="Unable to load the page."
      isPending={isPending}
      isReady={Boolean(page)}
      loadingLabel={loadingLabel}
    >
      {() => (
        <ContentPage
          eyebrow={page!.content.hero.eyebrow}
          title={page!.content.hero.title}
          description={page!.content.hero.description}
          sections={page!.content.sections}
          nextStep={page!.content.next_step}
        />
      )}
    </LoadBoundary>
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

export function CookiePage() {
  return (
    <InfoPageRoute
      slug="cookies"
      canonicalPath={routes.cookies}
      loadingLabel="Loading cookie notice..."
    />
  );
}

export function DataRightsPage() {
  return (
    <InfoPageRoute
      slug="data-rights"
      canonicalPath={routes.dataRights}
      loadingLabel="Loading data rights..."
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
