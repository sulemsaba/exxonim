import { useQuery } from "@tanstack/react-query";
import { getCachedPageBySlug, getPageBySlug } from "../services/pageService";

export function usePage<TContent = Record<string, unknown>>(slug: string) {
  return useQuery({
    queryKey: ["pages", slug],
    queryFn: () => getPageBySlug<TContent>(slug),
    initialData: () => getCachedPageBySlug<TContent>(slug),
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    staleTime: 1000 * 60 * 60,
  });
}
