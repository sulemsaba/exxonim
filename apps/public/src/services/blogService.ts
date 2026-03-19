import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import { mapBlogCategory, mapBlogPost } from "../utils/contentMappers";
import type { BlogCategory, BlogPost } from "../types";
import type { ApiBlogCategory, ApiBlogPost } from "../types/api";

export async function getPosts() {
  const response = await api.get<ApiBlogPost[]>(apiRoutes.public.blogPosts.list);
  return response.data.map(mapBlogPost);
}

export async function getFeaturedPosts(limit: number = 3) {
  const response = await api.get<ApiBlogPost[]>(apiRoutes.public.blogPosts.list, {
    params: {
      featured_on_home: true,
      limit,
    },
  });
  return response.data.map(mapBlogPost);
}

export async function getPostBySlug(slug: string) {
  const response = await api.get<ApiBlogPost>(apiRoutes.public.blogPosts.detail(slug));
  return mapBlogPost(response.data);
}

export async function getCategories() {
  const response = await api.get<ApiBlogCategory[]>(apiRoutes.public.blogCategories);
  return response.data.map(
    (category): BlogCategory => mapBlogCategory(category) as BlogCategory
  );
}
