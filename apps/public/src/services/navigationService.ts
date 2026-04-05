import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import {
  fetchWithFallback,
  getCachedPublicContent,
} from "@exxonim/shared/publicContentCache";
import { mapNavigationItem } from "../utils/contentMappers";
import type { NavigationItem } from "../types";
import type { ApiNavigationItem } from "../types/api";
import { fallbackNavigationItems } from "../content/fallbackPublicContent";

const NAVIGATION_CACHE_KEY = "navigation";

async function fetchFreshNavigation() {
  const response = await api.get<ApiNavigationItem[]>(apiRoutes.public.navigation.list);
  return response.data.map(
    (item): NavigationItem => mapNavigationItem(item)
  );
}

export function getCachedNavigation() {
  return getCachedPublicContent<NavigationItem[]>(NAVIGATION_CACHE_KEY, fallbackNavigationItems);
}

export async function getNavigation() {
  return fetchWithFallback<NavigationItem[]>({
    cacheKey: NAVIGATION_CACHE_KEY,
    fallbackValue: fallbackNavigationItems,
    fetcher: fetchFreshNavigation,
    warningLabel: "Using cached or default navigation content.",
  });
}
