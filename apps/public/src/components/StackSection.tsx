import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import type { StackItem } from "../types";

interface StackSectionProps {
  items: StackItem[];
  defaultFeatureRows?: FeatureRow[];
  featureVisualContentMap?: Record<string, FeatureVisualContent>;
}

type FeatureVisualKey = string;

type FeatureRow = {
  title: string;
  description: string;
  visualKey: FeatureVisualKey;
};

type FeatureVisualContent = {
  workstreamValue: string;
  counterpartLabel: string;
  counterpartValue: string;
  focusValue: string;
  summaryTitle: string;
  summaryBody: string;
};

type ExtendedStackItem = StackItem & {
  emphasis?: string;
  ctaHref?: string;
  ctaLabel?: string;
  featureRows?: FeatureRow[];
};

const defaultFeatureRows: FeatureRow[] = [
  {
    title: "Registration and Setup",
    description:
      "Company registration, business name registration, NGO or organization registration, and trademark filing support before operations begin.",
    visualKey: "registration",
  },
  {
    title: "Tax, Licensing, and Approvals",
    description:
      "TIN applications, business licensing, annual returns, and regulator-facing approvals prepared with clearer documentation and follow-up.",
    visualKey: "tax",
  },
  {
    title: "Institutional Support",
    description:
      "OSHA, NSSF, WCF, CRB / ERB, and related institutional registrations coordinated so compliance work stays current and submission-ready.",
    visualKey: "institutional",
  },
];

const featureVisualContentMap: Record<FeatureVisualKey, FeatureVisualContent> = {
  registration: {
    workstreamValue: "Registration and setup",
    counterpartLabel: "Client",
    counterpartValue: "Client coordination",
    focusValue: "Company, NGO, business name, and trademark setup",
    summaryTitle: "Clear setup steps, fewer avoidable corrections.",
    summaryBody:
      "We organize the registration path, documentation, and filing order so the work moves forward with less confusion and better visibility.",
  },
  tax: {
    workstreamValue: "Compliance and approvals",
    counterpartLabel: "Client",
    counterpartValue: "Client coordination",
    focusValue: "TIN, licensing, returns, and approvals",
    summaryTitle: "Clear next steps, fewer avoidable delays.",
    summaryBody:
      "We organize the filing path, documentation, and authority follow-up so the work moves forward with less back-and-forth and better visibility.",
  },
  institutional: {
    workstreamValue: "Institutional support",
    counterpartLabel: "Coverage",
    counterpartValue: "Employer and board registrations",
    focusValue: "OSHA, NSSF, WCF, CRB / ERB registrations",
    summaryTitle: "Institutional registrations stay organized.",
    summaryBody:
      "We keep employer-side and institutional filing work aligned so renewals, compliance, and submission follow-up stay practical.",
  },
  tracking: {
    workstreamValue: "Consultation tracking",
    counterpartLabel: "Reference",
    counterpartValue: "EXX-24091",
    focusValue: "Status checkpoints, follow-up, and next actions",
    summaryTitle: "Know what is complete and what comes next.",
    summaryBody:
      "We keep intake, review, submission, and authority follow-up visible so the next action stays clear from start to release.",
  },
};


