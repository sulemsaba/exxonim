import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import { mapTestimonial } from "../utils/contentMappers";
import type { Testimonial } from "../types";
import type { ApiTestimonial } from "../types/api";

export async function getTestimonials() {
  const response = await api.get<ApiTestimonial[]>(apiRoutes.public.testimonials);
  return response.data.map(mapTestimonial) as Testimonial[];
}
