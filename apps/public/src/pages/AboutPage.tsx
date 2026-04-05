import { routes } from "../routes";
import { LoadBoundary } from "../components/LoadBoundary";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import type { AboutPageContent } from "../types";

const aboutPageStyles = String.raw`
  .cx-about-page {
    --cx-page-text: var(--color-text);
    --cx-muted: var(--color-text-muted);
    --cx-meta: var(--color-text-soft);
    --cx-page-veil: rgba(247, 247, 244, 0.78);
    --cx-page-glow: var(--glow-accent);
    --cx-page-glow-soft: rgba(127, 188, 193, 0.08);
    --cx-surface: rgba(242, 244, 241, 0.92);
    --cx-surface-strong: rgba(247, 247, 244, 0.92);
    --cx-surface-accent: rgba(226, 230, 225, 0.94);
    --cx-border: var(--color-border-soft);
    --cx-border-strong: var(--color-border-strong);
    --cx-shadow: 0 12px 28px rgba(8, 31, 35, 0.08);
    --cx-shadow-soft: 0 8px 18px rgba(8, 31, 35, 0.05);
    --cx-link: var(--color-accent);
    --cx-link-hover: var(--color-accent-hover);
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  .cx-about-page::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -2;
    background:
      radial-gradient(circle at top center, var(--cx-page-glow) 0%, var(--cx-page-veil) 54%, transparent 100%);
    pointer-events: none;
  }

  .cx-about-page::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(circle at 18% 12%, var(--cx-page-glow-soft) 0, transparent 22%),
      radial-gradient(circle at 84% 18%, rgba(44, 139, 145, 0.08) 0, transparent 24%);
    pointer-events: none;
  }

  .cx-about-shell {
    max-width: 1160px;
    margin: 0 auto;
    padding: 2rem 1.25rem 5.5rem;
  }

  .cx-about-hero {
    display: grid;
    gap: 1.4rem;
    max-width: 52rem;
    margin: 0 auto 3.25rem;
    text-align: center;
  }

  .cx-about-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 auto;
    padding: 0.7rem 1.1rem;
    border: 1px solid var(--cx-border);
    border-radius: 999px;
    background: rgba(248, 242, 232, 0.76);
    color: rgba(17, 35, 37, 0.84);
    font-size: 0.88rem;
    font-weight: 800;
    letter-spacing: 0.03em;
  }

  .cx-about-pill span {
    width: 0.72rem;
    height: 0.72rem;
    border-radius: 50%;
    background: linear-gradient(180deg, var(--color-accent-secondary), var(--color-accent));
  }

  .cx-about-hero h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(3rem, 7vw, 5.1rem);
    font-weight: 400;
    line-height: 0.95;
    letter-spacing: -0.065em;
    color: var(--cx-page-text);
  }

  .cx-about-hero p {
    margin: 0;
    font-size: clamp(1.02rem, 1.8vw, 1.18rem);
    line-height: 1.75;
    color: var(--cx-muted);
  }

  .cx-about-layout {
    display: grid;
    gap: 1.25rem;
  }

  .cx-about-panel,
  .cx-about-card,
  .cx-about-process-item,
  .cx-about-cta {
    border: 1px solid var(--cx-border);
    background: var(--cx-surface);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: var(--cx-shadow);
  }

  .cx-about-panel {
    display: grid;
    gap: 1.2rem;
    padding: 2rem;
    border-radius: 1.25rem;
  }

  .cx-about-panel--hero {
    grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
    align-items: start;
    gap: 1.75rem;
    background:
      linear-gradient(180deg, rgba(249, 243, 234, 0.76), rgba(236, 227, 212, 0.9)),
      var(--cx-surface);
  }

  .cx-about-panel__copy {
    display: grid;
    gap: 1rem;
  }

  .cx-about-panel__eyebrow {
    margin: 0;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(17, 35, 37, 0.5);
  }

  .cx-about-panel h2,
  .cx-about-section-heading h2,
  .cx-about-cta h2 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3.1rem);
    font-weight: 400;
    line-height: 0.96;
    letter-spacing: -0.05em;
    color: var(--cx-page-text);
  }

  .cx-about-panel p,
  .cx-about-section-heading p,
  .cx-about-card p,
  .cx-about-process-item p,
  .cx-about-cta p {
    margin: 0;
    color: var(--cx-muted);
    line-height: 1.72;
  }

  .cx-about-stat {
    display: grid;
    gap: 0.55rem;
    align-content: start;
    padding: 1.35rem;
    border-radius: 1rem;
    border: 1px solid var(--cx-border);
    background: var(--cx-surface-strong);
    box-shadow: var(--cx-shadow-soft);
  }

  .cx-about-stat strong {
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(17, 35, 37, 0.52);
  }

  .cx-about-stat span {
    font-size: 1.05rem;
    line-height: 1.5;
    color: rgba(17, 35, 37, 0.88);
  }

  .cx-about-section {
    display: grid;
    gap: 1.25rem;
  }

  .cx-about-section-heading {
    display: grid;
    gap: 0.85rem;
    max-width: 40rem;
  }

  .cx-about-grid {
    display: grid;
    gap: 1.15rem;
  }

  .cx-about-grid--support {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cx-about-grid--services {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .cx-about-grid--expectations {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cx-about-card {
    display: grid;
    gap: 0.8rem;
    padding: 1.4rem;
    border-radius: 1.15rem;
    background: var(--cx-surface-strong);
    box-shadow: var(--cx-shadow-soft);
  }

  .cx-about-card strong,
  .cx-about-process-item strong {
    font-size: 1rem;
    line-height: 1.4;
    color: rgba(17, 35, 37, 0.94);
  }

  .cx-about-process {
    display: grid;
    gap: 1rem;
  }

  .cx-about-process-item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 1rem;
    align-items: start;
    padding: 1.3rem 1.4rem;
    border-radius: 1.1rem;
    background: var(--cx-surface-strong);
  }

  .cx-about-process-step {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 3rem;
    min-height: 3rem;
    padding: 0.35rem;
    border-radius: 999px;
    background: rgba(13, 102, 106, 0.12);
    color: rgba(9, 68, 73, 0.88);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.12em;
  }

  .cx-about-expectation {
    display: flex;
    gap: 0.85rem;
    align-items: flex-start;
  }

  .cx-about-expectation span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    flex: none;
    margin-top: 0.15rem;
    background: rgba(13, 102, 106, 0.14);
    color: rgba(9, 68, 73, 0.9);
    font-size: 0.82rem;
    font-weight: 900;
  }

  .cx-about-expectation p {
    margin: 0;
  }

  .cx-about-cta {
    display: grid;
    gap: 1.15rem;
    padding: 2rem;
    border-radius: 1.25rem;
    background:
      radial-gradient(circle at top right, rgba(44, 139, 145, 0.12), transparent 35%),
      var(--cx-surface-accent);
  }

  .cx-about-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
  }

  .cx-about-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.95rem;
    padding: 0.95rem 1.3rem;
    border-radius: 0.95rem;
    border: 1px solid var(--cx-border-strong);
    text-decoration: none;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition:
      transform 180ms ease,
      background-color 180ms ease,
      border-color 180ms ease,
      color 180ms ease;
  }

  .cx-about-button:hover,
  .cx-about-button:focus-visible {
    transform: translateY(-1px);
  }

  .cx-about-button--primary {
    background: var(--color-accent);
    border-color: transparent;
    color: var(--color-accent-contrast);
  }

  .cx-about-button--secondary {
    background: rgba(248, 242, 232, 0.8);
    color: var(--cx-link);
  }

  html[data-theme="dark"] .cx-about-page {
    --cx-page-text: var(--color-text);
    --cx-muted: var(--color-text-muted);
    --cx-meta: var(--color-text-soft);
    --cx-page-veil: rgba(7, 21, 24, 0.72);
    --cx-page-glow: var(--glow-accent);
    --cx-page-glow-soft: rgba(127, 188, 193, 0.08);
    --cx-surface: rgba(13, 34, 38, 0.9);
    --cx-surface-strong: rgba(17, 43, 48, 0.9);
    --cx-surface-accent: rgba(11, 31, 35, 0.92);
    --cx-border: var(--color-border-soft);
    --cx-border-strong: var(--color-border-strong);
    --cx-shadow: 0 16px 34px rgba(0, 0, 0, 0.24);
    --cx-shadow-soft: 0 10px 22px rgba(0, 0, 0, 0.18);
    --cx-link: var(--color-accent);
    --cx-link-hover: var(--color-accent-hover);
  }

  html[data-theme="dark"] .cx-about-pill {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(237, 247, 247, 0.88);
  }

  html[data-theme="dark"] .cx-about-panel__eyebrow,
  html[data-theme="dark"] .cx-about-stat strong {
    color: rgba(183, 207, 209, 0.64);
  }

  html[data-theme="dark"] .cx-about-stat span,
  html[data-theme="dark"] .cx-about-card strong,
  html[data-theme="dark"] .cx-about-process-item strong {
    color: rgba(237, 247, 247, 0.94);
  }

  html[data-theme="dark"] .cx-about-process-step,
  html[data-theme="dark"] .cx-about-expectation span {
    background: rgba(44, 139, 145, 0.18);
    color: rgba(237, 247, 247, 0.92);
  }

  html[data-theme="dark"] .cx-about-button--primary {
    background: linear-gradient(90deg, #083d42, #0e6f77);
    color: #f4fbfb;
  }

  html[data-theme="dark"] .cx-about-button--secondary {
    background: rgba(255, 255, 255, 0.06);
    color: var(--cx-link);
  }

  @media (max-width: 1024px) {
    .cx-about-shell {
      padding: 1.75rem 1rem 4.5rem;
    }

    .cx-about-panel--hero {
      grid-template-columns: 1fr;
    }

    .cx-about-grid--services {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 720px) {
    .cx-about-hero {
      margin-bottom: 2.4rem;
    }

    .cx-about-panel,
    .cx-about-cta {
      padding: 1.45rem;
    }

    .cx-about-grid--support,
    .cx-about-grid--services,
    .cx-about-grid--expectations {
      grid-template-columns: 1fr;
    }

    .cx-about-process-item {
      grid-template-columns: 1fr;
    }

    .cx-about-process-step {
      width: fit-content;
    }

    .cx-about-actions {
      flex-direction: column;
    }

    .cx-about-button {
      width: 100%;
    }
  }
`;

