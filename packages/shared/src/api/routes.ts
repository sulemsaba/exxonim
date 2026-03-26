export const apiRoutes = {
  admin: {
    auth: {
      login: "/admin/auth/login",
      refresh: "/admin/auth/refresh",
      me: "/admin/auth/me",
    },
    blog: {
      posts: {
        list: "/admin/blog/posts",
        byId: (id: number) => `/admin/blog/posts/${id}`,
        previewToken: (id: number) => `/admin/blog/posts/${id}/preview-token`,
      },
      categories: {
        list: "/admin/blog/categories",
        byId: (id: number) => `/admin/blog/categories/${id}`,
      },
      authors: {
        list: "/admin/blog/authors",
        byId: (id: number) => `/admin/blog/authors/${id}`,
        me: "/admin/blog/authors/me",
      },
    },
    media: {
      list: "/admin/media",
      byId: (id: number) => `/admin/media/${id}`,
      upload: "/admin/media/upload",
    },
    pages: {
      list: "/admin/pages",
      byId: (id: number) => `/admin/pages/${id}`,
    },
    navigation: {
      list: "/admin/navigation",
      byId: (id: number) => `/admin/navigation/${id}`,
    },
    pricing: {
      plans: {
        list: "/admin/pricing/plans",
        byId: (id: number) => `/admin/pricing/plans/${id}`,
      },
    },
    testimonials: {
      list: "/admin/testimonials",
      byId: (id: number) => `/admin/testimonials/${id}`,
    },
    jobs: {
      list: "/admin/jobs",
      bySlug: (slug: string) => `/admin/jobs/${slug}`,
    },
    staff: "/admin/staff",
    dashboard: {
      summary: "/admin/dashboard/summary",
    },
    siteSettings: {
      list: "/admin/site-settings",
      byKey: (key: string) => `/admin/site-settings/${key}`,
    },
    access: {
      users: {
        list: "/admin/users",
        byId: (id: number) => `/admin/users/${id}`,
        role: (id: number) => `/admin/users/${id}/role`,
        status: (id: number) => `/admin/users/${id}/status`,
      },
      roles: "/admin/roles",
    },
  },
  public: {
    blog: {
      posts: {
        list: "/blog/posts",
        bySlug: (slug: string) => `/blog/posts/${slug}`,
      },
      categories: {
        list: "/blog/categories",
      },
      authors: {
        list: "/blog/authors",
        bySlug: (slug: string) => `/blog/authors/${slug}`,
      },
    },
    pages: {
      list: "/pages",
      bySlug: (slug: string) => `/pages/${slug}`,
    },
    navigation: {
      list: "/navigation",
    },
    pricing: {
      plans: {
        list: "/pricing/plans",
      },
    },
    testimonials: {
      list: "/testimonials",
    },
    siteSettings: {
      byKey: (key: string) => `/site-settings/${key}`,
    },
  },
} as const;
