import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import { mapNavigationItem } from "../utils/contentMappers";
import type { NavigationItem } from "../types";
import type { ApiNavigationItem } from "../types/api";

export async function getNavigation() {
  const response = await api.get<ApiNavigationItem[]>(apiRoutes.public.navigation);
  return response.data.map(
    (item): NavigationItem => mapNavigationItem(item)
  );
}
