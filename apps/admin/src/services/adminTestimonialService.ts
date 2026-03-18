import api from "../api/axios";
import type { ApiContentStatus, ApiTestimonial } from "../types/api";
import { normalizeContentRecord, statusToActiveFlag } from "../utils/admin";

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
  status: ApiContentStatus;
}

function toRequestPayload(payload: Partial<AdminTestimonialPayload>) {
  return {
    ...payload,
    is_active:
      typeof payload.status === "string"
        ? statusToActiveFlag(payload.status)
        : undefined,
  };
}

export async function getAdminTestimonials() {
  const response = await api.get<ApiTestimonial[]>("/admin/testimonials");
  return response.data.map((testimonial) => normalizeContentRecord(testimonial));
}

export async function createAdminTestimonial(payload: AdminTestimonialPayload) {
  const response = await api.post<ApiTestimonial>(
    "/admin/testimonials",
    toRequestPayload(payload)
  );
  return normalizeContentRecord(response.data);
}

export async function updateAdminTestimonial(
  id: number,
  payload: Partial<AdminTestimonialPayload>
) {
  const response = await api.put<ApiTestimonial>(
    `/admin/testimonials/${id}`,
    toRequestPayload(payload)
  );
  return normalizeContentRecord(response.data);
}

export async function deleteAdminTestimonial(id: number) {
  await api.delete(`/admin/testimonials/${id}`);
}
