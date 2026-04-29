import { routes } from "../routes";
import type { ServicesOverviewContent } from "../types";


interface ServicesOverviewSectionProps {
  content: ServicesOverviewContent;
}

export function ServicesOverviewSection({
  content,
}: ServicesOverviewSectionProps) {
  const serviceSignals = content.service_signals;
  const serviceNavGroups = content.service_nav_groups;
  const serviceFlow = content.service_flow;
  const servicePromises = content.service_promises;

  return (
    <>
<section
        className="services-overview"
        aria-labelledby="services-overview-title"
      >
        <div className="services-overview__shell">
          <div className="services-overview__hero">
            <article className="services-overview__copy" data-reveal>
              <p className="services-overview__eyebrow">{content.eyebrow}</p>
              <h1 id="services-overview-title">
                {content.title}
              </h1>
              <p>{content.description}</p>

              <div className="services-overview__actions">
                <a className="landing-cta landing-cta--primary" href="#packages">
                  See package plans
                </a>
                <a
                  className="landing-cta landing-cta--secondary"
                  href={routes.contact}
                >
                  Contact Exxonim
                </a>
              </div>
            </article>

            <aside className="services-overview__panel" data-reveal>
              <strong>{content.panel_title}</strong>
              <p>{content.panel_body}</p>

              <div className="services-overview__signals">
                {serviceSignals.map((signal) => (
                  <article key={signal.label} className="services-overview__signal">
                    <span className="services-overview__signal-value">
                      {signal.value}
                    </span>
                    <div>
                      <strong>{signal.label}</strong>
                      <span>{signal.detail}</span>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </div>

          <div className="services-overview__nav">
            {serviceNavGroups.map((group) => (
              <a
                key={group.title}
                className="services-overview__group"
                href={group.href}
                data-reveal
              >
                <div className="services-overview__group-top">
                  <strong>{group.title}</strong>
                  <span className="services-overview__group-arrow">
                    {"\u2192"}
                  </span>
                </div>
                <p>{group.summary}</p>
                <ul>
                  {group.items.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </a>
            ))}
          </div>

          <div className="services-overview__flow">
            <article className="services-overview__intro" data-reveal>
              <p className="services-overview__eyebrow">How the work moves</p>
              <h2>Less friction. Better preparation. Clearer follow-through.</h2>
              <p>
                Good service support is not just about submitting forms. It is
                about knowing the requirement, organizing the right documents,
                and keeping the next action visible when the process is active.
              </p>

              <div className="services-overview__promise-list">
                {servicePromises.map((item) => (
                  <div key={item} className="services-overview__promise">
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <div className="services-overview__steps">
              {serviceFlow.map((item) => (
                <article
                  key={item.step}
                  className="services-overview__step"
                  data-reveal
                >
                  <span className="services-overview__step-tag">{item.step}</span>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
