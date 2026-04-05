import type { SiteSettingSeoDefaultsValue } from "../types/api";
import {
  fetchFreshPublicBlogPosts,
  getPublicBlogPostBySlug,
  listPublicBlogPosts,
} from "../services/blogService";
import { getPageBySlug } from "../services/pageService";
import { getSiteSetting } from "../services/siteSettingsService";
import {
  createBlogPostSeo,
  createFallbackSeo,
  createPageSeo,
  siteOrigin,
  type PageSeo,
} from "../seo";
import {
  getResourcePostSlug,
  normalizePathname,
  resourcePost,
  routes,
} from "../routes";

const pageSlugByRoute: Record<string, string> = {
  [normalizePathname(routes.home)]: "home",
  [normalizePathname(routes.about)]: "about",
  [normalizePathname(routes.faq)]: "faq",
  [normalizePathname(routes.services)]: "services",
  [normalizePathname(routes.resources)]: "resources",
  [normalizePathname(routes.career)]: "career",
  [normalizePathname(routes.contact)]: "contact",
  [normalizePathname(routes.support)]: "support",
  [normalizePathname(routes.terms)]: "terms",
  [normalizePathname(routes.privacy)]: "privacy",
};

function toRobots(value?: SiteSettingSeoDefaultsValue | null) {
  return value
    ? `${value.robotsIndex ? "index" : "noindex"},${value.robotsFollow ? "follow" : "nofollow"}`
    : "index,follow";
}

function toCanonicalBaseUrl(value?: SiteSettingSeoDefaultsValue | null) {
  return value?.canonicalBaseUrl ?? siteOrigin;
}

function toDefaultImage(value?: SiteSettingSeoDefaultsValue | null) {
  if (value?.defaultShareImageUrl) {
    return value.defaultShareImageUrl;
  }

  return new URL("/exxonim-logo.webp", toCanonicalBaseUrl(value)).toString();
}

async function getSeoDefaults() {
  try {
    const setting = await getSiteSetting<SiteSettingSeoDefaultsValue>("seo_defaults");
    return setting.value;
  } catch {
    return null;
  }
}

export async function resolveServerSeo(pathname: string | undefined): Promise<PageSeo> {
  const normalizedPathname = normalizePathname(pathname);
  const seoDefaults = await getSeoDefaults();
  const canonicalBaseUrl = toCanonicalBaseUrl(seoDefaults);
  const defaultImage = toDefaultImage(seoDefaults);
  const robots = toRobots(seoDefaults);
  const articleSlug = getResourcePostSlug(normalizedPathname);

  if (articleSlug) {
    try {
      const post = await getPublicBlogPostBySlug(articleSlug);
      return createBlogPostSeo(post, {
        canonicalBaseUrl,
        defaultDescription: seoDefaults?.defaultMetaDescription ?? undefined,
        defaultImage,
        robots,
      });
    } catch {
      return createFallbackSeo(resourcePost(articleSlug), {
        canonicalBaseUrl,
        image: defaultImage,
      });
    }
  }

  const pageSlug = pageSlugByRoute[normalizedPathname];
  if (pageSlug) {
    try {
      const page = await getPageBySlug(pageSlug);
      return createPageSeo(page, {
        canonicalBaseUrl,
        canonicalPath:
          normalizedPathname === normalizePathname(routes.home)
            ? routes.home
            : `${normalizedPathname}/`,
        defaultDescription: seoDefaults?.defaultMetaDescription ?? undefined,
        defaultImage,
        robots,
      });
    } catch {
      return createFallbackSeo(pathname, {
        canonicalBaseUrl,
        image: defaultImage,
      });
    }
  }

  return createFallbackSeo(routes.notFound, {
    canonicalBaseUrl,
    image: defaultImage,
    robots: "noindex,follow",
    title: "Page not found | Exxonim",
    description: "The Exxonim page you requested could not be found.",
  });
}

export async function getBlogPrerenderRoutes() {
  try {
    const posts = await fetchFreshPublicBlogPosts();
    return posts.map((post) => resourcePost(post.slug));
  } catch {
    return [];
  }
}
