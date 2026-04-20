import { useQuery } from "@tanstack/react-query";
import { getCachedSiteSetting, getSiteSetting } from "../services/siteSettingsService";

export function useSiteSetting<TValue = unknown>(key: string) {
  return useQuery({
    queryKey: ["site-settings", key],
    queryFn: () => getSiteSetting<TValue>(key),
    initialData: () => getCachedSiteSetting<TValue>(key),
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    retry: (failureCount, error) => {
      const status = (error as { response?: { status?: number } } | null)?.response?.status;
      if (status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });
}
