export function resolveApiBaseUrl(explicitBaseUrl?: string) {
  return explicitBaseUrl ?? "http://localhost:8000/api/v1";
}
