import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
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

export interface AdminTestimonialWorkflowActionPayload {
  reason?: string | null;
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
  const response = await api.get<ApiTestimonial[]>(apiRoutes.admin.testimonials.list);
  return response.data.map((testimonial) => normalizeContentRecord(testimonial));
}

export async function createAdminTestimonial(payload: AdminTestimonialPayload) {
  const response = await api.post<ApiTestimonial>(
    apiRoutes.admin.testimonials.list,
    toRequestPayload(payload)
  );
  return normalizeContentRecord(response.data);
}

export async function updateAdminTestimonial(
  id: number,
  payload: Partial<AdminTestimonialPayload>
) {
  const response = await api.put<ApiTestimonial>(
    apiRoutes.admin.testimonials.byId(id),
    toRequestPayload(payload)
  );
  return normalizeContentRecord(response.data);
}

export async function submitAdminTestimonialForReview(
  id: number,
  payload?: AdminTestimonialWorkflowActionPayload
) {
  const response = await api.post<ApiTestimonial>(
    apiRoutes.admin.testimonials.submit(id),
    payload ?? {}
  );
  return normalizeContentRecord(response.data);
}

export async function approveAdminTestimonial(
  id: number,
  payload?: AdminTestimonialWorkflowActionPayload
) {
  const response = await api.post<ApiTestimonial>(
    apiRoutes.admin.testimonials.approve(id),
    payload ?? {}
  );
  return normalizeContentRecord(response.data);
}

export async function rejectAdminTestimonial(
  id: number,
  payload?: AdminTestimonialWorkflowActionPayload
) {
  const response = await api.post<ApiTestimonial>(
    apiRoutes.admin.testimonials.reject(id),
    payload ?? {}
  );
  return normalizeContentRecord(response.data);
}

export async function publishAdminTestimonial(
  id: number,
  payload?: AdminTestimonialWorkflowActionPayload
) {
  const response = await api.post<ApiTestimonial>(
    apiRoutes.admin.testimonials.publish(id),
    payload ?? {}
  );
  return normalizeContentRecord(response.data);
}

export async function archiveAdminTestimonial(
  id: number,
  payload?: AdminTestimonialWorkflowActionPayload
) {
  const response = await api.post<ApiTestimonial>(
    apiRoutes.admin.testimonials.archive(id),
    payload ?? {}
  );
  return normalizeContentRecord(response.data);
}

export async function deleteAdminTestimonial(id: number) {
  await api.delete(apiRoutes.admin.testimonials.byId(id));
}
