export function EngineSection() {
  return (
    <section className="engine-section light-section" id="services">
      <div className="container">
        <p className="section-pill section-pill--light">
          <span></span>How We Work
        </p>
        <h2 className="section-title">
          A Consulting Model Built for Leadership Teams
        </h2>
        <p className="section-subtitle">
          Diagnose the issue. Design the operating answer. Deliver the change.
        </p>

        <div className="engine-flow" data-reveal>
          <div className="engine-track" aria-hidden="true"></div>
          <article className="engine-card">
            <div className="engine-card__inner">
              <div className="engine-icon layers"></div>
              <h3>Diagnose</h3>
            </div>
          </article>
          <article className="engine-card engine-card--featured">
            <div className="engine-card__inner">
              <div className="engine-icon coins"></div>
              <h3>Design</h3>
            </div>
          </article>
          <article className="engine-card">
            <div className="engine-card__inner">
              <div className="engine-icon eject"></div>
              <h3>Deliver</h3>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
