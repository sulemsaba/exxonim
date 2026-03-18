import { useQuery } from "@tanstack/react-query";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { getAdminDashboardSummary } from "../../services/adminDashboardService";

function alertClassFor(severity: "info" | "warning" | "error") {
  if (severity === "error") {
    return "adminx-alert adminx-alert--error";
  }

  if (severity === "warning") {
    return "adminx-alert adminx-alert--warning";
  }

  return "adminx-alert adminx-alert--info";
}

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
        detail="Check that the admin API is reachable and try again."
      />
    );
  }

  const summary = summaryQuery.data;
  const maxChartValue = Math.max(
    1,
    ...summary.consultation_inflow.map((item) => item.count)
  );

  return (
    <div className="adminx-page-body">
      <div className="adminx-alert-stack">
        {summary.alerts.length > 0 ? (
          summary.alerts.map((alert) => (
            <div key={alert.id} className={alertClassFor(alert.severity)}>
              <div>
                <strong>{alert.title}</strong>
                <p>{alert.message}</p>
              </div>
              {alert.href ? (
                <a className="admin-secondary-button" href={alert.href}>
                  Open
                </a>
              ) : null}
            </div>
          ))
        ) : (
          <div className="adminx-alert adminx-alert--info">
            <div>
              <strong>No urgent alerts</strong>
              <p>The dashboard is clear right now.</p>
            </div>
          </div>
        )}
      </div>

      <section className="adminx-card-grid">
        {summary.metrics.map((metric) => (
          <article key={metric.key} className="adminx-stat-card">
            <span className="adminx-stat-card__label">{metric.label}</span>
            <span className="adminx-stat-card__value">{metric.value}</span>
            <span className="adminx-stat-card__helper">{metric.helper ?? "No helper text"}</span>
            {metric.href ? (
              <a className="admin-secondary-button" href={metric.href}>
                Open
              </a>
            ) : null}
          </article>
        ))}
      </section>

      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Consultation Inflow</h2>
              <p>Daily request volume over the last 14 days.</p>
            </div>
          </div>
          <div className="admin-card__body">
            {summary.consultation_inflow.length ? (
              <div className="adminx-chart" aria-label="Consultation inflow chart">
                {summary.consultation_inflow.map((point) => (
                  <div key={point.label} className="adminx-chart__bar">
                    <div
                      className="adminx-chart__bar-fill"
                      style={{ height: `${Math.max((point.count / maxChartValue) * 180, 12)}px` }}
                      title={`${point.count} consultations`}
                    ></div>
                    <span className="adminx-chart__label">{point.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <AdminEmptyState
                title="No inflow data"
                description="Consultation volume will appear here once requests start arriving."
              />
            )}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Activity Feed</h2>
              <p>Publishing, settings, SEO, and workflow events.</p>
            </div>
          </div>
          <div className="admin-card__body">
            {summary.recent_activity.length ? (
              <div className="adminx-activity-list">
                {summary.recent_activity.map((item) => (
                  <article key={item.id} className="adminx-activity-item">
                    <span className="adminx-activity-item__title">
                      {item.actor_name} {item.action_type.replace(/_/g, " ")}
                    </span>
                    <span className="adminx-activity-item__meta">
                      {item.target_label}
                      {item.detail ? ` · ${item.detail}` : ""}
                    </span>
                    <span className="adminx-activity-item__meta">
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <AdminEmptyState
                title="No recent activity"
                description="Publishing, consultation, and settings events will appear here."
              />
            )}
          </div>
        </section>
      </div>

      <div className="adminx-card-grid adminx-card-grid--two">
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Recent Consultations</h2>
              <p>Newest requests across the operations queue.</p>
            </div>
          </div>
          <div className="admin-card__body">
            {summary.recent_consultations.length ? (
              <div className="adminx-activity-list">
                {summary.recent_consultations.map((item) => (
                  <article key={item.id} className="adminx-activity-item">
                    <span className="adminx-activity-item__title">{item.client_name}</span>
                    <span className="adminx-activity-item__meta">
                      {item.tracking_id} · {item.subject}
                    </span>
                    <span className="adminx-activity-item__meta">
                      {item.status}
                      {item.assignee_name ? ` · ${item.assignee_name}` : ""}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <AdminEmptyState
                title="No consultations"
                description="Consultation records will appear here as soon as new requests are created."
              />
            )}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Content Pipeline</h2>
              <p>Posts and pages waiting for better SEO or publication.</p>
            </div>
          </div>
          <div className="admin-card__body">
            {summary.content_pipeline.length ? (
              <div className="adminx-activity-list">
                {summary.content_pipeline.map((item) => (
                  <article key={item.id} className="adminx-activity-item">
                    <span className="adminx-activity-item__title">{item.title}</span>
                    <span className="adminx-activity-item__meta">
                      /{item.kind === "blog_post" ? "blog" : "pages"}/{item.slug} · {item.status}
                    </span>
                    <span className="adminx-activity-item__meta">
                      SEO: {item.seo_health} · Completion: {item.completion_percent}%
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <AdminEmptyState
                title="No content items"
                description="Draft posts and pages with SEO gaps will appear here."
              />
            )}
          </div>
        </section>
      </div>

      <section className="admin-card">
        <div className="admin-card__header">
          <div>
            <h2>Open Job Listings</h2>
            <p>Published roles visible from the hiring workspace.</p>
          </div>
        </div>
        <div className="admin-card__body">
          {summary.open_jobs.length ? (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Department</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.open_jobs.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <strong>{job.title}</strong>
                        <p>{job.slug}</p>
                      </td>
                      <td>{job.department}</td>
                      <td>{job.employment_type}</td>
                      <td>{job.location}</td>
                      <td>
                        <span className="admin-status admin-status--published">{job.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <AdminEmptyState
              title="No active job listings"
              description="Create a new job from the hiring workspace to populate this table."
            />
          )}
        </div>
      </section>
    </div>
  );
}
