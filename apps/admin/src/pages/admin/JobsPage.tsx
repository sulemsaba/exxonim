import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import { adminRoutes, type AdminRouteMode } from "../../lib/adminRoutes";
import {
  createAdminJob,
  deleteAdminJob,
  getAdminJobs,
  updateAdminJob,
} from "../../services/adminJobsService";
import { SystemOSFrame } from "../../systemos/SystemOSFrame";
import { formatDate, relativeTime } from "../../systemos/utils";
import type { ApiCareerJob, ApiContentStatus } from "../../types/api";
import { getAdminErrorMessage, slugify } from "../../utils/admin";

interface JobsPageProps {
  mode: AdminRouteMode;
  entitySlug?: string;
  theme: "light" | "dark";
}

interface JobFormState {
  title: string;
  slug: string;
  department: string;
  employment_type: string;
  location_mode: string;
  city: string;
  country: string;
  compensation_label: string;
  experience_label: string;
  summary: string;
  description: string;
  requirementsText: string;
  responsibilitiesText: string;
  status: ApiContentStatus;
}

const defaultValues: JobFormState = {
  title: "",
  slug: "",
  department: "Engineering",
  employment_type: "Full-time",
  location_mode: "Remote",
  city: "Dar es Salaam",
  country: "Tanzania",
  compensation_label: "",
  experience_label: "",
  summary: "",
  description: "",
  requirementsText: "",
  responsibilitiesText: "",
  status: "draft",
};

function toFormState(job: ApiCareerJob): JobFormState {
  return {
    title: job.title,
    slug: job.slug,
    department: job.department,
    employment_type: job.employment_type,
    location_mode: job.location_mode,
    city: job.city,
    country: job.country,
    compensation_label: job.compensation_label ?? "",
    experience_label: job.experience_label ?? "",
    summary: job.summary,
    description: job.description,
    requirementsText: job.requirements.join("\n"),
    responsibilitiesText: job.responsibilities.join("\n"),
    status: job.status ?? "draft",
  };
}

function toPayload(values: JobFormState) {
  return {
    title: values.title,
    slug: values.slug,
    department: values.department,
    employment_type: values.employment_type,
    location_mode: values.location_mode,
    city: values.city,
    country: values.country,
    compensation_label: values.compensation_label || null,
    experience_label: values.experience_label || null,
    summary: values.summary,
    description: values.description,
    requirements: values.requirementsText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    responsibilities: values.responsibilitiesText
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean),
    status: values.status,
  };
}

function getJobStatusClass(status?: ApiContentStatus | null) {
  if (status === "published") return "published";
  if (status === "archived") return "trash";
  return "draft";
}

function isRemoteReady(job: ApiCareerJob) {
  return /remote/i.test(job.location_mode);
}

