import { normalizePathname, routes } from "../app/routes";

export type AdminSection =
  | "dashboard"
  | "blog-posts"
  | "blog-categories"
  | "blog-authors"
  | "pages"
  | "navigation"
  | "pricing"
  | "testimonials"
  | "site-settings"
  | "media";

export interface AdminBreadcrumb {
  label: string;
  href?: string;
}

export interface AdminNavItem {
  section: AdminSection;
  label: string;
  href: string;
  description: string;
}

export interface AdminRouteMatch {
  section: AdminSection;
  mode: "index" | "new" | "edit";
  entityId?: number;
  pathname: string;
  title: string;
  description: string;
  breadcrumbs: AdminBreadcrumb[];
}

export const adminRoutes = {
  dashboard: routes.admin,
  blogPosts: "/admin/blog/posts/",
  blogPostsNew: "/admin/blog/posts/new/",
  blogPostEdit: (id: number) => `/admin/blog/posts/${id}/edit/`,
  blogCategories: "/admin/blog/categories/",
  blogAuthors: "/admin/blog/authors/",
  pages: "/admin/pages/",
  pagesNew: "/admin/pages/new/",
  pageEdit: (id: number) => `/admin/pages/${id}/edit/`,
  navigation: "/admin/navigation/",
  pricing: "/admin/pricing/",
  testimonials: "/admin/testimonials/",
  siteSettings: "/admin/site-settings/",
  media: "/admin/media/",
} as const;

export const adminNavItems: AdminNavItem[] = [
  {
    section: "dashboard",
    label: "Dashboard",
    href: adminRoutes.dashboard,
    description: "Overview and workspace entry point.",
  },
  {
    section: "blog-posts",
    label: "Blog Posts",
    href: adminRoutes.blogPosts,
    description: "Create, edit, publish, and remove articles.",
  },
  {
    section: "blog-categories",
    label: "Blog Categories",
    href: adminRoutes.blogCategories,
    description: "Organize blog content.",
  },
  {
    section: "blog-authors",
    label: "Blog Authors",
    href: adminRoutes.blogAuthors,
    description: "Manage author identities.",
  },
  {
    section: "pages",
    label: "Pages",
    href: adminRoutes.pages,
    description: "Edit long-form public pages.",
  },
  {
    section: "navigation",
    label: "Navigation",
    href: adminRoutes.navigation,
    description: "Manage menu structure and order.",
  },
  {
    section: "pricing",
    label: "Pricing",
    href: adminRoutes.pricing,
    description: "Maintain active service plans.",
  },
  {
    section: "testimonials",
    label: "Testimonials",
    href: adminRoutes.testimonials,
    description: "Update social proof content.",
  },
  {
    section: "site-settings",
    label: "Site Settings",
    href: adminRoutes.siteSettings,
    description: "Adjust global company and footer data.",
  },
  {
    section: "media",
    label: "Media",
    href: adminRoutes.media,
    description: "Upload and reuse images.",
  },
];

function matchNumericId(segment: string | undefined) {
  if (!segment) {
    return undefined;
  }

  const value = Number(segment);
  return Number.isInteger(value) && value > 0 ? value : undefined;
}

function buildMatch(
  pathname: string,
  section: AdminSection,
  mode: AdminRouteMatch["mode"],
  title: string,
  description: string,
  breadcrumbs: AdminBreadcrumb[],
  entityId?: number
): AdminRouteMatch {
  return {
    section,
    mode,
    title,
    description,
    breadcrumbs,
    pathname,
    entityId,
  };
}

