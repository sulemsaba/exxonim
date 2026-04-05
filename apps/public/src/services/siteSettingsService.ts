import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import {
  fetchWithFallback,
  getCachedPublicContent,
} from "@exxonim/shared/publicContentCache";
import { mapSiteSetting } from "../utils/contentMappers";
import type { SiteSetting } from "../types";
import type { ApiSiteSetting } from "../types/api";
import { getFallbackSiteSetting } from "../content/fallbackPublicContent";

function siteSettingCacheKey(key: string) {
  return `site-settings:${key}`;
}

async function fetchFreshSiteSetting<TValue = unknown>(key: string) {
  const response = await api.get<ApiSiteSetting<TValue>>(
    apiRoutes.public.siteSettings.byKey(key)
  );
  return mapSiteSetting(response.data) as SiteSetting<TValue>;
}

export function getCachedSiteSetting<TValue = unknown>(key: string) {
  return getCachedPublicContent<SiteSetting<TValue> | undefined>(
    siteSettingCacheKey(key),
    getFallbackSiteSetting(key) as SiteSetting<TValue> | undefined
  );
}

export async function getSiteSetting<TValue = unknown>(key: string) {
  return fetchWithFallback<SiteSetting<TValue>>({
    cacheKey: siteSettingCacheKey(key),
    fallbackValue: getFallbackSiteSetting(key) as SiteSetting<TValue> | undefined,
    fetcher: () => fetchFreshSiteSetting<TValue>(key),
    warningLabel: `Using cached or default site setting for "${key}".`,
  });
}
