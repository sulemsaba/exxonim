export const apiRoutes = {
  admin: {
    auth: {
      login: "/admin/login",
      refresh: "/admin/refresh",
      me: "/admin/me",
    },
    blogPosts: {
      list: "/admin/blog/posts",
      detail: (id: number) => `/admin/blog/posts/${id}`,
      previewToken: (id: number) => `/admin/blog/posts/${id}/preview-token`,
    },
    blogCategories: {
      list: "/admin/blog/categories",
      detail: (id: number) => `/admin/blog/categories/${id}`,
    },
    blogAuthors: {
      list: "/admin/blog/authors",
      detail: (id: number) => `/admin/blog/authors/${id}`,
    },
    media: {
      list: "/admin/media",
      detail: (id: number) => `/admin/media/${id}`,
      upload: "/admin/media/upload",
    },
    pages: {
      list: "/admin/pages",
      detail: (id: number) => `/admin/pages/${id}`,
    },
    navigation: {
      list: "/admin/navigation",
      detail: (id: number) => `/admin/navigation/${id}`,
    },
    pricing: {
      list: "/admin/pricing/plans",
      detail: (id: number) => `/admin/pricing/plans/${id}`,
    },
    testimonials: {
      list: "/admin/testimonials",
      detail: (id: number) => `/admin/testimonials/${id}`,
    },
    jobs: {
      list: "/admin/jobs",
      detail: (slug: string) => `/admin/jobs/${slug}`,
    },
    consultations: {
      list: "/admin/consultations",
      detail: (id: number) => `/admin/consultations/${id}`,
      notify: (id: number) => `/admin/consultations/${id}/notify`,
    },
    staff: "/admin/staff",
    dashboard: {
      summary: "/admin/dashboard/summary",
    },
    siteSettings: {
      list: "/admin/site-settings",
      detail: (id: number) => `/admin/site-settings/${id}`,
      byKey: (key: string) => `/admin/site-settings/key/${key}`,
    },
    access: {
      users: "/admin/users",
      userDetail: (id: number) => `/admin/users/${id}`,
      userRole: (id: number) => `/admin/users/${id}/role`,
      userStatus: (id: number) => `/admin/users/${id}/status`,
      roles: "/admin/roles",
    },
  },
  public: {
    blogPosts: {
      list: "/blog/posts",
      detail: (slug: string) => `/blog/posts/${slug}`,
    },
    blogCategories: "/blog/categories",
    pages: {
      detail: (slug: string) => `/pages/${slug}`,
    },
    navigation: "/navigation/",
    pricing: "/pricing/plans",
    testimonials: "/testimonials/",
    siteSettings: {
      detail: (key: string) => `/site-settings/${key}`,
    },
    consultations: {
      create: "/public/consultations",
      magicLink: "/public/consultations/magic-link",
      detail: (trackingId: string) => `/public/consultations/${trackingId}`,
    },
  },
} as const;
