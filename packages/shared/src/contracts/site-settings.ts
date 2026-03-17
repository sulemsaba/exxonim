export interface ApiSiteSetting<TValue = unknown> {
  id: number;
  key: string;
  value: TValue;
  created_at: string;
  updated_at: string;
}
