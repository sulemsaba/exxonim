import type { ApiContentStatus } from "./content";

export interface ApiPricingPlan {
  id: number;
  name: string;
  badge?: string | null;
  description?: string | null;
  notes?: string | null;
  price?: string | number | null;
  features: Array<{
    label: string;
    included: boolean;
  }>;
  recommended: boolean;
  sort_order: number;
  status?: ApiContentStatus;
  is_active?: boolean;
  created_at: string;
  updated_at: string;
}