export function AboutPage() {
  const { data: page, isPending, error } = usePage<AboutPageContent>("about");
  useResolvedPageSeo(page, routes.about);
  const content = page?.content;

  return (
    <LoadBoundary
      error={error}
      errorDetail="The about page content could not be loaded right now."
      errorTitle="Unable to load the about page."
      isPending={isPending}
      isReady={Boolean(content)}
      loadingLabel="Loading about page..."
    >
      {() => (
        <>
        <style>{aboutPageStyles}</style>
        <div className="cx-about-page">
          <div className="cx-about-shell">
            <section className="cx-about-hero">
              <p className="cx-about-pill">
                <span></span>
                {content!.hero.eyebrow}
              </p>
              <h1>{content!.hero.title}</h1>
              <p>{content!.hero.description}</p>
            </section>

            <div className="cx-about-layout">
              <section className="cx-about-panel cx-about-panel--hero">
                <div className="cx-about-panel__copy">
                  <p className="cx-about-panel__eyebrow">
                    {content!.company_profile.eyebrow}
                  </p>
                  <h2>{content!.company_profile.title}</h2>
                  {content!.company_profile.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                <div className="cx-about-stat">
                  {content!.company_profile.working_style_label ? (
                    <strong>{content!.company_profile.working_style_label}</strong>
                  ) : null}
                  <span>{content!.company_profile.working_style}</span>
                </div>
              </section>

              <section className="cx-about-section">
                {content!.support_profiles_section ? (
                  <div className="cx-about-section-heading">
                    <h2>{content!.support_profiles_section.title}</h2>
                    <p>{content!.support_profiles_section.description}</p>
                  </div>
                ) : null}

                <div className="cx-about-grid cx-about-grid--support">
                  {content!.support_profiles.map((profile) => (
                    <article key={profile.title} className="cx-about-card">
                      <strong>{profile.title}</strong>
                      <p>{profile.description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="cx-about-section">
                {content!.service_scope_section ? (
                  <div className="cx-about-section-heading">
                    <h2>{content!.service_scope_section.title}</h2>
                    <p>{content!.service_scope_section.description}</p>
                  </div>
                ) : null}

                <div className="cx-about-grid cx-about-grid--services">
                  {content!.service_scope.map((service) => (
                    <article key={service.title} className="cx-about-card">
                      <strong>{service.title}</strong>
                      <p>{service.description}</p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="cx-about-section">
                {content!.operating_model_section ? (
                  <div className="cx-about-section-heading">
                    <h2>{content!.operating_model_section.title}</h2>
                    <p>{content!.operating_model_section.description}</p>
                  </div>
                ) : null}

                <div className="cx-about-process">
                  {content!.operating_model.map((item) => (
                    <article key={item.step} className="cx-about-process-item">
                      <span className="cx-about-process-step">{item.step}</span>
                      <div className="cx-about-card__copy">
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="cx-about-section">
                {content!.client_expectations_section ? (
                  <div className="cx-about-section-heading">
                    <h2>{content!.client_expectations_section.title}</h2>
                    <p>{content!.client_expectations_section.description}</p>
                  </div>
                ) : null}

                <div className="cx-about-grid cx-about-grid--expectations">
                  {content!.client_expectations.map((item) => (
                    <article key={item} className="cx-about-card">
                      <div className="cx-about-expectation">
                        <span>+</span>
                        <p>{item}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="cx-about-cta">
                <h2>{content!.cta.title}</h2>
                <p>{content!.cta.description}</p>
                <div className="cx-about-actions">
                  <a
                    className="cx-about-button cx-about-button--primary"
                    href={content!.cta.primary.href}
                  >
                    {content!.cta.primary.label}
                  </a>
                  <a
                    className="cx-about-button cx-about-button--secondary"
                    href={content!.cta.secondary.href}
                  >
                    {content!.cta.secondary.label}
                  </a>
                </div>
              </section>
            </div>
          </div>
        </div>
        </>
      )}
    </LoadBoundary>
  );
}
