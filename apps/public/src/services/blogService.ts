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
  preloadStaticFallback,
  getStaticFallback,
} from "./staticFallbackService";
import {
  fallbackBlogCategories,
  fallbackBlogPosts,
} from "../content/fallbackPublicContent";

preloadStaticFallback<BlogPost[]>("blog-posts");
preloadStaticFallback<BlogCategory[]>("blog-categories");

const BLOG_POSTS_CACHE_KEY = "blog:posts";
const BLOG_CATEGORIES_CACHE_KEY = "blog:categories";
const BLOG_POSTS_TTL_MS = 1000 * 60 * 30;
const BLOG_CATEGORIES_TTL_MS = 1000 * 60 * 60 * 24;
const BLOG_POST_TTL_MS = 1000 * 60 * 60 * 6;

function blogPostCacheKey(slug: string) {
  return `blog:post:${slug}`;
}

function isBlogPostCollection(value: BlogPost[]) {
  return Array.isArray(value) && value.length > 0;
}

function isBlogCategoryCollection(value: BlogCategory[]) {
  return Array.isArray(value) && value.length > 0;
}

function isBlogPostRecord(value: BlogPost | undefined): value is BlogPost {
  return Boolean(value && typeof value.slug === "string");
}

function findFallbackBlogPost(slug: string) {
  return fallbackBlogPosts.find((post) => post.slug === slug);
}

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
  return getCachedPublicContent<BlogPost[]>(BLOG_POSTS_CACHE_KEY, getStaticFallback<BlogPost[]>("blog-posts") ?? fallbackBlogPosts);
}

export async function listPublicBlogPosts() {
  return fetchWithFallback<BlogPost[]>({
    cacheKey: BLOG_POSTS_CACHE_KEY,
    fallbackValue: getStaticFallback<BlogPost[]>("blog-posts") ?? fallbackBlogPosts,
    fetcher: fetchFreshPublicBlogPosts,
    ttlMs: BLOG_POSTS_TTL_MS,
    validate: isBlogPostCollection,
    warningLabel: "Using cached or default blog posts.",
  });
}

export async function listFeaturedPublicBlogPosts(limit: number = 3) {
  const posts = await listPublicBlogPosts();
  return posts.filter((post) => post.featuredOnHome).slice(0, limit);
}

export async function getPublicBlogPostBySlug(slug: string) {
  return fetchWithFallback<BlogPost>({
    cacheKey: blogPostCacheKey(slug),
    fallbackValue: findFallbackBlogPost(slug),
    fetcher: async () => {
      const response = await api.get<ApiBlogPost>(apiRoutes.public.blog.posts.bySlug(slug));
      return mapBlogPost(response.data);
    },
    ttlMs: BLOG_POST_TTL_MS,
    validate: isBlogPostRecord,
    warningLabel: `Using cached or default blog article content for "${slug}".`,
  });
}

export function getCachedPublicBlogPostBySlug(slug: string) {
  const cachedPost = getCachedPublicContent<BlogPost | undefined>(
    blogPostCacheKey(slug)
  );
  if (cachedPost) {
    return cachedPost;
  }

  const cachedPosts = getCachedPublicContent<BlogPost[]>(
    BLOG_POSTS_CACHE_KEY,
    getStaticFallback<BlogPost[]>("blog-posts") ?? fallbackBlogPosts
  );
  const cachedCollectionMatch = cachedPosts?.find((post) => post.slug === slug);

  return getCachedPublicContent<BlogPost | undefined>(
    blogPostCacheKey(slug),
    cachedCollectionMatch ?? findFallbackBlogPost(slug)
  );
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
    getStaticFallback<BlogCategory[]>("blog-categories") ?? fallbackBlogCategories
  );
}

export async function listPublicBlogCategories() {
  return fetchWithFallback<BlogCategory[]>({
    cacheKey: BLOG_CATEGORIES_CACHE_KEY,
    fallbackValue: getStaticFallback<BlogCategory[]>("blog-categories") ?? fallbackBlogCategories,
    fetcher: fetchFreshPublicBlogCategories,
    ttlMs: BLOG_CATEGORIES_TTL_MS,
    validate: isBlogCategoryCollection,
    warningLabel: "Using cached or default blog categories.",
  });
}
