import { z } from "zod";
import type {
  ApiBlogAuthor,
  ApiBlogCategory,
  ApiBlogPost,
  ApiContentStatus,
} from "../types/api";
import { resourcePost } from "../routes";
import type { AdminBlogPostPayload } from "../services/adminBlogService";
import { fromDatetimeLocalValue, getContentStatus, toDatetimeLocalValue } from "./admin";

export const contentStatusSchema = z.enum(["draft", "published", "archived"]);

const highlightFieldSchema = z.object({
  value: z.string(),
});

const paragraphFieldSchema = z.object({
  value: z.string(),
});

const sectionFieldSchema = z.object({
  heading: z.string(),
  paragraphs: z.array(paragraphFieldSchema),
});

export const blogEditorSchema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  slug: z.string().trim().min(1, "Slug is required."),
  excerpt: z.string(),
  introduction: z.string(),
  highlights: z.array(highlightFieldSchema),
  sections: z.array(sectionFieldSchema),
  category_id: z.string(),
  author_id: z.string(),
  featured_image: z.string(),
  cover_alt: z.string(),
  media_label: z.string(),
  featured_slot: z.string(),
  featured_on_home: z.boolean(),
  read_time_override: z
    .string()
    .refine((value) => !value.trim() || /^[1-9]\d*$/.test(value.trim()), {
      message: "Read time must be a positive integer.",
    }),
  related_slugs: z.array(z.string()),
  meta_title: z.string(),
  meta_description: z.string(),
  og_image_url: z.string(),
  published_at: z.string(),
  status: contentStatusSchema,
});

export type BlogEditorFormValues = z.infer<typeof blogEditorSchema>;
export type BlogEditorSubmitIntent = "respect-status" | "draft" | "publish";

export interface BlogChecklistItem {
  key:
    | "title"
    | "slug"
    | "excerpt"
    | "introduction"
    | "sections"
    | "category"
    | "author"
    | "cover_alt"
    | "empty_rows";
  label: string;
  complete: boolean;
  required_on_publish: boolean;
  detail: string;
}

export interface BlogValidationChecklist {
  items: BlogChecklistItem[];
  can_publish: boolean;
  auto_read_time_minutes: number | null;
  resolved_read_time_minutes: number | null;
  has_custom_read_time: boolean;
}

export interface BlogPreviewData {
  title: string;
  excerpt: string;
  introduction: string;
  highlights: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  category_label?: string | null;
  author:
    | {
        name: string;
        role?: string | null;
        bio?: string | null;
      }
    | null;
  cover_image?: string | null;
  cover_alt?: string | null;
  media_label?: string | null;
  permalink: string;
  published_label: string;
  read_time_minutes: number | null;
  related_posts: Array<{
    slug: string;
    href: string;
    title: string;
    excerpt?: string | null;
    category_label?: string | null;
  }>;
}

type NormalizedContent = {
  introduction: string;
  highlights: string[];
  sections: Array<{
    heading: string;
    paragraphs: string[];
  }>;
};

export function createEmptyHighlight() {
  return { value: "" };
}

export function createEmptyParagraph() {
  return { value: "" };
}

export function createEmptySection() {
  return {
    heading: "",
    paragraphs: [createEmptyParagraph()],
  };
}

export function createDefaultBlogEditorValues(): BlogEditorFormValues {
  return {
    title: "",
    slug: "",
    excerpt: "",
    introduction: "",
    highlights: [],
    sections: [],
    category_id: "",
    author_id: "",
    featured_image: "",
    cover_alt: "",
    media_label: "",
    featured_slot: "",
    featured_on_home: false,
    read_time_override: "",
    related_slugs: [],
    meta_title: "",
    meta_description: "",
    og_image_url: "",
    published_at: "",
    status: "draft",
  };
}

export function postToBlogEditorValues(post: ApiBlogPost): BlogEditorFormValues {
  const content = normalizeContent(post.content);
  const computedReadTime = calculateReadTimeMinutes(content);
  const storedReadTime = post.read_time_minutes ?? null;
  const readTimeOverride =
    storedReadTime && storedReadTime !== computedReadTime ? String(storedReadTime) : "";

  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    introduction: content.introduction,
    highlights: content.highlights.map((value) => ({ value })),
    sections: content.sections.map((section) => ({
      heading: section.heading,
      paragraphs:
        section.paragraphs.length > 0
          ? section.paragraphs.map((value) => ({ value }))
          : [createEmptyParagraph()],
    })),
    category_id: post.category?.id ? String(post.category.id) : "",
    author_id: post.author?.id ? String(post.author.id) : "",
    featured_image: post.featured_image ?? "",
    cover_alt: post.cover_alt ?? "",
    media_label: post.media_label ?? "",
    featured_slot: post.featured_slot ?? "",
    featured_on_home: post.featured_on_home,
    read_time_override: readTimeOverride,
    related_slugs: post.related_slugs ?? [],
    meta_title: post.meta_title ?? "",
    meta_description: post.meta_description ?? "",
    og_image_url: post.og_image_url ?? "",
    published_at: toDatetimeLocalValue(post.published_at),
    status: getContentStatus(post),
  };
}

