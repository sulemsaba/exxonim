import axios from "axios";

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function prettyJson(value: unknown) {
  return JSON.stringify(value, null, 2);
}

export function parseJsonValue<T = unknown>(value: string): T {
  return JSON.parse(value) as T;
}

export function tryParseJsonValue<T = unknown>(value: string): T | undefined {
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

export function getAdminErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Try again."
) {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") {
      return detail;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function toDatetimeLocalValue(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const pad = (part: number) => String(part).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDatetimeLocalValue(value?: string) {
  if (!value) {
    return null;
  }

  return new Date(value).toISOString();
}

export function flattenNavigationItems<T extends { id: number; title: string; children: T[] }>(
  items: T[],
  depth = 0
): Array<T & { depth: number }> {
  return items.flatMap((item) => [
    { ...item, depth },
    ...flattenNavigationItems(item.children, depth + 1),
  ]);
}
