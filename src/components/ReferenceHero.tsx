import { routes } from "../routes";

const focusAreas = [
  "BRELA",
  "TRA",
  "BOT",
  "CRB / ERB",
  "OSHA",
  "NSSF / WCF",
] as const;

const serviceGroups = [
  {
    title: "Registration & Setup",
    items: [
      "Company Registration",
      "Business Name Registration",
      "NGO / Organization Registration",
    ],
  },
  {
    title: "Tax & Licensing",
    items: [
      "TIN Application",
      "Annual Statutory Returns",
      "Business License Applications",
    ],
  },
  {
    title: "Institutional Support",
    items: [
      "CRB / ERB Registration",
      "OSHA Registration",
      "Business Plan Preparation",
    ],
  },
] as const;

const quickSignals = [
  {
    label: "Typical support",
    title: "One desk from filing to follow-up",
    copy: "We prepare, submit, and keep the process moving until there is an actual outcome.",
  },
  {
    label: "Best fit",
    title: "Founders, NGOs, SMEs, and regulated operators",
    copy: "Use Exxonim when the work is operationally important and delays create real cost.",
  },
] as const;

export function ReferenceHero() {
  return (
    <section className="reference-hero" aria-labelledby="reference-hero-title">
      <div className="container reference-hero__grid">
        <div className="reference-hero__copy" data-reveal>
          <p className="reference-hero__eyebrow">
            Registration, licensing, and consultation support
          </p>

          <h1 id="reference-hero-title" className="reference-hero__title">
            Build the business. We keep setup, compliance, and follow-through moving.
          </h1>

          <p className="reference-hero__lead">
            Exxonim handles company registration, tax filing, business licensing,
            and institutional submissions through one practical workflow for founders,
            NGOs, and regulated operators.
          </p>

          <div className="reference-hero__actions">
            <a className="reference-hero__button reference-hero__button--primary" href={routes.services}>
              See More Services
            </a>
            <a className="reference-hero__button reference-hero__button--secondary" href={routes.tracking}>
              Track Your Consultation
            </a>
          </div>

          <div className="reference-hero__chips" aria-label="Core service areas">
            {focusAreas.map((area) => (
              <span key={area} className="reference-hero__chip">
                {area}
              </span>
            ))}
          </div>
        </div>

        <div className="reference-hero__visual" data-reveal>
          <article className="reference-hero__panel">
            <div className="reference-hero__panel-top">
              <div>
                <span className="reference-hero__panel-label">Active workflow</span>
                <h2 className="reference-hero__panel-title">
                  One desk for setup, filing, and regulator follow-through.
                </h2>
              </div>
              <span className="reference-hero__panel-badge">Open</span>
            </div>

            <p className="reference-hero__panel-copy">
              Start with the filing that matters now. Exxonim keeps the documentation,
              regulator-facing steps, and follow-up clear enough to keep moving.
            </p>

            <div className="reference-hero__service-grid">
              {serviceGroups.map((group) => (
                <article key={group.title} className="reference-hero__service-card">
                  <span className="reference-hero__service-label">{group.title}</span>
                  <ul className="reference-hero__service-list">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </article>

          <div className="reference-hero__signal-grid">
            {quickSignals.map((signal) => (
              <article key={signal.label} className="reference-hero__signal">
                <span className="reference-hero__signal-label">{signal.label}</span>
                <strong>{signal.title}</strong>
                <p>{signal.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
