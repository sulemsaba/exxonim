import { serviceNavGroups } from "../content";
import { routes } from "../routes";

const serviceSignals = [
  {
    value: "5",
    label: "service lanes",
    detail: "Structured around registrations, compliance, licensing, institutions, and business support.",
  },
  {
    value: "Next",
    label: "step clarity",
    detail: "Every engagement is organized around the next action, not vague status updates.",
  },
  {
    value: "End",
    label: "to end follow-up",
    detail: "We help from scoping and document prep through submission and authority follow-through.",
  },
] as const;

const serviceFlow = [
  {
    step: "01",
    title: "Scope the exact requirement",
    detail:
      "We identify the filing, registration, permit, or approval path before the work starts so documents are prepared against the real requirement.",
  },
  {
    step: "02",
    title: "Prepare the document path",
    detail:
      "Ownership details, supporting records, and business information are reviewed against what the process actually asks for.",
  },
  {
    step: "03",
    title: "Submit and follow through",
    detail:
      "Once the pack is active, Exxonim helps coordinate the outstanding step instead of leaving the process open-ended.",
  },
  {
    step: "04",
    title: "Keep the next move practical",
    detail:
      "Where there is backlog, risk, or missing information, we work from the immediate next action so momentum returns fast.",
  },
] as const;

const servicePromises = [
  "Clearer requirements before submission starts",
  "Better organized documents across recurring filings",
  "Support that holds up under authority review",
  "A cleaner path for approvals, renewals, and handover",
] as const;

