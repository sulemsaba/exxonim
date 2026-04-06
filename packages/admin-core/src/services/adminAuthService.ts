import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiAdminLogoutResponse,
  ApiAdminRefreshResponse,
  ApiAdminSessionResponse,
  ApiAdminUser,
} from "../types/api";

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export async function loginAdmin(
  payload: AdminLoginPayload
): Promise<ApiAdminSessionResponse> {
  const response = await api.post<ApiAdminSessionResponse>(
    apiRoutes.admin.auth.login,
    payload
  );
  return response.data;
}

export async function refreshAdminSession(): Promise<ApiAdminRefreshResponse> {
  const response = await api.post<ApiAdminRefreshResponse>(apiRoutes.admin.auth.refresh);

  return response.data;
}

export async function logoutAdmin(): Promise<ApiAdminLogoutResponse> {
  const response = await api.post<ApiAdminLogoutResponse>(apiRoutes.admin.auth.logout);
  return response.data;
}

export async function getAdminMe(): Promise<ApiAdminUser> {
  const response = await api.get<ApiAdminUser>(apiRoutes.admin.auth.me);
  return response.data;
}
