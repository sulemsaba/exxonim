import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiPrivacyConsentState,
  ApiPrivacyConsentUpdate,
} from "../types/api";

export const PRIVACY_CONSENT_EVENT = "exxonim:privacy-consent";

function dispatchConsentEvent(consent: ApiPrivacyConsentState) {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(PRIVACY_CONSENT_EVENT, {
      detail: {
        preferencesEnabled: consent.categories.preferences,
      },
    })
  );
}

export async function getPrivacyConsent() {
  const response = await api.get<ApiPrivacyConsentState>(apiRoutes.public.privacy.consent, {
    withCredentials: true,
  });
  dispatchConsentEvent(response.data);
  return response.data;
}

export async function updatePrivacyConsent(payload: ApiPrivacyConsentUpdate) {
  const response = await api.post<ApiPrivacyConsentState>(
    apiRoutes.public.privacy.consent,
    payload,
    {
      withCredentials: true,
    }
  );
  dispatchConsentEvent(response.data);
  return response.data;
}
