import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type { ApiContentStatus, ApiPricingPlan } from "../types/api";
import { normalizeContentRecord, statusToActiveFlag } from "../utils/admin";

export interface AdminPricingPayload {
  name: string;
  badge?: string | null;
  description?: string | null;
  notes?: string | null;
  price?: number | null;
  features: Array<{ label: string; included: boolean }>;
  recommended: boolean;
  sort_order: number;
  status: ApiContentStatus;
}

function toRequestPayload(payload: Partial<AdminPricingPayload>) {
  return {
    ...payload,
    is_active:
      typeof payload.status === "string"
        ? statusToActiveFlag(payload.status)
        : undefined,
  };
}

export async function getAdminPricingPlans() {
  const response = await api.get<ApiPricingPlan[]>(apiRoutes.admin.pricing.plans.list);
  return response.data.map((plan) => normalizeContentRecord(plan));
}

export async function createAdminPricingPlan(payload: AdminPricingPayload) {
  const response = await api.post<ApiPricingPlan>(
    apiRoutes.admin.pricing.plans.list,
    toRequestPayload(payload)
  );
  return normalizeContentRecord(response.data);
}

export async function updateAdminPricingPlan(
  id: number,
  payload: Partial<AdminPricingPayload>
) {
  const response = await api.put<ApiPricingPlan>(
    apiRoutes.admin.pricing.plans.byId(id),
    toRequestPayload(payload)
  );
  return normalizeContentRecord(response.data);
}

export async function deleteAdminPricingPlan(id: number) {
  await api.delete(apiRoutes.admin.pricing.plans.byId(id));
}
