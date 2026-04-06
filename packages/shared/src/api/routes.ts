export const apiRoutes = {
  admin: {
    auth: {
      login: "/admin/auth/login",
      refresh: "/admin/auth/refresh",
      logout: "/admin/auth/logout",
      me: "/admin/auth/me",
    },
    blog: {
      posts: {
        list: "/admin/blog/posts",
        byId: (id: number) => `/admin/blog/posts/${id}`,
        submit: (id: number) => `/admin/blog/posts/${id}/submit`,
        approve: (id: number) => `/admin/blog/posts/${id}/approve`,
        reject: (id: number) => `/admin/blog/posts/${id}/reject`,
        publish: (id: number) => `/admin/blog/posts/${id}/publish`,
        archive: (id: number) => `/admin/blog/posts/${id}/archive`,
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
      submit: (id: number) => `/admin/pages/${id}/submit`,
      approve: (id: number) => `/admin/pages/${id}/approve`,
      reject: (id: number) => `/admin/pages/${id}/reject`,
      publish: (id: number) => `/admin/pages/${id}/publish`,
      archive: (id: number) => `/admin/pages/${id}/archive`,
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
      submit: (id: number) => `/admin/testimonials/${id}/submit`,
      approve: (id: number) => `/admin/testimonials/${id}/approve`,
      reject: (id: number) => `/admin/testimonials/${id}/reject`,
      publish: (id: number) => `/admin/testimonials/${id}/publish`,
      archive: (id: number) => `/admin/testimonials/${id}/archive`,
    },
    jobs: {
      list: "/admin/jobs",
      bySlug: (slug: string) => `/admin/jobs/${slug}`,
    },
    consultations: {
      list: "/admin/consultations",
      byId: (id: number) => `/admin/consultations/${id}`,
    },
    serviceTypes: "/admin/service-types",
    customers: {
      list: "/admin/customers",
      byId: (id: string) => `/admin/customers/${id}`,
      timeline: (id: string) => `/admin/customers/${id}/timeline`,
    },
    serviceRequests: {
      list: "/admin/service-requests",
      byId: (id: string) => `/admin/service-requests/${id}`,
      markRead: (id: string) => `/admin/service-requests/${id}/mark-read`,
      status: (id: string) => `/admin/service-requests/${id}/status`,
      bulkMarkRead: "/admin/service-requests/bulk/mark-read",
      bulkStatus: "/admin/service-requests/bulk/status",
      bulkAssign: "/admin/service-requests/bulk/assign",
      bulkPriority: "/admin/service-requests/bulk/priority",
      assignments: (id: string) => `/admin/service-requests/${id}/assignments`,
      assignmentById: (id: string, assignmentId: string) =>
        `/admin/service-requests/${id}/assignments/${assignmentId}`,
      threads: (id: string) => `/admin/service-requests/${id}/threads`,
      messages: (id: string) => `/admin/service-requests/${id}/messages`,
      notes: (id: string) => `/admin/service-requests/${id}/notes`,
      documents: (id: string) => `/admin/service-requests/${id}/documents`,
    },
    worklists: "/admin/dashboard/worklists",
    reviewQueue: "/admin/review-queue",
    notifications: {
      list: "/admin/notifications",
      byId: (id: string) => `/admin/notifications/${id}`,
      markRead: (id: string) => `/admin/notifications/${id}/read`,
      markAllRead: "/admin/notifications/mark-all-read",
      preferences: "/admin/notifications/preferences",
    },
    documents: {
      download: (id: string) => `/admin/documents/${id}/download`,
    },
    staff: "/admin/staff",
    dashboard: {
      summary: "/admin/dashboard/summary",
    },
    reports: {
      operations: "/admin/reports/operations",
      adminActivity: "/admin/reports/activity/admin",
      contentActivity: "/admin/reports/activity/content",
    },
    siteSettings: {
      list: "/admin/site-settings",
      byKey: (key: string) => `/admin/site-settings/${key}`,
    },
    privacyRequests: {
      list: "/admin/privacy-requests",
      byId: (id: string) => `/admin/privacy-requests/${id}`,
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
    consultations: {
      create: "/consultations",
    },
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
    jobs: {
      list: "/jobs",
      bySlug: (slug: string) => `/jobs/${slug}`,
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
    privacy: {
      consent: "/privacy/consent",
    },
  },
} as const;
