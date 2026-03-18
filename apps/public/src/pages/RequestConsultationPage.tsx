import { useState, type FormEvent } from "react";
import { createPublicConsultation } from "../services/consultationService";

const requestConsultationStyles = String.raw`
  .consultation-request {
    padding: clamp(4.5rem, 8vw, 6.5rem) 0 5rem;
  }

  .consultation-request__grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: minmax(0, 0.92fr) minmax(18rem, 0.68fr);
  }

  .consultation-request__card,
  .consultation-request__summary {
    border: 1px solid var(--color-border-soft);
    border-radius: 1.6rem;
    background: rgba(248, 249, 246, 0.74);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow: var(--cinematic-card-shadow);
  }

  .consultation-request__card {
    padding: 1.5rem;
  }

  .consultation-request__summary {
    display: grid;
    gap: 1rem;
    align-content: start;
    padding: 1.35rem;
  }

  .consultation-request__header {
    display: grid;
    gap: 0.85rem;
    margin-bottom: 1.35rem;
  }

  .consultation-request__header h1,
  .consultation-request__summary h2 {
    margin: 0;
    font-family: var(--font-display);
    letter-spacing: -0.05em;
  }

  .consultation-request__header h1 {
    font-size: clamp(2.5rem, 6vw, 4.6rem);
    line-height: 0.94;
  }

  .consultation-request__header p,
  .consultation-request__summary p,
  .consultation-request__summary li {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.7;
  }

  .consultation-request__form {
    display: grid;
    gap: 1rem;
  }

  .consultation-request__grid-fields {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .consultation-request__field {
    display: grid;
    gap: 0.5rem;
  }

  .consultation-request__field--full {
    grid-column: 1 / -1;
  }

  .consultation-request__field label {
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-text-soft);
  }

  .consultation-request__field input,
  .consultation-request__field textarea {
    width: 100%;
    min-height: 3.15rem;
    padding: 0.9rem 1rem;
    border: 1px solid var(--color-border-strong);
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.78);
    color: var(--color-text);
  }

  .consultation-request__field textarea {
    min-height: 11rem;
    resize: vertical;
  }

  .consultation-request__actions {
    display: flex;
    gap: 0.85rem;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .consultation-request__button,
  .consultation-request__link {
    min-height: 3.15rem;
    padding: 0.9rem 1.2rem;
    border-radius: 1rem;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .consultation-request__button {
    border: 0;
    background: linear-gradient(135deg, var(--color-accent), var(--color-accent-hover));
    color: var(--color-accent-contrast);
    cursor: pointer;
  }

  .consultation-request__button:disabled {
    opacity: 0.68;
    cursor: progress;
  }

  .consultation-request__link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-border-strong);
    background: rgba(255, 255, 255, 0.62);
    color: var(--color-text);
  }

  .consultation-request__error,
  .consultation-request__success {
    padding: 1rem 1.1rem;
    border-radius: 1rem;
  }

  .consultation-request__error {
    background: rgba(132, 32, 50, 0.08);
    border: 1px solid rgba(132, 32, 50, 0.18);
    color: #8c2338;
  }

  .consultation-request__success {
    display: grid;
    gap: 0.8rem;
    background: rgba(15, 92, 99, 0.08);
    border: 1px solid rgba(15, 92, 99, 0.14);
  }

  .consultation-request__success strong {
    font-size: 1.4rem;
    letter-spacing: 0.06em;
  }

  .consultation-request__summary ul {
    margin: 0;
    padding-left: 1.1rem;
    display: grid;
    gap: 0.55rem;
  }

  @media (max-width: 920px) {
    .consultation-request__grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 640px) {
    .consultation-request__grid-fields {
      grid-template-columns: 1fr;
    }

    .consultation-request__actions {
      flex-direction: column;
      align-items: stretch;
    }
  }
`;

function createIdempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function RequestConsultationPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<{
    trackingId: string;
    magicLink?: string | null;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await createPublicConsultation(
        {
          ...form,
          phone: form.phone || null,
          company: form.company || null,
        },
        createIdempotencyKey()
      );

      setSuccessState({
        trackingId: response.tracking_id,
        magicLink: response.magic_link,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit the request right now."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <style>{requestConsultationStyles}</style>
      <section className="consultation-request">
        <div className="container">
          <div className="consultation-request__grid">
            <div className="consultation-request__card">
              <div className="consultation-request__header">
                <p className="section-pill">
                  <span></span>
                  Consultation Request
                </p>
                <h1>Start the conversation with the details that matter.</h1>
                <p>
                  Share the core problem, your contact details, and any company context.
                  You will receive a tracking ID immediately.
                </p>
              </div>

              {successState ? (
                <div className="consultation-request__success" role="status">
                  <p>Your request has been recorded.</p>
                  <strong>{successState.trackingId}</strong>
                  <p>
                    Keep this tracking ID. Use it together with your email address if you
                    need a new magic link later.
                  </p>
                  <div className="consultation-request__actions">
                    {successState.magicLink ? (
                      <a
                        className="consultation-request__link"
                        href={successState.magicLink}
                      >
                        Open Tracking Portal
                      </a>
                    ) : (
                      <a className="consultation-request__link" href="/track-consultation/">
                        Track Consultation
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <form className="consultation-request__form" onSubmit={handleSubmit}>
                  <div className="consultation-request__grid-fields">
                    <div className="consultation-request__field">
                      <label htmlFor="consultation-full-name">Full name</label>
                      <input
                        id="consultation-full-name"
                        value={form.full_name}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            full_name: event.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="consultation-request__field">
                      <label htmlFor="consultation-email">Email</label>
                      <input
                        id="consultation-email"
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="consultation-request__field">
                      <label htmlFor="consultation-phone">Phone</label>
                      <input
                        id="consultation-phone"
                        value={form.phone}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            phone: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="consultation-request__field">
                      <label htmlFor="consultation-company">Company</label>
                      <input
                        id="consultation-company"
                        value={form.company}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            company: event.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="consultation-request__field consultation-request__field--full">
                      <label htmlFor="consultation-message">How can Exxonim help?</label>
                      <textarea
                        id="consultation-message"
                        value={form.message}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            message: event.target.value,
                          }))
                        }
                        required
                      />
                    </div>
                  </div>

                  {errorMessage ? (
                    <div className="consultation-request__error" role="alert">
                      {errorMessage}
                    </div>
                  ) : null}

                  <div className="consultation-request__actions">
                    <p className="admin-form__hint">
                      A confirmation email and secure tracking link will be sent after
                      submission.
                    </p>
                    <button
                      className="consultation-request__button"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Request Consultation"}
                    </button>
                  </div>
                </form>
              )}
            </div>

            <aside className="consultation-request__summary">
              <h2>What happens next</h2>
              <p>
                Every request gets a tracking ID, a secure portal link, and a timeline that
                updates when the consultation status changes.
              </p>
              <ul>
                <li>Immediate confirmation and tracking ID.</li>
                <li>Secure magic-link access to the consultation portal.</li>
                <li>Status updates and public notes as the case moves forward.</li>
                <li>Manual follow-up from the assigned consultant when needed.</li>
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
