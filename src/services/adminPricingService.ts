import api from "../api/axios";
import type { ApiPricingPlan } from "../types/api";

export interface AdminPricingPayload {
  name: string;
  badge?: string | null;
  description?: string | null;
  notes?: string | null;
  price?: number | null;
  features: Array<{ label: string; included: boolean }>;
  recommended: boolean;
  sort_order: number;
  is_active: boolean;
}

export async function getAdminPricingPlans() {
  const response = await api.get<ApiPricingPlan[]>("/admin/pricing/plans");
  return response.data;
}

export async function createAdminPricingPlan(payload: AdminPricingPayload) {
  const response = await api.post<ApiPricingPlan>("/admin/pricing/plans", payload);
  return response.data;
}

export async function updateAdminPricingPlan(
  id: number,
  payload: Partial<AdminPricingPayload>
) {
  const response = await api.put<ApiPricingPlan>(`/admin/pricing/plans/${id}`, payload);
  return response.data;
}

export async function deleteAdminPricingPlan(id: number) {
  await api.delete(`/admin/pricing/plans/${id}`);
}
