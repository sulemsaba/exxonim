import { useQuery } from "@tanstack/react-query";
import {
  getCachedTestimonials,
  getTestimonials,
} from "../services/testimonialService";

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
    initialData: getCachedTestimonials,
    refetchOnMount: "always",
    refetchOnReconnect: "always",
    staleTime: 1000 * 60 * 60,
  });
}
