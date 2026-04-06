import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiAdminNotificationListParams,
  ApiAdminNotificationListResponse,
  ApiAdminNotificationMarkAllReadPayload,
  ApiAdminNotificationMarkAllReadResponse,
  ApiAdminNotificationPreference,
  ApiAdminNotificationReadResponse,
} from "../types/api";

export async function listAdminNotifications(
  params: ApiAdminNotificationListParams = {}
) {
  const response = await api.get<ApiAdminNotificationListResponse>(
    apiRoutes.admin.notifications.list,
    { params }
  );
  return response.data;
}

export async function markAdminNotificationRead(notificationId: string) {
  const response = await api.post<ApiAdminNotificationReadResponse>(
    apiRoutes.admin.notifications.markRead(notificationId)
  );
  return response.data;
}

export async function markAllAdminNotificationsRead(
  payload: ApiAdminNotificationMarkAllReadPayload = {}
) {
  const response = await api.post<ApiAdminNotificationMarkAllReadResponse>(
    apiRoutes.admin.notifications.markAllRead,
    payload
  );
  return response.data;
}

export async function getAdminNotificationPreferences() {
  const response = await api.get<{ items: ApiAdminNotificationPreference[] }>(
    apiRoutes.admin.notifications.preferences
  );
  return response.data.items;
}

export async function updateAdminNotificationPreferences(
  payload: ApiAdminNotificationPreference[]
) {
  const response = await api.patch<{ items: ApiAdminNotificationPreference[] }>(
    apiRoutes.admin.notifications.preferences,
    payload
  );
  return response.data.items;
}
