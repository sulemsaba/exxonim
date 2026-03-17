export interface ApiNavigationItem {
  id: number;
  title: string;
  url: string;
  description?: string | null;
  kind: string;
  order: number;
  is_active: boolean;
  parent_id?: number | null;
  created_at: string;
  updated_at: string;
  children: ApiNavigationItem[];
}
