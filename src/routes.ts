export const routes = {
  home: "/",
  about: "/about/",
  faq: "/faq/",
  services: "/services/",
  tracking: "/track-consultation/",
  resources: "/resources/",
  career: "/career/",
  contact: "/contact/",
} as const;

export const staticRoutePaths = Object.values(routes);

export function resourcePost(slug: string) {
  return `${routes.resources}${slug}/`;
}

export function normalizePathname(pathname: string | undefined) {
  if (!pathname || pathname === "/") {
    return "/";
  }

  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}
