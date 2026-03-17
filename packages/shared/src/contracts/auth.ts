export interface ApiAdminUser {
  id: number;
  email: string;
  is_active: boolean;
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
