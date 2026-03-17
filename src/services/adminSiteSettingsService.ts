import api from "../api/axios";
import type { ApiSiteSetting } from "../types/api";

export interface AdminSiteSettingPayload {
  key: string;
  value: unknown;
}

export async function getAdminSiteSettings() {
  const response = await api.get<ApiSiteSetting[]>("/admin/site-settings");
  return response.data;
}

export async function createAdminSiteSetting(payload: AdminSiteSettingPayload) {
  const response = await api.post<ApiSiteSetting>("/admin/site-settings", payload);
  return response.data;
}

export async function updateAdminSiteSetting(
  id: number,
  payload: Partial<AdminSiteSettingPayload>
) {
  const response = await api.put<ApiSiteSetting>(`/admin/site-settings/${id}`, payload);
  return response.data;
}

export async function deleteAdminSiteSetting(id: number) {
  await api.delete(`/admin/site-settings/${id}`);
}
