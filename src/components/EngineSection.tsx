const serviceGroups = [
  {
    title: "Registration and setup",
    description:
      "Entity formation, protective filings, and structure setup before operations begin.",
    services: [
      {
        id: "company",
        label: "Company Registration",
        detail: "End-to-end coordination for incorporation and statutory setup.",
      },
      {
        id: "business-name",
        label: "Business Name Registration",
        detail: "Fast support for sole proprietors and early-stage operators.",
      },
      {
        id: "ngo",
        label: "NGO / Organization Registration",
        detail: "Formation support for mission-led organizations and associations.",
      },
      {
        id: "trademark",
        label: "Trademark Registration",
        detail: "Brand protection support before market expansion and launch.",
      },
    ],
  },
  {
    title: "Tax, licensing, and approvals",
    description:
      "Core compliance work for operating legally, filing on time, and unlocking approvals.",
    services: [
      {
        id: "tin",
        label: "TIN Application",
        detail: "TRA registration support for founders, firms, and operating entities.",
      },
      {
        id: "returns",
        label: "Annual Statutory Returns",
        detail: "Calendar-based filing support to avoid missed deadlines and penalties.",
      },
      {
        id: "license",
        label: "Business License Applications",
        detail: "Application preparation and authority follow-up for local licensing.",
      },
      {
        id: "bot",
        label: "BOT / Central Bank Licensing",
        detail: "Support for regulated approvals and documentation in financial services.",
      },
    ],
  },
  {
    title: "Institutional support",
    description:
      "Operational registrations and advisory work that help businesses stay submission-ready.",
    services: [
      {
        id: "crb",
        label: "CRB / ERB Registration",
        detail: "Professional and contractor registration support where sector rules apply.",
      },
      {
        id: "osha",
        label: "OSHA Registration",
        detail: "Safety registration guidance for compliant operations and inspections.",
      },
      {
        id: "nssf",
        label: "NSSF / WCF Registration",
        detail: "Employer-side registration support for workforce and compensation schemes.",
      },
      {
        id: "plan",
        label: "Business Plan Preparation",
        detail: "Structured plans for investors, lenders, internal approvals, and growth decisions.",
      },
    ],
  },
];

export function EngineSection() {
  return (
    <section className="service-catalog light-section" id="services">
      <div className="container">
        <div className="landing-section-heading" data-reveal>
          <p className="section-pill section-pill--light">
            <span></span>Services
          </p>
          <h2>
            Practical support across registration, filing, licensing, and
            business readiness.
          </h2>
          <p>
            Each service line is structured to reduce back-and-forth, keep
            documentation organized, and move your application or compliance
            work toward a clear next step.
          </p>
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
          <a className="landing-cta landing-cta--primary" href="#contact">
            Request a consultation
          </a>
          <a
            className="landing-cta landing-cta--secondary"
            href="#track-consultation"
          >
            Track your consultation
          </a>
        </div>
      </div>
    </section>
  );
}
