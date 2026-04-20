import { useQuery } from "@tanstack/react-query";
import {
  getCachedPricingPlans,
  getPricingPlans,
} from "../services/pricingService";

export function usePricingPlans() {
  return useQuery({
    queryKey: ["pricing", "plans"],
    queryFn: getPricingPlans,
    initialData: getCachedPricingPlans,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    staleTime: 1000 * 60 * 30,
  });
}
