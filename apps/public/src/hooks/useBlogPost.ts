import { useQuery } from "@tanstack/react-query";
import { getPublicBlogPostBySlug } from "../services/blogService";

export function useBlogPost(slug: string | null) {
  return useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: () => getPublicBlogPostBySlug(slug as string),
    enabled: Boolean(slug),
  });
}
