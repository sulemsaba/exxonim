import type { ApiAdminRole } from "./auth";

export interface ApiAdminManagedUser {
  id: number;
  email: string;
  full_name?: string | null;
  role?: ApiAdminRole | null;
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

