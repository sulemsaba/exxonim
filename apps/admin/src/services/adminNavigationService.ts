import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type { ApiContentStatus, ApiNavigationItem } from "../types/api";
import { normalizeContentRecord, statusToActiveFlag } from "../utils/admin";

export interface AdminNavigationPayload {
  title: string;
  url: string;
  description?: string | null;
  kind: string;
  parent_id?: number | null;
  order: number;
  status: ApiContentStatus;
}

function normalizeNavigationItem(item: ApiNavigationItem): ApiNavigationItem {
  return {
    ...normalizeContentRecord(item),
    children: item.children.map((child) => normalizeNavigationItem(child)),
  };
}

function toRequestPayload(payload: Partial<AdminNavigationPayload>) {
  return {
    ...payload,
    is_active:
      typeof payload.status === "string"
        ? statusToActiveFlag(payload.status)
        : undefined,
  };
}

export async function getAdminNavigation() {
  const response = await api.get<ApiNavigationItem[]>(apiRoutes.admin.navigation.list);
  return response.data.map((item) => normalizeNavigationItem(item));
}

export async function createAdminNavigationItem(payload: AdminNavigationPayload) {
  const response = await api.post<ApiNavigationItem>(
    apiRoutes.admin.navigation.list,
    toRequestPayload(payload)
  );
  return normalizeNavigationItem(response.data);
}

export async function updateAdminNavigationItem(
  id: number,
  payload: Partial<AdminNavigationPayload>
) {
  const response = await api.put<ApiNavigationItem>(
    apiRoutes.admin.navigation.byId(id),
    toRequestPayload(payload)
  );
  return normalizeNavigationItem(response.data);
}

export async function deleteAdminNavigationItem(id: number) {
  await api.delete(apiRoutes.admin.navigation.byId(id));
}
