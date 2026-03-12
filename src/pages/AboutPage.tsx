import { routes } from "../routes";

const supportProfiles = [
  {
    title: "Founders and owner-led businesses",
    description:
      "Businesses that need clear support while setting up entities, preparing filings, and handling early compliance requirements.",
  },
  {
    title: "Growing operating teams",
    description:
      "Companies managing recurring registrations, statutory submissions, and regulator-facing follow-up as operations expand.",
  },
  {
    title: "NGOs and institutions",
    description:
      "Organizations that need structured handling of registrations, employer-side compliance, and institutional reporting workflows.",
  },
  {
    title: "Regulated and approval-heavy businesses",
    description:
      "Teams that need practical coordination across permits, licensing steps, and documentation that must hold up under review.",
  },
];

const serviceScope = [
  {
    title: "Registration and setup",
    description:
      "Company, business name, and organizational registration support built around correct preparation before submission.",
  },
  {
    title: "Tax and statutory compliance",
    description:
      "Support for tax registration, returns, annual filings, and routine compliance work that cannot be left to drift.",
  },
  {
    title: "Licensing and permits",
    description:
      "Practical coordination for sector licenses, operating permits, and regulated approval processes that require disciplined follow-through.",
  },
  {
    title: "Institutional registrations",
    description:
      "Employer-side and institutional registration workflows tied to public systems, boards, and compliance bodies.",
  },
  {
    title: "Business support documents",
    description:
      "Planning materials and submission support that help clients present requirements clearly and move decisions forward.",
  },
];

const operatingModel = [
  {
    step: "01",
    title: "Clarify the requirement",
    description:
      "We start by identifying the exact filing, registration, license, or regulator expectation so the work is scoped correctly from the beginning.",
  },
  {
    step: "02",
    title: "Prepare the document path",
    description:
      "Documents, ownership details, business information, and supporting records are reviewed against what the process actually demands.",
  },
  {
    step: "03",
    title: "Coordinate submission and follow-up",
    description:
      "Once the filing or application is submitted, Exxonim helps track the next action instead of leaving clients with open-ended waiting.",
  },
  {
    step: "04",
    title: "Keep the next step practical",
    description:
      "Where there is backlog, risk, or missing information, we work from the immediate requirement first so the process can move again.",
  },
];

const clientExpectations = [
  "Clearer requirements before submission work begins",
  "Tighter follow-up after documents are filed or delivered",
  "Practical communication tied to the next required action",
  "Better handling of overdue filings and compliance backlogs",
  "Support organized around progress, not vague status updates",
];

