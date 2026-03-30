import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiConsultation,
  ApiConsultationListParams,
  ApiConsultationListResponse,
  ApiConsultationStatus,
} from "../types/api";

export interface AdminConsultationUpdatePayload {
  status?: ApiConsultationStatus;
  assigned_to?: number | null;
  notes?: string | null;
  public_notes?: string | null;
  comment?: string | null;
}

export async function listAdminConsultationsPage(
  params: ApiConsultationListParams = { page: 1, limit: 20 }
) {
  const response = await api.get<ApiConsultationListResponse>(
    apiRoutes.admin.consultations.list,
    { params }
  );
  return response.data;
}

export async function listAdminConsultations(
  params: ApiConsultationListParams = { page: 1, limit: 100 }
) {
  const response = await listAdminConsultationsPage(params);
  return response.items;
}

export async function getAdminConsultation(id: number) {
  const response = await api.get<ApiConsultation>(apiRoutes.admin.consultations.byId(id));
  return response.data;
}

export async function updateAdminConsultation(
  id: number,
  payload: AdminConsultationUpdatePayload
) {
  const response = await api.put<ApiConsultation>(
    apiRoutes.admin.consultations.byId(id),
    payload
  );
  return response.data;
}
