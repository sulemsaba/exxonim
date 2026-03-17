import { routes } from "../routes";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { usePage } from "../hooks/usePage";
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
  primaryAction?: { href: string; label: string };
  secondaryAction?: { href: string; label: string };
}

function ContentPage({
  eyebrow,
  title,
  description,
  sections,
  primaryAction,
  secondaryAction,
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

            {primaryAction || secondaryAction ? (
              <section className="info-page__section">
                <h2>Next step</h2>
                <p>
                  If you need help with a live filing, a licensing question, or a
                  document handoff, use the contact options below and Exxonim will
                  guide the next practical step.
                </p>
                <div className="info-page__actions">
                  {primaryAction ? (
                    <a className="landing-cta landing-cta--primary" href={primaryAction.href}>
                      {primaryAction.label}
                    </a>
                  ) : null}
                  {secondaryAction ? (
                    <a
                      className="landing-cta landing-cta--secondary"
                      href={secondaryAction.href}
                    >
                      {secondaryAction.label}
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

function useInfoPage(slug: string, loadingLabel: string) {
  const { data: page, isPending, error } = usePage<InfoPageContent>(slug);

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

  return page.content;
}

export function SupportPage() {
  const content = useInfoPage("support", "Loading support page...");

  if (!("hero" in content)) {
    return content;
  }

  return (
    <ContentPage
      eyebrow={content.hero.eyebrow}
      title={content.hero.title}
      description={content.hero.description}
      sections={content.sections}
      primaryAction={{ href: routes.contact, label: "Contact Exxonim" }}
      secondaryAction={{ href: routes.faq, label: "Read the FAQ" }}
    />
  );
}

export function TermsPage() {
  const content = useInfoPage("terms", "Loading terms...");

  if (!("hero" in content)) {
    return content;
  }

  return (
    <ContentPage
      eyebrow={content.hero.eyebrow}
      title={content.hero.title}
      description={content.hero.description}
      sections={content.sections}
      primaryAction={{ href: routes.contact, label: "Ask a question" }}
      secondaryAction={{ href: routes.privacy, label: "Privacy policy" }}
    />
  );
}

export function PrivacyPage() {
  const content = useInfoPage("privacy", "Loading privacy policy...");

  if (!("hero" in content)) {
    return content;
  }

  return (
    <ContentPage
      eyebrow={content.hero.eyebrow}
      title={content.hero.title}
      description={content.hero.description}
      sections={content.sections}
      primaryAction={{ href: routes.support, label: "Support details" }}
      secondaryAction={{ href: routes.contact, label: "Contact Exxonim" }}
    />
  );
}

export function NotFoundPage() {
  const content = useInfoPage("404", "Loading page...");

  if (!("hero" in content)) {
    return content;
  }

  return (
    <ContentPage
      eyebrow={content.hero.eyebrow}
      title={content.hero.title}
      description={content.hero.description}
      sections={content.sections}
      primaryAction={{ href: routes.home, label: "Go home" }}
      secondaryAction={{ href: routes.resources, label: "Browse resources" }}
    />
  );
}
