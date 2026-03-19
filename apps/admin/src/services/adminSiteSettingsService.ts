import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type { ApiSiteSetting } from "../types/api";

export interface AdminSiteSettingPayload {
  key: string;
  value: unknown;
}

export async function getAdminSiteSettings() {
  const response = await api.get<ApiSiteSetting[]>(apiRoutes.admin.siteSettings.list);
  return response.data;
}

export async function createAdminSiteSetting(payload: AdminSiteSettingPayload) {
  const response = await api.post<ApiSiteSetting>(
    apiRoutes.admin.siteSettings.list,
    payload
  );
  return response.data;
}

export async function updateAdminSiteSetting(
  id: number,
  payload: Partial<AdminSiteSettingPayload>
) {
  const response = await api.put<ApiSiteSetting>(
    apiRoutes.admin.siteSettings.detail(id),
    payload
  );
  return response.data;
}

export async function deleteAdminSiteSetting(id: number) {
  await api.delete(apiRoutes.admin.siteSettings.detail(id));
}
