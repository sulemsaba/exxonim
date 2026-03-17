import { useQuery } from "@tanstack/react-query";
import { getPageBySlug } from "../services/pageService";

export function usePage<TContent = Record<string, unknown>>(slug: string) {
  return useQuery({
    queryKey: ["pages", slug],
    queryFn: () => getPageBySlug<TContent>(slug),
  });
}
