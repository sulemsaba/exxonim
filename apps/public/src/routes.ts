export const routes = {
  home: "/",
  admin: "/admin/",
  adminLogin: "/admin/login/",
  about: "/about/",
  faq: "/faq/",
  services: "/services/",
  resources: "/resources/",
  career: "/career/",
  contact: "/contact/",
  support: "/support/",
  terms: "/terms/",
  privacy: "/privacy/",
  cookies: "/cookies/",
  dataRights: "/data-rights/",
  notFound: "/404/",
} as const;

export const staticRoutePaths = Object.values(routes);

export function resourceArticlePath(slug: string) {
  return `${routes.resources}${slug}/`;
}

export function resourcePost(slug: string) {
  return resourceArticlePath(slug);
}

export function legacyBlogArticlePath(slug: string) {
  return `/blog/${slug}/`;
}

export function legacyBlogPost(slug: string) {
  return legacyBlogArticlePath(slug);
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

export function isPublicAppRoute(pathname: string | undefined) {
  const normalizedPathname = normalizePathname(pathname);

  if (
    normalizedPathname === normalizePathname(routes.admin) ||
    normalizedPathname === normalizePathname(routes.adminLogin)
  ) {
    return false;
  }

  return (
    staticRoutePaths
      .filter((route) => route !== routes.admin && route !== routes.adminLogin)
      .map((route) => normalizePathname(route))
      .includes(normalizedPathname) || Boolean(getResourcePostSlug(normalizedPathname))
  );
}
