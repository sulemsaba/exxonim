import api from "../api/axios";
import { mapBlogCategory, mapBlogPost } from "../utils/contentMappers";
import type { BlogCategory, BlogPost } from "../types";
import type { ApiBlogCategory, ApiBlogPost } from "../types/api";

export async function getPosts() {
  const response = await api.get<ApiBlogPost[]>("/blog/posts");
  return response.data.map(mapBlogPost);
}

export async function getPostBySlug(slug: string) {
  const response = await api.get<ApiBlogPost>(`/blog/posts/${slug}`);
  return mapBlogPost(response.data);
}

export async function getCategories() {
  const response = await api.get<ApiBlogCategory[]>("/blog/categories");
  return response.data.map(
    (category): BlogCategory => mapBlogCategory(category) as BlogCategory
  );
}
