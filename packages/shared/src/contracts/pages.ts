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
