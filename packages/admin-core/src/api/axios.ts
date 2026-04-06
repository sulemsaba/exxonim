import { apiRoutes } from "@exxonim/shared/api/routes";
import { resolveApiBaseUrl } from "@exxonim/shared/api/baseUrl";
import { clearAuthSession } from "@exxonim/shared/auth/session";
import { createHttpClient, setRequestHeader } from "@exxonim/shared/api/http";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

type ExxonimRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
  skipAuthRefresh?: boolean;
};

const ADMIN_CSRF_COOKIE_NAME = import.meta.env.VITE_ADMIN_CSRF_COOKIE_NAME || "exxonim_csrf_token";
const MUTATION_METHODS = new Set(["post", "put", "patch", "delete"]);

function isAdminRequest(url?: string) {
  return Boolean(url && (url.startsWith("/admin") || url.includes("/admin/")));
}

function isAdminAuthEndpoint(url?: string) {
  const adminAuthPaths = [
    apiRoutes.admin.auth.login,
    apiRoutes.admin.auth.refresh,
  ];

  return Boolean(
    url &&
      adminAuthPaths.some((path) => url.startsWith(path) || url.includes(path))
  );
}

function readCookie(name: string) {
  if (typeof document === "undefined" || !document.cookie) {
    return null;
  }

  const prefix = `${name}=`;
  const entry = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(prefix));

  if (!entry) {
    return null;
  }

  return decodeURIComponent(entry.slice(prefix.length));
}

function applyCsrfHeader(config: InternalAxiosRequestConfig) {
  if (!isAdminRequest(config.url)) {
    return;
  }

  const method = (config.method || "get").toLowerCase();
  if (!MUTATION_METHODS.has(method)) {
    return;
  }

  const csrfToken = readCookie(ADMIN_CSRF_COOKIE_NAME);
  if (!csrfToken) {
    return;
  }

  setRequestHeader(config, "X-CSRF-Token", csrfToken);
}

const baseURL = resolveApiBaseUrl(import.meta.env.VITE_API_URL);
const api = createHttpClient(baseURL);
const refreshClient = createHttpClient(baseURL);

api.defaults.withCredentials = true;
refreshClient.defaults.withCredentials = true;

let refreshPromise: Promise<void> | null = null;

async function requestSessionRefresh() {
  await refreshClient.post(apiRoutes.admin.auth.refresh, undefined, {
    skipAuthRefresh: true,
  } as ExxonimRequestConfig);
}

api.interceptors.request.use((config) => {
  applyCsrfHeader(config);
  return config;
});

refreshClient.interceptors.request.use((config) => {
  applyCsrfHeader(config);
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

    config._retry = true;

    try {
      refreshPromise ??= requestSessionRefresh().finally(() => {
        refreshPromise = null;
      });

      await refreshPromise;
      applyCsrfHeader(config);
      return api(config);
    } catch (refreshError) {
      clearAuthSession();
      return Promise.reject(refreshError);
    }
  }
);

export default api;
