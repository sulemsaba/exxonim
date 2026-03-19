import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import { mapPricingPlan } from "../utils/contentMappers";
import type { PricingPlan } from "../types";
import type { ApiPricingPlan } from "../types/api";

export async function getPricingPlans() {
  const response = await api.get<ApiPricingPlan[]>(apiRoutes.public.pricing);
  return response.data.map(mapPricingPlan) as PricingPlan[];
}
