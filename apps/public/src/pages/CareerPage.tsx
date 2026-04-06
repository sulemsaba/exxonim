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
          <style>{`
        .career-summary {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .career-stat {
          display: grid;
          gap: 0.35rem;
          padding: 1rem 1.1rem;
          border-radius: 1rem;
          border: 1px solid rgba(9, 68, 73, 0.14);
          background: rgba(255, 255, 255, 0.04);
        }

        .career-stat strong {
          font-size: 1.55rem;
          line-height: 1;
        }

        .career-openings {
          display: grid;
          gap: 1rem;
        }

        .career-openings__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .career-openings__list {
          display: grid;
          gap: 1rem;
        }

        .career-job {
          display: grid;
          gap: 1rem;
          padding: 1.3rem;
          border-radius: 1.35rem;
          border: 1px solid rgba(9, 68, 73, 0.14);
          background: rgba(255, 255, 255, 0.05);
        }

        .career-job__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
        }

        .career-job__pill {
          display: inline-flex;
          align-items: center;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          background: rgba(9, 68, 73, 0.08);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .career-job__body {
          display: grid;
          gap: 0.5rem;
        }

        .career-job__body p {
          margin: 0;
        }

        .career-job__footer {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .career-job__lists {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .career-job__lists ul {
          margin: 0;
          padding-left: 1rem;
          display: grid;
          gap: 0.45rem;
          color: rgba(17, 35, 37, 0.78);
        }

        .career-empty {
          padding: 1.15rem 1.2rem;
          border-radius: 1rem;
          border: 1px dashed rgba(9, 68, 73, 0.18);
          color: var(--color-text-muted);
        }

        @media (max-width: 920px) {
          .career-summary,
          .career-job__lists {
            grid-template-columns: 1fr;
          }
        }

        html[data-theme="dark"] .career-stat,
        html[data-theme="dark"] .career-job {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.1);
        }

        html[data-theme="dark"] .career-job__pill {
          background: rgba(255, 255, 255, 0.1);
        }

        html[data-theme="dark"] .career-job__lists ul {
          color: rgba(237, 242, 255, 0.72);
        }
      `}</style>
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
