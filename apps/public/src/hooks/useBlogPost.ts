import { useQuery } from "@tanstack/react-query";
import {
  getCachedPublicBlogPostBySlug,
  getPublicBlogPostBySlug,
} from "../services/blogService";

export function useBlogPost(slug: string | null) {
  return useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: () => getPublicBlogPostBySlug(slug as string),
    enabled: Boolean(slug),
    initialData: slug ? () => getCachedPublicBlogPostBySlug(slug) : undefined,
    staleTime: 1000 * 60 * 30,
    retry: (failureCount, error) => {
      const status = (error as { response?: { status?: number } } | null)?.response?.status;
      if (status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
