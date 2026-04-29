import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPrivacyConsent, updatePrivacyConsent } from "../services/privacyService";


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
