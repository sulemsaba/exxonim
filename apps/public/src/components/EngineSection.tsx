import { Container } from './primitives/Container'
import { Button } from './primitives/Button'
import { routes } from '../routes'
import type { ServicesCatalogContent } from '../types'

interface EngineSectionProps {
  content: ServicesCatalogContent;
}

export function EngineSection({ content }: EngineSectionProps) {
  const serviceGroups = content.service_groups;

  return (
    <section id="services" className="py-16 md:py-24 bg-page-strong dark:bg-page-dark-strong">
      <Container>
        {/* Section Header */}
        <div className="grid gap-4 text-center max-w-[min(52ch,90%)] mx-auto mb-12 md:mb-16">
          <p className="inline-flex items-center justify-center gap-2 text-accent text-xs font-extrabold tracking-[0.14em] uppercase dark:text-accent-dark">
            <span className="w-1.5 h-1.5 rounded-full bg-accent dark:bg-accent-dark" />
            {content.eyebrow}
          </p>
          <h2 className="font-display text-[clamp(1.8rem,3.2vw,2.6rem)] font-medium leading-tight tracking-tight dark:text-text-dark">
            {content.title}
          </h2>
          <p className="text-text-muted text-lg leading-relaxed dark:text-text-dark-muted">
            {content.description}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {serviceGroups.map((group, groupIndex) => (
            <article
              key={group.title}
              className="grid gap-5 p-6 md:p-8 rounded-[22px] border border-border-soft bg-surface/88 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 dark:bg-surface-dark/72 dark:border-border-dark-soft dark:shadow-card-dark"
              style={{ transitionDelay: `${groupIndex * 80}ms` }}
            >
              {/* Card Header */}
              <div className="flex items-start gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-accent-soft text-accent font-extrabold text-sm dark:bg-accent-dark-soft dark:text-accent-dark">
                  0{groupIndex + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl font-medium leading-tight tracking-tight dark:text-text-dark">
                    {group.title}
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed mt-1 dark:text-text-dark-muted">
                    {group.description}
                  </p>
                </div>
              </div>

              {/* Services List */}
              <ul className="grid gap-3 pt-4 border-t border-border-soft dark:border-border-dark-soft">
                {group.services.map((service) => (
                  <li
                    key={service.id}
                    id={service.id}
                    className="grid gap-1"
                  >
                    <strong className="text-text font-medium dark:text-text-dark">
                      {service.label}
                    </strong>
                    <p className="text-text-muted text-sm leading-relaxed dark:text-text-dark-muted">
                      {service.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        {/* CTA Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button href={routes.contact}>
            Contact Exxonim
          </Button>
          <Button href={routes.services} variant="ghost">
            Explore more services
          </Button>
        </div>
      </Container>
    </section>
  );
}
