import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import { mapSiteSetting } from "../utils/contentMappers";
import type { SiteSetting } from "../types";
import type { ApiSiteSetting } from "../types/api";

export async function getSiteSetting<TValue = unknown>(key: string) {
  const response = await api.get<ApiSiteSetting<TValue>>(
    apiRoutes.public.siteSettings.detail(key)
  );
  return mapSiteSetting(response.data) as SiteSetting<TValue>;
}
