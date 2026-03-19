import type { ApiContentStatus } from "./content";
import type {
  ApiPaginatedResponse,
  ApiPaginationParams,
} from "./pagination";

export interface ApiPage<TContent = Record<string, unknown>> {
  id: number;
  title: string;
  slug: string;
  content: TContent;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_url?: string | null;
  status?: ApiContentStatus;
  is_published?: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiPageListParams extends ApiPaginationParams {
  status?: ApiContentStatus;
  search?: string;
}

export type ApiPageListResponse<TContent = Record<string, unknown>> =
  ApiPaginatedResponse<ApiPage<TContent>>;
