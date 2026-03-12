import heroImagePrimary from "../../assets/clients/smiling-woman-writing-notes-tablet-digital-device.jpg";
import heroImageSecondary from "../../assets/clients/financial-consultant-writing-capital-allocation-details-from-archives.jpg";
import { routes } from "../routes";

const heroHighlights = [
  {
    title: "Setup",
    detail: "Company registration, tax setup, and first-step filing preparation.",
  },
  {
    title: "Licensing",
    detail: "Permit coordination and regulator-facing submission support.",
  },
  {
    title: "Follow-through",
    detail: "Practical updates until approvals, renewals, or next actions are clear.",
  },
] as const;

export function ReferenceHero() {
  return (
    <section className="reference-hero" aria-labelledby="reference-hero-title">
      <div className="container">
        <div className="reference-hero__frame">
          <div className="reference-hero__media" data-reveal>
            <img
              className="reference-hero__image reference-hero__image--primary"
              src={heroImagePrimary}
              alt=""
              loading="eager"
            />
            <img
              className="reference-hero__image reference-hero__image--secondary"
              src={heroImageSecondary}
              alt=""
              loading="eager"
            />
            <div className="reference-hero__scrim" aria-hidden="true"></div>

            <div className="reference-hero__content">
              <p className="reference-hero__eyebrow">
                Registration, licensing, and compliance support
              </p>

              <h1 id="reference-hero-title" className="reference-hero__title">
                Get help with the filings that keep business moving.
              </h1>

              <p className="reference-hero__lead">
                Exxonim supports founders, NGOs, and institutions with
                registration, tax setup, licensing, and regulator-facing
                submissions across Tanzania.
              </p>

              <div className="reference-hero__actions">
                <a
                  className="reference-hero__button reference-hero__button--primary"
                  href={routes.contact}
                >
                  Request consultation
                  <span aria-hidden="true">-&gt;</span>
                </a>
              </div>
            </div>
          </div>

          <div className="reference-hero__stats" data-reveal>
            {heroHighlights.map((item) => (
              <article key={item.title} className="reference-hero__stat">
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
