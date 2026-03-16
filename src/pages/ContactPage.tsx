export function ContactPage() {
  return (
    <section className="page-shell light-section">
      <div className="container page-hero" id="contact" data-reveal>
        <div className="landing-section-heading">
          <p className="section-pill section-pill--light">
            <span></span>Contact
          </p>
          <h1>Reach Exxonim for registration, compliance, or licensing support.</h1>
          <p>
            Use the contact points below to start a consultation, ask a
            question, or confirm the next step for an ongoing request.
          </p>
        </div>

        <div className="contact-grid">
          <article className="page-card">
            <span className="page-card__eyebrow">Call</span>
            <strong>+255 794 689 099</strong>
            <p>Primary line for new consultations and active follow-up.</p>
            <a className="landing-cta landing-cta--secondary" href="tel:+255794689099">
              Call now
            </a>
          </article>

          <article className="page-card">
            <span className="page-card__eyebrow">Email</span>
            <strong>info@exxonim.tz</strong>
            <p>Send background information, documents, or direct questions.</p>
            <a className="landing-cta landing-cta--secondary" href="mailto:info@exxonim.tz">
              Send email
            </a>
          </article>

          <article className="page-card">
            <span className="page-card__eyebrow">Office</span>
            <strong>Mbezi Beach B, Africana</strong>
            <p>
              Bagamoyo Road, Block no H, House number 9, Dar es Salaam.
            </p>
            <a
              className="landing-cta landing-cta--secondary"
              href="https://wa.me/255794689099"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
