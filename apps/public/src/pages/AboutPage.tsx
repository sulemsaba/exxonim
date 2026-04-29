import { routes } from "../routes";
import { LoadBoundary } from "../components/LoadBoundary";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import type { AboutPageContent } from "../types";


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
