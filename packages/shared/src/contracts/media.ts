export interface ApiMedia {
  id: number;
  url: string;
  alt_text?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  uploaded_at: string;
}
