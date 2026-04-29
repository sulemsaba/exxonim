import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import {
  fetchWithFallback,
  getCachedPublicContent,
} from "@exxonim/shared/publicContentCache";
import type { ApiCareerJob } from "../types/api";
import {
  preloadStaticFallback,
  getStaticFallback,
} from "./staticFallbackService";
import { fallbackJobs } from "../content/fallbackPublicContent";

preloadStaticFallback<ApiCareerJob[]>("jobs");

const JOBS_CACHE_KEY = "jobs:published";
const JOBS_TTL_MS = 1000 * 60 * 30;

function isJobCollection(value: ApiCareerJob[]) {
  return Array.isArray(value) && value.length > 0;
}

async function fetchFreshPublishedJobs() {
  const response = await api.get<ApiCareerJob[]>(apiRoutes.public.jobs.list);
  return response.data;
}

export function getCachedPublishedJobs() {
  return getCachedPublicContent<ApiCareerJob[]>(JOBS_CACHE_KEY, getStaticFallback<ApiCareerJob[]>("jobs") ?? fallbackJobs);
}

export async function getPublishedJobs() {
  return fetchWithFallback<ApiCareerJob[]>({
    cacheKey: JOBS_CACHE_KEY,
    fallbackValue: getStaticFallback<ApiCareerJob[]>("jobs") ?? fallbackJobs,
    fetcher: fetchFreshPublishedJobs,
    ttlMs: JOBS_TTL_MS,
    validate: isJobCollection,
    warningLabel: "Using cached or default published jobs.",
  });
}
