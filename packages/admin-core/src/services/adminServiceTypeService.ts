import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type { ApiServiceType } from "../types/api";

export async function listAdminServiceTypes() {
  const response = await api.get<ApiServiceType[]>(apiRoutes.admin.serviceTypes);
  return response.data;
}
