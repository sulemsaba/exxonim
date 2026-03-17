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
