import api from "../api/axios";
import type { ApiNavigationItem } from "../types/api";

export interface AdminNavigationPayload {
  title: string;
  url: string;
  description?: string | null;
  kind: string;
  parent_id?: number | null;
  order: number;
  is_active: boolean;
}

export async function getAdminNavigation() {
  const response = await api.get<ApiNavigationItem[]>("/admin/navigation");
  return response.data;
}

export async function createAdminNavigationItem(payload: AdminNavigationPayload) {
  const response = await api.post<ApiNavigationItem>("/admin/navigation", payload);
  return response.data;
}

export async function updateAdminNavigationItem(
  id: number,
  payload: Partial<AdminNavigationPayload>
) {
  const response = await api.put<ApiNavigationItem>(`/admin/navigation/${id}`, payload);
  return response.data;
}

export async function deleteAdminNavigationItem(id: number) {
  await api.delete(`/admin/navigation/${id}`);
}
