import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiAdminAccessTokenResponse,
  ApiAdminTokenResponse,
} from "../types/api";

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export async function loginAdmin(
  payload: AdminLoginPayload
): Promise<ApiAdminTokenResponse> {
  const response = await api.post<ApiAdminTokenResponse>(
    apiRoutes.admin.auth.login,
    payload
  );
  return response.data;
}

export async function refreshAdminAccessToken(
  refreshToken: string
): Promise<ApiAdminAccessTokenResponse> {
  const response = await api.post<ApiAdminAccessTokenResponse>(
    apiRoutes.admin.auth.refresh,
    {
      refresh_token: refreshToken,
    }
  );

  return response.data;
}
