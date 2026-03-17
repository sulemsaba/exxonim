import { useQuery } from "@tanstack/react-query";
import { getPostBySlug } from "../services/blogService";

export function useBlogPost(slug: string | null) {
  return useQuery({
    queryKey: ["blog", "post", slug],
    queryFn: () => getPostBySlug(slug as string),
    enabled: Boolean(slug),
  });
}
