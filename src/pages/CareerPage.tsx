import { routes } from "../routes";

const careerTracks = [
  "Client service and filing coordination",
  "Compliance and regulatory support",
  "Research, documentation, and submission prep",
  "Operations support for growing client portfolios",
];

export function CareerPage() {
  return (
    <section className="page-shell dark-grid-section">
      <div className="container page-hero" id="career" data-reveal>
        <div className="landing-section-heading">
          <p className="section-pill section-pill--dark">
            <span></span>Career
          </p>
          <h2>Build practical work that helps businesses move forward.</h2>
          <p>
            Exxonim is growing around client service, compliance support, and
            execution-heavy business operations. We look for people who are
            organized, reliable, and comfortable owning details.
          </p>
        </div>

        <div className="page-grid">
          <article className="page-card">
            <span className="page-card__eyebrow">Focus areas</span>
            <div className="page-list">
              {careerTracks.map((track) => (
                <div key={track} className="page-list__item">
                  <strong>{track}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="page-card">
            <span className="page-card__eyebrow">Current status</span>
            <strong>Open to hearing from strong operators</strong>
            <p>
              Share your background, the type of work you handle well, and the
              role you think you can grow into.
            </p>
            <div className="page-actions">
              <a className="landing-cta landing-cta--primary" href="mailto:info@exxonim.tz">
                Send your profile
              </a>
              <a className="landing-cta landing-cta--secondary" href={routes.contact}>
                Contact Exxonim
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