const aboutPageStyles = String.raw`
  .cx-about-page {
    --cx-page-text: #0e1f22;
    --cx-muted: #43575a;
    --cx-meta: #567074;
    --cx-page-veil: rgba(245, 249, 249, 0.74);
    --cx-page-glow: rgba(44, 139, 145, 0.16);
    --cx-page-glow-soft: rgba(134, 207, 211, 0.08);
    --cx-surface: rgba(235, 242, 242, 0.9);
    --cx-surface-strong: rgba(255, 255, 255, 0.9);
    --cx-surface-accent: rgba(226, 239, 240, 0.94);
    --cx-border: rgba(44, 139, 145, 0.16);
    --cx-border-strong: rgba(44, 139, 145, 0.28);
    --cx-shadow: 0 12px 28px rgba(8, 61, 66, 0.06);
    --cx-shadow-soft: 0 8px 18px rgba(8, 61, 66, 0.05);
    --cx-link: #083d42;
    --cx-link-hover: #0d666a;
    position: relative;
    z-index: 1;
    overflow: hidden;
  }

  .cx-about-page::before {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -2;
    background:
      radial-gradient(circle at top center, var(--cx-page-glow) 0%, var(--cx-page-veil) 54%, transparent 100%);
    pointer-events: none;
  }

  .cx-about-page::after {
    content: "";
    position: fixed;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(circle at 18% 12%, var(--cx-page-glow-soft) 0, transparent 22%),
      radial-gradient(circle at 84% 18%, rgba(44, 139, 145, 0.08) 0, transparent 24%);
    pointer-events: none;
  }

  .cx-about-shell {
    max-width: 1160px;
    margin: 0 auto;
    padding: 2rem 1.25rem 5.5rem;
  }

  .cx-about-hero {
    display: grid;
    gap: 1.4rem;
    max-width: 52rem;
    margin: 0 auto 3.25rem;
    text-align: center;
  }

  .cx-about-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    margin: 0 auto;
    padding: 0.7rem 1.1rem;
    border: 1px solid var(--cx-border);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.68);
    color: rgba(17, 35, 37, 0.84);
    font-size: 0.88rem;
    font-weight: 800;
    letter-spacing: 0.03em;
  }

  .cx-about-pill span {
    width: 0.72rem;
    height: 0.72rem;
    border-radius: 50%;
    background: linear-gradient(180deg, #2f9aa1, #0d666a);
  }

  .cx-about-hero h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(3rem, 7vw, 5.1rem);
    font-weight: 400;
    line-height: 0.95;
    letter-spacing: -0.065em;
    color: var(--cx-page-text);
  }

  .cx-about-hero p {
    margin: 0;
    font-size: clamp(1.02rem, 1.8vw, 1.18rem);
    line-height: 1.75;
    color: var(--cx-muted);
  }

  .cx-about-layout {
    display: grid;
    gap: 1.25rem;
  }

  .cx-about-panel,
  .cx-about-card,
  .cx-about-process-item,
  .cx-about-cta {
    border: 1px solid var(--cx-border);
    background: var(--cx-surface);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: var(--cx-shadow);
  }

  .cx-about-panel {
    display: grid;
    gap: 1.2rem;
    padding: 2rem;
    border-radius: 1.25rem;
  }

  .cx-about-panel--hero {
    grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
    align-items: start;
    gap: 1.75rem;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.72), rgba(232, 242, 242, 0.88)),
      var(--cx-surface);
  }

  .cx-about-panel__copy {
    display: grid;
    gap: 1rem;
  }

  .cx-about-panel__eyebrow {
    margin: 0;
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: rgba(17, 35, 37, 0.5);
  }

  .cx-about-panel h2,
  .cx-about-section-heading h2,
  .cx-about-cta h2 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3.1rem);
    font-weight: 400;
    line-height: 0.96;
    letter-spacing: -0.05em;
    color: var(--cx-page-text);
  }

  .cx-about-panel p,
  .cx-about-section-heading p,
  .cx-about-card p,
  .cx-about-process-item p,
  .cx-about-cta p {
    margin: 0;
    color: var(--cx-muted);
    line-height: 1.72;
  }

  .cx-about-stat {
    display: grid;
    gap: 0.55rem;
    align-content: start;
    padding: 1.35rem;
    border-radius: 1rem;
    border: 1px solid var(--cx-border);
    background: var(--cx-surface-strong);
    box-shadow: var(--cx-shadow-soft);
  }

  .cx-about-stat strong {
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(17, 35, 37, 0.52);
  }

  .cx-about-stat span {
    font-size: 1.05rem;
    line-height: 1.5;
    color: rgba(17, 35, 37, 0.88);
  }

  .cx-about-section {
    display: grid;
    gap: 1.25rem;
  }

  .cx-about-section-heading {
    display: grid;
    gap: 0.85rem;
    max-width: 40rem;
  }

  .cx-about-grid {
    display: grid;
    gap: 1.15rem;
  }

  .cx-about-grid--support {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cx-about-grid--services {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .cx-about-grid--expectations {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .cx-about-card {
    display: grid;
    gap: 0.8rem;
    padding: 1.4rem;
    border-radius: 1.15rem;
    background: var(--cx-surface-strong);
    box-shadow: var(--cx-shadow-soft);
  }

  .cx-about-card strong,
  .cx-about-process-item strong {
    font-size: 1rem;
    line-height: 1.4;
    color: rgba(17, 35, 37, 0.94);
  }

  .cx-about-process {
    display: grid;
    gap: 1rem;
  }

  .cx-about-process-item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 1rem;
    align-items: start;
    padding: 1.3rem 1.4rem;
    border-radius: 1.1rem;
    background: var(--cx-surface-strong);
  }

  .cx-about-process-step {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 3rem;
    min-height: 3rem;
    padding: 0.35rem;
    border-radius: 999px;
    background: rgba(13, 102, 106, 0.12);
    color: rgba(9, 68, 73, 0.88);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.12em;
  }

  .cx-about-expectation {
    display: flex;
    gap: 0.85rem;
    align-items: flex-start;
  }

  .cx-about-expectation span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    flex: none;
    margin-top: 0.15rem;
    background: rgba(13, 102, 106, 0.14);
    color: rgba(9, 68, 73, 0.9);
    font-size: 0.82rem;
    font-weight: 900;
  }

  .cx-about-expectation p {
    margin: 0;
  }

  .cx-about-cta {
    display: grid;
    gap: 1.15rem;
    padding: 2rem;
    border-radius: 1.25rem;
    background:
      radial-gradient(circle at top right, rgba(44, 139, 145, 0.12), transparent 35%),
      var(--cx-surface-accent);
  }

  .cx-about-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.85rem;
  }

  .cx-about-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.95rem;
    padding: 0.95rem 1.3rem;
    border-radius: 0.95rem;
    border: 1px solid var(--cx-border-strong);
    text-decoration: none;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    transition:
      transform 180ms ease,
      background-color 180ms ease,
      border-color 180ms ease,
      color 180ms ease;
  }

  .cx-about-button:hover,
  .cx-about-button:focus-visible {
    transform: translateY(-1px);
  }

  .cx-about-button--primary {
    background: #041214;
    border-color: transparent;
    color: #ffffff;
  }

  .cx-about-button--secondary {
    background: rgba(255, 255, 255, 0.72);
    color: var(--cx-link);
  }

  html[data-theme="dark"] .cx-about-page {
    --cx-page-text: #edf7f7;
    --cx-muted: #b7cfd1;
    --cx-meta: #9fb6b8;
    --cx-page-veil: rgba(7, 24, 26, 0.72);
    --cx-page-glow: rgba(44, 139, 145, 0.18);
    --cx-page-glow-soft: rgba(134, 207, 211, 0.08);
    --cx-surface: rgba(10, 30, 33, 0.88);
    --cx-surface-strong: rgba(14, 35, 38, 0.9);
    --cx-surface-accent: rgba(12, 38, 41, 0.92);
    --cx-border: rgba(134, 207, 211, 0.14);
    --cx-border-strong: rgba(134, 207, 211, 0.24);
    --cx-shadow: 0 16px 34px rgba(0, 0, 0, 0.22);
    --cx-shadow-soft: 0 10px 22px rgba(0, 0, 0, 0.18);
    --cx-link: #86cfd3;
    --cx-link-hover: #9de1e4;
  }

  html[data-theme="dark"] .cx-about-pill {
    background: rgba(255, 255, 255, 0.06);
    color: rgba(237, 247, 247, 0.88);
  }

  html[data-theme="dark"] .cx-about-panel__eyebrow,
  html[data-theme="dark"] .cx-about-stat strong {
    color: rgba(183, 207, 209, 0.64);
  }

  html[data-theme="dark"] .cx-about-stat span,
  html[data-theme="dark"] .cx-about-card strong,
  html[data-theme="dark"] .cx-about-process-item strong {
    color: rgba(237, 247, 247, 0.94);
  }

  html[data-theme="dark"] .cx-about-process-step,
  html[data-theme="dark"] .cx-about-expectation span {
    background: rgba(44, 139, 145, 0.18);
    color: rgba(237, 247, 247, 0.92);
  }

  html[data-theme="dark"] .cx-about-button--primary {
    background: linear-gradient(90deg, #083d42, #0e6f77);
    color: #f4fbfb;
  }

  html[data-theme="dark"] .cx-about-button--secondary {
    background: rgba(255, 255, 255, 0.06);
    color: var(--cx-link);
  }

  @media (max-width: 1024px) {
    .cx-about-shell {
      padding: 1.75rem 1rem 4.5rem;
    }

    .cx-about-panel--hero {
      grid-template-columns: 1fr;
    }

    .cx-about-grid--services {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 720px) {
    .cx-about-hero {
      margin-bottom: 2.4rem;
    }

    .cx-about-panel,
    .cx-about-cta {
      padding: 1.45rem;
    }

    .cx-about-grid--support,
    .cx-about-grid--services,
    .cx-about-grid--expectations {
      grid-template-columns: 1fr;
    }

    .cx-about-process-item {
      grid-template-columns: 1fr;
    }

    .cx-about-process-step {
      width: fit-content;
    }

    .cx-about-actions {
      flex-direction: column;
    }

    .cx-about-button {
      width: 100%;
    }
  }
`;

