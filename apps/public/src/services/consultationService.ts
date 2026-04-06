import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiPublicConsultationSubmission,
  ApiPublicConsultationSubmissionResponse,
} from "../types/api";

export async function submitPublicConsultation(
  payload: ApiPublicConsultationSubmission
) {
  const response = await api.post<ApiPublicConsultationSubmissionResponse>(
    apiRoutes.public.consultations.create,
    payload
  );

  return response.data;
}
