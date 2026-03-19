import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiAdminStaff,
  ApiConsultationAdminDetail,
  ApiConsultationAdminListResponse,
  ApiConsultationManualNotifyResponse,
  ApiConsultationStatus,
  ApiNotificationType,
} from "../types/api";

export interface AdminConsultationListParams {
  page?: number;
  limit?: number;
  status?: ApiConsultationStatus | "";
  assigned_to?: number | "";
  search?: string;
}

export interface AdminConsultationUpdatePayload {
  status?: ApiConsultationStatus;
  assigned_to?: number | null;
  notes?: string | null;
  public_notes?: string | null;
  status_comment?: string | null;
}

export interface AdminConsultationNotifyPayload {
  type: ApiNotificationType;
  subject?: string | null;
  message: string;
}

export async function getAdminConsultations(params: AdminConsultationListParams = {}) {
  const response = await api.get<ApiConsultationAdminListResponse>(
    apiRoutes.admin.consultations.list,
    {
      params,
    }
  );

  return response.data;
}

export async function getAdminConsultation(id: number) {
  const response = await api.get<ApiConsultationAdminDetail>(
    apiRoutes.admin.consultations.detail(id)
  );
  return response.data;
}

export async function updateAdminConsultation(
  id: number,
  payload: AdminConsultationUpdatePayload
) {
  const response = await api.put<ApiConsultationAdminDetail>(
    apiRoutes.admin.consultations.detail(id),
    payload
  );

  return response.data;
}

export async function notifyAdminConsultation(
  id: number,
  payload: AdminConsultationNotifyPayload
) {
  const response = await api.post<ApiConsultationManualNotifyResponse>(
    apiRoutes.admin.consultations.notify(id),
    payload
  );

  return response.data;
}

export async function getAdminStaff() {
  const response = await api.get<ApiAdminStaff[]>(apiRoutes.admin.staff);
  return response.data;
}
