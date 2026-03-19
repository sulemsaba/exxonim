import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { ApiConsultationPublic } from "../types/api";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import { routes } from "../routes";
import {
  getPublicConsultation,
  requestConsultationMagicLink,
} from "../services/consultationService";
import type { TrackingSectionContent } from "../types";

const trackConsultationStyles = String.raw`
  .tracking-portal {
    padding: clamp(4.5rem, 8vw, 6rem) 0 5rem;
  }

  .tracking-portal__stack {
    display: grid;
    gap: 1.3rem;
  }

  .tracking-portal__hero,
  .tracking-portal__card,
  .tracking-portal__detail {
    border: 1px solid var(--color-border-soft);
    border-radius: 1.5rem;
    background: rgba(248, 249, 246, 0.74);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: var(--cinematic-card-shadow);
  }

  .tracking-portal__hero {
    display: grid;
    gap: 0.9rem;
    padding: 1.4rem;
  }

  .tracking-portal__hero h1,
  .tracking-portal__detail h2,
  .tracking-portal__card h2 {
    margin: 0;
    font-family: var(--font-display);
    letter-spacing: -0.05em;
  }

  .tracking-portal__hero h1 {
    font-size: clamp(2.35rem, 5vw, 4.1rem);
    line-height: 0.96;
  }

  .tracking-portal__hero p,
  .tracking-portal__detail p,
  .tracking-portal__timeline-item p,
  .tracking-portal__card p {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.7;
  }

  .tracking-portal__grid {
    display: grid;
    gap: 1.3rem;
    grid-template-columns: minmax(0, 0.78fr) minmax(18rem, 1fr);
  }

  .tracking-portal__card,
  .tracking-portal__detail {
    padding: 1.3rem;
  }

  .tracking-portal__form {
    display: grid;
    gap: 1rem;
  }

  .tracking-portal__field {
    display: grid;
    gap: 0.5rem;
  }

  .tracking-portal__field label {
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-soft);
  }

  .tracking-portal__field input {
    width: 100%;
    min-height: 3.05rem;
    padding: 0.88rem 1rem;
    border: 1px solid var(--color-border-strong);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.78);
    color: var(--color-text);
  }

  .tracking-portal__actions {
    display: flex;
    justify-content: space-between;
    gap: 0.8rem;
    align-items: center;
    flex-wrap: wrap;
  }

  .tracking-portal__button {
    min-height: 3.05rem;
    padding: 0.9rem 1.15rem;
    border: 0;
    border-radius: 1rem;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    color: var(--color-accent-contrast);
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
  }

  .tracking-portal__button--secondary {
    border: 1px solid var(--color-border-strong);
    background: rgba(255, 255, 255, 0.62);
    color: var(--color-text);
  }

  .tracking-portal__button:disabled {
    opacity: 0.68;
    cursor: progress;
  }

  .tracking-portal__error,
  .tracking-portal__notice {
    padding: 0.95rem 1rem;
    border-radius: 1rem;
  }

  .tracking-portal__error {
    background: rgba(132, 32, 50, 0.08);
    border: 1px solid rgba(132, 32, 50, 0.18);
    color: #8c2338;
  }

  .tracking-portal__notice {
    background: rgba(15, 92, 99, 0.08);
    border: 1px solid rgba(15, 92, 99, 0.14);
  }

  .tracking-portal__meta {
    display: grid;
    gap: 0.8rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-top: 1rem;
  }

  .tracking-portal__meta-item {
    padding: 0.95rem 1rem;
    border: 1px solid var(--color-border-soft);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.62);
  }

  .tracking-portal__meta-item strong {
    display: block;
    margin-bottom: 0.3rem;
    font-size: 0.78rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-soft);
  }

  .tracking-portal__status {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.3rem;
    padding: 0.55rem 0.85rem;
    border-radius: 999px;
    background: rgba(15, 92, 99, 0.12);
    color: var(--color-accent);
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .tracking-portal__timeline {
    display: grid;
    gap: 0.95rem;
    margin-top: 1.1rem;
  }

  .tracking-portal__timeline-item {
    position: relative;
    padding-left: 1.25rem;
  }

  .tracking-portal__timeline-item::before {
    content: "";
    position: absolute;
    top: 0.45rem;
    left: 0;
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 999px;
    background: var(--color-accent);
    box-shadow: 0 0 0 0.22rem rgba(15, 92, 99, 0.1);
  }

  .tracking-portal__timeline-item strong {
    display: block;
    margin-bottom: 0.18rem;
  }

  .tracking-portal__timeline-item time {
    display: block;
    margin-bottom: 0.28rem;
    color: var(--color-text-soft);
    font-size: 0.86rem;
  }

  @media (max-width: 880px) {
    .tracking-portal__grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .tracking-portal__meta {
      grid-template-columns: 1fr;
    }

    .tracking-portal__actions {
      flex-direction: column;
      align-items: stretch;
    }
  }
`;

