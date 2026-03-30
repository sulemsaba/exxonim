import type { ApiAdminUser } from "./auth";
import type {
  ApiPaginatedResponse,
  ApiPaginationParams,
} from "./pagination";

export type ApiConsultationStatus =
  | "pending"
  | "contacted"
  | "completed"
  | "cancelled";

export interface ApiConsultationStatusHistory {
  id: number;
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
}

export interface ApiConsultationListParams extends ApiPaginationParams {
  status?: ApiConsultationStatus | "";
  search?: string;
}

export type ApiConsultationListResponse = ApiPaginatedResponse<ApiConsultation>;
