import { normalizePathname, routes } from "../routes";

export type AdminSection =
  | "dashboard"
  | "blog-posts"
  | "blog-analytics"
  | "blog-categories"
  | "blog-authors"
  | "page-home"
  | "page-services"
  | "page-about"
  | "page-faq"
  | "page-contact"
  | "page-careers"
  | "pages"
  | "jobs"
  | "brand-settings"
  | "contact-settings"
  | "navigation"
  | "pricing"
  | "testimonials"
  | "footer-settings"
  | "seo-settings"
  | "access-roles";

export type AdminRouteMode = "index" | "new" | "edit" | "shortcut";

export interface AdminBreadcrumb {
  label: string;
  href?: string;
}

export interface AdminNavItem {
  section: AdminSection;
  label: string;
  href: string;
  description: string;
  icon:
    | "dashboard"
      | "posts"
    | "analytics"
    | "categories"
    | "authors"
    | "page"
    | "services"
    | "about"
    | "faq"
    | "contact"
    | "careers"
    | "all-pages"
    | "jobs"
    | "brand"
    | "map"
    | "navigation"
    | "pricing"
    | "testimonials"
    | "footer"
    | "seo"
    | "roles";
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export interface AdminRouteMatch {
  section: AdminSection;
  mode: AdminRouteMode;
  pathname: string;
  title: string;
  description: string;
  breadcrumbs: AdminBreadcrumb[];
  entityId?: number;
  entitySlug?: string;
  pageSlug?: string;
}

export const adminRoutes = {
  dashboard: routes.admin,
  blogPosts: "/admin/blog/posts/",
  blogPostsNew: "/admin/blog/posts/new/",
  blogPostEdit: (id: number) => `/admin/blog/posts/${id}/edit/`,
  blogAnalytics: "/admin/blog/analytics/",
  blogCategories: "/admin/blog/categories/",
  blogAuthors: "/admin/blog/authors/",
  pages: "/admin/pages/",
  pagesNew: "/admin/pages/new/",
  pageEdit: (id: number) => `/admin/pages/${id}/edit/`,
  pageShortcut: (slug: AdminPageShortcutSlug) => `/admin/pages/${slug}/`,
  jobs: "/admin/jobs/",
  jobsNew: "/admin/jobs/new/",
  jobEdit: (slug: string) => `/admin/jobs/${slug}/`,
  settingsBrand: "/admin/settings/brand/",
  settingsContact: "/admin/settings/contact/",
  settingsFooter: "/admin/settings/footer/",
  settingsSeo: "/admin/settings/seo/",
  navigation: "/admin/navigation/",
  pricing: "/admin/pricing/",
  testimonials: "/admin/testimonials/",
  accessRoles: "/admin/access/roles/",
  legacySiteSettings: "/admin/site-settings/",
  legacyMedia: "/admin/media/",
} as const;

export const editorRestrictedSections: AdminSection[] = [
  "brand-settings",
  "contact-settings",
  "page-home",
  "page-services",
  "page-about",
  "page-faq",
  "page-contact",
  "page-careers",
  "pages",
  "jobs",
  "navigation",
  "pricing",
  "testimonials",
  "footer-settings",
  "seo-settings",
  "access-roles",
];

export const authorRestrictedSections: AdminSection[] = [
  ...editorRestrictedSections,
  "blog-categories",
];

export function isAdminSectionRestrictedForEditor(section: AdminSection) {
  return editorRestrictedSections.includes(section);
}

export function isAdminSectionRestrictedForRole(
  role: "admin" | "editor" | "author" | string | null | undefined,
  section: AdminSection
) {
  if (role === "author") {
    return authorRestrictedSections.includes(section);
  }

  if (role === "editor") {
    return isAdminSectionRestrictedForEditor(section);
  }

  return false;
}

const pageShortcuts = {
  home: {
    section: "page-home",
    title: "Home Page",
    description: "Edit homepage copy, content blocks, and publishing settings.",
  },
  services: {
    section: "page-services",
    title: "Services Page",
    description: "Edit the public services page content and SEO metadata.",
  },
  about: {
    section: "page-about",
    title: "About Page",
    description: "Maintain company story, narrative sections, and metadata.",
  },
  faq: {
    section: "page-faq",
    title: "FAQ Page",
    description: "Manage FAQ page content while keeping the route stable.",
  },
  contact: {
    section: "page-contact",
    title: "Contact Page",
    description: "Edit contact page copy only. Global phones, maps, and offices live in Contact & Map settings.",
  },
  careers: {
    section: "page-careers",
    title: "Career Page",
    description: "Edit the public career page copy only. Job records live in Job Listings.",
  },
} as const satisfies Record<
  string,
  { section: AdminSection; title: string; description: string }
>;

export type AdminPageShortcutSlug = keyof typeof pageShortcuts;

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [
      {
        section: "dashboard",
        label: "Dashboard",
        href: adminRoutes.dashboard,
        description: "Overview, alerts, and workspace pulse.",
        icon: "dashboard",
      },
    ],
  },
  {
    label: "Content Management",
    items: [
      {
        section: "page-careers",
        label: "Career Page",
        href: adminRoutes.pageShortcut("careers"),
        description: "Edit the public career page content and supporting copy.",
        icon: "careers",
      },
      {
        section: "jobs",
        label: "Job Listings",
        href: adminRoutes.jobs,
        description: "Create, publish, and archive open roles.",
        icon: "jobs",
      },
      {
        section: "page-home",
        label: "Home Page",
        href: adminRoutes.pageShortcut("home"),
        description: "Shortcut to the homepage record.",
        icon: "page",
      },
      {
        section: "page-services",
        label: "Services Page",
        href: adminRoutes.pageShortcut("services"),
        description: "Shortcut to the services page record.",
        icon: "services",
      },
      {
        section: "page-about",
        label: "About Page",
        href: adminRoutes.pageShortcut("about"),
        description: "Shortcut to the about page record.",
        icon: "about",
      },
      {
        section: "page-faq",
        label: "FAQ Page",
        href: adminRoutes.pageShortcut("faq"),
        description: "Shortcut to the FAQ page record.",
        icon: "faq",
      },
      {
        section: "page-contact",
        label: "Contact Page",
        href: adminRoutes.pageShortcut("contact"),
        description: "Edit contact page content only.",
        icon: "contact",
      },
      {
        section: "pages",
        label: "All Pages",
        href: adminRoutes.pages,
        description: "Generic page manager and long-form page inventory.",
        icon: "all-pages",
      },
      {
        section: "blog-posts",
        label: "Blog Posts",
        href: adminRoutes.blogPosts,
        description: "Create, edit, publish, and review articles.",
        icon: "posts",
      },
      {
        section: "blog-analytics",
        label: "Blog Analytics",
        href: adminRoutes.blogAnalytics,
        description: "Traffic, SEO, and publishing performance for blog content.",
        icon: "analytics",
      },
      {
        section: "blog-categories",
        label: "Blog Categories",
        href: adminRoutes.blogCategories,
        description: "Organize posts with taxonomy controls.",
        icon: "categories",
      },
      {
        section: "blog-authors",
        label: "Blog Authors",
        href: adminRoutes.blogAuthors,
        description: "Manage visible author identities.",
        icon: "authors",
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        section: "brand-settings",
        label: "Brand & Company",
        href: adminRoutes.settingsBrand,
        description: "Brand assets plus company identity.",
        icon: "brand",
      },
      {
        section: "contact-settings",
        label: "Contact & Map",
        href: adminRoutes.settingsContact,
        description: "Global phones, map data, offices, and socials.",
        icon: "map",
      },
      {
        section: "navigation",
        label: "Navigation",
        href: adminRoutes.navigation,
        description: "Manage header and footer navigation structure.",
        icon: "navigation",
      },
      {
        section: "pricing",
        label: "Pricing Plans",
        href: adminRoutes.pricing,
        description: "Maintain service plan inventory.",
        icon: "pricing",
      },
      {
        section: "testimonials",
        label: "Testimonials",
        href: adminRoutes.testimonials,
        description: "Update customer proof and speaker metadata.",
        icon: "testimonials",
      },
      {
        section: "footer-settings",
        label: "Footer Content",
        href: adminRoutes.settingsFooter,
        description: "Edit footer links, CTA, and legal copy.",
        icon: "footer",
      },
      {
        section: "seo-settings",
        label: "SEO Defaults",
        href: adminRoutes.settingsSeo,
        description: "Manage site-wide SEO fallback values.",
        icon: "seo",
      },
      {
        section: "access-roles",
        label: "Access Roles",
        href: adminRoutes.accessRoles,
        description: "Manage admin users and editor permissions.",
        icon: "roles",
      },
    ],
  },
];

