import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import {
  fetchWithFallback,
  getCachedPublicContent,
} from "@exxonim/shared/publicContentCache";
import { mapTestimonial } from "../utils/contentMappers";
import type { Testimonial } from "../types";
import type { ApiTestimonial } from "../types/api";
import { fallbackTestimonials } from "../content/fallbackPublicContent";

const TESTIMONIALS_CACHE_KEY = "testimonials";
const TESTIMONIALS_TTL_MS = 1000 * 60 * 60 * 24;

function isTestimonialCollection(value: Testimonial[]) {
  return Array.isArray(value) && value.length > 0;
}

async function fetchFreshTestimonials() {
  const response = await api.get<ApiTestimonial[]>(apiRoutes.public.testimonials.list);
  return response.data.map(mapTestimonial) as Testimonial[];
}

export function getCachedTestimonials() {
  return getCachedPublicContent<Testimonial[]>(
    TESTIMONIALS_CACHE_KEY,
    fallbackTestimonials
  );
}

export async function getTestimonials() {
  return fetchWithFallback<Testimonial[]>({
    cacheKey: TESTIMONIALS_CACHE_KEY,
    fallbackValue: fallbackTestimonials,
    fetcher: fetchFreshTestimonials,
    ttlMs: TESTIMONIALS_TTL_MS,
    validate: isTestimonialCollection,
    warningLabel: "Using cached or default testimonials.",
  });
}
