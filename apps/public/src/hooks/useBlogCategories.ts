import { useQuery } from "@tanstack/react-query";
import {
  getCachedPublicBlogCategories,
  listPublicBlogCategories,
} from "../services/blogService";

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog", "categories"],
    queryFn: listPublicBlogCategories,
    initialData: getCachedPublicBlogCategories,
  });
}
