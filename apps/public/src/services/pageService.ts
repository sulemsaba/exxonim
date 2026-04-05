import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import {
  fetchWithFallback,
  getCachedPublicContent,
} from "@exxonim/shared/publicContentCache";
import { mapPage } from "../utils/contentMappers";
import type { PageRecord } from "../types";
import type { ApiPage } from "../types/api";
import { getFallbackPage } from "../content/fallbackPublicContent";

function pageCacheKey(slug: string) {
  return `pages:${slug}`;
}

async function fetchFreshPageBySlug<TContent = Record<string, unknown>>(slug: string) {
  const response = await api.get<ApiPage<TContent>>(apiRoutes.public.pages.bySlug(slug));
  return mapPage(response.data) as PageRecord<TContent>;
}

export function getCachedPageBySlug<TContent = Record<string, unknown>>(slug: string) {
  return getCachedPublicContent<PageRecord<TContent> | undefined>(
    pageCacheKey(slug),
    getFallbackPage(slug) as PageRecord<TContent> | undefined
  );
}

export async function getPageBySlug<TContent = Record<string, unknown>>(slug: string) {
  return fetchWithFallback<PageRecord<TContent>>({
    cacheKey: pageCacheKey(slug),
    fallbackValue: getFallbackPage(slug) as PageRecord<TContent> | undefined,
    fetcher: () => fetchFreshPageBySlug<TContent>(slug),
    warningLabel: `Using cached or default page content for "${slug}".`,
  });
}
