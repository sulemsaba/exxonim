import api from "../api/axios";
import type { ApiMedia } from "../types/api";

export interface AdminMediaPayload {
  url: string;
  alt_text?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
}

export async function getAdminMedia() {
  const response = await api.get<ApiMedia[]>("/admin/media");
  return response.data;
}

export async function createAdminMedia(payload: AdminMediaPayload) {
  const response = await api.post<ApiMedia>("/admin/media", payload);
  return response.data;
}

export async function updateAdminMedia(id: number, payload: Partial<AdminMediaPayload>) {
  const response = await api.put<ApiMedia>(`/admin/media/${id}`, payload);
  return response.data;
}

export async function deleteAdminMedia(id: number) {
  await api.delete(`/admin/media/${id}`);
}

export async function uploadMediaFile(file: File, altText?: string) {
  const body = new FormData();
  body.append("file", file);
  if (altText?.trim()) {
    body.append("alt_text", altText.trim());
  }

  const response = await api.post<ApiMedia>("/admin/media/upload", body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
