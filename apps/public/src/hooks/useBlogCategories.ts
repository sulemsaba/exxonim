import { useQuery } from "@tanstack/react-query";
import { listPublicBlogCategories } from "../services/blogService";

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog", "categories"],
    queryFn: listPublicBlogCategories,
  });
}
