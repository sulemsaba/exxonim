import { useQuery } from "@tanstack/react-query";
import { getSiteSetting } from "../services/siteSettingsService";

export function useSiteSetting<TValue = unknown>(key: string) {
  return useQuery({
    queryKey: ["site-settings", key],
    queryFn: () => getSiteSetting<TValue>(key),
  });
}
