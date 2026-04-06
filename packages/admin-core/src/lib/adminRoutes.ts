import { normalizePathname, routes } from "../routes";

export type AdminSection =
  | "dashboard"
  | "notifications"
  | "reports"
  | "consultations"
  | "review-queue"
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
  | "access-roles"
  | "privacy-requests";

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
    | "notifications"
    | "analytics"
    | "consultations"
    | "posts"
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
    | "roles"
    | "privacy";
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
  notifications: "/admin/notifications/",
  reports: "/admin/reports/",
  consultations: "/admin/consultations/",
  consultationDetail: (id: number) => `/admin/consultations/${id}/`,
  reviewQueue: "/admin/review-queue/",
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
  privacyRequests: "/admin/privacy-requests/",
  legacySiteSettings: "/admin/site-settings/",
  legacyMedia: "/admin/media/",
} as const;

export const editorRestrictedSections: AdminSection[] = [
  "reports",
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
  "consultations",
  "navigation",
  "pricing",
  "testimonials",
  "footer-settings",
  "seo-settings",
  "access-roles",
  "privacy-requests",
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

const adminSectionPermissionMap: Record<AdminSection, string[]> = {
  dashboard: ["dashboard.read"],
  notifications: ["notification.read"],
  reports: ["report.read"],
  consultations: ["consultation.read"],
  "review-queue": ["review_queue.read"],
  "blog-posts": ["blog_post.read"],
  "blog-analytics": ["blog_post.read"],
  "blog-categories": ["blog_category.read"],
  "blog-authors": ["blog_author.read"],
  "page-home": ["page.read"],
  "page-services": ["page.read"],
  "page-about": ["page.read"],
  "page-faq": ["page.read"],
  "page-contact": ["page.read"],
  "page-careers": ["page.read"],
  pages: ["page.read"],
  jobs: ["job.read"],
  "brand-settings": ["site_setting.read"],
  "contact-settings": ["site_setting.read"],
  navigation: ["navigation.read"],
  pricing: ["pricing.read"],
  testimonials: ["testimonial.read"],
  "footer-settings": ["site_setting.read"],
  "seo-settings": ["site_setting.read"],
  "access-roles": ["user.manage"],
  "privacy-requests": ["privacy_request.read"],
};

export function getAdminSectionPermissions(section: AdminSection) {
  return adminSectionPermissionMap[section];
}

export function canAccessAdminSection(
  section: AdminSection,
  permissions?: string[] | null,
  role?: string | null
) {
  if (Array.isArray(permissions) && permissions.length > 0) {
    const requiredPermissions = getAdminSectionPermissions(section);
    return requiredPermissions.some((permission) => permissions.includes(permission));
  }

  return !isAdminSectionRestrictedForRole(role, section);
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
    title: "Careers",
    description: "Manage the public careers page copy and live job positions in one workspace.",
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
      {
        section: "reports",
        label: "Reports",
        href: adminRoutes.reports,
        description: "Operational reporting built from request history, workload, and audit activity.",
        icon: "analytics",
      },
      {
        section: "notifications",
        label: "Notifications",
        href: adminRoutes.notifications,
        description: "Personal in-app alerts and notification preferences.",
        icon: "notifications",
      },
    ],
  },
  {
    label: "Content Management",
    items: [
      {
        section: "consultations",
        label: "Service Requests",
        href: adminRoutes.consultations,
        description: "Track service requests, assignments, and follow-up status.",
        icon: "consultations",
      },
      {
        section: "review-queue",
        label: "Review Queue",
        href: adminRoutes.reviewQueue,
        description: "Approve or reject content waiting in the publishing workflow.",
        icon: "posts",
      },
      {
        section: "jobs",
        label: "Careers",
        href: adminRoutes.jobs,
        description: "Edit the public careers page and manage open positions in one place.",
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
      {
        section: "privacy-requests",
        label: "Privacy Requests",
        href: adminRoutes.privacyRequests,
        description: "Track access, correction, and deletion requests with auditable internal handling.",
        icon: "privacy",
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

  if (segments[1] === "notifications") {
    return directMatch(
      normalizedPathname,
      "notifications",
      "Notifications",
      "Review personal alerts, unread items, and in-app notification preferences.",
      adminRoutes.notifications
    );
  }

  if (segments[1] === "reports") {
    return directMatch(
      normalizedPathname,
      "reports",
      "Reports",
      "Read-only operational reporting built from service-request history and audit activity.",
      adminRoutes.reports
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

  if (segments[1] === "consultations") {
    const consultationId = matchNumericId(segments[2]);

    if (consultationId) {
      return buildMatch(
        normalizedPathname,
        "consultations",
        "edit",
        "Service Request Detail",
        "Review the request, update status, assign ownership, and track follow-up notes.",
        [
          { label: "Dashboard", href: adminRoutes.dashboard },
          { label: "Service Requests", href: adminRoutes.consultations },
          { label: `Request #${consultationId}` },
        ],
        { entityId: consultationId }
      );
    }

    return directMatch(
      normalizedPathname,
      "consultations",
      "Service Requests",
      "Track incoming service requests, assign owners, and move each request through follow-up.",
      adminRoutes.consultations
    );
  }

  if (segments[1] === "review-queue") {
    return directMatch(
      normalizedPathname,
      "review-queue",
      "Review Queue",
      "Review and approve content waiting in the publishing workflow.",
      adminRoutes.reviewQueue
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
          { label: config.title, href: adminRoutes.jobs },
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
        "New Position",
        "Create a new role inside the unified careers workspace.",
        [
          { label: "Dashboard", href: adminRoutes.dashboard },
          { label: "Careers", href: adminRoutes.jobs },
          { label: "New Position" },
        ]
      );
    }

    if (segments[2]) {
      return buildMatch(
        normalizedPathname,
        "jobs",
        "edit",
        "Edit Position",
        "Update role details, publishing state, and hiring metadata inside Careers.",
        [
          { label: "Dashboard", href: adminRoutes.dashboard },
          { label: "Careers", href: adminRoutes.jobs },
          { label: segments[2] },
        ],
        { entitySlug: segments[2] }
      );
    }

    return directMatch(
      normalizedPathname,
      "jobs",
      "Careers",
      "Edit the public careers page and manage published job positions without leaving the same workspace.",
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

  if (segments[1] === "privacy-requests") {
    return directMatch(
      normalizedPathname,
      "privacy-requests",
      "Privacy Requests",
      "Log and manage access, correction, and deletion requests with an audit trail.",
      adminRoutes.privacyRequests
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
