import type { ApiAdminUser } from "./auth";
import type {
  ApiPaginatedResponse,
  ApiPaginationParams,
} from "./pagination";

export type ApiCustomerKind = "individual" | "organization";
export type ApiCustomerSource =
  | "public_consultation_form"
  | "public_contact_form"
  | "admin_created"
  | "migration_legacy";

export type ApiServiceRequestStatus =
  | "new"
  | "triaged"
  | "waiting_customer"
  | "in_progress"
  | "completed"
  | "cancelled";

export type ApiServiceRequestPriority = "low" | "normal" | "high" | "urgent";

export type ApiServiceRequestSourceChannel =
  | "public_consultation_form"
  | "public_contact_form"
  | "admin_created"
  | "migration_legacy";
export type ApiServiceRequestQueueView =
  | "all_active"
  | "mine"
  | "assigned"
  | "unassigned"
  | "unread"
  | "completed";
export type ApiServiceRequestSort = "last_activity" | "opened_at" | "priority";
export type ApiSortOrder = "asc" | "desc";

export type ApiAssignmentRole = "lead" | "collaborator";
export type ApiInboxThreadKind = "primary";
export type ApiMessageDirection = "inbound" | "outbound" | "internal";
export type ApiMessageChannel = "web_form" | "admin_manual" | "system_seed";
export type ApiNoteVisibility = "internal" | "customer_safe";
export type ApiDocumentClassification =
  | "customer_upload"
  | "internal_attachment"
  | "generated_document"
  | "compliance_proof";

export interface ApiServiceType {
  id: string;
  code: string;
  label: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface ApiCustomer {
  id: string;
  display_name: string;
  primary_email?: string | null;
  normalized_email?: string | null;
  primary_phone?: string | null;
  normalized_phone?: string | null;
  company_name?: string | null;
  customer_kind: ApiCustomerKind;
  source: ApiCustomerSource;
  created_at: string;
  updated_at: string;
}

export interface ApiServiceRequestAssignment {
  id: string;
  assignment_role: ApiAssignmentRole;
  assigned_at: string;
  unassigned_at?: string | null;
  admin_user: ApiAdminUser;
  assigned_by_admin?: ApiAdminUser | null;
}

export interface ApiServiceRequestStatusHistory {
  id: string;
  old_status?: ApiServiceRequestStatus | null;
  new_status: ApiServiceRequestStatus;
  comment?: string | null;
  created_at: string;
  changed_by_admin?: ApiAdminUser | null;
}

export interface ApiInboxMessage {
  id: string;
  direction: ApiMessageDirection;
  channel: ApiMessageChannel;
  body: string;
  author_admin?: ApiAdminUser | null;
  customer_author_name?: string | null;
  customer_author_email?: string | null;
  created_at: string;
}

export interface ApiInboxThread {
  id: string;
  thread_kind: ApiInboxThreadKind;
  subject?: string | null;
  created_at: string;
  messages: ApiInboxMessage[];
}

export interface ApiRecordNote {
  id: string;
  customer_id?: string | null;
  service_request_id?: string | null;
  visibility: ApiNoteVisibility;
  body: string;
  created_at: string;
  created_by_admin: ApiAdminUser;
}

export interface ApiRecordDocument {
  id: string;
  customer_id?: string | null;
  service_request_id?: string | null;
  classification: ApiDocumentClassification;
  storage_key: string;
  original_filename: string;
  mime_type: string;
  file_size: number;
  created_at: string;
  uploaded_by_admin: ApiAdminUser;
  download_url?: string | null;
}

export interface ApiTimelineEvent {
  id: string;
  event_type: string;
  scope_type: "customer" | "service_request";
  scope_id: string;
  actor_name: string;
  actor_type: string;
  summary: string;
  body?: string | null;
  created_at: string;
  related_record_type?: string | null;
  related_record_id?: string | null;
}

export interface ApiServiceRequest {
  id: string;
  customer_id: string;
  tracking_id: string;
  legacy_consultation_id?: number | null;
  service_type_id: string;
  title: string;
  intake_message?: string | null;
  source_channel: ApiServiceRequestSourceChannel;
  status: ApiServiceRequestStatus;
  priority: ApiServiceRequestPriority;
  opened_at: string;
  closed_at?: string | null;
  last_activity_at: string;
  last_customer_message_at?: string | null;
  due_at?: string | null;
  target_response_at?: string | null;
  closed_reason?: string | null;
  created_at: string;
  updated_at: string;
  customer: ApiCustomer;
  service_type: ApiServiceType;
  created_by_admin?: ApiAdminUser | null;
  status_history: ApiServiceRequestStatusHistory[];
  assignments: ApiServiceRequestAssignment[];
  threads: ApiInboxThread[];
  notes: ApiRecordNote[];
  documents: ApiRecordDocument[];
  timeline: ApiTimelineEvent[];
  unread: boolean;
  unread_count: number;
}

export interface ApiCustomerListParams extends ApiPaginationParams {
  search?: string;
}

export interface ApiServiceRequestListParams extends ApiPaginationParams {
  search?: string;
  status?: ApiServiceRequestStatus | "";
  service_type?: string;
  priority?: ApiServiceRequestPriority | "";
  assignee_id?: number;
  source_channel?: ApiServiceRequestSourceChannel | "";
  view?: ApiServiceRequestQueueView;
  sort?: ApiServiceRequestSort;
  order?: ApiSortOrder;
}

export interface ApiServiceRequestMarkReadResponse {
  service_request_id: string;
  unread: boolean;
  unread_count: number;
  last_read_at: string;
}

export interface ApiBulkAssignPayload {
  request_ids: string[];
  admin_user_id: number;
  assignment_role?: ApiAssignmentRole;
}

export interface ApiBulkPriorityPayload {
  request_ids: string[];
  priority: ApiServiceRequestPriority;
}

export interface ApiBulkStatusPayload {
  request_ids: string[];
  status: ApiServiceRequestStatus;
  comment?: string | null;
}

export interface ApiBulkMarkReadPayload {
  request_ids: string[];
}

export interface ApiBulkActionResult {
  requested: number;
  updated: number;
  skipped: number;
  request_ids: string[];
}

export interface ApiDashboardWorklistItem {
  key: string;
  label: string;
  count: number;
  href?: string | null;
  tone: "default" | "info" | "warning" | "error";
  description?: string | null;
}

export interface ApiReviewQueueItem {
  id: string;
  content_type: "page" | "blog_post" | "testimonial";
  title: string;
  status: string;
  submitted_at?: string | null;
  submitted_by?: string | null;
  href?: string | null;
}

export type ApiCustomerListResponse = ApiPaginatedResponse<ApiCustomer>;
export type ApiServiceRequestListResponse = ApiPaginatedResponse<ApiServiceRequest>;
