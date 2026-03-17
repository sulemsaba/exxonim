import api from "../api/axios";
import { mapPage } from "../utils/contentMappers";
import type { PageRecord } from "../types";
import type { ApiPage } from "../types/api";

export async function getPageBySlug<TContent = Record<string, unknown>>(slug: string) {
  const response = await api.get<ApiPage<TContent>>(`/pages/${slug}`);
  return mapPage(response.data) as PageRecord<TContent>;
}
