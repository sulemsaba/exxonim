import { useEffect, useRef, type CSSProperties } from "react";
import type { StackItem } from "../types";

interface StackSectionProps {
  items: StackItem[];
}

type FeatureRow = {
  title: string;
  description?: string;
};

type ExtendedStackItem = StackItem & {
  emphasis?: string;
  ctaHref?: string;
  ctaLabel?: string;
  featureRows?: FeatureRow[];
};

const stackSectionStyles = String.raw`
  :root {
    --surface: #efefef;
    --surface-2: #f6f6f6;
    --surface-3: #e3e3e3;
    --border: rgba(15, 23, 42, 0.12);
    --text: #111111;
    --text-soft: rgba(17, 17, 17, 0.74);
    --muted: rgba(17, 17, 17, 0.5);
    --green: #0d5b00;
    --green-dark: #063f00;
    --shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  }

  .scroll-snap-wrapper {
    position: relative;
    background: var(--surface);
    overflow-x: clip;
    overflow-y: visible;
  }

  .stack-snap-item {
    position: relative;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    min-height: 100vh;
    background: var(--surface);
    transform-origin: center top;
    will-change: transform;
    transition: none;
  }

  @media (min-width: 1024px) {
    .stack-snap-item {
      position: sticky;
      top: calc(var(--stack-index) * 40px);
    }
  }

  .stack-inner-container {
    max-width: 1320px;
    margin: 0 auto;
    min-height: 100vh;
    padding: 6.5rem 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  @media (max-width: 1023px) {
    .stack-snap-item {
      width: 100%;
      margin-left: 0;
      min-height: auto;
    }

    .stack-inner-container {
      min-height: auto;
      padding: 4rem 1rem;
    }
  }

  .statement-layout,
  .feature-layout {
    display: grid;
    align-items: center;
    gap: 4rem;
  }

  .statement-layout {
    grid-template-columns: minmax(0, 1.05fr) minmax(420px, 560px);
  }

  .feature-layout {
    grid-template-columns: minmax(420px, 620px) minmax(0, 1fr);
  }

  @media (max-width: 1023px) {
    .statement-layout,
    .feature-layout {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  .copy-block {
    max-width: 650px;
  }

  .stack-title {
    margin: 0;
    color: var(--text);
    font-size: clamp(2.5rem, 5vw, 4.8rem);
    font-weight: 700;
    line-height: 1.02;
    letter-spacing: -0.04em;
  }

  .stack-subtitle {
    margin: 1.4rem 0 0;
    color: var(--text);
    font-size: clamp(1.25rem, 2vw, 1.65rem);
    line-height: 1.45;
    font-weight: 600;
    max-width: 58rem;
  }

  .stack-desc {
    margin: 1.6rem 0 0;
    color: var(--text-soft);
    font-size: clamp(1rem, 1.2vw, 1.15rem);
    line-height: 1.75;
    max-width: 44rem;
  }

  .stack-emphasis {
    margin: 1rem 0 0;
    color: var(--text);
    font-size: clamp(1.05rem, 1.35vw, 1.35rem);
    line-height: 1.5;
    font-style: italic;
    font-weight: 600;
  }

  .stack-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-top: 2.2rem;
  }

  .stack-cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 50px;
    padding: 0 1.2rem;
    border-radius: 999px;
    text-decoration: none;
    font-size: 0.98rem;
    font-weight: 500;
    line-height: 1;
    transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
  }

  .stack-cta--primary {
    background: var(--green);
    color: #ffffff;
    box-shadow: 0 10px 24px rgba(13, 91, 0, 0.18);
  }

  .stack-cta--primary:hover {
    transform: translateY(-2px);
    background: var(--green-dark);
  }

  .stack-cta__arrow {
    display: inline-flex;
    margin-left: 0.65rem;
    font-size: 1.1rem;
    line-height: 1;
  }

  .study-visual-shell {
    width: 100%;
    max-width: 560px;
    min-height: 520px;
    padding: 2.2rem;
    border-radius: 34px;
    background: #e7e7e7;
    border: 1px solid rgba(17, 17, 17, 0.12);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .study-visual-track {
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 1.25rem;
    overflow: hidden;
  }

  .study-card {
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid rgba(17, 17, 17, 0.08);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
    flex: 0 0 auto;
  }

  .study-card--light {
    width: 188px;
    min-height: 412px;
    background: #dcdcdc;
    color: #1b1b1b;
    padding: 1rem 1rem 1.2rem;
  }

  .study-card--dark {
    width: 198px;
    min-height: 432px;
    background: #050505;
    color: #ffffff;
    padding: 1rem 1rem 1.2rem;
  }

  .study-card--narrow {
    width: 116px;
    min-height: 430px;
    background: #0a0a0a;
    color: #ffffff;
    padding: 0.9rem 0.75rem 1rem;
  }

  .study-topline {
    width: 3.6rem;
    height: 2px;
    border-radius: 999px;
    background: currentColor;
    opacity: 0.7;
    margin-bottom: 1rem;
  }

  .study-brand {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.9;
  }

  .study-small {
    margin-top: 0.75rem;
    font-size: 0.72rem;
    line-height: 1.45;
    opacity: 0.7;
  }

  .study-big {
    margin-top: 2rem;
    font-size: 1.08rem;
    line-height: 1.15;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  .study-paragraph {
    margin-top: 1rem;
    font-size: 0.84rem;
    line-height: 1.5;
    opacity: 0.82;
  }

  .study-divider {
    width: 100%;
    height: 1px;
    background: currentColor;
    opacity: 0.12;
    margin: 1rem 0;
  }

  .study-tag {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 22px;
    padding: 0 0.45rem;
    border-radius: 6px;
    background: rgba(13, 91, 0, 0.16);
    color: #1ec466;
    font-size: 0.62rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .study-list {
    margin-top: 0.8rem;
    display: grid;
    gap: 0.75rem;
  }

  .study-list-item {
    font-size: 0.68rem;
    line-height: 1.45;
    opacity: 0.88;
  }

  .study-narrow-title {
    margin-top: 1rem;
    font-size: 0.9rem;
    line-height: 1.2;
    font-weight: 700;
  }

  .study-narrow-copy {
    margin-top: 0.7rem;
    font-size: 0.66rem;
    line-height: 1.5;
    opacity: 0.78;
  }

  .compose-visual {
    width: 100%;
    max-width: 620px;
    min-height: 470px;
    border-radius: 32px;
    overflow: hidden;
    position: relative;
    background:
      radial-gradient(circle at top right, rgba(182, 198, 255, 0.9) 0%, rgba(182, 198, 255, 0.55) 14%, transparent 36%),
      linear-gradient(135deg, #ffffff 0%, #f4f4f4 48%, #e7e7e7 100%);
    border: 1px solid rgba(17, 17, 17, 0.08);
  }

  .compose-visual::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(135deg, transparent 0 74%, rgba(181, 203, 234, 0.65) 74% 76%, transparent 76%),
      radial-gradient(circle at 90% 10%, rgba(255,255,255,0.8), transparent 34%);
    pointer-events: none;
  }

  .compose-rail {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 5rem;
    background: linear-gradient(180deg, rgba(255,255,255,0.2), rgba(226,226,226,0.7));
    border-right: 1px solid rgba(17,17,17,0.06);
  }

  .compose-card {
    position: absolute;
    left: 5.5rem;
    top: 3.2rem;
    width: min(68%, 420px);
    min-height: 360px;
    border-radius: 28px;
    background: linear-gradient(180deg, rgba(255,255,255,0.78), rgba(236,236,236,0.88));
    box-shadow: 0 22px 50px rgba(120, 120, 160, 0.16);
    border: 1px solid rgba(17, 17, 17, 0.06);
    padding: 1.4rem 1.4rem 1.3rem;
    backdrop-filter: blur(8px);
  }

  .compose-title {
    font-size: 0.98rem;
    font-weight: 700;
    color: #222;
  }

  .compose-label {
    margin-top: 1.2rem;
    font-size: 0.82rem;
    color: rgba(17,17,17,0.64);
  }

  .compose-pill {
    display: inline-flex;
    align-items: center;
    margin-top: 0.55rem;
    min-height: 30px;
    padding: 0 0.9rem;
    border-radius: 999px;
    background: rgba(176, 176, 243, 0.4);
    color: #404066;
    font-size: 0.82rem;
    font-weight: 600;
  }

  .compose-row {
    margin-top: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding-bottom: 0.7rem;
    border-bottom: 1px solid rgba(17,17,17,0.08);
    font-size: 0.9rem;
    color: #2b2b2b;
  }

  .compose-subject {
    margin-top: 0.9rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
    font-size: 0.86rem;
    color: rgba(17,17,17,0.72);
  }

  .compose-input {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 0 0.9rem;
    border-radius: 999px;
    background: rgba(0,0,0,0.04);
    color: #333;
    font-size: 0.88rem;
  }

  .compose-message {
    margin-top: 1.15rem;
    padding: 1.1rem 1rem;
    border: 1.5px solid rgba(0,0,0,0.24);
    border-radius: 22px;
    background: rgba(255,255,255,0.26);
  }

  .compose-message h4 {
    margin: 0 0 0.7rem;
    font-size: 1rem;
    color: #1a1a1a;
  }

  .compose-message p {
    margin: 0;
    color: rgba(17,17,17,0.52);
    font-size: 0.88rem;
    line-height: 1.55;
  }

  .feature-side {
    width: 100%;
    max-width: 570px;
  }

  .feature-list {
    margin-top: 0.4rem;
  }

  .feature-row {
    display: grid;
    grid-template-columns: 46px 1fr 28px;
    align-items: start;
    gap: 1rem;
    padding: 1.15rem 0;
    border-top: 1px solid rgba(17,17,17,0.18);
  }

  .feature-row:first-child {
    border-top: 0;
    padding-top: 0;
  }

  .feature-row:last-child {
    border-bottom: 1px solid rgba(17,17,17,0.18);
  }

  .feature-badge {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #d1d5db;
    color: #111;
    font-size: 0.95rem;
    font-weight: 700;
  }

  .feature-row.is-active .feature-badge {
    background: var(--green);
    color: #fff;
  }

  .feature-text h3 {
    margin: 0;
    color: var(--text);
    font-size: clamp(1.55rem, 2vw, 1.95rem);
    line-height: 1.2;
    font-weight: 700;
  }

  .feature-text p {
    margin: 0.9rem 0 0;
    color: var(--text-soft);
    font-size: 1.02rem;
    line-height: 1.6;
    max-width: 34rem;
  }

  .feature-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--green);
    font-size: 1.5rem;
    line-height: 1;
    padding-top: 0.1rem;
  }

  @media (max-width: 1023px) {
    .study-visual-shell,
    .compose-visual {
      max-width: 100%;
      min-height: auto;
    }

    .study-visual-shell {
      padding: 1.25rem;
    }

    .study-visual-track {
      gap: 0.9rem;
    }

    .study-card--light {
      width: 160px;
      min-height: 360px;
    }

    .study-card--dark {
      width: 170px;
      min-height: 380px;
    }

    .study-card--narrow {
      width: 100px;
      min-height: 380px;
    }

    .compose-visual {
      aspect-ratio: 1.15 / 1;
    }

    .compose-card {
      left: 4rem;
      top: 2.3rem;
      width: calc(100% - 6rem);
      min-height: 320px;
    }

    .feature-side {
      max-width: 100%;
    }

    .feature-text h3 {
      font-size: 1.7rem;
    }

    .stack-actions {
      margin-top: 1.8rem;
    }
  }
`;

