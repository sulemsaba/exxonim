import type { ApiAdminUser } from "./auth";

export const apiAdminNotificationCategories = [
  "request_ops",
  "content_review",
  "security",
  "reporting",
  "system",
] as const;

export type ApiAdminNotificationCategory =
  (typeof apiAdminNotificationCategories)[number];

export const apiAdminNotificationSeverities = [
  "info",
  "success",
  "warning",
  "error",
] as const;

export type ApiAdminNotificationSeverity =
  (typeof apiAdminNotificationSeverities)[number];

export const apiAdminNotificationEventTypes = [
  "request.submitted",
  "request.inbound_message",
  "request.assigned",
  "request.overdue",
  "content.pending_review",
  "security.suspicious_login",
  "security.admin_role_changed",
  "security.admin_status_changed",
  "report.generated",
] as const;

export type ApiAdminNotificationEventType =
  (typeof apiAdminNotificationEventTypes)[number];

export type ApiAdminNotificationStatus = "all" | "unread";

export interface ApiAdminNotification {
  id: string;
  category: ApiAdminNotificationCategory;
  event_type: ApiAdminNotificationEventType;
  severity: ApiAdminNotificationSeverity;
  title: string;
  body?: string | null;
  href?: string | null;
  resource_type?: string | null;
  resource_id?: string | null;
  actor_admin?: ApiAdminUser | null;
  occurrence_count: number;
  is_read: boolean;
  read_at?: string | null;
  last_occurred_at: string;
  created_at: string;
  updated_at: string;
}

export interface ApiAdminNotificationPreference {
  category: ApiAdminNotificationCategory;
  in_app_enabled: boolean;
}

export interface ApiAdminNotificationListParams {
  status?: ApiAdminNotificationStatus;
  category?: ApiAdminNotificationCategory | "";
  severity?: ApiAdminNotificationSeverity | "";
  page?: number;
  limit?: number;
}

export interface ApiAdminNotificationListResponse {
  items: ApiAdminNotification[];
  page: number;
  limit: number;
  total: number;
  pages: number;
  unread_total: number;
}

export interface ApiAdminNotificationReadResponse {
  id: string;
  is_read: boolean;
  read_at: string;
}

export interface ApiAdminNotificationMarkAllReadPayload {
  category?: ApiAdminNotificationCategory | null;
}

export interface ApiAdminNotificationMarkAllReadResponse {
  updated: number;
  unread_total: number;
}
