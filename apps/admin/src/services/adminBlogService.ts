import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiBlogAuthor,
  ApiBlogCategory,
  ApiBlogPost,
  ApiContentStatus,
} from "../types/api";
import { normalizeContentRecord, statusToPublishedFlag } from "../utils/admin";

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
  status: ApiContentStatus;
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

export async function getAdminPosts() {
  const response = await api.get<ApiBlogPost[]>(apiRoutes.admin.blogPosts.list);
  return response.data.map((post) => normalizeContentRecord(post));
}

export async function getAdminPost(id: number) {
  const response = await api.get<ApiBlogPost>(apiRoutes.admin.blogPosts.detail(id));
  return normalizeContentRecord(response.data);
}

export async function createAdminPost(payload: AdminBlogPostPayload) {
  const response = await api.post<ApiBlogPost>(
    apiRoutes.admin.blogPosts.list,
    toRequestPayload(payload)
  );
  return normalizeContentRecord(response.data);
}

export async function updateAdminPost(id: number, payload: Partial<AdminBlogPostPayload>) {
  const response = await api.put<ApiBlogPost>(
    apiRoutes.admin.blogPosts.detail(id),
    toRequestPayload(payload)
  );
  return normalizeContentRecord(response.data);
}

export async function deleteAdminPost(id: number) {
  await api.delete(apiRoutes.admin.blogPosts.detail(id));
}

export async function getAdminCategories() {
  const response = await api.get<ApiBlogCategory[]>(apiRoutes.admin.blogCategories.list);
  return response.data;
}

export async function createAdminCategory(payload: AdminBlogCategoryPayload) {
  const response = await api.post<ApiBlogCategory>(
    apiRoutes.admin.blogCategories.list,
    payload
  );
  return response.data;
}

export async function updateAdminCategory(
  id: number,
  payload: Partial<AdminBlogCategoryPayload>
) {
  const response = await api.put<ApiBlogCategory>(
    apiRoutes.admin.blogCategories.detail(id),
    payload
  );
  return response.data;
}

export async function deleteAdminCategory(id: number) {
  await api.delete(apiRoutes.admin.blogCategories.detail(id));
}

export async function getAdminAuthors() {
  const response = await api.get<ApiBlogAuthor[]>(apiRoutes.admin.blogAuthors.list);
  return response.data;
}

export async function createAdminAuthor(payload: AdminBlogAuthorPayload) {
  const response = await api.post<ApiBlogAuthor>(
    apiRoutes.admin.blogAuthors.list,
    payload
  );
  return response.data;
}

export async function updateAdminAuthor(id: number, payload: Partial<AdminBlogAuthorPayload>) {
  const response = await api.put<ApiBlogAuthor>(
    apiRoutes.admin.blogAuthors.detail(id),
    payload
  );
  return response.data;
}

export async function deleteAdminAuthor(id: number) {
  await api.delete(apiRoutes.admin.blogAuthors.detail(id));
}
