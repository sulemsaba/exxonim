import type {
  ApiPaginatedResponse,
  ApiPaginationParams,
} from "./pagination";

export type ApiConsultationStatus =
  | "pending"
  | "contacted"
  | "completed"
  | "cancelled";

export type ApiNotificationType = "email" | "sms";

export interface ApiConsultationAssignedStaff {
  id: number;
  full_name: string;
  email: string;
}

export interface ApiConsultationStatusHistoryPublic {
  new_status: ApiConsultationStatus;
  changed_at: string;
  comment?: string | null;
}

export interface ApiConsultationStatusHistoryAdmin {
  id: number;
  old_status?: ApiConsultationStatus | null;
  new_status: ApiConsultationStatus;
  changed_at: string;
  comment?: string | null;
  changed_by?: ApiConsultationAssignedStaff | null;
}

export interface ApiNotificationLog {
  id: number;
  type: ApiNotificationType;
  recipient: string;
  subject?: string | null;
  body: string;
  status: string;
  error_message?: string | null;
  created_at: string;
}

export interface ApiConsultationCreateResponse {
  id: number;
  tracking_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message: string;
  status: ApiConsultationStatus;
  created_at: string;
  magic_link?: string | null;
}

export interface ApiConsultationPublic {
  id: number;
  tracking_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message: string;
  status: ApiConsultationStatus;
  assigned_to?: ApiConsultationAssignedStaff | null;
  public_notes?: string | null;
  status_history: ApiConsultationStatusHistoryPublic[];
  created_at: string;
  updated_at: string;
}

export interface ApiConsultationMagicLinkResponse {
  ok: boolean;
  magic_link?: string | null;
}

export interface ApiConsultationAdminListItem {
  id: number;
  tracking_id: string;
  full_name: string;
  email: string;
  status: ApiConsultationStatus;
  assigned_to?: ApiConsultationAssignedStaff | null;
  created_at: string;
}

export interface ApiConsultationAdminListParams extends ApiPaginationParams {
  status?: ApiConsultationStatus;
  assigned_to?: number;
  search?: string;
}

export type ApiConsultationAdminListResponse =
  ApiPaginatedResponse<ApiConsultationAdminListItem>;

export interface ApiConsultationAdminDetail {
  id: number;
  tracking_id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message: string;
  status: ApiConsultationStatus;
  assigned_to?: ApiConsultationAssignedStaff | null;
  notes?: string | null;
  public_notes?: string | null;
  status_history: ApiConsultationStatusHistoryAdmin[];
  notification_logs: ApiNotificationLog[];
  created_at: string;
  updated_at: string;
}

export interface ApiAdminStaff {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
}

export interface ApiConsultationManualNotifyResponse {
  id: number;
  status: string;
}