export function matchAdminRoute(pathname: string | undefined): AdminRouteMatch | null {
  const normalizedPathname = normalizePathname(pathname);
  const segments = normalizedPathname.split("/").filter(Boolean);

  if (segments[0] !== "admin") {
    return null;
  }

  if (segments.length === 1) {
    return buildMatch(
      normalizedPathname,
      "dashboard",
      "index",
      "Dashboard",
      "Operational overview and quick access to content resources.",
      [{ label: "Dashboard" }]
    );
  }

  if (segments[1] === "login") {
    return null;
  }

  if (segments[1] === "blog" && segments[2] === "posts") {
    if (segments[3] === "new") {
      return buildMatch(
        normalizedPathname,
        "blog-posts",
        "new",
        "New Blog Post",
        "Create a new article and publish it when ready.",
        [
          { label: "Dashboard", href: adminRoutes.dashboard },
          { label: "Blog Posts", href: adminRoutes.blogPosts },
          { label: "New Post" },
        ]
      );
    }

    const postId = matchNumericId(segments[3]);
    if (postId && segments[4] === "edit") {
      return buildMatch(
        normalizedPathname,
        "blog-posts",
        "edit",
        "Edit Blog Post",
        "Update article content and publication settings.",
        [
          { label: "Dashboard", href: adminRoutes.dashboard },
          { label: "Blog Posts", href: adminRoutes.blogPosts },
          { label: `Post #${postId}` },
        ],
        postId
      );
    }

    return buildMatch(
      normalizedPathname,
      "blog-posts",
      "index",
      "Blog Posts",
      "Review, publish, update, and delete articles.",
      [
        { label: "Dashboard", href: adminRoutes.dashboard },
        { label: "Blog Posts" },
      ]
    );
  }

  if (segments[1] === "blog" && segments[2] === "categories") {
    return buildMatch(
      normalizedPathname,
      "blog-categories",
      "index",
      "Blog Categories",
      "Manage categories used by posts.",
      [
        { label: "Dashboard", href: adminRoutes.dashboard },
        { label: "Blog Categories" },
      ]
    );
  }

  if (segments[1] === "blog" && segments[2] === "authors") {
    return buildMatch(
      normalizedPathname,
      "blog-authors",
      "index",
      "Blog Authors",
      "Maintain the author directory shown on articles.",
      [
        { label: "Dashboard", href: adminRoutes.dashboard },
        { label: "Blog Authors" },
      ]
    );
  }

  if (segments[1] === "pages") {
    if (segments[2] === "new") {
      return buildMatch(
        normalizedPathname,
        "pages",
        "new",
        "New Page",
        "Create a new structured page backed by JSON content.",
        [
          { label: "Dashboard", href: adminRoutes.dashboard },
          { label: "Pages", href: adminRoutes.pages },
          { label: "New Page" },
        ]
      );
    }

    const pageId = matchNumericId(segments[2]);
    if (pageId && segments[3] === "edit") {
      return buildMatch(
        normalizedPathname,
        "pages",
        "edit",
        "Edit Page",
        "Update content, metadata, and publication state.",
        [
          { label: "Dashboard", href: adminRoutes.dashboard },
          { label: "Pages", href: adminRoutes.pages },
          { label: `Page #${pageId}` },
        ],
        pageId
      );
    }

    return buildMatch(
      normalizedPathname,
      "pages",
      "index",
      "Pages",
      "Manage static and informational public pages.",
      [
        { label: "Dashboard", href: adminRoutes.dashboard },
        { label: "Pages" },
      ]
    );
  }

  const directSectionMap: Record<
    string,
    { section: AdminSection; title: string; description: string }
  > = {
    navigation: {
      section: "navigation",
      title: "Navigation",
      description: "Edit menu structure, ordering, and parent relationships.",
    },
    pricing: {
      section: "pricing",
      title: "Pricing Plans",
      description: "Maintain the active pricing catalog.",
    },
    testimonials: {
      section: "testimonials",
      title: "Testimonials",
      description: "Update proof points and testimonial rotation.",
    },
    "site-settings": {
      section: "site-settings",
      title: "Site Settings",
      description: "Edit global JSON settings consumed across the public site.",
    },
    media: {
      section: "media",
      title: "Media Library",
      description: "Upload images and manage reusable media assets.",
    },
  };

  const directMatch = directSectionMap[segments[1]];
  if (directMatch) {
    return buildMatch(
      normalizedPathname,
      directMatch.section,
      "index",
      directMatch.title,
      directMatch.description,
      [
        { label: "Dashboard", href: adminRoutes.dashboard },
        { label: directMatch.title },
      ]
    );
  }

  return buildMatch(
    normalizedPathname,
    "dashboard",
    "index",
    "Admin",
    "Requested admin route was not recognized.",
    [
      { label: "Dashboard", href: adminRoutes.dashboard },
      { label: "Not Found" },
    ]
  );
}
