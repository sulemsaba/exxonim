import type {
  BlogAuthor,
  BlogCategory,
  BlogPost,
  NavigationItem,
  PageRecord,
  PricingPlan,
  SiteSetting,
  Testimonial,
} from "../types";
import type {
  ApiBlogAuthor,
  ApiBlogCategory,
  ApiBlogPost,
  ApiNavigationItem,
  ApiPage,
  ApiPricingPlan,
  ApiSiteSetting,
  ApiTestimonial,
} from "../types/api";

function toDateOnly(value?: string | null) {
  if (!value) {
    return "";
  }

  return new Date(value).toISOString().slice(0, 10);
}

export function mapBlogAuthor(author?: ApiBlogAuthor | null): BlogAuthor | undefined {
  if (!author) {
    return undefined;
  }

  return {
    id: author.slug,
    name: author.name,
    role: author.role ?? undefined,
    avatarSrc: author.avatar_src ?? undefined,
  };
}

export function mapBlogCategory(
  category?: ApiBlogCategory | null
): BlogCategory | undefined {
  if (!category) {
    return undefined;
  }

  return {
    id: category.slug,
    label: category.name,
    description: category.description ?? undefined,
  };
}

export function mapBlogPost(post: ApiBlogPost): BlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    publishedAt: toDateOnly(post.published_at),
    category: mapBlogCategory(post.category),
    author: mapBlogAuthor(post.author),
    coverImageSrc: post.featured_image ?? undefined,
    coverAlt: post.cover_alt ?? undefined,
    mediaLabel: post.media_label ?? post.title,
    featuredSlot: post.featured_slot ?? undefined,
    featuredOnHome: post.featured_on_home,
    readTimeMinutes: post.read_time_minutes ?? undefined,
    relatedSlugs: post.related_slugs ?? [],
    metaTitle: post.meta_title ?? undefined,
    metaDescription: post.meta_description ?? undefined,
    content: post.content,
  };
}

export function mapPage<TContent>(page: ApiPage<TContent>): PageRecord<TContent> {
  return {
    id: page.id,
    title: page.title,
    slug: page.slug,
    content: page.content,
    metaTitle: page.meta_title ?? undefined,
    metaDescription: page.meta_description ?? undefined,
    isPublished: page.is_published,
    createdAt: page.created_at,
    updatedAt: page.updated_at,
  };
}

export function mapNavigationItem(item: ApiNavigationItem): NavigationItem {
  return {
    id: item.id,
    title: item.title,
    url: item.url,
    description: item.description ?? undefined,
    kind: item.kind,
    order: item.order,
    isActive: item.is_active,
    parentId: item.parent_id ?? null,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    children: item.children.map(mapNavigationItem),
  };
}

export function mapPricingPlan(plan: ApiPricingPlan): PricingPlan {
  return {
    id: plan.id,
    name: plan.name,
    badge: plan.badge ?? undefined,
    description: plan.description ?? "",
    notes: plan.notes ?? "",
    recommended: plan.recommended,
    features: plan.features ?? [],
  };
}

export function mapTestimonial(testimonial: ApiTestimonial): Testimonial {
  return {
    id: testimonial.id,
    eyebrow: testimonial.eyebrow ?? "",
    headline: testimonial.headline ?? "",
    support: testimonial.support ?? "",
    quote: testimonial.content,
    name: testimonial.author,
    role: testimonial.author_role ?? "",
    initials: testimonial.initials ?? "",
  };
}

export function mapSiteSetting<TValue>(
  setting: ApiSiteSetting<TValue>
): SiteSetting<TValue> {
  return {
    id: setting.id,
    key: setting.key,
    value: setting.value,
    createdAt: setting.created_at,
    updatedAt: setting.updated_at,
  };
}
