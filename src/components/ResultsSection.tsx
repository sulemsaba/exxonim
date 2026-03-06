export function ResultsSection() {
  return (
    <section className="roi-section light-section" id="results">
      <div className="container roi-grid">
        <div className="roi-copy" data-reveal>
          <p className="section-pill section-pill--light">
            <span></span>Proven in Execution
          </p>
          <h2 className="section-title">
            Advice That Shows Up in Margin, Focus, and Delivery
          </h2>
          <p className="section-description">
            Good consulting should not end in a slide deck. We work with
            leadership teams to improve commercial clarity, operating pace, and
            accountability so change becomes visible in the business.
          </p>
          <a className="button button-primary" href="#contact">
            Schedule a leadership session
          </a>
        </div>

        <div className="roi-visual" data-reveal>
          <div className="status-alert">
            <span>Priority review</span>
            <strong>Commercial performance below target</strong>
            <small>Margin trend dropped under plan</small>
          </div>

          <div className="roi-panel">
            <div className="roi-panel__header">
              <div>
                <strong>Margin protection plan</strong>
                <small>Leadership actions tied to gross margin</small>
              </div>
              <span className="toggle is-on"></span>
            </div>
            <div className="slider-block">
              <div className="slider-label">
                <span>Target operating margin</span>
                <strong>24%</strong>
              </div>
              <div className="slider-track">
                <span className="slider-fill"></span>
                <span className="slider-thumb"></span>
              </div>
            </div>
          </div>

          <div className="roi-code-card">
            <div className="code-window code-window--dark">
              <div className="code-window__top">
                <div className="window-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span>operating-playbook.md</span>
                <span className="window-tag">plan</span>
              </div>
              <div className="code-window__body">
                <pre>{`Priority 01: Restore margin discipline

- tighten pricing governance by account tier
- reset weekly commercial review cadence
- clarify approval rights on discounting
- assign delivery owners for each intervention
- track impact against the 90-day plan`}</pre>
              </div>
            </div>
          </div>

          <div className="pricing-panel" id="pricing">
            <div className="pricing-panel__row">
              <span>Baseline</span>
              <strong>12%</strong>
            </div>
            <div className="pricing-bar">
              <span style={{ width: "38%" }}></span>
            </div>
            <div className="pricing-panel__row">
              <span>Intervention</span>
              <strong>19%</strong>
            </div>
            <div className="pricing-bar">
              <span style={{ width: "63%" }}></span>
            </div>
            <div className="pricing-panel__row highlight">
              <span>Optimized</span>
              <strong>24%</strong>
            </div>
            <div className="pricing-bar highlight">
              <span style={{ width: "82%" }}></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
