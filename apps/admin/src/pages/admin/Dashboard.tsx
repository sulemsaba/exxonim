import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { AdminSectionCard } from "../../components/admin/AdminSectionCard";
import { AdminStatusBadge } from "../../components/admin/AdminStatusBadge";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { getAdminDashboardSummary } from "../../services/adminDashboardService";

/* ── Metric icon map ─────────────────────────────────── */
function MetricIcon({ label }: { label: string }) {
  const icon = label.toLowerCase().includes("draft")
    ? "edit_note"
    : label.toLowerCase().includes("page")
      ? "description"
      : label.toLowerCase().includes("pending") || label.toLowerCase().includes("request")
        ? "contact_support"
        : label.toLowerCase().includes("publish")
          ? "newspaper"
          : "bar_chart";

  return (
    <span className="dash-metric-icon material-symbols-rounded">{icon}</span>
  );
}

/* ── Severity icon ────────────────────────────────────── */
function SeverityIcon({ severity }: { severity: "info" | "warning" | "error" }) {
  const icon =
    severity === "error" ? "error" : severity === "warning" ? "warning" : "info";
  return (
    <span className={`dash-alert-icon dash-alert-icon--${severity} material-symbols-rounded`}>
      {icon}
    </span>
  );
}

/* ── Completion bar ───────────────────────────────────── */
function CompletionBar({ percent }: { percent: number }) {
  const color =
    percent >= 80 ? "var(--adminx-teal)" : percent >= 50 ? "var(--adminx-amber)" : "var(--adminx-red)";
  return (
    <div className="dash-progress-track">
      <div
        className="dash-progress-fill"
        style={{ width: `${percent}%`, background: color }}
      />
    </div>
  );
}

/* ── SEO badge ────────────────────────────────────────── */
function SeoBadge({ health }: { health: string }) {
  const tone =
    health === "clean" ? "teal" : health === "warning" ? "amber" : "red";
  return (
    <span className={`dash-badge dash-badge--${tone}`}>{health}</span>
  );
}

/* ── Stat card with accent ────────────────────────────── */
function StatCard({
  label,
  value,
  helper,
  href,
}: {
  label: string;
  value: string | number;
  helper: string;
  href?: string;
}) {
  const accentColors = [
    "var(--adminx-accent)",
    "var(--adminx-teal)",
    "var(--adminx-amber)",
    "var(--adminx-red)",
  ];
  const index = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < label.length; i++) {
      hash = ((hash << 5) - hash + label.charCodeAt(i)) | 0;
    }
    return Math.abs(hash) % accentColors.length;
  }, [label, accentColors.length]);

  const card = (
    <article className="dash-stat-card" style={{ "--stat-accent": accentColors[index] } as React.CSSProperties}>
      <div className="dash-stat-card__top">
        <span className="dash-stat-card__label">{label}</span>
        <MetricIcon label={label} />
      </div>
      <span className="dash-stat-card__value">{value}</span>
      <span className="dash-stat-card__helper">{helper}</span>
      {href && (
        <div className="dash-stat-card__action">
          <span className="material-symbols-rounded">arrow_forward</span>
        </div>
      )}
    </article>
  );

  if (href) {
    return <a href={href} className="dash-stat-link">{card}</a>;
  }

  return card;
}

/* ── Alert item ───────────────────────────────────────── */
function AlertItem({
  severity,
  title,
  message,
  href,
}: {
  severity: "info" | "warning" | "error";
  title: string;
  message: string;
  href?: string;
}) {
  return (
    <div className={`dash-alert dash-alert--${severity}`}>
      <SeverityIcon severity={severity} />
      <div className="dash-alert__body">
        <strong>{title}</strong>
        <p>{message}</p>
      </div>
      {href ? (
        <a className="dash-alert__action" href={href}>
          <span>View</span>
          <span className="material-symbols-rounded" style={{ fontSize: 16 }}>arrow_forward</span>
        </a>
      ) : null}
    </div>
  );
}

/* ── Pipeline item ────────────────────────────────────── */
function PipelineItem({
  title,
  slug,
  kind,
  status,
  seo_health,
  completion_percent,
  href,
}: {
  title: string;
  slug: string;
  kind: string;
  status: string;
  seo_health: string;
  completion_percent: number;
  href?: string;
}) {
  const typeLabel = kind === "blog_post" ? "Blog" : "Page";
  const content = (
    <article className="dash-pipeline-item">
      <div className="dash-pipeline-item__head">
        <span className="dash-pipeline-item__type">{typeLabel}</span>
        <AdminStatusBadge label={status} />
      </div>
      <strong className="dash-pipeline-item__title">{title}</strong>
      <span className="dash-pipeline-item__slug">/{kind === "blog_post" ? "blog" : "pages"}/{slug}</span>
      <div className="dash-pipeline-item__meta">
        <SeoBadge health={seo_health} />
        <span className="dash-pipeline-item__pct">{completion_percent}% complete</span>
      </div>
      <CompletionBar percent={completion_percent} />
      {href && (
        <div className="dash-pipeline-item__action">
          <span className="material-symbols-rounded">open_in_new</span>
        </div>
      )}
    </article>
  );

  if (href) {
    return <a href={href} className="dash-pipeline-link">{content}</a>;
  }

  return content;
}