export function JobsPage({ mode, entitySlug, theme }: JobsPageProps) {
  const queryClient = useQueryClient();
  const { admin } = useAuth();
  const [values, setValues] = useState<JobFormState>(defaultValues);
  const [slugDirty, setSlugDirty] = useState(false);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ApiCareerJob | null>(null);
  const adminRole = admin?.role ?? "admin";

  const jobsQuery = useQuery({
    queryKey: ["admin", "jobs"],
    queryFn: getAdminJobs,
  });

  const selectedJob =
    mode === "edit" && entitySlug
      ? jobsQuery.data?.find((job) => job.slug === entitySlug) ?? null
      : null;

  useEffect(() => {
    if (mode === "edit" && selectedJob) {
      setValues(toFormState(selectedJob));
      setSlugDirty(true);
      return;
    }

    setValues(defaultValues);
    setSlugDirty(false);
  }, [mode, selectedJob]);

  useEffect(() => {
    if (!slugDirty) {
      setValues((current) => ({ ...current, slug: slugify(current.title) }));
    }
  }, [slugDirty, values.title]);

  const createMutation = useMutation({
    mutationFn: createAdminJob,
    onSuccess: async (job) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
      setMessage({ tone: "success", text: "Job listing created." });
      if (typeof window !== "undefined") {
        window.location.assign(adminRoutes.jobEdit(job.slug));
      }
    },
    onError: (error) => {
      setMessage({ tone: "error", text: getAdminErrorMessage(error, "Unable to create job listing.") });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ slug, payload }: { slug: string; payload: ReturnType<typeof toPayload> }) =>
      updateAdminJob(slug, payload),
    onSuccess: async (job) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
      setMessage({ tone: "success", text: "Job listing updated." });
      if (typeof window !== "undefined" && job.slug !== entitySlug) {
        window.location.assign(adminRoutes.jobEdit(job.slug));
      }
    },
    onError: (error) => {
      setMessage({ tone: "error", text: getAdminErrorMessage(error, "Unable to update job listing.") });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminJob,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
      setDeleteTarget(null);
      if (typeof window !== "undefined") {
        window.location.assign(adminRoutes.jobs);
      }
    },
    onError: (error) => {
      setMessage({ tone: "error", text: getAdminErrorMessage(error, "Unable to delete job listing.") });
    },
  });

  const jobs = jobsQuery.data ?? [];
  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return jobs;

    return jobs.filter((job) =>
      [
        job.title,
        job.slug,
        job.department,
        job.employment_type,
        job.location_mode,
        job.city,
        job.country,
        job.summary,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [jobs, query]);

  const stats = useMemo(
    () => [
      {
        label: "Total Roles",
        value: jobs.length,
        note: "All open and archived job records in this workspace.",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M9 4V2h6v2" />
            <path d="M4 8h16v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
            <path d="M4 12h16" />
          </svg>
        ),
      },
      {
        label: "Published",
        value: jobs.filter((job) => job.status === "published").length,
        note: "Currently visible to candidates on the careers surface.",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5 10 17l9-10" />
          </svg>
        ),
      },
      {
        label: "Remote Friendly",
        value: jobs.filter(isRemoteReady).length,
        note: "Listings marked with a remote work mode.",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M4 5h16v10H4z" />
            <path d="M8 19h8" />
            <path d="M12 15v4" />
          </svg>
        ),
      },
      {
        label: "Departments",
        value: new Set(jobs.map((job) => job.department).filter(Boolean)).size,
        note: "Distinct teams represented across active and archived roles.",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M4 6h7v6H4z" />
            <path d="M13 6h7v6h-7z" />
            <path d="M4 14h7v6H4z" />
            <path d="M13 14h7v6h-7z" />
          </svg>
        ),
      },
    ],
    [jobs]
  );

  function handleChange<Key extends keyof JobFormState>(key: Key, value: JobFormState[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    if (!values.title.trim() || !values.slug.trim()) {
      setMessage({ tone: "error", text: "Title and slug are required." });
      return;
    }

    if (values.slug === "new") {
      setMessage({ tone: "error", text: 'The slug "new" is reserved.' });
      return;
    }

    const payload = toPayload(values);

    if (mode === "edit" && entitySlug) {
      await updateMutation.mutateAsync({ slug: entitySlug, payload });
      return;
    }

    await createMutation.mutateAsync(payload);
  }

  if (jobsQuery.isPending) {
    return <LoadingSpinner label="Loading job listings..." />;
  }

  if (jobsQuery.error || !jobsQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load job listings."
        detail="Job records could not be loaded right now."
      />
    );
  }

  return (
    <>
      <SystemOSFrame theme={theme} padded={false}>
        <div style={{ display: "grid", gap: 14 }}>
          <section className="stats">
            {stats.map((item) => (
              <article className="card stat" key={item.label}>
                <div className="stat-top">
                  <div>
                    <div className="stat-label">{item.label}</div>
                    <div className="stat-value">{item.value}</div>
                    <div className="stat-note">{item.note}</div>
                  </div>
                  <div className="stat-icon">{item.icon}</div>
                </div>
              </article>
            ))}
          </section>

          <div className="workspace-split">
            <div className="workspace-stack">
              <section className="card toolbar">
                <div style={{ display: "grid", gap: 14 }}>
                  <div className="analytics-head">
                    <div>
                      <div className="analytics-kicker">Careers Workspace</div>
                      <div className="analytics-title">Job listings</div>
                      <div className="analytics-copy">
                        Manage the roles shown on the careers page without changing the main admin shell.
                      </div>
                    </div>
                    <div className="workspace-form-actions-end">
                      <a className="btn small" href={adminRoutes.jobsNew}>
                        New Job
                      </a>
                    </div>
                  </div>

                  <div className="search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.5-3.5" />
                    </svg>
                    <input
                      className="field"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search role, department, location, or summary"
                    />
                  </div>
                </div>
              </section>

              <section className="card table-card">
                {filteredJobs.length ? (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Role / Department</th>
                          <th>Status</th>
                          <th>Location</th>
                          <th>Updated</th>
                          <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJobs.map((job) => (
                          <tr key={job.id}>
                            <td>
                              <a className="title-btn" href={adminRoutes.jobEdit(job.slug)}>
                                {job.title}
                              </a>
                              <div className="subtext">
                                {job.department} · /{job.slug}
                              </div>
                              <div className="row-excerpt">{job.summary}</div>
                            </td>
                            <td>
                              <span className={`status ${getJobStatusClass(job.status)}`}>
                                <span className="dot" />
                                {job.status ?? "draft"}
                              </span>
                            </td>
                            <td>
                              <div>{job.location_mode}</div>
                              <div className="subtext">{[job.city, job.country].filter(Boolean).join(", ")}</div>
                            </td>
                            <td>
                              {relativeTime(job.updated_at)}
                              <div className="subtext">{formatDate(job.updated_at)}</div>
                            </td>
                            <td>
                              <div className="icon-actions">
                                <a className="icon-btn" href={adminRoutes.jobEdit(job.slug)} aria-label="Edit">
                                  <svg viewBox="0 0 24 24">
                                    <path d="M4 20h4l10-10-4-4L4 16v4Z" />
                                    <path d="m12 6 4 4" />
                                  </svg>
                                </a>
                                {adminRole === "admin" ? (
                                  <button
                                    className="icon-btn danger"
                                    type="button"
                                    aria-label="Delete"
                                    onClick={() => setDeleteTarget(job)}
                                  >
                                    <svg viewBox="0 0 24 24">
                                      <path d="M4 7h16" />
                                      <path d="m10 11 1 6" />
                                      <path d="m14 11-1 6" />
                                      <path d="M9 7V5h6v2" />
                                      <path d="M6 7l1 12h10l1-12" />
                                    </svg>
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty">
                    <div className="empty-title">No job listings match the current search</div>
                    <div className="empty-note">
                      Clear the search or create a new role for the careers page.
                    </div>
                    <div className="empty-actions">
                      <a className="btn primary" href={adminRoutes.jobsNew}>
                        Create Job
                      </a>
                    </div>
                  </div>
                )}
              </section>
            </div>

            <section className="card workspace-form-card">
              <div className="section-head">
                <div className="section-title">
                  {mode === "edit" ? "Edit Job Listing" : "Create Job Listing"}
                </div>
                <div className="section-note">
                  Slug changes still redirect to the correct edit route after save.
                </div>
              </div>

              <form style={{ display: "grid", gap: 22 }} onSubmit={handleSubmit}>
                <section className="modal-section">
                  <div className="section-head">
                    <div className="section-title">Role Profile</div>
                    <div className="section-note">
                      Define the public title, slug, department, and publishing state for this role.
                    </div>
                  </div>

                  <div className="form-grid">
                    <div>
                      <label className="label" htmlFor="job-title">Title</label>
                      <input
                        className="field"
                        id="job-title"
                        type="text"
                        value={values.title}
                        onChange={(event) => handleChange("title", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="job-slug">Slug</label>
                      <input
                        className="field"
                        id="job-slug"
                        type="text"
                        value={values.slug}
                        onChange={(event) => {
                          setSlugDirty(true);
                          handleChange("slug", slugify(event.target.value));
                        }}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="job-department">Department</label>
                      <input
                        className="field"
                        id="job-department"
                        type="text"
                        value={values.department}
                        onChange={(event) => handleChange("department", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="job-status">Status</label>
                      <select
                        className="select"
                        id="job-status"
                        value={values.status}
                        disabled={adminRole === "editor" && values.status === "archived"}
                        onChange={(event) => handleChange("status", event.target.value as ApiContentStatus)}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived" disabled={adminRole !== "admin"}>
                          Archived
                        </option>
                      </select>
                      {adminRole === "editor" && values.status === "archived" ? (
                        <div className="help">
                          Archived job listings can only be restored or changed by an admin.
                        </div>
                      ) : null}
                    </div>
                  </div>
                </section>

                <section className="modal-section">
                  <div className="section-head">
                    <div className="section-title">Work Setup</div>
                    <div className="section-note">
                      Capture the employment details candidates need before they open the full role.
                    </div>
                  </div>

                  <div className="form-grid">
                    <div>
                      <label className="label" htmlFor="job-employment">Employment Type</label>
                      <input
                        className="field"
                        id="job-employment"
                        type="text"
                        value={values.employment_type}
                        onChange={(event) => handleChange("employment_type", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="job-location-mode">Location Mode</label>
                      <input
                        className="field"
                        id="job-location-mode"
                        type="text"
                        value={values.location_mode}
                        onChange={(event) => handleChange("location_mode", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="job-city">City</label>
                      <input
                        className="field"
                        id="job-city"
                        type="text"
                        value={values.city}
                        onChange={(event) => handleChange("city", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="job-country">Country</label>
                      <input
                        className="field"
                        id="job-country"
                        type="text"
                        value={values.country}
                        onChange={(event) => handleChange("country", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="job-compensation">Compensation</label>
                      <input
                        className="field"
                        id="job-compensation"
                        type="text"
                        value={values.compensation_label}
                        onChange={(event) => handleChange("compensation_label", event.target.value)}
                      />
                    </div>
                    <div>
                      <label className="label" htmlFor="job-experience">Experience</label>
                      <input
                        className="field"
                        id="job-experience"
                        type="text"
                        value={values.experience_label}
                        onChange={(event) => handleChange("experience_label", event.target.value)}
                      />
                    </div>
                  </div>
                </section>

                <section className="modal-section">
                  <div className="section-head">
                    <div className="section-title">Content</div>
                    <div className="section-note">
                      Use a short summary for the listing surface, then write the full description for the job page.
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-col-2">
                      <label className="label" htmlFor="job-summary">Summary</label>
                      <textarea
                        className="textarea"
                        id="job-summary"
                        rows={4}
                        value={values.summary}
                        onChange={(event) => handleChange("summary", event.target.value)}
                      />
                    </div>
                    <div className="form-col-2">
                      <label className="label" htmlFor="job-description">Description</label>
                      <textarea
                        className="textarea"
                        id="job-description"
                        rows={7}
                        value={values.description}
                        onChange={(event) => handleChange("description", event.target.value)}
                      />
                    </div>
                  </div>
                </section>

                <section className="modal-section">
                  <div className="section-head">
                    <div className="section-title">Requirements & Responsibilities</div>
                    <div className="section-note">
                      Put one line per item so the API still receives clean arrays for each section.
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-col-2">
                      <label className="label" htmlFor="job-requirements">Requirements</label>
                      <textarea
                        className="textarea"
                        id="job-requirements"
                        rows={6}
                        value={values.requirementsText}
                        onChange={(event) => handleChange("requirementsText", event.target.value)}
                      />
                    </div>
                    <div className="form-col-2">
                      <label className="label" htmlFor="job-responsibilities">Responsibilities</label>
                      <textarea
                        className="textarea"
                        id="job-responsibilities"
                        rows={6}
                        value={values.responsibilitiesText}
                        onChange={(event) => handleChange("responsibilitiesText", event.target.value)}
                      />
                    </div>
                  </div>
                </section>

                {message ? <div className="hero-note">{message.text}</div> : null}

                <div className="workspace-form-actions">
                  <div className="workspace-copy">
                    {selectedJob
                      ? `Last updated ${formatDate(selectedJob.updated_at)}.`
                      : "Create a job listing and publish it when recruiting is ready."}
                  </div>
                  <div className="workspace-form-actions-end">
                    {mode === "edit" ? (
                      <a className="btn small" href={adminRoutes.jobs}>
                        View List
                      </a>
                    ) : null}
                    <button
                      className="btn primary"
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Job"}
                    </button>
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </SystemOSFrame>

      <AdminDeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete job listing?"
        description={`This will permanently remove ${deleteTarget?.title ?? "the selected job listing"}.`}
        isPending={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.slug);
          }
        }}
      />
    </>
  );
}
