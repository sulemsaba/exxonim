import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import { mapBlogCategory, mapBlogPost } from "../utils/contentMappers";
import type { BlogCategory, BlogPost } from "../types";
import type {
  ApiBlogCategory,
  ApiBlogPost,
  ApiPublicBlogPostListParams,
  ApiPublicBlogPostListResponse,
} from "../types/api";

function mapPostsResponse(responseData: ApiPublicBlogPostListResponse | ApiBlogPost[]) {
  if (Array.isArray(responseData)) {
    return responseData.map(mapBlogPost);
  }

  return responseData.items.map(mapBlogPost);
}

export async function listPublicBlogPosts() {
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

export async function listFeaturedPublicBlogPosts(limit: number = 3) {
  const params: ApiPublicBlogPostListParams & {
    skip?: number;
    featured_on_home?: boolean;
  } = {
    featured: true,
    featured_on_home: true,
    page: 1,
    limit,
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

export async function getPublicBlogPostBySlug(slug: string) {
  const response = await api.get<ApiBlogPost>(apiRoutes.public.blog.posts.bySlug(slug));
  return mapBlogPost(response.data);
}

export async function listPublicBlogCategories() {
  const response = await api.get<ApiBlogCategory[]>(apiRoutes.public.blog.categories.list);
  return response.data.map(
    (category): BlogCategory => mapBlogCategory(category) as BlogCategory
  );
}