/* ── Activity item ────────────────────────────────────── */
function ActivityItem({
  actor_name,
  action_type,
  target_label,
  detail,
  created_at,
}: {
  actor_name: string;
  action_type: string;
  target_label: string;
  detail?: string;
  created_at: string;
}) {
  const actionIcon =
    action_type.includes("publish") ? "publish" :
    action_type.includes("create") ? "add_circle" :
    action_type.includes("update") || action_type.includes("edit") ? "edit" :
    action_type.includes("delete") ? "delete" :
    action_type.includes("settings") ? "settings" :
    action_type.includes("consultation") ? "forum" : "circle";

  return (
    <div className="dash-activity-item">
      <div className="dash-activity-item__icon-wrapper">
        <span className="dash-activity-item__icon material-symbols-rounded">{actionIcon}</span>
      </div>
      <div className="dash-activity-item__body">
        <span className="dash-activity-item__title">
          <strong>{actor_name}</strong> {action_type.replace(/_/g, " ")}
        </span>
        <span className="dash-activity-item__target">{target_label}</span>
        {detail ? <span className="dash-activity-item__detail">{detail}</span> : null}
        <span className="dash-activity-item__time">
          {new Date(created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

/* ── Job row ──────────────────────────────────────────── */
function JobRow({
  title,
  slug,
  department,
  employment_type,
  location,
  status,
}: {
  title: string;
  slug: string;
  department: string;
  employment_type: string;
  location: string;
  status: string;
}) {
  return (
    <div className="dash-job-row">
      <div className="dash-job-row__info">
        <strong>{title}</strong>
        <span className="dash-job-row__slug">{slug}</span>
      </div>
      <div className="dash-job-row__tags">
        <span className="dash-job-tag">{department}</span>
        <span className="dash-job-tag">{employment_type}</span>
        <span className="dash-job-tag dash-job-tag--location">{location}</span>
      </div>
      <AdminStatusBadge label={status} />
    </div>
  );
}

/* ── Welcome banner ───────────────────────────────────── */
function WelcomeBanner() {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="dash-welcome">
      <div className="dash-welcome__copy">
        <h2 className="dash-welcome__title">{greeting}</h2>
        <p className="dash-welcome__sub">Here's what's happening across your workspace.</p>
      </div>
      <div className="dash-welcome__graphic">
        <span className="material-symbols-rounded" style={{ fontSize: 40 }}>dashboard_customize</span>
      </div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────── */
export function AdminDashboardPage() {
  const summaryQuery = useQuery({
    queryKey: ["admin", "dashboard", "summary"],
    queryFn: getAdminDashboardSummary,
  });

  if (summaryQuery.isPending) {
    return <LoadingSpinner label="Loading dashboard..." />;
  }

  if (summaryQuery.error || !summaryQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load the admin dashboard."
        detail="The admin dashboard could not be loaded right now."
      />
    );
  }

  const summary = summaryQuery.data;
  const hasAlerts = summary.alerts.length > 0;
  const pipeline = summary.content_pipeline ?? [];
  const activity = summary.recent_activity ?? [];
  const jobs = summary.open_jobs ?? [];

  return (
    <div className="dash-root">
      {/* Welcome */}
      <WelcomeBanner />

      {/* Alerts */}
      <div className="dash-alerts-stack">
        {hasAlerts ? (
          summary.alerts.map((alert) => (
            <AlertItem key={alert.id} {...alert} />
          ))
        ) : (
          <div className="dash-alert dash-alert--info">
            <SeverityIcon severity="info" />
            <div className="dash-alert__body">
              <strong>No urgent alerts</strong>
              <p>The dashboard is clear right now.</p>
            </div>
          </div>
        )}
      </div>

      {/* Metric cards */}
      <section className="dash-metrics">
        {summary.metrics.map((metric) => (
          <StatCard key={metric.key} {...metric} />
        ))}
      </section>

      {/* Content pipeline + Activity feed */}
      <div className="dash-two-col">
        <AdminSectionCard
          title="Content Pipeline"
          description="Posts and pages waiting for better SEO or publication."
        >
          {pipeline.length ? (
            <div className="dash-pipeline-list">
              {pipeline.map((item) => (
                <PipelineItem key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <AdminEmptyState
              title="No content items"
              description="Draft posts and pages with SEO gaps will appear here."
            />
          )}
        </AdminSectionCard>

        <AdminSectionCard
          title="Recent Activity"
          description="Publishing, settings, and workflow events."
        >
          {activity.length ? (
            <div className="dash-activity-list">
              {activity.slice(0, 6).map((item) => (
                <ActivityItem key={item.id} {...item} />
              ))}
            </div>
          ) : (
            <AdminEmptyState
              title="No recent activity"
              description="Publishing and settings events will appear here."
            />
          )}
        </AdminSectionCard>
      </div>

      {/* Job listings */}
      <AdminSectionCard
        title="Open Job Listings"
        description="Published roles visible from the hiring workspace."
      >
        {jobs.length ? (
          <div className="dash-jobs-list">
            {jobs.map((job) => (
              <JobRow key={job.id} {...job} />
            ))}
          </div>
        ) : (
          <AdminEmptyState
            title="No active job listings"
            description="Create a new job from the hiring workspace to populate this section."
          />
        )}
      </AdminSectionCard>
    </div>
  );
}
