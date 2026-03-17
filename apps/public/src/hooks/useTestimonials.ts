import { useQuery } from "@tanstack/react-query";
import { getTestimonials } from "../services/testimonialService";

export function useTestimonials() {
  return useQuery({
    queryKey: ["testimonials"],
    queryFn: getTestimonials,
  });
}
