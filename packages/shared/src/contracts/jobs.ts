import type { ApiContentStatus } from "./content";
import type {
  ApiPaginatedResponse,
  ApiPaginationParams,
} from "./pagination";

export interface ApiCareerJob {
  id: number;
  title: string;
  slug: string;
  department: string;
  employment_type: string;
  location_mode: string;
  city: string;
  country: string;
  compensation_label?: string | null;
  experience_label?: string | null;
  summary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status?: ApiContentStatus;
  is_published?: boolean;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiCareerJobListParams extends ApiPaginationParams {
  status?: ApiContentStatus;
  search?: string;
}

export type ApiCareerJobListResponse = ApiPaginatedResponse<ApiCareerJob>;
