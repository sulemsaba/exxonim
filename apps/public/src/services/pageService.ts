import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import {
  fetchWithFallback,
  getCachedPublicContent,
} from "@exxonim/shared/publicContentCache";
import { mapPage } from "../utils/contentMappers";
import type { PageRecord } from "../types";
import type { ApiPage } from "../types/api";
import {
  preloadStaticFallback,
  getStaticFallback,
} from "./staticFallbackService";
import { getFallbackPage } from "../content/fallbackPublicContent";

preloadStaticFallback<Record<string, unknown>[]>("pages");

const PAGE_TTL_MS = 1000 * 60 * 60 * 6;

function pageCacheKey(slug: string) {
  return `pages:${slug}`;
}

function isPageRecord<TContent>(
  value: PageRecord<TContent> | undefined
): value is PageRecord<TContent> {
  return Boolean(value && typeof value.slug === "string");
}

async function fetchFreshPageBySlug<TContent = Record<string, unknown>>(slug: string) {
  const response = await api.get<ApiPage<TContent>>(apiRoutes.public.pages.bySlug(slug));
  return mapPage(response.data) as PageRecord<TContent>;
}

export function getCachedPageBySlug<TContent = Record<string, unknown>>(slug: string) {
  return getCachedPublicContent<PageRecord<TContent> | undefined>(
    pageCacheKey(slug),
    getStaticFallback<PageRecord<TContent>>("pages") ??
      (getFallbackPage(slug) as PageRecord<TContent> | undefined)
  );
}

export async function getPageBySlug<TContent = Record<string, unknown>>(slug: string) {
  return fetchWithFallback<PageRecord<TContent>>({
    cacheKey: pageCacheKey(slug),
    fallbackValue:
      getStaticFallback<PageRecord<TContent>>("pages") ??
      (getFallbackPage(slug) as PageRecord<TContent> | undefined),
    fetcher: () => fetchFreshPageBySlug<TContent>(slug),
    ttlMs: PAGE_TTL_MS,
    validate: isPageRecord,
    warningLabel: `Using cached or default page content for "${slug}".`,
  });
}