function formatDateTime(value?: string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString();
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return window.atob(padded);
}

function getTokenFromUrl() {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("token");
}

function getTrackingIdFromToken(token: string) {
  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    const parsed = JSON.parse(decodeBase64Url(payload)) as {
      tracking_id?: string;
    };

    return typeof parsed.tracking_id === "string" ? parsed.tracking_id : null;
  } catch {
    return null;
  }
}

export function TrackConsultationPage() {
  const { data: page, isPending, error } =
    usePage<TrackingSectionContent>("track-consultation");
  useResolvedPageSeo(page, routes.tracking);
  const [email, setEmail] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [consultation, setConsultation] = useState<ApiConsultationPublic | null>(null);
  const [isFetchingConsultation, setIsFetchingConsultation] = useState(false);
  const [isRequestingLink, setIsRequestingLink] = useState(false);
  const [requestMessage, setRequestMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = getTokenFromUrl();
    if (!tokenFromUrl) {
      return;
    }

    setToken(tokenFromUrl);
    const trackingIdFromToken = getTrackingIdFromToken(tokenFromUrl);
    if (trackingIdFromToken) {
      setTrackingId(trackingIdFromToken);
    }
  }, []);

  useEffect(() => {
    if (!token || !trackingId) {
      return;
    }

    let isCancelled = false;
    const activeToken = token;
    const activeTrackingId = trackingId;

    async function loadConsultation() {
      setIsFetchingConsultation(true);
      setErrorMessage(null);

      try {
        const response = await getPublicConsultation(activeTrackingId, activeToken);
        if (!isCancelled) {
          setConsultation(response);
          setRequestMessage(null);
        }
      } catch (error) {
        if (!isCancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load the consultation from this magic link."
          );
          setConsultation(null);
        }
      } finally {
        if (!isCancelled) {
          setIsFetchingConsultation(false);
        }
      }
    }

    void loadConsultation();

    return () => {
      isCancelled = true;
    };
  }, [token, trackingId]);

  async function handleRequestMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsRequestingLink(true);
    setRequestMessage(null);
    setErrorMessage(null);

    try {
      const response = await requestConsultationMagicLink({
        email,
        tracking_id: trackingId,
      });

      if (response.magic_link && typeof window !== "undefined") {
        window.location.assign(response.magic_link);
        return;
      }

      setRequestMessage(
        "If that tracking ID and email match a consultation, a fresh secure link has been sent."
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to request a new magic link right now."
      );
    } finally {
      setIsRequestingLink(false);
    }
  }

  if (isPending) {
    return <LoadingSpinner label="Loading consultation tracking..." />;
  }

  if (error || !page) {
    return (
      <ErrorMessage
        title="Unable to load consultation tracking."
        detail="Check that the page endpoint is available."
      />
    );
  }

  return (
    <>
      <style>{trackConsultationStyles}</style>
      <section className="tracking-portal">
        <div className="container">
          <div className="tracking-portal__stack">
            <div className="tracking-portal__hero">
                <p className="section-pill">
                  <span></span>
                  {page.content.eyebrow}
                </p>
              <h1>{page.content.title}</h1>
              <p>{page.content.description}</p>
            </div>

            <div className="tracking-portal__grid">
              <div className="tracking-portal__card">
                <h2>Request a secure link</h2>
                <p>
                  Enter the email address used for the request and the tracking ID you
                  received after submission.
                </p>

                <form className="tracking-portal__form" onSubmit={handleRequestMagicLink}>
                  <div className="tracking-portal__field">
                    <label htmlFor="tracking-email">Email</label>
                    <input
                      id="tracking-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>

                  <div className="tracking-portal__field">
                    <label htmlFor="tracking-id">Tracking ID</label>
                    <input
                      id="tracking-id"
                      value={trackingId}
                      onChange={(event) => setTrackingId(event.target.value.toUpperCase())}
                      required
                    />
                  </div>

                  {requestMessage ? (
                    <div className="tracking-portal__notice" role="status">
                      {requestMessage}
                    </div>
                  ) : null}

                  {errorMessage && !consultation ? (
                    <div className="tracking-portal__error" role="alert">
                      {errorMessage}
                    </div>
                  ) : null}

                  <div className="tracking-portal__actions">
                    <p>
                      Use the magic link from your email whenever possible. It is safer than
                      sharing a tracking ID alone.
                    </p>
                    <button
                      className="tracking-portal__button"
                      type="submit"
                      disabled={isRequestingLink}
                    >
                      {isRequestingLink ? "Sending..." : "Send Magic Link"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="tracking-portal__detail">
                <h2>Consultation status</h2>
                {isFetchingConsultation ? (
                  <LoadingSpinner label="Loading consultation..." />
                ) : !consultation ? (
                  <p>
                    Open your secure link to view the consultation dashboard, public notes,
                    and the status timeline.
                  </p>
                ) : (
                  <>
                    <div className="tracking-portal__meta">
                      <div className="tracking-portal__meta-item">
                        <strong>Status</strong>
                        <span className="tracking-portal__status">
                          {consultation.status}
                        </span>
                      </div>
                      <div className="tracking-portal__meta-item">
                        <strong>Tracking ID</strong>
                        <p>{consultation.tracking_id}</p>
                      </div>
                      <div className="tracking-portal__meta-item">
                        <strong>Customer</strong>
                        <p>{consultation.full_name}</p>
                      </div>
                      <div className="tracking-portal__meta-item">
                        <strong>Assigned consultant</strong>
                        <p>
                          {consultation.assigned_to?.full_name ??
                            "Not assigned yet"}
                        </p>
                      </div>
                      <div className="tracking-portal__meta-item">
                        <strong>Created</strong>
                        <p>{formatDateTime(consultation.created_at)}</p>
                      </div>
                      <div className="tracking-portal__meta-item">
                        <strong>Last updated</strong>
                        <p>{formatDateTime(consultation.updated_at)}</p>
                      </div>
                    </div>

                    <div className="tracking-portal__timeline">
                      <div className="tracking-portal__timeline-item">
                        <strong>Request details</strong>
                        <p>{consultation.message}</p>
                      </div>

                      {consultation.public_notes ? (
                        <div className="tracking-portal__timeline-item">
                          <strong>Public notes</strong>
                          <p>{consultation.public_notes}</p>
                        </div>
                      ) : null}

                      {consultation.status_history.map((item) => (
                        <div
                          key={`${item.new_status}-${item.changed_at}`}
                          className="tracking-portal__timeline-item"
                        >
                          <strong>{item.new_status}</strong>
                          <time>{formatDateTime(item.changed_at)}</time>
                          {item.comment ? <p>{item.comment}</p> : null}
                        </div>
                      ))}
                    </div>

                    <div className="tracking-portal__actions">
                      <button
                        className="tracking-portal__button tracking-portal__button--secondary"
                        type="button"
                        onClick={() => {
                          setConsultation(null);
                          setToken(null);
                          setRequestMessage(null);
                          setErrorMessage(null);
                          if (typeof window !== "undefined") {
                            window.history.replaceState({}, "", routes.tracking);
                          }
                        }}
                      >
                        Reset Portal
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
