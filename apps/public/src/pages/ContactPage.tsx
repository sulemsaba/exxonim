import { useMutation } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { LoadBoundary } from "../components/LoadBoundary";
import { usePage } from "../hooks/usePage";
import { usePublicShell } from "../hooks/usePublicShell";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import { routes } from "../routes";
import { submitPublicConsultation } from "../services/consultationService";
import type {
  ApiPublicConsultationSubmissionResponse,
} from "../types/api";
import type { ContactPageContent } from "../types";

const SERVICE_OPTIONS = [
  { label: "General consultation", value: "general_consultation" },
  { label: "Registration support", value: "registration" },
  { label: "Licensing support", value: "licensing" },
  { label: "Tax returns", value: "tax_returns" },
  { label: "Compliance support", value: "compliance" },
] as const;

function createSubmissionKey() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `public-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createInitialFormState() {
  return {
    fullName: "",
    email: "",
    phone: "",
    company: "",
    serviceTypeCode: "general_consultation",
    message: "",
    idempotencyKey: createSubmissionKey(),
  };
}

const contactPageStyles = String.raw`
  .contact-request-shell {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.95fr);
    align-items: start;
  }

  .contact-request-panel,
  .contact-request-aside {
    display: grid;
    gap: 1rem;
    padding: clamp(1.2rem, 2vw, 1.6rem);
    border-radius: 1.4rem;
    border: 1px solid rgba(9, 68, 73, 0.14);
    background: rgba(255, 255, 255, 0.06);
    box-shadow: 0 18px 34px rgba(8, 31, 35, 0.08);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
  }

  .contact-request-panel h2,
  .contact-request-aside h2 {
    margin: 0;
    font-size: clamp(1.4rem, 2vw, 1.75rem);
  }

  .contact-request-copy,
  .contact-request-meta,
  .contact-request-alt {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.7;
  }

  .contact-request-form {
    display: grid;
    gap: 1rem;
  }

  .contact-request-grid {
    display: grid;
    gap: 0.95rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .contact-request-field {
    display: grid;
    gap: 0.45rem;
  }

  .contact-request-field--full {
    grid-column: 1 / -1;
  }

  .contact-request-field label {
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--color-text);
  }

  .contact-request-field input,
  .contact-request-field select,
  .contact-request-field textarea {
    width: 100%;
    border: 1px solid rgba(9, 68, 73, 0.16);
    border-radius: 1rem;
    padding: 0.9rem 1rem;
    background: rgba(255, 255, 255, 0.9);
    color: var(--color-text);
    font: inherit;
  }

  .contact-request-field textarea {
    min-height: 10rem;
    resize: vertical;
  }

  .contact-request-field input:focus,
  .contact-request-field select:focus,
  .contact-request-field textarea:focus {
    outline: 2px solid rgba(15, 92, 99, 0.24);
    outline-offset: 2px;
    border-color: rgba(15, 92, 99, 0.3);
  }

  .contact-request-actions {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    flex-wrap: wrap;
  }

  .contact-request-submit {
    border: none;
    cursor: pointer;
  }

  .contact-request-submit[disabled] {
    cursor: progress;
    opacity: 0.7;
  }

  .contact-request-status {
    display: grid;
    gap: 0.45rem;
    padding: 1rem 1.1rem;
    border-radius: 1rem;
    border: 1px solid rgba(9, 68, 73, 0.14);
    background: rgba(255, 255, 255, 0.5);
  }

  .contact-request-status strong {
    font-size: 0.96rem;
  }

  .contact-request-status p {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.65;
  }

  .contact-request-status code {
    display: inline-flex;
    width: fit-content;
    padding: 0.2rem 0.5rem;
    border-radius: 999px;
    background: rgba(9, 68, 73, 0.1);
    color: var(--color-accent);
    font-weight: 700;
  }

  .contact-request-status--success {
    border-color: rgba(30, 108, 58, 0.18);
    background: rgba(242, 250, 244, 0.88);
  }

  .contact-request-status--error {
    border-color: rgba(151, 48, 48, 0.16);
    background: rgba(255, 247, 247, 0.92);
  }

  .contact-request-asideList {
    display: grid;
    gap: 0.8rem;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .contact-request-asideList li {
    display: grid;
    gap: 0.2rem;
  }

  .contact-request-asideList a {
    color: var(--color-accent);
    font-weight: 700;
  }

  .contact-request-note {
    font-size: 0.9rem;
    color: var(--color-text-muted);
  }

  @media (max-width: 960px) {
    .contact-request-shell {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 720px) {
    .contact-request-grid {
      grid-template-columns: 1fr;
    }
  }

  html[data-theme="dark"] .contact-request-panel,
  html[data-theme="dark"] .contact-request-aside {
    background: rgba(11, 31, 35, 0.52);
    border-color: rgba(127, 188, 193, 0.16);
  }

  html[data-theme="dark"] .contact-request-field input,
  html[data-theme="dark"] .contact-request-field select,
  html[data-theme="dark"] .contact-request-field textarea {
    background: rgba(7, 22, 24, 0.92);
    border-color: rgba(127, 188, 193, 0.14);
  }

  html[data-theme="dark"] .contact-request-status {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

export function ContactPage() {
  const { data: page, isPending, error } = usePage<ContactPageContent>("contact");
  const shell = usePublicShell();
  useResolvedPageSeo(page, routes.contact);

  const content = page?.content;
  const [formValues, setFormValues] = useState(createInitialFormState);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] =
    useState<ApiPublicConsultationSubmissionResponse | null>(null);

  const submissionMutation = useMutation({
    mutationFn: submitPublicConsultation,
  });

  const canSubmit =
    formValues.fullName.trim().length > 1 &&
    formValues.email.trim().length > 3 &&
    formValues.message.trim().length > 12 &&
    !submissionMutation.isPending;

  const handleFieldChange = (
    field:
      | "fullName"
      | "email"
      | "phone"
      | "company"
      | "serviceTypeCode"
      | "message",
    value: string
  ) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    setSubmitError(null);

    try {
      const result = await submissionMutation.mutateAsync({
        full_name: formValues.fullName.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone.trim() || null,
        company: formValues.company.trim() || null,
        service_type_code: formValues.serviceTypeCode,
        message: formValues.message.trim(),
        idempotency_key: formValues.idempotencyKey,
        source_channel: "public_contact_form",
      });

      setSubmissionResult(result);
      setFormValues(createInitialFormState());
    } catch {
      setSubmitError(
        "We couldn't send your request yet. Your message has not been submitted. Please try again in a moment or use one of the direct contact paths below."
      );
    }
  };

  return (
    <LoadBoundary
      error={error}
      errorDetail="The contact page content could not be loaded right now."
      errorTitle="Unable to load the contact page."
      isPending={isPending}
      isReady={Boolean(content)}
      loadingLabel="Loading contact page..."
    >
      {() => (
        <section className="page-shell light-section">
          <style>{contactPageStyles}</style>
          <div className="container page-hero" id="contact" data-reveal>
            <div className="landing-section-heading">
              <p className="section-pill section-pill--light">
                <span></span>
                {content!.hero.eyebrow}
              </p>
              <h1>{content!.hero.title}</h1>
              <p>{content!.hero.description}</p>
            </div>

            <div className="contact-grid">
              {content!.cards.map((card) => (
                <article key={card.label} className="page-card">
                  <span className="page-card__eyebrow">{card.label}</span>
                  <strong>{card.value}</strong>
                  <p>{card.description}</p>
                  <a className="landing-cta landing-cta--secondary" href={card.action.href}>
                    {card.action.label}
                  </a>
                </article>
              ))}
            </div>

            <div className="contact-request-shell">
              <article className="contact-request-panel">
                <div>
                  <span className="page-card__eyebrow">Request support</span>
                  <h2>Send Exxonim your request directly</h2>
                </div>
                <p className="contact-request-copy">
                  Submit the essentials once and Exxonim will return a tracking ID so your
                  request stays easy to reference.
                </p>

                {submissionResult ? (
                  <div className="contact-request-status contact-request-status--success" role="status">
                    <strong>Your request has been received.</strong>
                    <p>
                      Keep this tracking ID for follow-up:
                      {" "}
                      <code>{submissionResult.tracking_id}</code>
                    </p>
                    <p>
                      Exxonim will review your request and respond using the contact details you
                      provided.
                    </p>
                  </div>
                ) : null}

                {submitError ? (
                  <div className="contact-request-status contact-request-status--error" role="alert">
                    <strong>Your request was not submitted yet.</strong>
                    <p>{submitError}</p>
                  </div>
                ) : null}

                <form className="contact-request-form" onSubmit={handleSubmit}>
                  <div className="contact-request-grid">
                    <div className="contact-request-field">
                      <label htmlFor="contact-full-name">Full name</label>
                      <input
                        id="contact-full-name"
                        autoComplete="name"
                        value={formValues.fullName}
                        onChange={(event) => handleFieldChange("fullName", event.target.value)}
                        required={true}
                      />
                    </div>

                    <div className="contact-request-field">
                      <label htmlFor="contact-email">Email address</label>
                      <input
                        id="contact-email"
                        autoComplete="email"
                        inputMode="email"
                        type="email"
                        value={formValues.email}
                        onChange={(event) => handleFieldChange("email", event.target.value)}
                        required={true}
                      />
                    </div>

                    <div className="contact-request-field">
                      <label htmlFor="contact-phone">Phone or WhatsApp</label>
                      <input
                        id="contact-phone"
                        autoComplete="tel"
                        inputMode="tel"
                        value={formValues.phone}
                        onChange={(event) => handleFieldChange("phone", event.target.value)}
                      />
                    </div>

                    <div className="contact-request-field">
                      <label htmlFor="contact-company">Company or organization</label>
                      <input
                        id="contact-company"
                        autoComplete="organization"
                        value={formValues.company}
                        onChange={(event) => handleFieldChange("company", event.target.value)}
                      />
                    </div>

                    <div className="contact-request-field contact-request-field--full">
                      <label htmlFor="contact-service-type">Primary support area</label>
                      <select
                        id="contact-service-type"
                        value={formValues.serviceTypeCode}
                        onChange={(event) =>
                          handleFieldChange("serviceTypeCode", event.target.value)
                        }
                      >
                        {SERVICE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="contact-request-field contact-request-field--full">
                      <label htmlFor="contact-message">How can Exxonim help?</label>
                      <textarea
                        id="contact-message"
                        value={formValues.message}
                        onChange={(event) => handleFieldChange("message", event.target.value)}
                        required={true}
                      />
                    </div>
                  </div>

                  <div className="contact-request-actions">
                    <button
                      className="landing-cta landing-cta--primary contact-request-submit"
                      type="submit"
                      disabled={!canSubmit}
                    >
                      {submissionMutation.isPending ? "Sending request..." : "Submit request"}
                    </button>
                    <p className="contact-request-note">
                      Exxonim keeps your draft in place unless the request succeeds.
                    </p>
                  </div>
                </form>
              </article>

              <aside className="contact-request-aside" aria-label="Direct Exxonim contact options">
                <div>
                  <span className="page-card__eyebrow">Direct contact path</span>
                  <h2>Reach Exxonim without losing momentum</h2>
                </div>
                <p className="contact-request-alt">
                  If the request form is temporarily unavailable, you can still use the direct
                  contact routes below.
                </p>

                <ul className="contact-request-asideList">
                  {shell.company.emails.map((email) => (
                    <li key={email}>
                      <strong>Email</strong>
                      <a href={`mailto:${email}`}>{email}</a>
                    </li>
                  ))}
                  {shell.company.phones.map((phone) => (
                    <li key={phone}>
                      <strong>Phone</strong>
                      <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
                    </li>
                  ))}
                  {shell.company.whatsapp ? (
                    <li>
                      <strong>WhatsApp</strong>
                      <a href={shell.company.whatsapp} target="_blank" rel="noreferrer">
                        Open WhatsApp contact
                      </a>
                    </li>
                  ) : null}
                  <li>
                    <strong>Contact page</strong>
                    <a href={routes.contact}>Stay on the Exxonim contact route</a>
                  </li>
                </ul>

                <p className="contact-request-meta">
                  Address: {shell.company.address || "Use the direct contact channels above."}
                </p>
              </aside>
            </div>
          </div>
        </section>
      )}
    </LoadBoundary>
  );
}
