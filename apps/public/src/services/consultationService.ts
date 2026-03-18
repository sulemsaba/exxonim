import api from "../api/axios";
import type {
  ApiConsultationCreateResponse,
  ApiConsultationMagicLinkResponse,
  ApiConsultationPublic,
} from "../types/api";

export interface PublicConsultationPayload {
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message: string;
}

export interface PublicConsultationMagicLinkPayload {
  email: string;
  tracking_id: string;
}

export async function createPublicConsultation(
  payload: PublicConsultationPayload,
  idempotencyKey: string
) {
  const response = await api.post<ApiConsultationCreateResponse>(
    "/public/consultations",
    payload,
    {
      headers: {
        "Idempotency-Key": idempotencyKey,
      },
    }
  );

  return response.data;
}

export async function requestConsultationMagicLink(
  payload: PublicConsultationMagicLinkPayload
) {
  const response = await api.post<ApiConsultationMagicLinkResponse>(
    "/public/consultations/magic-link",
    payload
  );

  return response.data;
}

export async function getPublicConsultation(
  trackingId: string,
  token: string
) {
  const response = await api.get<ApiConsultationPublic>(
    `/public/consultations/${trackingId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}
