import { useQuery } from "@tanstack/react-query";
import { getCachedPublicBlogPosts, listPublicBlogPosts } from "../services/blogService";

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog", "posts"],
    queryFn: listPublicBlogPosts,
    initialData: getCachedPublicBlogPosts,
  });
}