export function calculateReadTimeMinutes(
  value: Pick<BlogEditorFormValues, "introduction" | "highlights" | "sections"> | NormalizedContent
) {
  const content = isNormalizedContent(value) ? value : normalizeContent(value);
  const source = [
    content.introduction,
    ...content.highlights,
    ...content.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
  ]
    .join(" ")
    .trim();
  const wordCount = source ? source.split(/\s+/).filter(Boolean).length : 0;

  if (wordCount === 0) {
    return null;
  }

  return Math.max(1, Math.ceil(wordCount / 220));
}

export function getResolvedReadTimeMinutes(values: BlogEditorFormValues) {
  const override = values.read_time_override.trim();
  if (override) {
    return Number(override);
  }

  return calculateReadTimeMinutes(values);
}

export function resolveSubmitStatus(
  currentStatus: ApiContentStatus,
  intent: BlogEditorSubmitIntent
): ApiContentStatus {
  if (intent === "draft") {
    return "draft";
  }

  if (intent === "publish") {
    return "published";
  }

  return currentStatus;
}

export function buildBlogValidationChecklist(values: BlogEditorFormValues): BlogValidationChecklist {
  const content = normalizeContent(values);
  const resolvedReadTimeMinutes = getResolvedReadTimeMinutes(values);
  const autoReadTimeMinutes = calculateReadTimeMinutes(values);
  const hasCustomReadTime = Boolean(values.read_time_override.trim());
  const rawSections = values.sections ?? [];
  const hasIncompleteSection = rawSections.some((section) => {
    const heading = section.heading.trim();
    const paragraphCount = (section.paragraphs ?? []).filter((paragraph) => paragraph.value.trim()).length;
    const touched = heading.length > 0 || (section.paragraphs ?? []).some((paragraph) => paragraph.value.trim());

    return touched && (!heading || paragraphCount === 0);
  });
  const hasEmptyRows =
    values.highlights.some((highlight) => !highlight.value.trim()) ||
    rawSections.some((section) =>
      (section.paragraphs ?? []).some((paragraph) => !paragraph.value.trim())
    );

  const items: BlogChecklistItem[] = [
    {
      key: "title",
      label: "Title is ready",
      complete: Boolean(values.title.trim()),
      required_on_publish: true,
      detail: "Give the article a clear editorial headline.",
    },
    {
      key: "slug",
      label: "Permalink is set",
      complete: Boolean(values.slug.trim()),
      required_on_publish: true,
      detail: "Slug should be set before publishing.",
    },
    {
      key: "excerpt",
      label: "Excerpt is written",
      complete: Boolean(values.excerpt.trim()),
      required_on_publish: true,
      detail: "Resource cards and SEO depend on a strong excerpt.",
    },
    {
      key: "introduction",
      label: "Introduction is written",
      complete: Boolean(content.introduction),
      required_on_publish: true,
      detail: "Lead with a concise summary before the detailed sections.",
    },
    {
      key: "sections",
      label: "Article sections are complete",
      complete: content.sections.length > 0 && !hasIncompleteSection,
      required_on_publish: true,
      detail: "Each section needs a heading and at least one paragraph.",
    },
    {
      key: "category",
      label: "Category is assigned",
      complete: Boolean(values.category_id),
      required_on_publish: true,
      detail: "Pick the category readers should discover this post under.",
    },
    {
      key: "author",
      label: "Author is assigned",
      complete: Boolean(values.author_id),
      required_on_publish: true,
      detail: "Published posts must show a real author.",
    },
    {
      key: "cover_alt",
      label: "Cover image alt text is present",
      complete: !values.featured_image.trim() || Boolean(values.cover_alt.trim()),
      required_on_publish: true,
      detail: "Required only when a cover image is attached.",
    },
    {
      key: "empty_rows",
      label: "No empty highlight or paragraph rows remain",
      complete: !hasEmptyRows,
      required_on_publish: true,
      detail: "Clean up placeholder rows before publishing.",
    },
  ];

  return {
    items,
    can_publish: items.every((item) => !item.required_on_publish || item.complete),
    auto_read_time_minutes: autoReadTimeMinutes,
    resolved_read_time_minutes: resolvedReadTimeMinutes,
    has_custom_read_time: hasCustomReadTime,
  };
}

