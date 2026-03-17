import { clearAuthSession, getAuthSession, updateAuthSession } from "@exxonim/shared/auth/session";
import { resolveApiBaseUrl } from "@exxonim/shared/api/baseUrl";
import { createHttpClient, setAuthorizationHeader } from "@exxonim/shared/api/http";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import type { ApiAdminAccessTokenResponse } from "../types/api";

type ExxonimRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

function isAdminRequest(url?: string) {
  return Boolean(url && (url.startsWith("/admin") || url.includes("/admin/")));
}

function isAdminAuthEndpoint(url?: string) {
  return Boolean(
    url &&
      (url.startsWith("/admin/login") ||
        url.startsWith("/admin/refresh") ||
        url.includes("/admin/login") ||
        url.includes("/admin/refresh"))
  );
}

const baseURL = resolveApiBaseUrl(import.meta.env.VITE_API_URL);
const api = createHttpClient(baseURL);
const refreshClient = createHttpClient(baseURL);

let refreshPromise: Promise<string> | null = null;

async function requestNewAccessToken() {
  const { admin, refreshToken } = getAuthSession();

  if (!admin || !refreshToken) {
    throw new Error("No refresh token available.");
  }

  const response = await refreshClient.post<ApiAdminAccessTokenResponse>(
    "/admin/refresh",
    {
      refresh_token: refreshToken,
    }
  );

  updateAuthSession({ accessToken: response.data.access_token });
  return response.data.access_token;
}

api.interceptors.request.use((config) => {
  if (isAdminRequest(config.url) && !isAdminAuthEndpoint(config.url)) {
    const { accessToken } = getAuthSession();

    if (accessToken) {
      setAuthorizationHeader(config, accessToken);
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as ExxonimRequestConfig | undefined;

    if (
      error.response?.status !== 401 ||
      !config ||
      config._retry ||
      config.skipAuthRefresh ||
      !isAdminRequest(config.url) ||
      isAdminAuthEndpoint(config.url)
    ) {
      return Promise.reject(error);
    }

    const { refreshToken } = getAuthSession();
    if (!refreshToken) {
      clearAuthSession();
      return Promise.reject(error);
    }

    config._retry = true;

    try {
      refreshPromise ??= requestNewAccessToken().finally(() => {
        refreshPromise = null;
      });

      const accessToken = await refreshPromise;
      setAuthorizationHeader(config, accessToken);
      return api(config);
    } catch (refreshError) {
      clearAuthSession();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
