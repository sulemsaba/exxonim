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
import {
  preloadStaticFallback,
  getStaticFallback,
} from "./staticFallbackService";
import { getFallbackSiteSetting } from "../content/fallbackPublicContent";

// Eagerly load known site-setting fallback files at module init
preloadStaticFallback<Record<string, unknown>>("site-settings-brand");
preloadStaticFallback<Record<string, unknown>>("site-settings-company-info");
preloadStaticFallback<Record<string, unknown>>("site-settings-footer");

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

/* ── Resolve a site-setting fallback ──────────────────────
 *  1. Check the static fallback JSON (build-time snapshot)
 *  2. Fall through to the hardcoded TypeScript default
 */
function resolveFallbackSiteSetting<TValue = unknown>(
  key: string
): SiteSetting<TValue> | undefined {
  const staticKey = `site-settings-${key}`;
  const fromStatic = getStaticFallback<SiteSetting<TValue>>(staticKey);
  if (fromStatic) return fromStatic;
  return getFallbackSiteSetting(key) as SiteSetting<TValue> | undefined;
}

export function getCachedSiteSetting<TValue = unknown>(key: string) {
  return getCachedPublicContent<SiteSetting<TValue> | undefined>(
    siteSettingCacheKey(key),
    resolveFallbackSiteSetting<TValue>(key)
  );
}

export function getCachedSiteSettingResource<TValue = unknown>(key: string) {
  return getCachedPublicContentState<SiteSetting<TValue> | undefined>(
    siteSettingCacheKey(key),
    {
      fallbackValue: resolveFallbackSiteSetting<TValue>(key),
      ttlMs: SHELL_SITE_SETTING_TTL_MS,
    }
  );
}

export async function getSiteSetting<TValue = unknown>(key: string) {
  return fetchWithFallback<SiteSetting<TValue>>({
    cacheKey: siteSettingCacheKey(key),
    fallbackValue: resolveFallbackSiteSetting<TValue>(key),
    fetcher: () => fetchFreshSiteSetting<TValue>(key),
    ttlMs: SHELL_SITE_SETTING_TTL_MS,
    validate: isSiteSettingRecord,
    warningLabel: `Using cached or default site setting for "${key}".`,
  });
}

export async function getSiteSettingResource<TValue = unknown>(key: string) {
  return fetchWithFallbackResource<SiteSetting<TValue>>({
    cacheKey: siteSettingCacheKey(key),
    fallbackValue: resolveFallbackSiteSetting<TValue>(key),
    fetcher: () => fetchFreshSiteSetting<TValue>(key),
    ttlMs: SHELL_SITE_SETTING_TTL_MS,
    validate: isSiteSettingRecord,
    warningLabel: `Using cached or default site setting for "${key}".`,
  });
}
