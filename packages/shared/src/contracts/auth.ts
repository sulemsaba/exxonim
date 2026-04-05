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

export interface ApiAdminTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  admin: ApiAdminUser;
}

export interface ApiAdminAccessTokenResponse {
  access_token: string;
  token_type: string;
}

export interface ApiAdminMeResponse {
  admin: ApiAdminUser;
  permissions?: string[];
}
