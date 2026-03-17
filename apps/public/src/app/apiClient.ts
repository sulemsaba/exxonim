import { resolveApiBaseUrl } from "@exxonim/shared/api/baseUrl";
import { createHttpClient } from "@exxonim/shared/api/http";

const api = createHttpClient(
  resolveApiBaseUrl(import.meta.env.VITE_API_URL)
);

export default api;
