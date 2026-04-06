import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPrivacyConsent, updatePrivacyConsent } from "../services/privacyService";

const styles = String.raw`
  .privacy-consent-banner {
    position: fixed;
    inset: auto 1rem 1rem 1rem;
    z-index: 50;
    display: grid;
    gap: 1rem;
    max-width: min(42rem, calc(100vw - 2rem));
    margin-left: auto;
    padding: 1.15rem 1.25rem;
    border: 1px solid rgba(17, 35, 37, 0.12);
    border-radius: 1.5rem;
    background: rgba(250, 245, 237, 0.96);
    box-shadow: 0 24px 60px rgba(17, 35, 37, 0.16);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .privacy-consent-banner__copy {
    display: grid;
    gap: 0.55rem;
  }

  .privacy-consent-banner__eyebrow {
    margin: 0;
    font-size: 0.82rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(17, 35, 37, 0.66);
  }

  .privacy-consent-banner__title {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.4;
    color: var(--color-text);
  }

  .privacy-consent-banner__body {
    margin: 0;
    color: rgba(17, 35, 37, 0.74);
    line-height: 1.7;
  }

  .privacy-consent-banner__links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    font-size: 0.92rem;
  }

  .privacy-consent-banner__links a {
    color: var(--color-accent);
    text-decoration: none;
  }

  .privacy-consent-banner__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
    justify-content: flex-end;
  }

  .privacy-consent-banner__button {
    border: 0;
    border-radius: 999px;
    padding: 0.85rem 1.2rem;
    font: inherit;
    cursor: pointer;
    transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
  }

  .privacy-consent-banner__button:hover {
    transform: translateY(-1px);
  }

  .privacy-consent-banner__button--secondary {
    background: rgba(17, 35, 37, 0.08);
    color: var(--color-text);
  }

  .privacy-consent-banner__button--primary {
    background: var(--color-accent);
    color: #fff;
    box-shadow: 0 18px 30px rgba(176, 83, 57, 0.24);
  }

  html[data-theme="dark"] .privacy-consent-banner {
    border-color: rgba(237, 242, 255, 0.12);
    background: rgba(13, 19, 28, 0.94);
  }

  html[data-theme="dark"] .privacy-consent-banner__eyebrow,
  html[data-theme="dark"] .privacy-consent-banner__body {
    color: rgba(237, 242, 255, 0.74);
  }

  html[data-theme="dark"] .privacy-consent-banner__button--secondary {
    background: rgba(237, 242, 255, 0.08);
    color: rgba(237, 242, 255, 0.94);
  }
`;

interface PrivacyConsentBannerProps {
  pathname: string;
}

export function PrivacyConsentBanner({ pathname }: PrivacyConsentBannerProps) {
  const queryClient = useQueryClient();
  const consentQuery = useQuery({
    queryKey: ["public", "privacy", "consent"],
    queryFn: getPrivacyConsent,
    staleTime: 60_000,
  });

  const consentMutation = useMutation({
    mutationFn: updatePrivacyConsent,
    onSuccess: async (data) => {
      queryClient.setQueryData(["public", "privacy", "consent"], data);
    },
  });

  if (consentQuery.isPending || consentQuery.isError || consentQuery.data?.consent_recorded) {
    return null;
  }

  return (
    <>
      <style>{styles}</style>
      <aside className="privacy-consent-banner" aria-live="polite">
        <div className="privacy-consent-banner__copy">
          <p className="privacy-consent-banner__eyebrow">Privacy & cookies</p>
          <h2 className="privacy-consent-banner__title">
            We only use browser storage for session handling, consent state, and optional preferences like theme memory.
          </h2>
          <p className="privacy-consent-banner__body">
            Business records such as customer history, service history, notes, and documents stay in the database. You can keep only necessary storage or allow preference storage too.
          </p>
          <div className="privacy-consent-banner__links">
            <a href="/privacy/">Privacy policy</a>
            <a href="/cookies/">Cookie notice</a>
            <a href="/data-rights/">Data rights</a>
          </div>
        </div>

        <div className="privacy-consent-banner__actions">
          <button
            className="privacy-consent-banner__button privacy-consent-banner__button--secondary"
            type="button"
            onClick={() => {
              consentMutation.mutate({
                preferences: false,
                source_path: pathname,
              });
            }}
            disabled={consentMutation.isPending}
          >
            Necessary only
          </button>
          <button
            className="privacy-consent-banner__button privacy-consent-banner__button--primary"
            type="button"
            onClick={() => {
              consentMutation.mutate({
                preferences: true,
                source_path: pathname,
              });
            }}
            disabled={consentMutation.isPending}
          >
            Allow preferences
          </button>
        </div>
      </aside>
    </>
  );
}
