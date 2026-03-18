import type { CSSProperties } from "react";

interface LoadingSpinnerProps {
  label?: string;
  compact?: boolean;
}

type AdminSkeletonVariant =
  | "dashboard"
  | "workspace"
  | "form"
  | "detail"
  | "inline";

function getVariant(label: string, compact: boolean): AdminSkeletonVariant {
  if (compact) {
    return "detail";
  }

  const normalized = label.toLowerCase();

  if (normalized.includes("dashboard")) {
    return "dashboard";
  }

  if (normalized.includes("detail")) {
    return "detail";
  }

  if (
    normalized.includes("settings") ||
    normalized.includes("seo") ||
    normalized.includes("footer") ||
    normalized.includes("brand")
  ) {
    return "form";
  }

  if (normalized.includes("redirect")) {
    return "inline";
  }

  return "workspace";
}

function SkeletonBlock({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={["adminx-skeleton-block", className].filter(Boolean).join(" ")}
      style={style}
    />
  );
}

function renderDashboardSkeleton(label: string) {
  return (
    <div className="adminx-page-body adminx-skeleton-screen adminx-skeleton-screen--dashboard">
      <div className="adminx-skeleton-alerts">
        {[0, 1].map((index) => (
          <article key={index} className="adminx-alert adminx-skeleton-card">
            <div className="adminx-skeleton-stack">
              <SkeletonBlock style={{ height: "0.95rem", width: "32%" }} />
              <SkeletonBlock style={{ height: "0.8rem", width: "88%" }} />
            </div>
            <SkeletonBlock style={{ height: "2.5rem", width: "5.5rem" }} />
          </article>
        ))}
      </div>

      <section className="adminx-card-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className="adminx-stat-card adminx-skeleton-card">
            <SkeletonBlock style={{ height: "0.8rem", width: "48%" }} />
            <SkeletonBlock style={{ height: "2.4rem", width: "36%" }} />
            <SkeletonBlock style={{ height: "0.75rem", width: "76%" }} />
            <SkeletonBlock style={{ height: "2.6rem", width: "6rem" }} />
          </article>
        ))}
      </section>

      <div className="admin-grid">
        <section className="admin-card adminx-skeleton-card">
          <div className="admin-card__header">
            <div className="adminx-skeleton-stack" style={{ width: "100%" }}>
              <SkeletonBlock style={{ height: "1rem", width: "34%" }} />
              <SkeletonBlock style={{ height: "0.78rem", width: "48%" }} />
            </div>
          </div>
          <div className="admin-card__body">
            <div className="adminx-skeleton-chart">
              {Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="adminx-skeleton-chart__column">
                  <SkeletonBlock
                    className="adminx-skeleton-chart__bar"
                    style={{
                      height: `${56 + ((index % 5) + 1) * 18}px`,
                      width: "100%",
                    }}
                  />
                  <SkeletonBlock style={{ height: "0.65rem", width: "100%" }} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="admin-card adminx-skeleton-card">
          <div className="admin-card__header">
            <div className="adminx-skeleton-stack" style={{ width: "100%" }}>
              <SkeletonBlock style={{ height: "1rem", width: "38%" }} />
              <SkeletonBlock style={{ height: "0.78rem", width: "56%" }} />
            </div>
          </div>
          <div className="admin-card__body">
            <div className="adminx-skeleton-list">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="adminx-skeleton-list__item">
                  <SkeletonBlock className="adminx-skeleton-list__avatar" />
                  <div className="adminx-skeleton-stack" style={{ width: "100%" }}>
                    <SkeletonBlock style={{ height: "0.82rem", width: `${66 - index * 4}%` }} />
                    <SkeletonBlock style={{ height: "0.72rem", width: `${84 - index * 6}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="adminx-card-grid adminx-card-grid--two">
        {Array.from({ length: 2 }).map((_, index) => (
          <section key={index} className="admin-card adminx-skeleton-card">
            <div className="admin-card__header">
              <div className="adminx-skeleton-stack" style={{ width: "100%" }}>
                <SkeletonBlock style={{ height: "1rem", width: "44%" }} />
                <SkeletonBlock style={{ height: "0.78rem", width: "58%" }} />
              </div>
            </div>
            <div className="admin-card__body">
              <div className="adminx-skeleton-list">
                {Array.from({ length: 4 }).map((__, rowIndex) => (
                  <div key={rowIndex} className="adminx-skeleton-stack">
                    <SkeletonBlock style={{ height: "0.85rem", width: `${60 - rowIndex * 4}%` }} />
                    <SkeletonBlock style={{ height: "0.72rem", width: `${80 - rowIndex * 5}%` }} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      <p className="adminx-skeleton-caption">{label}</p>
    </div>
  );
}

function renderWorkspaceSkeleton(label: string) {
  return (
    <div className="admin-grid adminx-skeleton-screen adminx-skeleton-screen--workspace">
      <section className="admin-card adminx-skeleton-card">
        <div className="admin-card__header">
          <div className="adminx-skeleton-stack" style={{ width: "100%" }}>
            <SkeletonBlock style={{ height: "1rem", width: "32%" }} />
            <SkeletonBlock style={{ height: "0.78rem", width: "62%" }} />
          </div>
        </div>
        <div className="admin-card__body">
          <div className="admin-toolbar">
            <SkeletonBlock style={{ height: "0.8rem", width: "8rem" }} />
            <SkeletonBlock style={{ height: "2.75rem", width: "7rem" }} />
          </div>

          <div className="adminx-skeleton-form-grid">
            <SkeletonBlock style={{ height: "3rem", width: "100%" }} />
            <SkeletonBlock style={{ height: "3rem", width: "100%" }} />
            <SkeletonBlock style={{ height: "3rem", width: "100%" }} />
          </div>

          <div className="adminx-skeleton-table">
            <SkeletonBlock style={{ height: "0.8rem", width: "100%" }} />
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="adminx-skeleton-table__row">
                <SkeletonBlock style={{ height: "0.85rem", width: `${20 + index * 2}%` }} />
                <SkeletonBlock style={{ height: "0.85rem", width: `${34 + (index % 3) * 6}%` }} />
                <SkeletonBlock style={{ height: "0.85rem", width: "18%" }} />
                <SkeletonBlock style={{ height: "0.85rem", width: `${22 + (index % 2) * 7}%` }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="admin-card adminx-skeleton-card">
        <div className="admin-card__header">
          <div className="adminx-skeleton-stack" style={{ width: "100%" }}>
            <SkeletonBlock style={{ height: "1rem", width: "40%" }} />
            <SkeletonBlock style={{ height: "0.78rem", width: "70%" }} />
          </div>
        </div>
        <div className="admin-card__body">
          <div className="adminx-skeleton-form-grid adminx-skeleton-form-grid--two">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className={index > 3 ? "adminx-skeleton-field adminx-skeleton-field--full" : "adminx-skeleton-field"}
              >
                <SkeletonBlock style={{ height: "0.72rem", width: "38%" }} />
                <SkeletonBlock
                  style={{
                    height: index > 3 ? "7.2rem" : "3rem",
                    width: "100%",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="admin-form__actions">
            <SkeletonBlock style={{ height: "2.75rem", width: "6rem" }} />
            <SkeletonBlock style={{ height: "2.75rem", width: "7.5rem" }} />
          </div>
        </div>
      </section>

      <p className="adminx-skeleton-caption adminx-skeleton-caption--wide">{label}</p>
    </div>
  );
}

function renderFormSkeleton(label: string) {
  return (
    <div className="adminx-page-body adminx-skeleton-screen adminx-skeleton-screen--form">
      <section className="admin-card adminx-skeleton-card">
        <div className="admin-card__header">
          <div className="adminx-skeleton-stack" style={{ width: "100%" }}>
            <SkeletonBlock style={{ height: "1rem", width: "30%" }} />
            <SkeletonBlock style={{ height: "0.8rem", width: "58%" }} />
          </div>
        </div>
        <div className="admin-card__body">
          <div className="adminx-skeleton-form-grid adminx-skeleton-form-grid--two">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className={index > 3 ? "adminx-skeleton-field adminx-skeleton-field--full" : "adminx-skeleton-field"}
              >
                <SkeletonBlock style={{ height: "0.72rem", width: `${34 + (index % 3) * 8}%` }} />
                <SkeletonBlock
                  style={{
                    height: index > 5 ? "7.8rem" : index > 3 ? "5.4rem" : "3rem",
                    width: "100%",
                  }}
                />
              </div>
            ))}
          </div>

          <div className="admin-form__actions">
            <SkeletonBlock style={{ height: "2.75rem", width: "6rem" }} />
            <SkeletonBlock style={{ height: "2.75rem", width: "7.75rem" }} />
          </div>
        </div>
      </section>

      <p className="adminx-skeleton-caption">{label}</p>
    </div>
  );
}

function renderDetailSkeleton(label: string) {
  return (
    <div className="adminx-skeleton-screen adminx-skeleton-screen--detail">
      <div className="adminx-skeleton-detail-grid">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="adminx-skeleton-detail-card">
            <SkeletonBlock style={{ height: "0.72rem", width: "38%" }} />
            <SkeletonBlock style={{ height: "1rem", width: `${46 + index * 8}%` }} />
          </div>
        ))}
      </div>

      <div className="adminx-skeleton-section">
        <SkeletonBlock style={{ height: "0.82rem", width: "22%" }} />
        <SkeletonBlock style={{ height: "0.8rem", width: "54%" }} />
        <SkeletonBlock style={{ height: "0.8rem", width: "48%" }} />
        <SkeletonBlock style={{ height: "0.8rem", width: "36%" }} />
      </div>

      <div className="adminx-skeleton-section">
        <SkeletonBlock style={{ height: "0.82rem", width: "18%" }} />
        <SkeletonBlock style={{ height: "0.8rem", width: "92%" }} />
        <SkeletonBlock style={{ height: "0.8rem", width: "88%" }} />
        <SkeletonBlock style={{ height: "0.8rem", width: "72%" }} />
      </div>

      <div className="adminx-skeleton-form-grid adminx-skeleton-form-grid--two">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className={index > 1 ? "adminx-skeleton-field adminx-skeleton-field--full" : "adminx-skeleton-field"}
          >
            <SkeletonBlock style={{ height: "0.72rem", width: "36%" }} />
            <SkeletonBlock style={{ height: index > 1 ? "5.2rem" : "3rem", width: "100%" }} />
          </div>
        ))}
      </div>

      <p className="adminx-skeleton-caption">{label}</p>
    </div>
  );
}

function renderInlineSkeleton(label: string) {
  return (
    <div className="adminx-skeleton-screen adminx-skeleton-screen--inline">
      <div className="admin-card adminx-skeleton-card adminx-skeleton-card--inline">
        <div className="admin-card__body">
          <div className="adminx-skeleton-stack">
            <SkeletonBlock style={{ height: "1rem", width: "11rem" }} />
            <SkeletonBlock style={{ height: "0.8rem", width: "16rem" }} />
          </div>
        </div>
      </div>
      <p className="adminx-skeleton-caption">{label}</p>
    </div>
  );
}

export function LoadingSpinner({
  label = "Loading content...",
  compact = false,
}: LoadingSpinnerProps) {
  const variant = getVariant(label, compact);

  return (
    <div
      className="adminx-loading-state"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <span className="adminx-visually-hidden">{label}</span>
      {variant === "dashboard"
        ? renderDashboardSkeleton(label)
        : variant === "form"
          ? renderFormSkeleton(label)
          : variant === "detail"
            ? renderDetailSkeleton(label)
            : variant === "inline"
              ? renderInlineSkeleton(label)
              : renderWorkspaceSkeleton(label)}
    </div>
  );
}
