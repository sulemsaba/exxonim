import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import {
  fetchWithFallbackResource,
  fetchWithFallback,
  getCachedPublicContentState,
  getCachedPublicContent,
} from "@exxonim/shared/publicContentCache";
import { mapNavigationItem } from "../utils/contentMappers";
import type { NavigationItem } from "../types";
import type { ApiNavigationItem } from "../types/api";
import { fallbackNavigationItems } from "../content/fallbackPublicContent";

const NAVIGATION_CACHE_KEY = "navigation";
const NAVIGATION_TTL_MS = 1000 * 60 * 60 * 24;

function isNavigationCollection(value: NavigationItem[]) {
  return Array.isArray(value) && value.length > 0;
}

async function fetchFreshNavigation() {
  const response = await api.get<ApiNavigationItem[]>(apiRoutes.public.navigation.list);
  return response.data.map(
    (item): NavigationItem => mapNavigationItem(item)
  );
}

export function getCachedNavigation() {
  return getCachedPublicContent<NavigationItem[]>(NAVIGATION_CACHE_KEY, fallbackNavigationItems);
}

export function getCachedNavigationResource() {
  return getCachedPublicContentState<NavigationItem[]>(NAVIGATION_CACHE_KEY, {
    fallbackValue: fallbackNavigationItems,
    ttlMs: NAVIGATION_TTL_MS,
  });
}

export async function getNavigation() {
  return fetchWithFallback<NavigationItem[]>({
    cacheKey: NAVIGATION_CACHE_KEY,
    fallbackValue: fallbackNavigationItems,
    fetcher: fetchFreshNavigation,
    ttlMs: NAVIGATION_TTL_MS,
    validate: isNavigationCollection,
    warningLabel: "Using cached or default navigation content.",
  });
}

export async function getNavigationResource() {
  return fetchWithFallbackResource<NavigationItem[]>({
    cacheKey: NAVIGATION_CACHE_KEY,
    fallbackValue: fallbackNavigationItems,
    fetcher: fetchFreshNavigation,
    ttlMs: NAVIGATION_TTL_MS,
    validate: isNavigationCollection,
    warningLabel: "Using cached or default navigation content.",
  });
}
