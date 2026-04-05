import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import {
  fetchWithFallback,
  getCachedPublicContent,
} from "@exxonim/shared/publicContentCache";
import { mapBlogCategory, mapBlogPost } from "../utils/contentMappers";
import type { BlogCategory, BlogPost } from "../types";
import type {
  ApiBlogCategory,
  ApiBlogPost,
  ApiPublicBlogPostListParams,
  ApiPublicBlogPostListResponse,
} from "../types/api";
import {
  fallbackBlogCategories,
  fallbackBlogPosts,
} from "../content/fallbackPublicContent";

const BLOG_POSTS_CACHE_KEY = "blog:posts";
const BLOG_CATEGORIES_CACHE_KEY = "blog:categories";

function mapPostsResponse(responseData: ApiPublicBlogPostListResponse | ApiBlogPost[]) {
  if (Array.isArray(responseData)) {
    return responseData.map(mapBlogPost);
  }

  return responseData.items.map(mapBlogPost);
}

export async function fetchFreshPublicBlogPosts() {
  const params: ApiPublicBlogPostListParams & {
    skip?: number;
    featured_on_home?: boolean;
  } = {
    page: 1,
    limit: 50,
    skip: 0,
  };

  const response = await api.get<ApiPublicBlogPostListResponse | ApiBlogPost[]>(
    apiRoutes.public.blog.posts.list,
    {
      params,
    }
  );

  return mapPostsResponse(response.data);
}

export function getCachedPublicBlogPosts() {
  return getCachedPublicContent<BlogPost[]>(BLOG_POSTS_CACHE_KEY, fallbackBlogPosts);
}

export async function listPublicBlogPosts() {
  return fetchWithFallback<BlogPost[]>({
    cacheKey: BLOG_POSTS_CACHE_KEY,
    fallbackValue: fallbackBlogPosts,
    fetcher: fetchFreshPublicBlogPosts,
    warningLabel: "Using cached or default blog posts.",
  });
}

export async function listFeaturedPublicBlogPosts(limit: number = 3) {
  const posts = await listPublicBlogPosts();
  return posts.filter((post) => post.featuredOnHome).slice(0, limit);
}

export async function getPublicBlogPostBySlug(slug: string) {
  const response = await api.get<ApiBlogPost>(apiRoutes.public.blog.posts.bySlug(slug));
  return mapBlogPost(response.data);
}

async function fetchFreshPublicBlogCategories() {
  const response = await api.get<ApiBlogCategory[]>(apiRoutes.public.blog.categories.list);
  return response.data.map(
    (category): BlogCategory => mapBlogCategory(category) as BlogCategory
  );
}

export function getCachedPublicBlogCategories() {
  return getCachedPublicContent<BlogCategory[]>(
    BLOG_CATEGORIES_CACHE_KEY,
    fallbackBlogCategories
  );
}

export async function listPublicBlogCategories() {
  return fetchWithFallback<BlogCategory[]>({
    cacheKey: BLOG_CATEGORIES_CACHE_KEY,
    fallbackValue: fallbackBlogCategories,
    fetcher: fetchFreshPublicBlogCategories,
    warningLabel: "Using cached or default blog categories.",
  });
}
