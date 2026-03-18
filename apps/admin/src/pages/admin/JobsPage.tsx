import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import { AdminEmptyState } from "../../components/admin/AdminEmptyState";
import { AdminFormBanner } from "../../components/admin/AdminFormBanner";
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
import type { ApiCareerJob, ApiContentStatus } from "../../types/api";
import { getAdminErrorMessage, slugify } from "../../utils/admin";

interface JobsPageProps {
  mode: AdminRouteMode;
  entitySlug?: string;
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

export function JobsPage({ mode, entitySlug }: JobsPageProps) {
  const queryClient = useQueryClient();
  const { admin } = useAuth();
  const [values, setValues] = useState<JobFormState>(defaultValues);
  const [slugDirty, setSlugDirty] = useState(false);
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
        detail="Check that the admin jobs endpoint is available."
      />
    );
  }

  return (
    <>
      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Job Listings</h2>
              <p>Published jobs are distinct from the Careers page content.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <div className="admin-toolbar">
              <span className="admin-toolbar__meta">{jobsQuery.data.length} records</span>
              <a className="admin-action-button" href={adminRoutes.jobsNew}>
                New Job
              </a>
            </div>

            {jobsQuery.data.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobsQuery.data.map((job) => (
                      <tr key={job.id}>
                        <td>
                          <strong>{job.title}</strong>
                          <p>{job.slug}</p>
                        </td>
                        <td>
                          <span
                            className={
                              job.status === "published"
                                ? "admin-status admin-status--published"
                                : job.status === "archived"
                                  ? "admin-status admin-status--danger"
                                  : "admin-status admin-status--draft"
                            }
                          >
                            {job.status ?? "draft"}
                          </span>
                        </td>
                        <td>{[job.city, job.country].filter(Boolean).join(", ")}</td>
                        <td>
                          <div className="admin-table__actions">
                            <a className="admin-table__action" href={adminRoutes.jobEdit(job.slug)}>
                              Edit
                            </a>
                            {adminRole === "admin" ? (
                              <button
                                className="admin-danger-button"
                                type="button"
                                onClick={() => setDeleteTarget(job)}
                              >
                                Delete
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
              <AdminEmptyState
                title="No job listings yet"
                description="Create the first role and publish it from here."
                primaryAction={<a className="admin-action-button" href={adminRoutes.jobsNew}>Create Job</a>}
              />
            )}
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>{mode === "edit" ? "Edit Job Listing" : "Create Job Listing"}</h2>
              <p>Slug changes redirect to the new edit route immediately after save.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form__grid">
                <div className="admin-form__field">
                  <label htmlFor="job-title">Title</label>
                  <input
                    id="job-title"
                    type="text"
                    value={values.title}
                    onChange={(event) => handleChange("title", event.target.value)}
                  />
                </div>
                <div className="admin-form__field">
                  <label htmlFor="job-slug">Slug</label>
                  <input
                    id="job-slug"
                    type="text"
                    value={values.slug}
                    onChange={(event) => {
                      setSlugDirty(true);
                      handleChange("slug", slugify(event.target.value));
                    }}
                  />
                </div>
                <div className="admin-form__field">
                  <label htmlFor="job-department">Department</label>
                  <input
                    id="job-department"
                    type="text"
                    value={values.department}
                    onChange={(event) => handleChange("department", event.target.value)}
                  />
                </div>
                <div className="admin-form__field">
                  <label htmlFor="job-status">Status</label>
                  <select
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
                    <p className="admin-form__hint">
                      Archived job listings can only be restored or changed by an admin.
                    </p>
                  ) : null}
                </div>
                <div className="admin-form__field">
                  <label htmlFor="job-employment">Employment Type</label>
                  <input
                    id="job-employment"
                    type="text"
                    value={values.employment_type}
                    onChange={(event) => handleChange("employment_type", event.target.value)}
                  />
                </div>
                <div className="admin-form__field">
                  <label htmlFor="job-location-mode">Location Mode</label>
                  <input
                    id="job-location-mode"
                    type="text"
                    value={values.location_mode}
                    onChange={(event) => handleChange("location_mode", event.target.value)}
                  />
                </div>
                <div className="admin-form__field">
                  <label htmlFor="job-city">City</label>
                  <input
                    id="job-city"
                    type="text"
                    value={values.city}
                    onChange={(event) => handleChange("city", event.target.value)}
                  />
                </div>
                <div className="admin-form__field">
                  <label htmlFor="job-country">Country</label>
                  <input
                    id="job-country"
                    type="text"
                    value={values.country}
                    onChange={(event) => handleChange("country", event.target.value)}
                  />
                </div>
                <div className="admin-form__field">
                  <label htmlFor="job-compensation">Compensation</label>
                  <input
                    id="job-compensation"
                    type="text"
                    value={values.compensation_label}
                    onChange={(event) => handleChange("compensation_label", event.target.value)}
                  />
                </div>
                <div className="admin-form__field">
                  <label htmlFor="job-experience">Experience</label>
                  <input
                    id="job-experience"
                    type="text"
                    value={values.experience_label}
                    onChange={(event) => handleChange("experience_label", event.target.value)}
                  />
                </div>
                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="job-summary">Summary</label>
                  <textarea
                    id="job-summary"
                    rows={4}
                    value={values.summary}
                    onChange={(event) => handleChange("summary", event.target.value)}
                  />
                </div>
                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="job-description">Description</label>
                  <textarea
                    id="job-description"
                    rows={6}
                    value={values.description}
                    onChange={(event) => handleChange("description", event.target.value)}
                  />
                </div>
                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="job-requirements">Requirements</label>
                  <textarea
                    id="job-requirements"
                    rows={5}
                    value={values.requirementsText}
                    onChange={(event) => handleChange("requirementsText", event.target.value)}
                  />
                </div>
                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="job-responsibilities">Responsibilities</label>
                  <textarea
                    id="job-responsibilities"
                    rows={5}
                    value={values.responsibilitiesText}
                    onChange={(event) => handleChange("responsibilitiesText", event.target.value)}
                  />
                </div>
              </div>

              {message ? <AdminFormBanner tone={message.tone} message={message.text} /> : null}

              <div className="admin-form__actions">
                <button
                  className="admin-form__submit"
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? "Saving..." : "Save Job"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

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