const servicesOverviewStyles = String.raw`
  .services-overview {
    --services-text: var(--color-text);
    --services-muted: var(--color-text-muted);
    --services-soft: var(--color-text-soft);
    --services-surface: rgba(247, 247, 244, 0.82);
    --services-surface-strong: rgba(242, 244, 241, 0.92);
    --services-surface-deep: linear-gradient(180deg, rgba(15, 92, 99, 0.96), rgba(8, 24, 27, 0.98));
    --services-border: var(--color-border-soft);
    --services-border-strong: var(--color-border-strong);
    --services-shadow: var(--shadow-panel);
    --services-glow: var(--glow-accent);
    position: relative;
    overflow: hidden;
    padding: 1.6rem 0 4.5rem;
  }

  .services-overview::before,
  .services-overview::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .services-overview::before {
    background:
      radial-gradient(circle at 15% 10%, var(--services-glow) 0, transparent 24%),
      radial-gradient(circle at 85% 14%, rgba(127, 188, 193, 0.12) 0, transparent 22%);
  }

  .services-overview::after {
    background:
      linear-gradient(180deg, rgba(248, 242, 232, 0.08), transparent 24%),
      radial-gradient(
        460px circle at var(--mouse-x, 50vw) var(--mouse-y, 30vh),
        rgba(15, 92, 99, 0.08) 0%,
        transparent 58%
      );
    opacity: 0.88;
  }

  html[data-theme="dark"] .services-overview {
    --services-text: var(--color-text);
    --services-muted: var(--color-text-muted);
    --services-soft: var(--color-text-soft);
    --services-surface: rgba(13, 34, 38, 0.72);
    --services-surface-strong: rgba(11, 31, 35, 0.86);
    --services-surface-deep: linear-gradient(180deg, rgba(17, 43, 48, 0.94), rgba(7, 21, 24, 0.98));
    --services-border: var(--color-border-soft);
    --services-border-strong: var(--color-border-strong);
    --services-shadow: var(--shadow-panel);
    --services-glow: var(--glow-accent);
  }

  .services-overview__shell {
    position: relative;
    z-index: 1;
    width: min(1240px, calc(100% - 2rem));
    margin: 0 auto;
    display: grid;
    gap: 1.25rem;
  }

  .services-overview__hero {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr);
    gap: 1.25rem;
    align-items: stretch;
  }

  .services-overview__copy,
  .services-overview__panel,
  .services-overview__group,
  .services-overview__intro,
  .services-overview__step {
    border: 1px solid var(--services-border);
    background: var(--services-surface);
    box-shadow: var(--services-shadow);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
  }

  .services-overview__copy,
  .services-overview__panel {
    border-radius: 2rem;
    padding: 1.5rem;
  }

  .services-overview__eyebrow {
    margin: 0 0 0.9rem;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--services-soft);
  }

  .services-overview__copy h1 {
    margin: 0;
    max-width: 13ch;
    font-size: clamp(2.6rem, 5vw, 5rem);
    line-height: 0.94;
    letter-spacing: -0.06em;
    color: var(--services-text);
  }

  .services-overview__copy p:last-of-type {
    margin: 1.1rem 0 0;
    max-width: 42rem;
    font-size: 1.04rem;
    line-height: 1.75;
    color: var(--services-muted);
  }

  .services-overview__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    margin-top: 1.5rem;
  }

  .services-overview__panel {
    position: relative;
    overflow: hidden;
    display: grid;
    gap: 1rem;
    align-content: start;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.14), transparent 48%),
      var(--services-surface-deep);
    color: #f7fbfb;
  }

  .services-overview__panel::before {
    content: "";
    position: absolute;
    inset: auto -12% -28% auto;
    width: 14rem;
    height: 14rem;
    border-radius: 50%;
    background: rgba(134, 207, 211, 0.18);
    filter: blur(24px);
  }

  .services-overview__panel > * {
    position: relative;
    z-index: 1;
  }

  .services-overview__panel strong {
    font-size: 1.15rem;
    line-height: 1.4;
  }

  .services-overview__panel p {
    margin: 0;
    color: rgba(238, 247, 247, 0.78);
    line-height: 1.65;
  }

  .services-overview__signals {
    display: grid;
    gap: 0.8rem;
  }

  .services-overview__signal {
    display: grid;
    grid-template-columns: 72px 1fr;
    gap: 0.8rem;
    align-items: start;
    padding: 0.9rem 1rem;
    border-radius: 1.2rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }

  .services-overview__signal-value {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 3rem;
    padding: 0 0.6rem;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .services-overview__signal strong {
    display: block;
    font-size: 0.98rem;
    line-height: 1.3;
  }

  .services-overview__signal span {
    display: block;
    margin-top: 0.35rem;
    color: rgba(238, 247, 247, 0.74);
    line-height: 1.55;
  }

  .services-overview__nav {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 1rem;
  }

  .services-overview__group {
    display: grid;
    gap: 0.9rem;
    padding: 1.2rem;
    border-radius: 1.6rem;
    color: inherit;
    text-decoration: none;
    transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
  }

  .services-overview__group:hover,
  .services-overview__group:focus-visible {
    transform: translateY(-4px);
    border-color: var(--services-border-strong);
  }

  .services-overview__group-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.8rem;
  }

  .services-overview__group-top strong {
    color: var(--services-text);
    font-size: 1.08rem;
    line-height: 1.35;
  }

  .services-overview__group-arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 999px;
    background: rgba(44, 139, 145, 0.12);
    color: #083d42;
    font-size: 1rem;
    flex-shrink: 0;
  }

  .services-overview__group p {
    margin: 0;
    color: var(--services-muted);
    line-height: 1.65;
  }

  .services-overview__group ul {
    margin: 0;
    padding: 0;
    list-style: none;
    display: grid;
    gap: 0.5rem;
  }

  .services-overview__group li {
    display: flex;
    align-items: flex-start;
    gap: 0.55rem;
    color: var(--services-soft);
    line-height: 1.5;
  }

  .services-overview__group li::before {
    content: "";
    width: 0.45rem;
    height: 0.45rem;
    border-radius: 50%;
    margin-top: 0.5rem;
    background: rgba(44, 139, 145, 0.54);
    flex-shrink: 0;
  }

  .services-overview__flow {
    display: grid;
    grid-template-columns: minmax(0, 0.82fr) minmax(0, 1.18fr);
    gap: 1rem;
    align-items: start;
  }

  .services-overview__intro {
    display: grid;
    gap: 1rem;
    padding: 1.35rem;
    border-radius: 1.8rem;
  }

  .services-overview__intro h2 {
    margin: 0;
    font-size: clamp(2rem, 3vw, 3rem);
    line-height: 1;
    letter-spacing: -0.05em;
    color: var(--services-text);
  }

  .services-overview__intro p {
    margin: 0;
    color: var(--services-muted);
    line-height: 1.7;
  }

  .services-overview__promise-list {
    display: grid;
    gap: 0.7rem;
  }

  .services-overview__promise {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    padding: 0.8rem 0.95rem;
    border-radius: 1rem;
    background: var(--services-surface-strong);
    border: 1px solid var(--services-border);
    color: var(--services-text);
    line-height: 1.55;
  }

  .services-overview__promise::before {
    content: "";
    width: 0.55rem;
    height: 0.55rem;
    margin-top: 0.45rem;
    border-radius: 50%;
    background: var(--color-accent);
    flex-shrink: 0;
  }

  .services-overview__steps {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1rem;
  }

  .services-overview__step {
    display: grid;
    gap: 0.8rem;
    padding: 1.2rem;
    border-radius: 1.5rem;
  }

  .services-overview__step-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    min-height: 2rem;
    padding: 0 0.7rem;
    border-radius: 999px;
    background: rgba(44, 139, 145, 0.12);
    color: #083d42;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.14em;
  }

  .services-overview__step strong {
    color: var(--services-text);
    font-size: 1.05rem;
    line-height: 1.35;
  }

  .services-overview__step p {
    margin: 0;
    color: var(--services-muted);
    line-height: 1.7;
  }

  html[data-theme="dark"] .services-overview__group-arrow,
  html[data-theme="dark"] .services-overview__step-tag {
    background: rgba(134, 207, 211, 0.14);
    color: #baf1f4;
  }

  @media (max-width: 1040px) {
    .services-overview__hero,
    .services-overview__flow {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 760px) {
    .services-overview {
      padding-bottom: 3.5rem;
    }

    .services-overview__copy,
    .services-overview__panel,
    .services-overview__intro,
    .services-overview__step,
    .services-overview__group {
      padding: 1.1rem;
    }

    .services-overview__steps {
      grid-template-columns: 1fr;
    }
  }
`;

