import axios, {
  AxiosError,
  AxiosHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import { clearAuthSession, getAuthSession, updateAuthSession } from "../lib/authSession";
import type { ApiAdminAccessTokenResponse } from "../types/api";

type ExxonimRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api/v1";

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

function setAuthorizationHeader(
  config: InternalAxiosRequestConfig,
  token: string
) {
  if (config.headers && "set" in config.headers) {
    config.headers.set("Authorization", `Bearer ${token}`);
    return;
  }

  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  if ("set" in config.headers) {
    config.headers.set("Authorization", `Bearer ${token}`);
    return;
  }

  (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
}

const api = axios.create({
  baseURL,
  timeout: 5000,
});

const refreshClient = axios.create({
  baseURL,
  timeout: 5000,
});

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