function renderStudyVisual(index: number) {
  if (index === 0) {
    return (
      <div className="study-visual-shell">
        <div className="study-visual-track">
          <div className="study-card study-card--light">
            <div className="study-topline" />
            <div className="study-brand">Exxonim</div>
            <div className="study-small">Registration Overview</div>
            <div className="study-big">
              Company, business name, NGO, and trademark setup support.
            </div>
            <div className="study-paragraph">
              Structure first. Delays later become easier to prevent.
            </div>
          </div>

          <div className="study-card study-card--dark">
            <div className="study-topline" />
            <div className="study-brand">Exxonim</div>
            <div className="study-divider" />
            <div className="study-paragraph">
              Clear documentation, coordinated follow-up, and fewer avoidable
              corrections during setup.
            </div>
            <div className="study-divider" />
            <span className="study-tag">Launch ready</span>
            <div className="study-list">
              <div className="study-list-item">
                • Company registration support
              </div>
              <div className="study-list-item">
                • Business name registration
              </div>
              <div className="study-list-item">
                • NGO / organization registration
              </div>
              <div className="study-list-item">
                • Trademark filing support
              </div>
            </div>
          </div>

          <div className="study-card study-card--narrow">
            <div className="study-topline" />
            <div className="study-brand">File</div>
            <div className="study-narrow-title">Next-step visibility</div>
            <div className="study-narrow-copy">
              Better preparation before submission, review, and launch.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="study-visual-shell">
      <div className="study-visual-track">
        <div className="study-card study-card--light">
          <div className="study-topline" />
          <div className="study-brand">Exxonim</div>
          <div className="study-small">Business Readiness Pack</div>
          <div className="study-big">
            Compliance, licensing, and institutional support you can act on.
          </div>
          <div className="study-paragraph">
            Prepared documents move faster under review.
          </div>
        </div>

        <div className="study-card study-card--dark">
          <div className="study-topline" />
          <div className="study-brand">Exxonim</div>
          <div className="study-divider" />
          <div className="study-paragraph">
            Submission-ready support across tax, licensing, registrations, and
            operating approvals.
          </div>
          <div className="study-divider" />
          <span className="study-tag">Operational readiness</span>
          <div className="study-list">
            <div className="study-list-item">• TIN application support</div>
            <div className="study-list-item">• Annual statutory returns</div>
            <div className="study-list-item">• OSHA / NSSF / WCF support</div>
            <div className="study-list-item">• Business plan preparation</div>
          </div>
        </div>

        <div className="study-card study-card--narrow">
          <div className="study-topline" />
          <div className="study-brand">Review</div>
          <div className="study-narrow-title">Prepared for decision</div>
          <div className="study-narrow-copy">
            Lender, authority, and internal review readiness.
          </div>
        </div>
      </div>
    </div>
  );
}

function renderComposeVisual() {
  return (
    <div className="compose-visual">
      <div className="compose-rail" />
      <div className="compose-card">
        <div className="compose-title">Service Coordination</div>

        <div className="compose-label">Current workstream</div>
        <div className="compose-pill">Compliance and approvals</div>

        <div className="compose-row">
          <span>Client</span>
          <span>Exxonim Consultation</span>
        </div>

        <div className="compose-subject">
          <span>Focus</span>
          <span className="compose-input">TIN, licensing, returns, and approvals</span>
        </div>

        <div className="compose-message">
          <h4>Clear next steps, fewer avoidable delays.</h4>
          <p>
            We organize the filing path, documentation, and authority follow-up
            so the work moves forward with less back-and-forth and better
            visibility.
          </p>
        </div>
      </div>
    </div>
  );
}

function renderStatementCard(item: ExtendedStackItem, index: number) {
  return (
    <div className="statement-layout">
      <div className="copy-block">
        <h2 className="stack-title">{item.title}</h2>
        <p className="stack-subtitle">{item.subtitle}</p>
        <p className="stack-desc">{item.description}</p>
        {item.emphasis ? <p className="stack-emphasis">{item.emphasis}</p> : null}

        <div className="stack-actions">
          <a href={item.ctaHref || "#"} className="stack-cta stack-cta--primary">
            {item.ctaLabel || "Request Consultation"}
            <span className="stack-cta__arrow">→</span>
          </a>
        </div>
      </div>

      {renderStudyVisual(index)}
    </div>
  );
}

function renderFeatureCard(item: ExtendedStackItem) {
  const rows =
    item.featureRows ||
    [
      {
        title: "Registration and Setup",
        description:
          "Company registration, business name registration, NGO or organization registration, and trademark filing support before operations begin.",
      },
      { title: "Tax, Licensing, and Approvals" },
      { title: "Institutional Support" },
      { title: "Track Your Consultation" },
    ];

  return (
    <div className="feature-layout">
      {renderComposeVisual()}

      <div className="feature-side">
        <div className="feature-list">
          {rows.map((row, idx) => {
            const active = idx === 0;

            return (
              <div
                key={`${row.title}-${idx}`}
                className={`feature-row ${active ? "is-active" : ""}`}
              >
                <div className="feature-badge">{idx + 1}</div>

                <div className="feature-text">
                  <h3>{row.title}</h3>
                  {row.description ? <p>{row.description}</p> : null}
                </div>

                <div className="feature-icon">{active ? "^" : "›"}</div>
              </div>
            );
          })}
        </div>

        <div className="stack-actions">
          <a href={item.ctaHref || "#"} className="stack-cta stack-cta--primary">
            {item.ctaLabel || "Explore Services"}
            <span className="stack-cta__arrow">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function StackSection({ items }: StackSectionProps) {
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateCards = () => {
      const cards = cardsRef.current.filter(Boolean) as HTMLElement[];

      if (window.innerWidth < 1024) {
        cards.forEach((card) => {
          card.style.transform = "";
        });
        return;
      }

      cards.forEach((card, i) => {
        let totalScale = 1;

        for (let j = i + 1; j < cards.length; j += 1) {
          const nextCard = cards[j];
          const nextTop = nextCard.getBoundingClientRect().top;
          const stickyPos = j * 40;
          const viewportHeight = window.innerHeight;

          let progress =
            (viewportHeight - nextTop) / (viewportHeight - stickyPos);

          progress = Math.max(0, Math.min(1, progress));

          const eased = 1 - Math.pow(1 - progress, 3);
          totalScale -= eased * 0.045;
        }

        totalScale = Math.max(totalScale, 0.88);
        card.style.transform = `translate3d(0, 0, 0) scale(${totalScale})`;
      });
    };

    const requestTick = () => {
      if (rafRef.current !== null) return;

      rafRef.current = window.requestAnimationFrame(() => {
        updateCards();
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick);

    updateCards();

    return () => {
      window.removeEventListener("scroll", requestTick);
      window.removeEventListener("resize", requestTick);

      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <>
      <style>{stackSectionStyles}</style>

      <section className="scroll-snap-wrapper">
        {items.map((rawItem, index) => {
          const item = rawItem as ExtendedStackItem;
          const isMiddle = index === 1;

          return (
            <article
              key={`${item.title}-${index}`}
              className="stack-snap-item"
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              style={{ "--stack-index": String(index) } as CSSProperties}
            >
              <div className="stack-inner-container">
                {isMiddle ? renderFeatureCard(item) : renderStatementCard(item, index)}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}