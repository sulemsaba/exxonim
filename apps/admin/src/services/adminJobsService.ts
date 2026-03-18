import api from "../api/axios";
import type { ApiCareerJob, ApiContentStatus } from "../types/api";
import { normalizeContentRecord, statusToPublishedFlag } from "../utils/admin";

export interface AdminJobPayload {
  title: string;
  slug: string;
  department: string;
  employment_type: string;
  location_mode: string;
  city: string;
  country: string;
  compensation_label?: string | null;
  experience_label?: string | null;
  summary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: ApiContentStatus;
  published_at?: string | null;
}

function toRequestPayload(payload: Partial<AdminJobPayload>) {
  return {
    ...payload,
    is_published:
      typeof payload.status === "string"
        ? statusToPublishedFlag(payload.status)
        : undefined,
  };
}

export async function getAdminJobs() {
  const response = await api.get<ApiCareerJob[]>("/admin/jobs");
  return response.data.map((job) => normalizeContentRecord(job));
}

export async function getAdminJob(slug: string) {
  const response = await api.get<ApiCareerJob>(`/admin/jobs/${slug}`);
  return normalizeContentRecord(response.data);
}

export async function createAdminJob(payload: AdminJobPayload) {
  const response = await api.post<ApiCareerJob>("/admin/jobs", toRequestPayload(payload));
  return normalizeContentRecord(response.data);
}

export async function updateAdminJob(slug: string, payload: Partial<AdminJobPayload>) {
  const response = await api.put<ApiCareerJob>(`/admin/jobs/${slug}`, toRequestPayload(payload));
  return normalizeContentRecord(response.data);
}

export async function deleteAdminJob(slug: string) {
  await api.delete(`/admin/jobs/${slug}`);
}

