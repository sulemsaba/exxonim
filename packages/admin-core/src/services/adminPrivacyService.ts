import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiPrivacyRequest,
  ApiPrivacyRequestCreate,
  ApiPrivacyRequestListParams,
  ApiPrivacyRequestListResponse,
  ApiPrivacyRequestUpdate,
} from "../types/api";

export async function listAdminPrivacyRequests(params: ApiPrivacyRequestListParams = {}) {
  const response = await api.get<ApiPrivacyRequestListResponse>(
    apiRoutes.admin.privacyRequests.list,
    {
      params,
    }
  );
  return response.data;
}

export async function createAdminPrivacyRequest(payload: ApiPrivacyRequestCreate) {
  const response = await api.post<ApiPrivacyRequest>(
    apiRoutes.admin.privacyRequests.list,
    payload
  );
  return response.data;
}

export async function updateAdminPrivacyRequest(id: string, payload: ApiPrivacyRequestUpdate) {
  const response = await api.patch<ApiPrivacyRequest>(
    apiRoutes.admin.privacyRequests.byId(id),
    payload
  );
  return response.data;
}