export const adminNavItems = adminNavGroups.flatMap((group) => group.items);

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
  mode: AdminRouteMode,
  title: string,
  description: string,
  breadcrumbs: AdminBreadcrumb[],
  extra: Partial<Pick<AdminRouteMatch, "entityId" | "entitySlug" | "pageSlug">> = {}
): AdminRouteMatch {
  return {
    section,
    mode,
    title,
    description,
    breadcrumbs,
    pathname,
    ...extra,
  };
}

function directMatch(
  pathname: string,
  section: AdminSection,
  title: string,
  description: string,
  href: string
) {
  return buildMatch(pathname, section, "index", title, description, [
    { label: "Dashboard", href: adminRoutes.dashboard },
    { label: title, href },
  ]);
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
      "Admin overview for content, settings, and hiring.",
      [{ label: "Dashboard", href: adminRoutes.dashboard }]
    );
  }

  if (segments[1] === "login") {
    return null;
  }

  if (segments[1] === "media") {
    return buildMatch(
      normalizedPathname,
      "dashboard",
      "index",
      "Dashboard",
      "Media Library was removed from the current admin experience.",
      [{ label: "Dashboard", href: adminRoutes.dashboard }]
    );
  }

  if (segments[1] === "site-settings") {
    return directMatch(
      normalizedPathname,
      "brand-settings",
      "Brand & Company",
      "Brand assets plus company identity.",
      adminRoutes.settingsBrand
    );
  }

  if (segments[1] === "blog" && segments[2] === "posts") {
    if (segments[3] === "new") {
      return buildMatch(
        normalizedPathname,
        "blog-posts",
        "new",
        "New Blog Post",
        "Create a new article draft with structured SEO fields and publishing status.",
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
        "Update article content, SEO fields, related links, and publishing status.",
        [
          { label: "Dashboard", href: adminRoutes.dashboard },
          { label: "Blog Posts", href: adminRoutes.blogPosts },
          { label: `Post #${postId}` },
        ],
        { entityId: postId }
      );
    }

    return directMatch(
      normalizedPathname,
      "blog-posts",
      "Blog Posts",
      "Review the content pipeline, publishing status, and SEO health.",
      adminRoutes.blogPosts
    );
  }

  if (segments[1] === "blog" && segments[2] === "categories") {
    return directMatch(
      normalizedPathname,
      "blog-categories",
      "Blog Categories",
      "Manage blog taxonomy and category metadata.",
      adminRoutes.blogCategories
    );
  }

  if (segments[1] === "blog" && segments[2] === "analytics") {
    return directMatch(
      normalizedPathname,
      "blog-analytics",
      "Blog Analytics",
      "Estimated traffic, SEO, and publishing performance for blog content.",
      adminRoutes.blogAnalytics
    );
  }

  if (segments[1] === "blog" && segments[2] === "authors") {
    return directMatch(
      normalizedPathname,
      "blog-authors",
      "Blog Authors",
      "Maintain author identity, profile details, and bylines.",
      adminRoutes.blogAuthors
    );
  }


  if (segments[1] === "pages") {
    if (segments[2] === "new") {
      return buildMatch(
        normalizedPathname,
        "pages",
        "new",
        "New Page",
        "Create a new public page record with slug and SEO fields.",
        [
          { label: "Dashboard", href: adminRoutes.dashboard },
          { label: "All Pages", href: adminRoutes.pages },
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
        "Update long-form page content, metadata, and publishing status.",
        [
          { label: "Dashboard", href: adminRoutes.dashboard },
          { label: "All Pages", href: adminRoutes.pages },
          { label: `Page #${pageId}` },
        ],
        { entityId: pageId }
      );
    }

    const shortcut = segments[2] as AdminPageShortcutSlug | undefined;
    if (shortcut && shortcut in pageShortcuts) {
      const config = pageShortcuts[shortcut];
      return buildMatch(
        normalizedPathname,
        config.section,
        "shortcut",
        config.title,
        config.description,
        [
          { label: "Dashboard", href: adminRoutes.dashboard },
          { label: "Content Management", href: adminRoutes.pages },
          { label: config.title, href: adminRoutes.pageShortcut(shortcut) },
        ],
        { pageSlug: shortcut }
      );
    }

    return directMatch(
      normalizedPathname,
      "pages",
      "All Pages",
      "Generic page manager for public content records and free-form routes.",
      adminRoutes.pages
    );
  }

  if (segments[1] === "jobs") {
    if (segments[2] === "new") {
      return buildMatch(
        normalizedPathname,
        "jobs",
        "new",
        "New Job Listing",
        "Create a new role with slug, publishing status, and hiring details.",
        [
          { label: "Dashboard", href: adminRoutes.dashboard },
          { label: "Job Listings", href: adminRoutes.jobs },
          { label: "New Job" },
        ]
      );
    }

    if (segments[2]) {
      return buildMatch(
        normalizedPathname,
        "jobs",
        "edit",
        "Edit Job Listing",
        "Update role details, slug, publishing state, and hiring metadata.",
        [
          { label: "Dashboard", href: adminRoutes.dashboard },
          { label: "Job Listings", href: adminRoutes.jobs },
          { label: segments[2] },
        ],
        { entitySlug: segments[2] }
      );
    }

    return directMatch(
      normalizedPathname,
      "jobs",
      "Job Listings",
      "Create, publish, and archive open roles while keeping careers page content separate.",
      adminRoutes.jobs
    );
  }

  if (segments[1] === "settings" && segments[2] === "brand") {
    return directMatch(
      normalizedPathname,
      "brand-settings",
      "Brand & Company",
      "Manage visual identity, company short name, and company identity fields.",
      adminRoutes.settingsBrand
    );
  }

  if (segments[1] === "settings" && segments[2] === "contact") {
    return directMatch(
      normalizedPathname,
      "contact-settings",
      "Contact & Map",
      "Manage phones, emails, WhatsApp, offices, maps, office hours, and social links.",
      adminRoutes.settingsContact
    );
  }

  if (segments[1] === "settings" && segments[2] === "footer") {
    return directMatch(
      normalizedPathname,
      "footer-settings",
      "Footer Content",
      "Edit footer links, CTA, tagline, and copyright.",
      adminRoutes.settingsFooter
    );
  }

  if (segments[1] === "settings" && segments[2] === "seo") {
    return directMatch(
      normalizedPathname,
      "seo-settings",
      "SEO Defaults",
      "Manage canonical base URL and site-wide SEO fallback values.",
      adminRoutes.settingsSeo
    );
  }

  if (segments[1] === "navigation") {
    return directMatch(
      normalizedPathname,
      "navigation",
      "Navigation",
      "Manage header and footer navigation structure and status.",
      adminRoutes.navigation
    );
  }

  if (segments[1] === "pricing") {
    return directMatch(
      normalizedPathname,
      "pricing",
      "Pricing Plans",
      "Maintain pricing plan content and publishing state.",
      adminRoutes.pricing
    );
  }

  if (segments[1] === "testimonials") {
    return directMatch(
      normalizedPathname,
      "testimonials",
      "Testimonials",
      "Manage social proof copy, speaker details, and publishing state.",
      adminRoutes.testimonials
    );
  }

  if (segments[1] === "access" && segments[2] === "roles") {
    return directMatch(
      normalizedPathname,
      "access-roles",
      "Access Roles",
      "Manage admin users, editor permissions, and activation status.",
      adminRoutes.accessRoles
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
