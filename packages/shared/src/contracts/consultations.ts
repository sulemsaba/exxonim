import type { ApiAdminUser } from "./auth";
import type {
  ApiPaginatedResponse,
  ApiPaginationParams,
} from "./pagination";
import type {
  ApiServiceRequestPriority,
  ApiServiceRequestQueueView,
  ApiServiceRequestSourceChannel,
  ApiServiceRequestSort,
  ApiSortOrder,
  ApiCustomer,
  ApiInboxMessage,
  ApiRecordDocument,
  ApiRecordNote,
  ApiServiceRequestAssignment,
  ApiServiceType,
  ApiTimelineEvent,
} from "./service-requests";

export type ApiConsultationStatus =
  | "pending"
  | "contacted"
  | "completed"
  | "cancelled";

export interface ApiConsultationStatusHistory {
  id: string;
  old_status?: ApiConsultationStatus | null;
  new_status: ApiConsultationStatus;
  comment?: string | null;
  created_at: string;
  changed_by_admin?: ApiAdminUser | null;
}

export interface ApiConsultation {
  id: number;
  tracking_id: string;
  idempotency_key: string;
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  message: string;
  status: ApiConsultationStatus;
  assigned_to?: number | null;
  notes?: string | null;
  public_notes?: string | null;
  created_at: string;
  updated_at: string;
  assigned_admin?: ApiAdminUser | null;
  status_history?: ApiConsultationStatusHistory[];
  customer_id?: string | null;
  service_request_id?: string | null;
  customer?: ApiCustomer | null;
  service_type?: ApiServiceType | null;
  priority?: ApiServiceRequestPriority | null;
  source_channel?: ApiServiceRequestSourceChannel | null;
  opened_at?: string | null;
  closed_at?: string | null;
  last_activity_at?: string | null;
  last_customer_message_at?: string | null;
  unread: boolean;
  unread_count: number;
  assignments?: ApiServiceRequestAssignment[];
  messages?: ApiInboxMessage[];
  notes_records?: ApiRecordNote[];
  documents?: ApiRecordDocument[];
  timeline?: ApiTimelineEvent[];
}

export interface ApiPublicConsultationSubmission {
  full_name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service_type_code?: string | null;
  message: string;
  idempotency_key?: string | null;
  source_channel?: ApiServiceRequestSourceChannel;
}

export interface ApiPublicConsultationSubmissionResponse {
  consultation_id: number;
  service_request_id: string;
  tracking_id: string;
  status: ApiConsultationStatus;
  message: string;
  received_at: string;
}

export interface ApiConsultationListParams extends ApiPaginationParams {
  status?: ApiConsultationStatus | "";
  search?: string;
  service_type?: string;
  priority?: ApiServiceRequestPriority | "";
  assignee_id?: number;
  source_channel?: ApiServiceRequestSourceChannel | "";
  view?: ApiServiceRequestQueueView;
  sort?: ApiServiceRequestSort;
  order?: ApiSortOrder;
}

export type ApiConsultationListResponse = ApiPaginatedResponse<ApiConsultation>;
