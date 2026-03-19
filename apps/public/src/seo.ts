import {
  getResourcePostSlug,
  normalizePathname,
  resourcePost,
  routes,
} from "./routes";
import type { BlogPost, PageRecord } from "./types";

export interface PageSeo {
  title: string;
  description: string;
  canonicalPath: string;
  image: string;
  type: "website" | "article";
  robots: string;
  canonicalBaseUrl?: string;
}

export const siteOrigin = "https://exxonim.tz";
const fallbackImagePath = "/exxonim-logo.webp";

function buildAbsoluteUrl(path: string, baseUrl: string = siteOrigin) {
  return new URL(path, baseUrl).toString();
}

function toCanonicalPath(pathname: string | undefined) {
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedPathname === normalizePathname(routes.home)) {
    return routes.home;
  }

  if (normalizedPathname === normalizePathname(routes.notFound)) {
    return routes.notFound;
  }

  return `${normalizedPathname}/`;
}

function escapeHtmlAttribute(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function ensureMetaTag(selector: string, setup: (meta: HTMLMetaElement) => void) {
  let meta = document.querySelector(selector) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    setup(meta);
    document.head.appendChild(meta);
  }

  return meta;
}

function ensureLinkTag(selector: string, setup: (link: HTMLLinkElement) => void) {
  let link = document.querySelector(selector) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    setup(link);
    document.head.appendChild(link);
  }

  return link;
}

export function createFallbackSeo(
  pathname: string | undefined,
  options: {
    canonicalBaseUrl?: string;
    image?: string;
    robots?: string;
    title?: string;
    description?: string;
    type?: "website" | "article";
  } = {}
): PageSeo {
  const normalizedPathname = normalizePathname(pathname);
  const canonicalBaseUrl = options.canonicalBaseUrl ?? siteOrigin;

  return {
    title: options.title ?? "Content unavailable",
    description:
      options.description ?? "This content is temporarily unavailable.",
    canonicalPath: toCanonicalPath(normalizedPathname),
    image:
      options.image ?? buildAbsoluteUrl(fallbackImagePath, canonicalBaseUrl),
    type:
      options.type ?? (getResourcePostSlug(normalizedPathname) ? "article" : "website"),
    robots: options.robots ?? "noindex,follow",
    canonicalBaseUrl,
  };
}

export function createPageSeo<TContent>(
  page: PageRecord<TContent>,
  options: {
    canonicalPath: string;
    canonicalBaseUrl?: string;
    defaultDescription?: string;
    defaultImage?: string;
    robots?: string;
  }
): PageSeo {
  const canonicalBaseUrl = options.canonicalBaseUrl ?? siteOrigin;

  return {
    title: page.metaTitle ?? page.title,
    description: page.metaDescription ?? options.defaultDescription ?? page.title,
    canonicalPath: options.canonicalPath,
    image:
      page.ogImageUrl ??
      options.defaultImage ??
      buildAbsoluteUrl(fallbackImagePath, canonicalBaseUrl),
    type: "website",
    robots: options.robots ?? "index,follow",
    canonicalBaseUrl,
  };
}

export function createBlogPostSeo(
  post: BlogPost,
  options: {
    canonicalBaseUrl?: string;
    defaultDescription?: string;
    defaultImage?: string;
    robots?: string;
  } = {}
): PageSeo {
  const canonicalBaseUrl = options.canonicalBaseUrl ?? siteOrigin;

  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? options.defaultDescription ?? post.title,
    canonicalPath: resourcePost(post.slug),
    image:
      post.coverImageSrc ??
      options.defaultImage ??
      buildAbsoluteUrl(fallbackImagePath, canonicalBaseUrl),
    type: "article",
    robots: options.robots ?? "index,follow",
    canonicalBaseUrl,
  };
}

export function applyResolvedSeo(seo: PageSeo) {
  const canonicalUrl = buildAbsoluteUrl(
    seo.canonicalPath,
    seo.canonicalBaseUrl ?? siteOrigin
  );

  document.title = seo.title;

  const metaDescription = ensureMetaTag(
    'meta[name="description"]',
    (meta) => {
      meta.name = "description";
      meta.setAttribute("data-exxonim", "description");
    }
  );
  metaDescription.content = seo.description;

  const robotsMeta = ensureMetaTag('meta[name="robots"]', (meta) => {
    meta.name = "robots";
    meta.setAttribute("data-exxonim", "robots");
  });
  robotsMeta.content = seo.robots;

  const ogTitle = ensureMetaTag('meta[property="og:title"]', (meta) => {
    meta.setAttribute("property", "og:title");
    meta.setAttribute("data-exxonim", "og:title");
  });
  ogTitle.content = seo.title;

  const ogDescription = ensureMetaTag(
    'meta[property="og:description"]',
    (meta) => {
      meta.setAttribute("property", "og:description");
      meta.setAttribute("data-exxonim", "og:description");
    }
  );
  ogDescription.content = seo.description;

  const ogType = ensureMetaTag('meta[property="og:type"]', (meta) => {
    meta.setAttribute("property", "og:type");
    meta.setAttribute("data-exxonim", "og:type");
  });
  ogType.content = seo.type;

  const ogUrl = ensureMetaTag('meta[property="og:url"]', (meta) => {
    meta.setAttribute("property", "og:url");
    meta.setAttribute("data-exxonim", "og:url");
  });
  ogUrl.content = canonicalUrl;

  const ogImage = ensureMetaTag('meta[property="og:image"]', (meta) => {
    meta.setAttribute("property", "og:image");
    meta.setAttribute("data-exxonim", "og:image");
  });
  ogImage.content = seo.image;

  const twitterCard = ensureMetaTag('meta[name="twitter:card"]', (meta) => {
    meta.name = "twitter:card";
    meta.setAttribute("data-exxonim", "twitter:card");
  });
  twitterCard.content = "summary_large_image";

  const twitterTitle = ensureMetaTag('meta[name="twitter:title"]', (meta) => {
    meta.name = "twitter:title";
    meta.setAttribute("data-exxonim", "twitter:title");
  });
  twitterTitle.content = seo.title;

  const twitterDescription = ensureMetaTag(
    'meta[name="twitter:description"]',
    (meta) => {
      meta.name = "twitter:description";
      meta.setAttribute("data-exxonim", "twitter:description");
    }
  );
  twitterDescription.content = seo.description;

  const twitterImage = ensureMetaTag('meta[name="twitter:image"]', (meta) => {
    meta.name = "twitter:image";
    meta.setAttribute("data-exxonim", "twitter:image");
  });
  twitterImage.content = seo.image;

  const canonicalLink = ensureLinkTag(
    'link[rel="canonical"][data-exxonim="canonical"]',
    (link) => {
      link.rel = "canonical";
      link.setAttribute("data-exxonim", "canonical");
    }
  );
  canonicalLink.href = canonicalUrl;
}

export function escapeSeoValue(value: string) {
  return escapeHtmlAttribute(value);
}