export function ServicesOverviewSection() {
  return (
    <>
      <style>{servicesOverviewStyles}</style>

      <section
        className="services-overview"
        aria-labelledby="services-overview-title"
      >
        <div className="services-overview__shell">
          <div className="services-overview__hero">
            <article className="services-overview__copy" data-reveal>
              <p className="services-overview__eyebrow">Exxonim services</p>
              <h1 id="services-overview-title">
                Practical support for registrations, filings, permits, and
                business readiness.
              </h1>
              <p>
                Exxonim works across business setup, tax compliance, licensing,
                institutional registrations, and business support documents.
                The goal is simple: cleaner preparation, less avoidable
                back-and-forth, and a clearer next step after every submission.
              </p>

              <div className="services-overview__actions">
                <a className="landing-cta landing-cta--primary" href="#packages">
                  See package plans
                </a>
                <a
                  className="landing-cta landing-cta--secondary"
                  href={routes.contact}
                >
                  Request consultation
                </a>
              </div>
            </article>

            <aside className="services-overview__panel" data-reveal>
              <strong>
                Services designed around real filing paths, not generic advice.
              </strong>
              <p>
                From BRELA and TRA work to licenses, employer-side registrations,
                and business plans, Exxonim helps prepare the requirement,
                coordinate the documents, and keep follow-up moving.
              </p>

              <div className="services-overview__signals">
                {serviceSignals.map((signal) => (
                  <article key={signal.label} className="services-overview__signal">
                    <span className="services-overview__signal-value">
                      {signal.value}
                    </span>
                    <div>
                      <strong>{signal.label}</strong>
                      <span>{signal.detail}</span>
                    </div>
                  </article>
                ))}
              </div>
            </aside>
          </div>

          <div className="services-overview__nav">
            {serviceNavGroups.map((group) => (
              <a
                key={group.title}
                className="services-overview__group"
                href={group.href}
                data-reveal
              >
                <div className="services-overview__group-top">
                  <strong>{group.title}</strong>
                  <span className="services-overview__group-arrow">
                    {"\u2192"}
                  </span>
                </div>
                <p>{group.summary}</p>
                <ul>
                  {group.items.slice(0, 3).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </a>
            ))}
          </div>

          <div className="services-overview__flow">
            <article className="services-overview__intro" data-reveal>
              <p className="services-overview__eyebrow">How the work moves</p>
              <h2>Less friction. Better preparation. Clearer follow-through.</h2>
              <p>
                Good service support is not just about submitting forms. It is
                about knowing the requirement, organizing the right documents,
                and keeping the next action visible when the process is active.
              </p>

              <div className="services-overview__promise-list">
                {servicePromises.map((item) => (
                  <div key={item} className="services-overview__promise">
                    {item}
                  </div>
                ))}
              </div>
            </article>

            <div className="services-overview__steps">
              {serviceFlow.map((item) => (
                <article
                  key={item.step}
                  className="services-overview__step"
                  data-reveal
                >
                  <span className="services-overview__step-tag">{item.step}</span>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
