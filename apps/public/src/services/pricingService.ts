import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import {
  fetchWithFallback,
  getCachedPublicContent,
} from "@exxonim/shared/publicContentCache";
import { mapPricingPlan } from "../utils/contentMappers";
import type { PricingPlan } from "../types";
import type { ApiPricingPlan } from "../types/api";
import {
  preloadStaticFallback,
  getStaticFallback,
} from "./staticFallbackService";
import { fallbackPricingPlans } from "../content/fallbackPublicContent";

// Eagerly start loading the static fallback at module init time
preloadStaticFallback<PricingPlan[]>("pricing");

const PRICING_CACHE_KEY = "pricing:plans";
const PRICING_TTL_MS = 1000 * 60 * 60 * 6;

function isPricingPlanCollection(value: PricingPlan[]) {
  return Array.isArray(value) && value.length > 0;
}

async function fetchFreshPricingPlans() {
  const response = await api.get<ApiPricingPlan[]>(apiRoutes.public.pricing.plans.list);
  return response.data.map(mapPricingPlan) as PricingPlan[];
}

export function getCachedPricingPlans() {
  return getCachedPublicContent<PricingPlan[]>(
    PRICING_CACHE_KEY,
    getStaticFallback<PricingPlan[]>("pricing") ?? fallbackPricingPlans
  );
}

export async function getPricingPlans() {
  return fetchWithFallback<PricingPlan[]>({
    cacheKey: PRICING_CACHE_KEY,
    fallbackValue: getStaticFallback<PricingPlan[]>("pricing") ?? fallbackPricingPlans,
    fetcher: fetchFreshPricingPlans,
    ttlMs: PRICING_TTL_MS,
    validate: isPricingPlanCollection,
    warningLabel: "Using cached or default pricing plans.",
  });
}
