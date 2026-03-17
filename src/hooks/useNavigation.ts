import { useQuery } from "@tanstack/react-query";
import { getNavigation } from "../services/navigationService";

export function useNavigation() {
  return useQuery({
    queryKey: ["navigation"],
    queryFn: getNavigation,
  });
}
