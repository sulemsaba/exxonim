import api from "../api/axios";
import type { ApiTestimonial } from "../types/api";

export interface AdminTestimonialPayload {
  eyebrow?: string | null;
  headline?: string | null;
  support?: string | null;
  author: string;
  author_role?: string | null;
  initials?: string | null;
  content: string;
  rating?: number | null;
  sort_order: number;
  is_active: boolean;
}

export async function getAdminTestimonials() {
  const response = await api.get<ApiTestimonial[]>("/admin/testimonials");
  return response.data;
}

export async function createAdminTestimonial(payload: AdminTestimonialPayload) {
  const response = await api.post<ApiTestimonial>("/admin/testimonials", payload);
  return response.data;
}

export async function updateAdminTestimonial(
  id: number,
  payload: Partial<AdminTestimonialPayload>
) {
  const response = await api.put<ApiTestimonial>(`/admin/testimonials/${id}`, payload);
  return response.data;
}

export async function deleteAdminTestimonial(id: number) {
  await api.delete(`/admin/testimonials/${id}`);
}