function renderReferenceVisual(index: number) {
  if (index === 0) {
    return (
      <div className="study-visual-shell">
        <div className="study-visual-track">
          <div className="study-card study-card--light">
            <div className="study-topline" />
            <div className="study-brand">Reference</div>
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
            <div className="study-brand">Reference</div>
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
          <div className="study-brand">Reference</div>
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
          <div className="study-brand">Reference</div>
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

function renderTaxApprovalsVisual() {
  return (
    <div className="compose-visual">
      <div className="compose-rail" />
      <div className="compose-card">
        <div className="compose-title">Service Coordination</div>

        <div className="compose-label">Current workstream</div>
        <div className="compose-pill">Compliance and approvals</div>

        <div className="compose-row">
          <span>Client</span>
          <span>Client coordination</span>
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

function renderInstitutionalSupportVisual() {
  return (
    <div className="compose-visual compose-visual--support">
      <div className="compose-card">
        <div className="compose-title">Institutional Support</div>

        <div className="compose-label">Active registrations</div>
        <div className="compose-pill">OSHA, NSSF, WCF, CRB / ERB</div>

        <div className="compose-message">
          <h4>Employer-side registrations stay organized.</h4>
          <p>
            We keep institutional registrations aligned across workforce,
            sector, and compliance bodies so the business stays ready for
            review, filing, and renewal.
          </p>
        </div>

        <div className="support-chip-grid">
          <span className="support-chip">OSHA</span>
          <span className="support-chip">NSSF</span>
          <span className="support-chip">WCF</span>
          <span className="support-chip">CRB / ERB</span>
        </div>
      </div>

      <div className="compose-visual__side-panel">
        <div className="compose-visual__side-label">Status board</div>
        <div className="compose-visual__side-item">
          <strong>Employer setup</strong>
          <span>Workforce and compensation registrations prepared.</span>
        </div>
        <div className="compose-visual__side-item">
          <strong>Sector boards</strong>
          <span>Professional and contractor registrations tracked clearly.</span>
        </div>
        <div className="compose-visual__side-item">
          <strong>Renewal visibility</strong>
          <span>Keep follow-up practical before deadlines drift.</span>
        </div>
      </div>
    </div>
  );
}

function renderFeatureVisual(
  visualKey: FeatureVisualKey,
  featureVisuals: Record<string, FeatureVisualContent>
) {
  const content = featureVisuals[visualKey] ?? featureVisuals.tax;

  return (
    <div className="compose-visual">
      <div className="compose-rail" />
      <div className="compose-card">
        <div className="compose-title">Service Coordination</div>

        <div className="compose-label">Current workstream</div>
        <div className="compose-pill">{content.workstreamValue}</div>

        <div className="compose-row">
          <span>{content.counterpartLabel}</span>
          <span>{content.counterpartValue}</span>
        </div>

        <div className="compose-subject">
          <span>Focus</span>
          <span className="compose-input">{content.focusValue}</span>
        </div>

        <div className="compose-message">
          <h4>{content.summaryTitle}</h4>
          <p>{content.summaryBody}</p>
        </div>
      </div>
    </div>
  );
}

function FeatureChevronIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M7 4.5L13 10L7 15.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function renderComposeVisual() {
  return renderTaxApprovalsVisual();
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
          <a href={item.ctaHref || "/contact/"} className="stack-cta stack-cta--primary">
            {item.ctaLabel || "Contact Exxonim"}
            <span className="stack-cta__arrow">→</span>
          </a>
        </div>
      </div>

      {renderReferenceVisual(index)}
    </div>
  );
}

function renderFeatureCard(item: ExtendedStackItem) {
  const rows =
    item.featureRows && item.featureRows.length > 0
      ? item.featureRows
      : defaultFeatureRows;

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
          <a href={item.ctaHref || "/services/"} className="stack-cta stack-cta--primary">
            {item.ctaLabel || "Explore Services"}
            <span className="stack-cta__arrow">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function FeatureAccordionCard({
  item,
  fallbackFeatureRows,
  featureVisuals,
}: {
  item: ExtendedStackItem;
  fallbackFeatureRows: FeatureRow[];
  featureVisuals: Record<string, FeatureVisualContent>;
}) {
  const rows =
    item.featureRows && item.featureRows.length > 0
      ? item.featureRows
      : fallbackFeatureRows;
  const accordionId = useId();
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(0);
  const safeActiveFeatureIndex = Math.min(selectedFeatureIndex, rows.length - 1);
  const activeRow = rows[safeActiveFeatureIndex];

  return (
    <div className="feature-layout">
      <div className="feature-visual-stage">
        <div className="feature-visual-stage__inner">
          {renderFeatureVisual(activeRow.visualKey, featureVisuals)}
        </div>
      </div>

      <div className="feature-side">
        <div className="feature-list">
          {rows.map((row, idx) => {
            const active = idx === safeActiveFeatureIndex;
            const panelId = `${accordionId}-feature-panel-${idx}`;

            return (
              <div
                key={`${row.title}-${idx}`}
                className="feature-accordion__item"
                data-accordion-item=""
                data-index={idx + 1}
                data-state={active ? "open" : "closed"}
              >
                <button
                  type="button"
                  className="feature-accordion__trigger"
                  aria-expanded={active}
                  aria-controls={panelId}
                  onClick={() => setSelectedFeatureIndex(idx)}
                >
                  <span className="feature-accordion__badge" aria-hidden="true">
                    {idx + 1}
                  </span>

                  <span className="feature-accordion__title-wrap">
                    <span className="feature-accordion__title">{row.title}</span>
                  </span>

                  <span className="feature-accordion__chevron" aria-hidden="true">
                    <FeatureChevronIcon />
                  </span>
                </button>

                <div
                  className="feature-accordion__panel"
                  id={panelId}
                  hidden={!active}
                >
                  <div className="feature-accordion__panel-inner">
                    <div className="feature-accordion__copy">
                      <p>{row.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="stack-actions">
          <a href={item.ctaHref || "#"} className="stack-cta stack-cta--primary">
            {item.ctaLabel || "Explore Services"}
            <span className="stack-cta__arrow">{"\u2192"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function StackSection({
  items,
  defaultFeatureRows: featureRowsProp,
  featureVisualContentMap: featureVisualsProp,
}: StackSectionProps) {
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);
  const defaultRows = featureRowsProp?.length ? featureRowsProp : defaultFeatureRows;
  const visibleItems = items.filter((item) => !/track\s+your\s+consultation/i.test(item.title));
  const featureVisuals =
    featureVisualsProp && Object.keys(featureVisualsProp).length
      ? featureVisualsProp
      : featureVisualContentMap;

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
<section className="scroll-snap-wrapper">
        {visibleItems.map((rawItem, index) => {
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
                {isMiddle ? (
                  <FeatureAccordionCard
                    item={item}
                    fallbackFeatureRows={defaultRows}
                    featureVisuals={featureVisuals}
                  />
                ) : (
                  renderStatementCard(item, index)
                )}
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
