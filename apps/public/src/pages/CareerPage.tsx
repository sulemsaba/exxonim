import { useQuery } from "@tanstack/react-query";
import { routes } from "../routes";
import { LoadBoundary } from "../components/LoadBoundary";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import {
  getCachedPublishedJobs,
  getPublishedJobs,
} from "../services/jobsService";
import type { CareerPageContent } from "../types";

function formatJobLocation(city: string, country: string, mode: string) {
  const label = [city, country].filter(Boolean).join(", ");
  return label || mode.replace(/-/g, " ");
}

export function CareerPage() {
  const { data: page, isPending, error } = usePage<CareerPageContent>("career");
  const jobsQuery = useQuery({
    queryKey: ["career-jobs"],
    queryFn: getPublishedJobs,
    initialData: getCachedPublishedJobs,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    staleTime: 1000 * 60 * 30,
  });
  useResolvedPageSeo(page, routes.career);

  const content = page?.content;
  const jobs = jobsQuery.data ?? [];

  return (
    <LoadBoundary
      error={error}
      errorDetail="The careers page content could not be loaded right now."
      errorTitle="Unable to load the career page."
      isPending={isPending}
      isReady={Boolean(content)}
      loadingLabel="Loading career page..."
    >
      {() => (
        <section className="page-shell dark-grid-section">
<div className="container page-hero" id="career" data-reveal>
          <div className="landing-section-heading">
            <p className="section-pill section-pill--dark">
              <span></span>
              {content!.hero.eyebrow}
            </p>
            <h1>{content!.hero.title}</h1>
            <p>{content!.hero.description}</p>
          </div>

          <div className="page-grid">
            <article className="page-card">
              <span className="page-card__eyebrow">Focus areas</span>
              <div className="page-list">
                {content!.focus_areas.map((track) => (
                  <div key={track} className="page-list__item">
                    <strong>{track}</strong>
                  </div>
                ))}
              </div>
            </article>

            <article className="page-card">
              <span className="page-card__eyebrow">Current status</span>
              <strong>{content!.status.label}</strong>
              <p>{content!.status.description}</p>
              <div className="page-actions">
                <a
                  className="landing-cta landing-cta--primary"
                  href={content!.status.primary.href}
                >
                  {content!.status.primary.label}
                </a>
                <a
                  className="landing-cta landing-cta--secondary"
                  href={content!.status.secondary.href}
                >
                  {content!.status.secondary.label}
                </a>
              </div>
            </article>
          </div>

          <div className="career-summary">
            <article className="career-stat">
              <span className="page-card__eyebrow">Open positions</span>
              <strong>{jobs.length}</strong>
              <p>Published roles currently visible on Exxonim careers.</p>
            </article>
            <article className="career-stat">
              <span className="page-card__eyebrow">Departments hiring</span>
              <strong>{new Set(jobs.map((job) => job.department).filter(Boolean)).size}</strong>
              <p>Teams currently recruiting across the live careers pipeline.</p>
            </article>
            <article className="career-stat">
              <span className="page-card__eyebrow">Hiring modes</span>
              <strong>{new Set(jobs.map((job) => job.location_mode).filter(Boolean)).size}</strong>
              <p>Remote, onsite, and hybrid roles all stay in one hiring workspace.</p>
            </article>
          </div>

          <article className="page-card career-openings">
            <div className="career-openings__header">
              <div>
                <span className="page-card__eyebrow">Open roles</span>
                <strong>Live Exxonim positions</strong>
                <p>Published vacancies now come directly from the admin careers workspace.</p>
              </div>
              <a className="landing-cta landing-cta--secondary" href={content!.status.primary.href}>
                {content!.status.primary.label}
              </a>
            </div>

            <LoadBoundary
              error={jobsQuery.error}
              errorDetail="The careers page copy is available, but the job listing feed is not responding right now."
              errorTitle="Unable to load current job openings."
              isPending={jobsQuery.isPending}
              loadingLabel="Loading open roles..."
              variant="section"
            >
              {jobs.length ? (
                <div className="career-openings__list">
                  {jobs.map((job) => (
                    <article key={job.id} className="career-job">
                      <div className="career-job__body">
                        <div className="career-job__meta">
                          <span className="career-job__pill">{job.department}</span>
                          <span className="career-job__pill">{job.employment_type}</span>
                          <span className="career-job__pill">
                            {formatJobLocation(job.city, job.country, job.location_mode)}
                          </span>
                          {job.experience_label ? (
                            <span className="career-job__pill">{job.experience_label}</span>
                          ) : null}
                        </div>
                        <strong>{job.title}</strong>
                        <p>{job.summary}</p>
                      </div>

                      <div className="career-job__lists">
                        <div>
                          <span className="page-card__eyebrow">Responsibilities</span>
                          <ul>
                            {(job.responsibilities.length ? job.responsibilities : [job.description])
                              .slice(0, 3)
                              .map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                          </ul>
                        </div>
                        <div>
                          <span className="page-card__eyebrow">Requirements</span>
                          <ul>
                            {job.requirements.slice(0, 3).map((item) => (
                              <li key={item}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="career-job__footer">
                        <p>
                          {job.compensation_label ||
                            "Compensation shared during the hiring process."}
                        </p>
                        <a
                          className="landing-cta landing-cta--primary"
                          href={content!.status.primary.href}
                        >
                          Apply for {job.title}
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="career-empty">
                  There are no published openings right now. Use the contact action above and
                  we will still help direct your inquiry.
                </div>
              )}
            </LoadBoundary>
          </article>
        </div>
      </section>
      )}
    </LoadBoundary>
  );
}
