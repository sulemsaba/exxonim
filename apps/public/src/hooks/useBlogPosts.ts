import { useQuery } from "@tanstack/react-query";
import { getPosts } from "../services/blogService";

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog", "posts"],
    queryFn: getPosts,
  });
}
