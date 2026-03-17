import { useQuery } from "@tanstack/react-query";
import { getPricingPlans } from "../services/pricingService";

export function usePricingPlans() {
  return useQuery({
    queryKey: ["pricing", "plans"],
    queryFn: getPricingPlans,
  });
}
