import api from "../api/axios";
import type { ApiBlogAuthor, ApiBlogCategory, ApiBlogPost } from "../types/api";

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
  published_at?: string | null;
  is_published: boolean;
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
}

export async function getAdminPosts() {
  const response = await api.get<ApiBlogPost[]>("/admin/blog/posts");
  return response.data;
}

export async function getAdminPost(id: number) {
  const response = await api.get<ApiBlogPost>(`/admin/blog/posts/${id}`);
  return response.data;
}

export async function createAdminPost(payload: AdminBlogPostPayload) {
  const response = await api.post<ApiBlogPost>("/admin/blog/posts", payload);
  return response.data;
}

export async function updateAdminPost(id: number, payload: Partial<AdminBlogPostPayload>) {
  const response = await api.put<ApiBlogPost>(`/admin/blog/posts/${id}`, payload);
  return response.data;
}

export async function deleteAdminPost(id: number) {
  await api.delete(`/admin/blog/posts/${id}`);
}

export async function getAdminCategories() {
  const response = await api.get<ApiBlogCategory[]>("/admin/blog/categories");
  return response.data;
}

export async function createAdminCategory(payload: AdminBlogCategoryPayload) {
  const response = await api.post<ApiBlogCategory>("/admin/blog/categories", payload);
  return response.data;
}

export async function updateAdminCategory(
  id: number,
  payload: Partial<AdminBlogCategoryPayload>
) {
  const response = await api.put<ApiBlogCategory>(`/admin/blog/categories/${id}`, payload);
  return response.data;
}

export async function deleteAdminCategory(id: number) {
  await api.delete(`/admin/blog/categories/${id}`);
}

export async function getAdminAuthors() {
  const response = await api.get<ApiBlogAuthor[]>("/admin/blog/authors");
  return response.data;
}

export async function createAdminAuthor(payload: AdminBlogAuthorPayload) {
  const response = await api.post<ApiBlogAuthor>("/admin/blog/authors", payload);
  return response.data;
}

export async function updateAdminAuthor(id: number, payload: Partial<AdminBlogAuthorPayload>) {
  const response = await api.put<ApiBlogAuthor>(`/admin/blog/authors/${id}`, payload);
  return response.data;
}

export async function deleteAdminAuthor(id: number) {
  await api.delete(`/admin/blog/authors/${id}`);
}
