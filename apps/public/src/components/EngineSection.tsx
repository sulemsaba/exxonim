import { routes } from "../routes";
import type { ServicesCatalogContent } from "../types";

interface EngineSectionProps {
  content: ServicesCatalogContent;
}

export function EngineSection({ content }: EngineSectionProps) {
  const serviceGroups = content.service_groups;

  return (
    <section className="service-catalog light-section" id="services">
      <div className="container">
        <div className="landing-section-heading" data-reveal>
          <p className="section-pill section-pill--light">
            <span></span>
            {content.eyebrow}
          </p>
          <h2>{content.title}</h2>
          <p>{content.description}</p>
        </div>

        <div className="service-catalog__grid">
          {serviceGroups.map((group, groupIndex) => (
            <article
              key={group.title}
              className="service-catalog__card"
              data-reveal
              style={{ transitionDelay: `${groupIndex * 80}ms` }}
            >
              <div className="service-catalog__card-top">
                <span className="service-catalog__index">0{groupIndex + 1}</span>
                <div>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </div>
              </div>

              <ul className="service-catalog__list">
                {group.services.map((service) => (
                  <li
                    key={service.id}
                    className="service-catalog__service"
                    id={service.id}
                  >
                    <strong>{service.label}</strong>
                    <p>{service.detail}</p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="service-catalog__footer" data-reveal>
          <a className="landing-cta landing-cta--primary" href={routes.contact}>
            Request a consultation
          </a>
          <a
            className="landing-cta landing-cta--secondary"
            href={routes.tracking}
          >
            Track your consultation
          </a>
        </div>
      </div>
    </section>
  );
}
