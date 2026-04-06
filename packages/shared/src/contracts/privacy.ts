import type { ApiAdminUser } from "./auth";
import type { ApiCustomer } from "./service-requests";
import type { ApiPaginatedResponse } from "./pagination";

export const apiPrivacyConsentCategories = ["necessary", "preferences"] as const;

export type ApiPrivacyConsentCategory = (typeof apiPrivacyConsentCategories)[number];

export interface ApiPrivacyPolicyVersions {
  privacy_policy: string;
  cookie_notice: string;
  data_rights_notice: string;
}

export interface ApiPrivacyConsentState {
  policy_versions: ApiPrivacyPolicyVersions;
  categories: {
    necessary: boolean;
    preferences: boolean;
  };
  consent_recorded: boolean;
  recorded_at?: string | null;
}

export interface ApiPrivacyConsentUpdate {
  preferences: boolean;
  source_path?: string | null;
}

export const apiPrivacyRequestTypes = [
  "access",
  "correction",
  "deletion",
] as const;

export type ApiPrivacyRequestType = (typeof apiPrivacyRequestTypes)[number];

export const apiPrivacyRequestStatuses = [
  "received",
  "verifying",
  "in_progress",
  "completed",
  "rejected",
] as const;

export type ApiPrivacyRequestStatus = (typeof apiPrivacyRequestStatuses)[number];

export interface ApiPrivacyRequest {
  id: string;
  customer_id?: string | null;
  request_type: ApiPrivacyRequestType;
  status: ApiPrivacyRequestStatus;
  requester_name: string;
  requester_email: string;
  summary: string;
  internal_notes?: string | null;
  resolution_notes?: string | null;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  customer?: ApiCustomer | null;
  created_by_admin: ApiAdminUser;
  completed_by_admin?: ApiAdminUser | null;
}

export interface ApiPrivacyRequestCreate {
  customer_id?: string | null;
  request_type: ApiPrivacyRequestType;
  requester_name: string;
  requester_email: string;
  summary: string;
  internal_notes?: string | null;
}

export interface ApiPrivacyRequestUpdate {
  status?: ApiPrivacyRequestStatus;
  internal_notes?: string | null;
  resolution_notes?: string | null;
}

export interface ApiPrivacyRequestListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ApiPrivacyRequestStatus | "";
  request_type?: ApiPrivacyRequestType | "";
}

export type ApiPrivacyRequestListResponse = ApiPaginatedResponse<ApiPrivacyRequest>;
