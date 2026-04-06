export type ApiAdminRole =
  | "superuser"
  | "administrator"
  | "editor"
  | "reviewer"
  | "viewer"
  | "admin"
  | "author";

export interface ApiAdminUser {
  id: number;
  email: string;
  full_name?: string | null;
  role?: ApiAdminRole | null;
  roles?: ApiAdminRole[];
  permissions?: string[];
  is_active: boolean;
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApiAdminSessionResponse {
  token_type: "cookie";
  admin: ApiAdminUser;
}

export interface ApiAdminRefreshResponse {
  token_type: "cookie";
  authenticated: boolean;
}

export interface ApiAdminLogoutResponse {
  token_type: "cookie";
  authenticated: boolean;
}

export interface ApiAdminMeResponse {
  admin: ApiAdminUser;
  permissions?: string[];
}
