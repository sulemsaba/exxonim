import api from "../api/axios";
import { mapSiteSetting } from "../utils/contentMappers";
import type { SiteSetting } from "../types";
import type { ApiSiteSetting } from "../types/api";

export async function getSiteSetting<TValue = unknown>(key: string) {
  const response = await api.get<ApiSiteSetting<TValue>>(`/site-settings/${key}`);
  return mapSiteSetting(response.data) as SiteSetting<TValue>;
}
