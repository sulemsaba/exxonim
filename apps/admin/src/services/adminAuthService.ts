import api from "../api/axios";
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
  const response = await api.post<ApiAdminTokenResponse>("/admin/login", payload);
  return response.data;
}

export async function refreshAdminAccessToken(
  refreshToken: string
): Promise<ApiAdminAccessTokenResponse> {
  const response = await api.post<ApiAdminAccessTokenResponse>(
    "/admin/refresh",
    {
      refresh_token: refreshToken,
    }
  );

  return response.data;
}
