import axios from "axios";
import type { ApiAdminRole, ApiContentStatus } from "../types/api";

type ContentLikeStatus = ApiContentStatus;

export type AdminStatusTone =
  | "published"
  | "draft"
  | "danger"
  | "active"
  | "inactive"
  | "warning";

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

    if (detail && typeof detail === "object") {
      const message =
        "message" in detail && typeof detail.message === "string"
          ? detail.message
          : null;
      const issues =
        "issues" in detail && Array.isArray(detail.issues)
          ? detail.issues.filter((item: unknown): item is string => typeof item === "string")
          : [];

      if (message && issues.length) {
        return `${message} ${issues.join(" ")}`;
      }

      if (message) {
        return message;
      }

      if (issues.length) {
        return issues.join(" ");
      }
    }

    if (Array.isArray(detail)) {
      const messages = detail
        .map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const message =
            "msg" in item && typeof item.msg === "string" ? item.msg : null;
          const rawLocation = "loc" in item ? item.loc : null;
          const location =
            Array.isArray(rawLocation)
              ? rawLocation
                  .filter(
                    (part: unknown): part is string | number =>
                      typeof part === "string" || typeof part === "number"
                  )
                  .join(".")
              : null;

          if (location && message) {
            return `${location}: ${message}`;
          }

          return message;
        })
        .filter((value): value is string => Boolean(value));

      if (messages.length) {
        return messages.join(" ");
      }
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

export function getContentStatus(value: {
  status?: ApiContentStatus | null;
  is_published?: boolean | null;
  is_active?: boolean | null;
}): ApiContentStatus;
export function getContentStatus(value: {
  status?: ContentLikeStatus | null;
  is_published?: boolean | null;
  is_active?: boolean | null;
}): ContentLikeStatus;
export function getContentStatus(value: {
  status?: string | null;
  is_published?: boolean | null;
  is_active?: boolean | null;
}): ContentLikeStatus {
  if (value.status) {
    return value.status as ContentLikeStatus;
  }

  if (typeof value.is_published === "boolean") {
    return value.is_published ? "published" : "draft";
  }

  if (typeof value.is_active === "boolean") {
    return value.is_active ? "published" : "archived";
  }

  return "draft" as const;
}

export function getBlogContentStatus(value: {
  status?: ContentLikeStatus | null;
  is_published?: boolean | null;
  is_active?: boolean | null;
}): ContentLikeStatus {
  return getContentStatus(value);
}

export function getAdminStatusTone(status?: string | null): AdminStatusTone {
  switch (status) {
    case "published":
    case "active":
    case "completed":
    case "open":
      return "published";
    case "pending_review":
    case "pending":
    case "contacted":
    case "warning":
      return "warning";
    case "rejected":
    case "archived":
    case "cancelled":
    case "inactive":
    case "closed":
      return "danger";
    default:
      return "draft";
  }
}

export function formatAdminRole(role?: ApiAdminRole | string | null) {
  if (!role) {
    return "Administrator";
  }

  if (role === "superuser") {
    return "Superuser";
  }

  if (role === "administrator" || role === "admin") {
    return "Administrator";
  }

  if (role === "editor") {
    return "Editor";
  }

  if (role === "reviewer") {
    return "Reviewer";
  }

  if (role === "viewer") {
    return "Viewer";
  }

  if (role === "author") {
    return "Author";
  }

  return "Administrator";
}

export function getAdminLabel(email?: string | null, fullName?: string | null) {
  if (fullName?.trim()) {
    return fullName.trim();
  }

  if (email?.trim()) {
    return email.trim();
  }

  return "Admin User";
}

export function getAdminInitials(email?: string | null, fullName?: string | null) {
  const source = fullName?.trim() || email?.split("@")[0] || "AU";
  const parts = source.split(/[.\s_-]+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

export function normalizeHexColor(value: string | null | undefined, fallback: string) {
  const normalizedValue = value?.trim() ?? "";
  const normalizedFallback = fallback.trim();
  const fallbackMatch = normalizedFallback.match(/^#?([a-f0-9]{3}|[a-f0-9]{6})$/i);

  const fallbackColor = fallbackMatch
    ? `#${fallbackMatch[1].length === 3
        ? fallbackMatch[1]
            .split("")
            .map((part) => `${part}${part}`)
            .join("")
        : fallbackMatch[1].toLowerCase()}`
    : "#0f5c63";
  const match = normalizedValue.match(/^#?([a-f0-9]{3}|[a-f0-9]{6})$/i);

  if (!match) {
    return fallbackColor;
  }

  const hexValue =
    match[1].length === 3
      ? match[1]
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : match[1];

  return `#${hexValue.toLowerCase()}`;
}

export function getReadableForegroundColor(
  backgroundColor: string,
  lightColor = "#f7fbfb",
  darkColor = "#08181b"
) {
  const normalizedColor = normalizeHexColor(backgroundColor, "#0f5c63").slice(1);
  const red = parseInt(normalizedColor.slice(0, 2), 16);
  const green = parseInt(normalizedColor.slice(2, 4), 16);
  const blue = parseInt(normalizedColor.slice(4, 6), 16);
  const luminance = (red * 0.299 + green * 0.587 + blue * 0.114) / 255;

  return luminance > 0.64 ? darkColor : lightColor;
}

export function isContentPublished(value: {
  status?: ApiContentStatus | null;
  is_published?: boolean | null;
  is_active?: boolean | null;
}) {
  return getContentStatus(value) === "published";
}

export function statusToPublishedFlag(status: ApiContentStatus) {
  return status === "published";
}

export function statusToActiveFlag(status: ApiContentStatus) {
  return status === "published";
}

export function normalizeContentRecord<
  TValue extends {
    status?: ApiContentStatus | null;
    is_published?: boolean | null;
    is_active?: boolean | null;
  },
>(value: TValue): TValue & { status: ApiContentStatus } {
  return {
    ...value,
    status: getContentStatus(value),
  };
}

export function normalizeBlogContentRecord<
  TValue extends {
    status?: ContentLikeStatus | null;
    is_published?: boolean | null;
    is_active?: boolean | null;
  },
>(value: TValue): TValue & { status: ContentLikeStatus } {
  return {
    ...value,
    status: getBlogContentStatus(value),
  };
}

export function formatWorkflowStatusLabel(status?: string | null) {
  switch (status) {
    case "pending_review":
      return "Pending Review";
    case "rejected":
      return "Rejected";
    case "archived":
      return "Archived";
    case "published":
      return "Published";
    case "draft":
      return "Draft";
    default:
      return status || "Draft";
  }
}