export function toBlogPostPayload(
  values: BlogEditorFormValues,
  intent: BlogEditorSubmitIntent
): AdminBlogPostPayload {
  const status = resolveSubmitStatus(values.status, intent);
  const content = normalizeContent(values);
  const publishedAt =
    status === "published" && !values.published_at
      ? new Date().toISOString()
      : fromDatetimeLocalValue(values.published_at);

  return {
    title: values.title.trim(),
    slug: values.slug.trim(),
    excerpt: values.excerpt.trim() || null,
    content,
    category_id: values.category_id ? Number(values.category_id) : null,
    author_id: values.author_id ? Number(values.author_id) : null,
    featured_image: values.featured_image.trim() || null,
    cover_alt: values.cover_alt.trim() || null,
    media_label: values.media_label.trim() || null,
    featured_slot:
      values.featured_on_home && values.featured_slot.trim()
        ? values.featured_slot.trim()
        : null,
    featured_on_home: values.featured_on_home,
    read_time_minutes: getResolvedReadTimeMinutes(values),
    related_slugs: Array.from(
      new Set(values.related_slugs.map((slug) => slug.trim()).filter(Boolean))
    ),
    meta_title: values.meta_title.trim() || null,
    meta_description: values.meta_description.trim() || null,
    og_image_url: values.og_image_url.trim() || null,
    published_at: publishedAt,
    status,
  };
}

export function buildBlogPreviewData(
  values: BlogEditorFormValues,
  options: {
    authors: ApiBlogAuthor[];
    categories: ApiBlogCategory[];
    posts: ApiBlogPost[];
    currentPostId?: number;
  }
): BlogPreviewData {
  const content = normalizeContent(values);
  const selectedAuthor = options.authors.find((author) => String(author.id) === values.author_id) ?? null;
  const selectedCategory =
    options.categories.find((category) => String(category.id) === values.category_id) ?? null;
  const relatedPosts = options.posts
    .filter((post) => post.id !== options.currentPostId)
    .filter((post) => values.related_slugs.includes(post.slug))
    .map((post) => ({
      slug: post.slug,
      href: resourcePost(post.slug),
      title: post.title,
      excerpt: post.excerpt ?? "",
      category_label: post.category?.name ?? null,
    }));
  const permalink = resourcePost(values.slug.trim() || "untitled-post");

  return {
    title: values.title.trim() || "Untitled draft",
    excerpt: values.excerpt.trim(),
    introduction: content.introduction,
    highlights: content.highlights,
    sections: content.sections,
    category_label: selectedCategory?.name ?? null,
    author: selectedAuthor
      ? {
          name: selectedAuthor.name,
          role: selectedAuthor.role ?? null,
          bio: selectedAuthor.bio ?? null,
        }
      : null,
    cover_image: values.featured_image.trim() || null,
    cover_alt: values.cover_alt.trim() || null,
    media_label: values.media_label.trim() || null,
    permalink,
    published_label: values.published_at
      ? new Date(fromDatetimeLocalValue(values.published_at) ?? values.published_at).toLocaleString()
      : values.status === "published"
        ? "Will be set on publish"
        : "Draft preview",
    read_time_minutes: getResolvedReadTimeMinutes(values),
    related_posts: relatedPosts,
  };
}

function normalizeContent(
  value:
    | Pick<BlogEditorFormValues, "introduction" | "highlights" | "sections">
    | ApiBlogPost["content"]
    | undefined
): NormalizedContent {
  const introduction = (value?.introduction ?? "").trim();
  const highlights = ((value?.highlights ?? []) as Array<string | { value: string }>)
    .map((highlight) => (typeof highlight === "string" ? highlight : highlight.value))
    .map((highlight) => highlight.trim())
    .filter(Boolean);
  const sections = ((value?.sections ?? []) as Array<
    | { heading: string; paragraphs: string[] }
    | { heading: string; paragraphs: Array<{ value: string }> }
  >)
    .map((section) => ({
      heading: section.heading.trim(),
      paragraphs: section.paragraphs
        .map((paragraph) => (typeof paragraph === "string" ? paragraph : paragraph.value))
        .map((paragraph) => paragraph.trim())
        .filter(Boolean),
    }))
    .filter((section) => section.heading || section.paragraphs.length > 0);

  return {
    introduction,
    highlights,
    sections,
  };
}

function isNormalizedContent(
  value: Pick<BlogEditorFormValues, "introduction" | "highlights" | "sections"> | NormalizedContent
): value is NormalizedContent {
  return value.highlights.every((highlight) => typeof highlight === "string");
}
