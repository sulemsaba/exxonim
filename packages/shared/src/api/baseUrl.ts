export function resolveApiBaseUrl(explicitBaseUrl?: string) {
  if (explicitBaseUrl) {
    return explicitBaseUrl;
  }

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:8000/api/v1`;
  }

  return "http://127.0.0.1:8000/api/v1";
}
