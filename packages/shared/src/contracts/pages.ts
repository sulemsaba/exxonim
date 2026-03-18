import type { ApiContentStatus } from "./content";

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
