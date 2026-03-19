import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import { mapPage } from "../utils/contentMappers";
import type { PageRecord } from "../types";
import type { ApiPage } from "../types/api";

export async function getPageBySlug<TContent = Record<string, unknown>>(slug: string) {
  const response = await api.get<ApiPage<TContent>>(apiRoutes.public.pages.detail(slug));
  return mapPage(response.data) as PageRecord<TContent>;
}
