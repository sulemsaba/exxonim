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

export interface ApiBlogAuthor {
  id: number;
  slug: string;
  name: string;
  role?: string | null;
  avatar_src?: string | null;
}

export interface ApiBlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  created_at: string;
}

export interface ApiBlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: {
    introduction: string;
    highlights: string[];
    sections: Array<{
      heading: string;
      paragraphs: string[];
    }>;
  };
  featured_image?: string | null;
  cover_alt?: string | null;
  media_label?: string | null;
  featured_slot?: string | null;
  featured_on_home: boolean;
  read_time_minutes?: number | null;
  related_slugs: string[];
  meta_title?: string | null;
  meta_description?: string | null;
  published_at?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category?: ApiBlogCategory | null;
  author?: ApiBlogAuthor | null;
}

export interface ApiPage<TContent = Record<string, unknown>> {
  id: number;
  title: string;
  slug: string;
  content: TContent;
  meta_title?: string | null;
  meta_description?: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

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
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

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
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiSiteSetting<TValue = unknown> {
  id: number;
  key: string;
  value: TValue;
  created_at: string;
  updated_at: string;
}

export interface ApiMedia {
  id: number;
  url: string;
  alt_text?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  uploaded_at: string;
}
