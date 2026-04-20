import { useQuery } from "@tanstack/react-query";
import { getCachedNavigation, getNavigation } from "../services/navigationService";

export function useNavigation() {
  return useQuery({
    queryKey: ["navigation"],
    queryFn: getNavigation,
    initialData: getCachedNavigation,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
  });
}
