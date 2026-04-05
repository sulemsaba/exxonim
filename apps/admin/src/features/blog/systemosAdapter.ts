import type { AdminBlogPostPayload } from "../../services/adminBlogService";
import type { ApiBlogAuthor, ApiBlogCategory, ApiBlogPost, ApiBlogStatus } from "../../types/api";
import type { SystemOSPost, SystemOSPostStatus } from "../../systemos/types";
import { getBlogContentStatus } from "../../utils/admin";

function getContentSource(post: ApiBlogPost) {
  return post.content ?? {
    introduction: "",
    highlights: [],
    sections: [],
  };
}

function normalizeName(value?: string | null) {
  return (value ?? "").trim().toLowerCase();
}

function cleanSelectionValue(value?: string | null) {
  const normalizedValue = (value ?? "").trim();
  const blockedValues = new Set(["unassigned", "unknown author", "select category", "select author"]);

  return blockedValues.has(normalizedValue.toLowerCase()) ? "" : normalizedValue;
}

function parseReadTimeMinutes(readTime: string, fallback?: number | null) {
  const match = readTime.match(/(\d+)/);
  if (!match) {
    return fallback ?? null;
  }

  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? value : fallback ?? null;
}

function toIsoString(value?: string | null) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function createSystemOSContent(post: SystemOSPost, original?: ApiBlogPost) {
  const normalizedBody = post.body.trim();

  if (original && normalizedBody === composeBlogBody(original).trim()) {
    return getContentSource(original);
  }

  if (/<[a-z][\s\S]*>/i.test(normalizedBody)) {
    return {
      introduction: "",
      highlights: [],
      sections: [],
      html: normalizedBody,
    };
  }

  const blocks = normalizedBody
    ? normalizedBody
        .split(/\n\s*\n+/)
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const introduction = blocks[0] ?? "";
  const sectionParagraphs = blocks.slice(1);

  return {
    introduction,
    highlights: [],
    sections: sectionParagraphs.length
      ? [
          {
            heading: "Main Section",
            paragraphs: sectionParagraphs,
          },
        ]
      : [],
  };
}

export function composeBlogBody(post: ApiBlogPost) {
  const content = getContentSource(post);
  if (typeof content.html === "string" && content.html.trim().length > 0) {
    return content.html;
  }
  const parts = [
    content.introduction,
    ...(content.highlights ?? []),
    ...(content.sections ?? []).flatMap((section) => [
      section.heading,
      ...(section.paragraphs ?? []),
    ]),
  ].filter((value) => typeof value === "string" && value.trim().length > 0);

  return parts.join("\n\n");
}

export function estimateAdminBlogSeo(post: ApiBlogPost) {
  const content = getContentSource(post);
  let score = 42;

  if ((post.meta_title ?? "").trim().length >= 20) score += 16;
  if ((post.meta_description ?? "").trim().length >= 60) score += 16;
  if ((post.og_image_url ?? "").trim() || (post.featured_image ?? "").trim()) score += 10;
  if ((post.excerpt ?? "").trim().length >= 32) score += 8;
  if ((post.slug ?? "").trim().length >= 8 && !/--/.test(post.slug ?? "")) score += 8;
  if ((content.introduction ?? "").trim() || (content.sections ?? []).length > 0) score += 10;
  if (post.category?.name) score += 5;
  if (post.author?.name) score += 5;

  return Math.min(100, score);
}

export function getBlogReadLabel(post: ApiBlogPost) {
  return post.read_time_minutes ? `${post.read_time_minutes} min read` : "Not set";
}

export function getBlogWorkspaceStatus(
  post: Pick<ApiBlogPost, "status" | "is_published"> & { is_active?: boolean | null }
): SystemOSPostStatus {
  const status = getBlogContentStatus(post);
  return status === "archived" ? "archived" : status;
}

export function getBlogWorkspaceStatusClass(status: SystemOSPostStatus) {
  return status === "archived" ? "trash" : status;
}

export function toSystemOSPost(post: ApiBlogPost): SystemOSPost {
  const status = getBlogWorkspaceStatus(post);

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    category: cleanSelectionValue(post.category?.name),
    author: cleanSelectionValue(post.author?.name),
    featuredSlot: post.featured_slot ?? "",
    featuredOnHome: post.featured_on_home,
    status: status === "archived" ? "trash" : status,
    updated: post.updated_at,
    scheduledFor: status === "scheduled" ? post.published_at ?? "" : "",
    publishedAt: status === "published" ? post.published_at ?? post.updated_at : "",
    readTime: getBlogReadLabel(post),
    views: 0,
    excerpt: post.excerpt ?? "",
    cover: post.featured_image ?? post.og_image_url ?? "",
    body: composeBlogBody(post),
    note: "",
    metaTitle: post.meta_title ?? "",
    metaDescription: post.meta_description ?? "",
    seo: estimateAdminBlogSeo(post),
    revisionOf: post.revision_of_id ?? null,
    revisionState:
      post.revision_state === "ready_for_review" || post.revision_state === "working"
        ? post.revision_state
        : "",
    openRevisionId: post.open_revision_id ?? null,
    openRevisionState:
      post.open_revision_state === "ready_for_review" || post.open_revision_state === "working"
        ? post.open_revision_state
        : "",
  };
}

export function toAdminPayloadFromSystemOSPost(
  post: SystemOSPost,
  options: {
    categories: ApiBlogCategory[];
    authors: ApiBlogAuthor[];
    original?: ApiBlogPost | null;
  }
): AdminBlogPostPayload {
  const { categories, authors, original = null } = options;
  const matchedCategory =
    categories.find((item) => normalizeName(item.name) === normalizeName(cleanSelectionValue(post.category))) ?? null;
  const matchedAuthor =
    authors.find((item) => normalizeName(item.name) === normalizeName(cleanSelectionValue(post.author))) ?? null;
  const status: ApiBlogStatus =
    post.status === "trash"
      ? "archived"
      : post.status === "scheduled"
        ? "pending_review"
        : post.status;
  const publishedAt =
    status === "published"
      ? toIsoString(post.publishedAt) ?? original?.published_at ?? new Date().toISOString()
      : null;

  return {
    title: post.title.trim() || "Untitled post",
    slug: post.slug.trim(),
    excerpt: post.excerpt.trim() || null,
    content: createSystemOSContent(post, original ?? undefined),
    category_id: matchedCategory?.id ?? null,
    author_id: matchedAuthor?.id ?? null,
    featured_image: post.cover.trim() || (original?.featured_image ?? null),
    cover_alt: original?.cover_alt ?? null,
    media_label: original?.media_label ?? null,
    featured_slot: post.featuredSlot?.trim() || null,
    featured_on_home: Boolean(post.featuredOnHome),
    read_time_minutes: parseReadTimeMinutes(post.readTime, original?.read_time_minutes ?? null),
    related_slugs: original?.related_slugs ?? [],
    meta_title: post.metaTitle.trim() || null,
    meta_description: post.metaDescription.trim() || null,
    og_image_url: original?.og_image_url ?? (post.cover.trim() || null),
    published_at: publishedAt,
    status,
  };
}
