import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type { ApiSiteSetting } from "../types/api";

export interface AdminSiteSettingPayload {
  key: string;
  value: unknown;
}

export async function listAdminSiteSettings() {
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

export async function updateAdminSiteSettingByKey(
  key: string,
  payload: Partial<AdminSiteSettingPayload>
) {
  const response = await api.put<ApiSiteSetting>(
    apiRoutes.admin.siteSettings.byKey(key),
    payload
  );
  return response.data;
}

export async function deleteAdminSiteSettingByKey(key: string) {
  await api.delete(apiRoutes.admin.siteSettings.byKey(key));
}
