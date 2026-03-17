import api from "../api/axios";
import type { ApiPage } from "../types/api";

export interface AdminPagePayload {
  title: string;
  slug: string;
  content: Record<string, unknown>;
  meta_title?: string | null;
  meta_description?: string | null;
  is_published: boolean;
}

export async function getAdminPages() {
  const response = await api.get<ApiPage[]>("/admin/pages");
  return response.data;
}

export async function getAdminPage(id: number) {
  const response = await api.get<ApiPage>(`/admin/pages/${id}`);
  return response.data;
}

export async function createAdminPage(payload: AdminPagePayload) {
  const response = await api.post<ApiPage>("/admin/pages", payload);
  return response.data;
}

export async function updateAdminPage(id: number, payload: Partial<AdminPagePayload>) {
  const response = await api.put<ApiPage>(`/admin/pages/${id}`, payload);
  return response.data;
}

export async function deleteAdminPage(id: number) {
  await api.delete(`/admin/pages/${id}`);
}
