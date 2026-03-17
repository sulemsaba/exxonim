import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../services/blogService";

export function useBlogCategories() {
  return useQuery({
    queryKey: ["blog", "categories"],
    queryFn: getCategories,
  });
}
