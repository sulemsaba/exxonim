import { useEffect } from "react";
import type { SiteSettingSeoDefaultsValue } from "../types/api";
import { useSiteSetting } from "./useSiteSetting";
import {
  applyResolvedSeo,
  createBlogPostSeo,
  createPageSeo,
  siteOrigin,
} from "../seo";
import type { BlogPost, PageRecord } from "../types";

function toRobots(value?: SiteSettingSeoDefaultsValue | null) {
  return value
    ? `${value.robotsIndex ? "index" : "noindex"},${value.robotsFollow ? "follow" : "nofollow"}`
    : "index,follow";
}

function toCanonicalBaseUrl(value?: SiteSettingSeoDefaultsValue | null) {
  return value?.canonicalBaseUrl ?? siteOrigin;
}

function toDefaultDescription(value?: SiteSettingSeoDefaultsValue | null) {
  return value?.defaultMetaDescription ?? undefined;
}

function toDefaultImage(value?: SiteSettingSeoDefaultsValue | null) {
  if (value?.defaultShareImageUrl) {
    return value.defaultShareImageUrl;
  }

  return new URL("/exxonim-logo.webp", toCanonicalBaseUrl(value)).toString();
}

export function useResolvedPageSeo<TContent>(
  page: PageRecord<TContent> | null | undefined,
  canonicalPath: string
) {
  const { data: seoDefaultsSetting } =
    useSiteSetting<SiteSettingSeoDefaultsValue>("seo_defaults");
  const seoDefaults = seoDefaultsSetting?.value;

  useEffect(() => {
    if (!page) {
      return;
    }

    applyResolvedSeo(
      createPageSeo(page, {
        canonicalPath,
        canonicalBaseUrl: toCanonicalBaseUrl(seoDefaults),
        defaultDescription: toDefaultDescription(seoDefaults),
        defaultImage: toDefaultImage(seoDefaults),
        robots: toRobots(seoDefaults),
      })
    );
  }, [canonicalPath, page, seoDefaults]);
}

export function useResolvedBlogSeo(post: BlogPost | null | undefined) {
  const { data: seoDefaultsSetting } =
    useSiteSetting<SiteSettingSeoDefaultsValue>("seo_defaults");
  const seoDefaults = seoDefaultsSetting?.value;

  useEffect(() => {
    if (!post) {
      return;
    }

    applyResolvedSeo(
      createBlogPostSeo(post, {
        canonicalBaseUrl: toCanonicalBaseUrl(seoDefaults),
        defaultDescription: toDefaultDescription(seoDefaults),
        defaultImage: toDefaultImage(seoDefaults),
        robots: toRobots(seoDefaults),
      })
    );
  }, [post, seoDefaults]);
}