export function AboutPage() {
  return (
    <>
      <style>{aboutPageStyles}</style>
      <div className="cx-about-page">
        <div className="cx-about-shell">
          <section className="cx-about-hero">
            <p className="cx-about-pill">
              <span></span>About Exxonim
            </p>
            <h1>Practical support for registration, compliance, and regulatory follow-through.</h1>
            <p>
              Exxonim helps businesses, NGOs, and institutions move through setup,
              statutory filing, licensing, and institutional registration work
              with clearer preparation and fewer avoidable delays.
            </p>
          </section>

          <div className="cx-about-layout">
            <section className="cx-about-panel cx-about-panel--hero">
              <div className="cx-about-panel__copy">
                <p className="cx-about-panel__eyebrow">What Exxonim is built for</p>
                <h2>A company profile grounded in execution, not vague advisory language.</h2>
                <p>
                  Exxonim exists to help clients handle the work that usually slows
                  progress: preparing correct information, meeting filing requirements,
                  following up after submission, and keeping registration or approval
                  processes moving when details start to drift.
                </p>
                <p>
                  The focus is practical. We help clients understand what is required,
                  organize what needs to be submitted, and keep the next action visible
                  instead of letting compliance work become an open-ended backlog.
                </p>
              </div>

              <div className="cx-about-stat">
                <strong>Working style</strong>
                <span>
                  Structured preparation, document discipline, and clear next-step
                  follow-through across registration and compliance workflows.
                </span>
              </div>
            </section>

            <section className="cx-about-section">
              <div className="cx-about-section-heading">
                <h2>Who we support</h2>
                <p>
                  Exxonim works with clients that need operational help moving through
                  filing, registration, and regulator-facing processes with less
                  confusion and stronger preparation.
                </p>
              </div>

              <div className="cx-about-grid cx-about-grid--support">
                {supportProfiles.map((profile) => (
                  <article key={profile.title} className="cx-about-card">
                    <strong>{profile.title}</strong>
                    <p>{profile.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="cx-about-section">
              <div className="cx-about-section-heading">
                <h2>What we actually do</h2>
                <p>
                  The work spans setup, filing, licensing, and institutional
                  registration support. It is not abstract consulting. It is help
                  organized around the operational requirements clients have to meet.
                </p>
              </div>

              <div className="cx-about-grid cx-about-grid--services">
                {serviceScope.map((service) => (
                  <article key={service.title} className="cx-about-card">
                    <strong>{service.title}</strong>
                    <p>{service.description}</p>
                  </article>
                ))}
              </div>
            </section>

            <section className="cx-about-section">
              <div className="cx-about-section-heading">
                <h2>How Exxonim works</h2>
                <p>
                  The operating model is built around getting the requirement clear,
                  preparing the right information, and staying close to the next step
                  until the filing or approval process moves forward again.
                </p>
              </div>

              <div className="cx-about-process">
                {operatingModel.map((item) => (
                  <article key={item.step} className="cx-about-process-item">
                    <span className="cx-about-process-step">{item.step}</span>
                    <div className="cx-about-card__copy">
                      <strong>{item.title}</strong>
                      <p>{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="cx-about-section">
              <div className="cx-about-section-heading">
                <h2>What clients can expect</h2>
                <p>
                  The goal is not just to submit documents. It is to keep the work
                  organized, reduce avoidable back-and-forth, and make progress easier
                  to track from one step to the next.
                </p>
              </div>

              <div className="cx-about-grid cx-about-grid--expectations">
                {clientExpectations.map((item) => (
                  <article key={item} className="cx-about-card">
                    <div className="cx-about-expectation">
                      <span>+</span>
                      <p>{item}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="cx-about-cta">
              <h2>Start with the next practical step.</h2>
              <p>
                If you are preparing a registration, cleaning up compliance work, or
                trying to move a licensing process forward, Exxonim can help you scope
                what is required and organize the work properly.
              </p>
              <div className="cx-about-actions">
                <a className="cx-about-button cx-about-button--primary" href={routes.contact}>
                  Contact Exxonim
                </a>
                <a className="cx-about-button cx-about-button--secondary" href={routes.services}>
                  Explore services
                </a>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
