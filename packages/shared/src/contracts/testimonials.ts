import type { ApiContentStatus } from "./content";

export interface ApiTestimonial {
  id: number;
  eyebrow?: string | null;
  headline?: string | null;
  support?: string | null;
  author: string;
  author_role?: string | null;
  initials?: string | null;
  content: string;
  rating?: number | null;
  sort_order: number;
  status?: ApiContentStatus;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}
