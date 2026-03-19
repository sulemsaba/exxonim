export interface ApiPaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiPaginatedResponse<TItem> {
  items: TItem[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}
