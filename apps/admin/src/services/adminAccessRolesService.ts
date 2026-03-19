import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type { ApiAdminManagedUser, ApiAdminRole } from "../types/api";

export interface AdminUsersListParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: ApiAdminRole | "";
}

export interface AdminManagedUserPayload {
  email: string;
  full_name?: string | null;
  role: ApiAdminRole;
  is_active: boolean;
}

export async function getAdminUsers(params: AdminUsersListParams = {}) {
  const response = await api.get<ApiAdminManagedUser[]>(apiRoutes.admin.access.users, {
    params,
  });
  return response.data;
}

export async function createAdminUser(payload: AdminManagedUserPayload) {
  const response = await api.post<ApiAdminManagedUser>(apiRoutes.admin.access.users, payload);
  return response.data;
}

export async function updateAdminUser(id: number, payload: Partial<AdminManagedUserPayload>) {
  const response = await api.put<ApiAdminManagedUser>(
    apiRoutes.admin.access.userDetail(id),
    payload
  );
  return response.data;
}

export async function updateAdminUserRole(id: number, role: ApiAdminRole) {
  const response = await api.put<ApiAdminManagedUser>(
    apiRoutes.admin.access.userRole(id),
    { role }
  );
  return response.data;
}

export async function updateAdminUserStatus(id: number, isActive: boolean) {
  const response = await api.put<ApiAdminManagedUser>(
    apiRoutes.admin.access.userStatus(id),
    {
      is_active: isActive,
    }
  );
  return response.data;
}

export async function getAdminRoles() {
  const response = await api.get<ApiAdminRole[]>(apiRoutes.admin.access.roles);
  return response.data;
}
