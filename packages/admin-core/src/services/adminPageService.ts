import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type { ApiContentStatus, ApiPage } from "../types/api";
import { normalizeContentRecord, statusToPublishedFlag } from "../utils/admin";

export interface AdminPagePayload {
  title: string;
  slug: string;
  content: Record<string, unknown>;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_url?: string | null;
  status: ApiContentStatus;
}

export interface AdminWorkflowActionPayload {
  reason?: string | null;
}

function toRequestPayload(payload: Partial<AdminPagePayload>) {
  return {
    ...payload,
    is_published:
      typeof payload.status === "string"
        ? statusToPublishedFlag(payload.status)
        : undefined,
  };
}

export async function getAdminPages() {
  const response = await api.get<ApiPage[]>(apiRoutes.admin.pages.list);
  return response.data.map((page) => normalizeContentRecord(page));
}

export async function getAdminPage(id: number) {
  const response = await api.get<ApiPage>(apiRoutes.admin.pages.byId(id));
  return normalizeContentRecord(response.data);
}

export async function createAdminPage(payload: AdminPagePayload) {
  const response = await api.post<ApiPage>(
    apiRoutes.admin.pages.list,
    toRequestPayload(payload)
  );
  return normalizeContentRecord(response.data);
}

export async function updateAdminPage(id: number, payload: Partial<AdminPagePayload>) {
  const response = await api.put<ApiPage>(
    apiRoutes.admin.pages.byId(id),
    toRequestPayload(payload)
  );
  return normalizeContentRecord(response.data);
}

export async function submitAdminPageForReview(
  id: number,
  payload?: AdminWorkflowActionPayload
) {
  const response = await api.post<ApiPage>(apiRoutes.admin.pages.submit(id), payload ?? {});
  return normalizeContentRecord(response.data);
}

export async function approveAdminPage(
  id: number,
  payload?: AdminWorkflowActionPayload
) {
  const response = await api.post<ApiPage>(apiRoutes.admin.pages.approve(id), payload ?? {});
  return normalizeContentRecord(response.data);
}

export async function rejectAdminPage(
  id: number,
  payload?: AdminWorkflowActionPayload
) {
  const response = await api.post<ApiPage>(apiRoutes.admin.pages.reject(id), payload ?? {});
  return normalizeContentRecord(response.data);
}

export async function publishAdminPage(
  id: number,
  payload?: AdminWorkflowActionPayload
) {
  const response = await api.post<ApiPage>(apiRoutes.admin.pages.publish(id), payload ?? {});
  return normalizeContentRecord(response.data);
}

export async function archiveAdminPage(
  id: number,
  payload?: AdminWorkflowActionPayload
) {
  const response = await api.post<ApiPage>(apiRoutes.admin.pages.archive(id), payload ?? {});
  return normalizeContentRecord(response.data);
}

export async function deleteAdminPage(id: number) {
  await api.delete(apiRoutes.admin.pages.byId(id));
}
