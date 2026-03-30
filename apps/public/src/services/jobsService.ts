import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type { ApiCareerJob } from "../types/api";

export async function getPublishedJobs() {
  const response = await api.get<ApiCareerJob[]>(apiRoutes.public.jobs.list);
  return response.data;
}
