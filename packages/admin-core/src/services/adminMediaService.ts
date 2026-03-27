import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type { ApiMedia } from "../types/api";

export interface AdminMediaPayload {
  url: string;
  alt_text?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
}

export async function getAdminMedia() {
  const response = await api.get<ApiMedia[]>(apiRoutes.admin.media.list);
  return response.data;
}

export async function createAdminMedia(payload: AdminMediaPayload) {
  const response = await api.post<ApiMedia>(apiRoutes.admin.media.list, payload);
  return response.data;
}

export async function updateAdminMedia(id: number, payload: Partial<AdminMediaPayload>) {
  const response = await api.put<ApiMedia>(apiRoutes.admin.media.byId(id), payload);
  return response.data;
}

export async function deleteAdminMedia(id: number) {
  await api.delete(apiRoutes.admin.media.byId(id));
}

export async function uploadMediaFile(file: File, altText?: string) {
  const body = new FormData();
  body.append("file", file);
  if (altText?.trim()) {
    body.append("alt_text", altText.trim());
  }

  const response = await api.post<ApiMedia>(apiRoutes.admin.media.upload, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
