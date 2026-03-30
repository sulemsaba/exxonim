import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type { ApiAdminUser } from "../types/api";

export async function listAdminStaff() {
  const response = await api.get<ApiAdminUser[]>(apiRoutes.admin.staff);
  return response.data;
}
