import api from "../api/axios";
import { mapPricingPlan } from "../utils/contentMappers";
import type { PricingPlan } from "../types";
import type { ApiPricingPlan } from "../types/api";

export async function getPricingPlans() {
  const response = await api.get<ApiPricingPlan[]>("/pricing/plans");
  return response.data.map(mapPricingPlan) as PricingPlan[];
}
