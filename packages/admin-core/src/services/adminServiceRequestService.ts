import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiBulkActionResult,
  ApiBulkAssignPayload,
  ApiBulkMarkReadPayload,
  ApiBulkPriorityPayload,
  ApiBulkStatusPayload,
  ApiDashboardWorklistItem,
  ApiReviewQueueItem,
  ApiServiceRequestMarkReadResponse,
} from "../types/api";

export async function markAdminServiceRequestRead(serviceRequestId: string) {
  const response = await api.post<ApiServiceRequestMarkReadResponse>(
    apiRoutes.admin.serviceRequests.markRead(serviceRequestId)
  );
  return response.data;
}

export async function bulkMarkAdminServiceRequestsRead(
  payload: ApiBulkMarkReadPayload
) {
  const response = await api.post<ApiBulkActionResult>(
    apiRoutes.admin.serviceRequests.bulkMarkRead,
    payload
  );
  return response.data;
}

export async function bulkAssignAdminServiceRequests(
  payload: ApiBulkAssignPayload
) {
  const response = await api.post<ApiBulkActionResult>(
    apiRoutes.admin.serviceRequests.bulkAssign,
    payload
  );
  return response.data;
}

export async function bulkUpdateAdminServiceRequestStatuses(
  payload: ApiBulkStatusPayload
) {
  const response = await api.post<ApiBulkActionResult>(
    apiRoutes.admin.serviceRequests.bulkStatus,
    payload
  );
  return response.data;
}

export async function bulkUpdateAdminServiceRequestPriorities(
  payload: ApiBulkPriorityPayload
) {
  const response = await api.post<ApiBulkActionResult>(
    apiRoutes.admin.serviceRequests.bulkPriority,
    payload
  );
  return response.data;
}

export async function getAdminDashboardWorklists() {
  const response = await api.get<ApiDashboardWorklistItem[]>(apiRoutes.admin.worklists);
  return response.data;
}

export async function getAdminReviewQueue() {
  const response = await api.get<ApiReviewQueueItem[]>(apiRoutes.admin.reviewQueue);
  return response.data;
}
