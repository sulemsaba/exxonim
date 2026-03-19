import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { mapBlogPost } from "../utils/contentMappers";
import { getFeaturedPosts } from "./blogService";
import type { BlogPost } from "../types";
import type { ApiBlogPost } from "../types/api";

const DEBUG_MODE = import.meta.env.DEV;

interface HomeResponse {
  blogPosts: ApiBlogPost[];
}

async function fetchHomeData(): Promise<{ blogPosts: BlogPost[]; usedFallback: boolean }> {
  try {
    const response = await api.get<HomeResponse>("/home");
    
    if (response.data?.blogPosts?.length > 0) {
      if (DEBUG_MODE) {
        console.log("Home API: Returned", response.data.blogPosts.length, "blog posts");
      }
      return {
        blogPosts: response.data.blogPosts.map(mapBlogPost),
        usedFallback: false,
      };
    }

    // Home API returned empty, use fallback
    if (DEBUG_MODE) {
      console.warn("Home API: Returned empty blogPosts, using fallback");
    }
    
    const fallbackPosts = await getFeaturedPosts(3);
    return {
      blogPosts: fallbackPosts,
      usedFallback: true,
    };
  } catch (error) {
    if (DEBUG_MODE) {
      console.warn("Home API failed, using fallback:", error);
    }

    // Both home and fallback failed - return empty but don't error
    try {
      const fallbackPosts = await getFeaturedPosts(3);
      return {
        blogPosts: fallbackPosts,
        usedFallback: true,
      };
    } catch (fallbackError) {
      if (DEBUG_MODE) {
        console.error("Both home and fallback APIs failed:", fallbackError);
      }
      return {
        blogPosts: [],
        usedFallback: true,
      };
    }
  }
}

export function useHomeData() {
  return useQuery({
    queryKey: ["home"],
    queryFn: fetchHomeData,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 1,
  });
}
