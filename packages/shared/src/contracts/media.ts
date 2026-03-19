export interface ApiMedia {
  id: number;
  url: string;
  alt_text?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  original_name?: string | null;
  width?: number | null;
  height?: number | null;
  uploaded_at: string;
}
