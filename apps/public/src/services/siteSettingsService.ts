import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import {
  fetchWithFallbackResource,
  fetchWithFallback,
  getCachedPublicContentState,
  getCachedPublicContent,
} from "@exxonim/shared/publicContentCache";
import { mapSiteSetting } from "../utils/contentMappers";
import type { SiteSetting } from "../types";
import type { ApiSiteSetting } from "../types/api";
import { getFallbackSiteSetting } from "../content/fallbackPublicContent";

const SHELL_SITE_SETTING_TTL_MS = 1000 * 60 * 60 * 24;

function siteSettingCacheKey(key: string) {
  return `site-settings:${key}`;
}

function isSiteSettingRecord<TValue>(
  value: SiteSetting<TValue> | undefined
): value is SiteSetting<TValue> {
  return Boolean(value && typeof value.key === "string");
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

export function getCachedSiteSettingResource<TValue = unknown>(key: string) {
  return getCachedPublicContentState<SiteSetting<TValue> | undefined>(
    siteSettingCacheKey(key),
    {
      fallbackValue: getFallbackSiteSetting(key) as SiteSetting<TValue> | undefined,
      ttlMs: SHELL_SITE_SETTING_TTL_MS,
    }
  );
}

export async function getSiteSetting<TValue = unknown>(key: string) {
  return fetchWithFallback<SiteSetting<TValue>>({
    cacheKey: siteSettingCacheKey(key),
    fallbackValue: getFallbackSiteSetting(key) as SiteSetting<TValue> | undefined,
    fetcher: () => fetchFreshSiteSetting<TValue>(key),
    ttlMs: SHELL_SITE_SETTING_TTL_MS,
    validate: isSiteSettingRecord,
    warningLabel: `Using cached or default site setting for "${key}".`,
  });
}

export async function getSiteSettingResource<TValue = unknown>(key: string) {
  return fetchWithFallbackResource<SiteSetting<TValue>>({
    cacheKey: siteSettingCacheKey(key),
    fallbackValue: getFallbackSiteSetting(key) as SiteSetting<TValue> | undefined,
    fetcher: () => fetchFreshSiteSetting<TValue>(key),
    ttlMs: SHELL_SITE_SETTING_TTL_MS,
    validate: isSiteSettingRecord,
    warningLabel: `Using cached or default site setting for "${key}".`,
  });
}
