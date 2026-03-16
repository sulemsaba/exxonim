export const routes = {
  home: "/",
  about: "/about/",
  faq: "/faq/",
  services: "/services/",
  tracking: "/track-consultation/",
  resources: "/resources/",
  career: "/career/",
  contact: "/contact/",
  support: "/support/",
  terms: "/terms/",
  privacy: "/privacy/",
  notFound: "/404/",
} as const;

export const staticRoutePaths = Object.values(routes);

export function resourcePost(slug: string) {
  return `${routes.resources}${slug}/`;
}

export function legacyBlogPost(slug: string) {
  return `/blog/${slug}/`;
}

export function normalizePathname(pathname: string | undefined) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

export function getResourcePostSlug(pathname: string | undefined) {
  const normalizedPathname = normalizePathname(pathname);
  const segments = normalizedPathname.split("/").filter(Boolean);

  if (
    segments.length === 2 &&
    (segments[0] === "resources" || segments[0] === "blog")
  ) {
    return segments[1];
  }

  return null;
}
