import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiBlogAuthor,
  ApiBlogCategory,
  ApiBlogPost,
  ApiBlogStatus,
  ApiAdminBlogPostListParams,
  ApiAdminBlogPostListResponse,
} from "../types/api";
import { normalizeBlogContentRecord, statusToPublishedFlag } from "../utils/admin";

export interface AdminBlogPostPayload {
  title: string;
  slug: string;
  excerpt?: string | null;
  content: Record<string, unknown>;
  category_id?: number | null;
  author_id?: number | null;
  featured_image?: string | null;
  cover_alt?: string | null;
  media_label?: string | null;
  featured_slot?: string | null;
  featured_on_home: boolean;
  read_time_minutes?: number | null;
  related_slugs: string[];
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_url?: string | null;
  published_at?: string | null;
  status: ApiBlogStatus;
}

export interface AdminBlogCategoryPayload {
  name: string;
  slug: string;
  description?: string | null;
}

export interface AdminBlogAuthorPayload {
  slug: string;
  name: string;
  role?: string | null;
  avatar_src?: string | null;
  bio?: string | null;
}

function toRequestPayload(payload: Partial<AdminBlogPostPayload>) {
  return {
    ...payload,
    is_published:
      typeof payload.status === "string"
        ? statusToPublishedFlag(payload.status)
        : undefined,
  };
}

function normalizeAdminPosts(
  data: ApiAdminBlogPostListResponse | ApiBlogPost[],
  params: ApiAdminBlogPostListParams
) {
  if (Array.isArray(data)) {
    const page = params.page ?? 1;
    const limit = params.limit ?? Math.max(data.length, 1);
    const start = Math.max(0, (page - 1) * limit);
    const items = data.slice(start, start + limit).map((post) => normalizeBlogContentRecord(post));

    return {
      items,
      page,
      limit,
      total: data.length,
      total_pages: data.length === 0 ? 0 : Math.ceil(data.length / limit),
    };
  }

  return {
    ...data,
    items: data.items.map((post) => normalizeBlogContentRecord(post)),
  };
}

export async function listAdminBlogPosts(
  params: ApiAdminBlogPostListParams = { page: 1, limit: 100 }
) {
  const response = await api.get<ApiAdminBlogPostListResponse | ApiBlogPost[]>(
    apiRoutes.admin.blog.posts.list,
    {
      params,
    }
  );
  return normalizeAdminPosts(response.data, params).items;
}

export async function listAdminBlogPostsPage(
  params: ApiAdminBlogPostListParams = { page: 1, limit: 20 }
) {
  const response = await api.get<ApiAdminBlogPostListResponse | ApiBlogPost[]>(
    apiRoutes.admin.blog.posts.list,
    {
      params,
    }
  );

  return normalizeAdminPosts(response.data, params);
}

export async function getAdminBlogPost(id: number) {
  const response = await api.get<ApiBlogPost>(apiRoutes.admin.blog.posts.byId(id));
  return normalizeBlogContentRecord(response.data);
}

export async function createAdminBlogPost(payload: AdminBlogPostPayload) {
  const response = await api.post<ApiBlogPost>(
    apiRoutes.admin.blog.posts.list,
    toRequestPayload(payload)
  );
  return normalizeBlogContentRecord(response.data);
}

export async function updateAdminBlogPost(id: number, payload: Partial<AdminBlogPostPayload>) {
  const response = await api.put<ApiBlogPost>(
    apiRoutes.admin.blog.posts.byId(id),
    toRequestPayload(payload)
  );
  return normalizeBlogContentRecord(response.data);
}

export async function deleteAdminBlogPost(id: number) {
  await api.delete(apiRoutes.admin.blog.posts.byId(id));
}

export async function listAdminBlogCategories() {
  const response = await api.get<ApiBlogCategory[]>(apiRoutes.admin.blog.categories.list);
  return response.data;
}

export async function createAdminBlogCategory(payload: AdminBlogCategoryPayload) {
  const response = await api.post<ApiBlogCategory>(
    apiRoutes.admin.blog.categories.list,
    payload
  );
  return response.data;
}

export async function updateAdminBlogCategory(
  id: number,
  payload: Partial<AdminBlogCategoryPayload>
) {
  const response = await api.put<ApiBlogCategory>(
    apiRoutes.admin.blog.categories.byId(id),
    payload
  );
  return response.data;
}

export async function deleteAdminBlogCategory(id: number) {
  await api.delete(apiRoutes.admin.blog.categories.byId(id));
}

export async function listAdminBlogAuthors() {
  const response = await api.get<ApiBlogAuthor[]>(apiRoutes.admin.blog.authors.list);
  return response.data;
}

export async function getAdminBlogAuthorMe() {
  const response = await api.get<ApiBlogAuthor>(apiRoutes.admin.blog.authors.me);
  return response.data;
}

export async function createAdminBlogAuthor(payload: AdminBlogAuthorPayload) {
  const response = await api.post<ApiBlogAuthor>(
    apiRoutes.admin.blog.authors.list,
    payload
  );
  return response.data;
}

export async function updateAdminBlogAuthor(id: number, payload: Partial<AdminBlogAuthorPayload>) {
  const response = await api.put<ApiBlogAuthor>(
    apiRoutes.admin.blog.authors.byId(id),
    payload
  );
  return response.data;
}

export async function updateAdminBlogAuthorMe(payload: Partial<AdminBlogAuthorPayload>) {
  const response = await api.put<ApiBlogAuthor>(apiRoutes.admin.blog.authors.me, payload);
  return response.data;
}

export async function deleteAdminBlogAuthor(id: number) {
  await api.delete(apiRoutes.admin.blog.authors.byId(id));
}
