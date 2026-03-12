export type Theme = "light" | "dark";
export type BlogCategoryId =
  | "registration"
  | "tax-compliance"
  | "licensing-permits"
  | "institutional-support"
  | "business-support";
export type BlogFeaturedSlot = "hero" | "popular" | "editors-pick";

export interface BrandAssets {
  name: string;
  lightLogoSrc: string;
  darkLogoSrc: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface ServiceNavGroup {
  title: string;
  summary: string;
  href: string;
  items: string[];
}

export interface StackItem {
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  windowTitle: string;
  windowTag: string;
  videoSrc: string;
}

export interface BlogCategory {
  id: BlogCategoryId;
  label: string;
  description: string;
}

export interface BlogAuthor {
  id: string;
  name: string;
  role?: string;
  avatarSrc?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  categoryId: BlogCategoryId;
  authorId: string;
  coverImageSrc?: string;
  coverAlt?: string;
  mediaLabel: string;
  featuredSlot?: BlogFeaturedSlot;
  featuredOnHome?: boolean;
  readTimeMinutes?: number;
  relatedSlugs?: string[];
}

export interface InsightPost {
  tag: string;
  title: string;
  description: string;
  mediaLabel: string;
}

export interface FooterLinkGroup {
  title: string;
  links: NavLink[];
}
