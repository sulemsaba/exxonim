import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiActivityEvent,
  ApiAdminDashboardSummary,
  ApiContentStatus,
} from "../types/api";
import { listAdminBlogPosts } from "./adminBlogService";
import { getAdminJobs } from "./adminJobsService";
import { getAdminPages } from "./adminPageService";
import { getSeoDefaultsSetting } from "./adminStructuredSettingsService";
import { getContentStatus } from "../utils/admin";
import { adminRoutes } from "../lib/adminRoutes";

function seoHealthForRecord(record: {
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_url?: string | null;
}) {
  if (record.meta_title && record.meta_description && record.og_image_url) {
    return "clean" as const;
  }

  if (record.meta_title || record.meta_description || record.og_image_url) {
    return "warning" as const;
  }

  return "error" as const;
}

function contentCompletion(record: {
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_url?: string | null;
}) {
  let score = 0;
  if (record.meta_title) score += 34;
  if (record.meta_description) score += 33;
  if (record.og_image_url) score += 33;
  return Math.min(score, 100);
}

function buildFallbackEvents(): ApiActivityEvent[] {
  return [
    {
      id: "fallback-settings",
      actor_name: "System",
      actor_role: "system",
      actor_type: "system",
      action_type: "settings_updated",
      resource_type: "setting",
      target_label: "Dashboard summary fallback",
      detail: "Summary endpoint unavailable, using composed admin data.",
      target_url: adminRoutes.dashboard,
      created_at: new Date().toISOString(),
    },
  ];
}

export async function getAdminDashboardSummary() {
  try {
    const response = await api.get<ApiAdminDashboardSummary>(
      apiRoutes.admin.dashboard.summary
    );
    return response.data;
  } catch {
    const [posts, pages, seoDefaults, jobs] = await Promise.all([
      listAdminBlogPosts(),
      getAdminPages(),
      getSeoDefaultsSetting(),
      getAdminJobs().catch(() => []),
    ]);

    const publishedPosts = posts.filter((item) => getContentStatus(item) === "published");
    const openJobs = jobs.filter((item) => getContentStatus(item) === "published");
    const seoFallbacksMissing =
      !seoDefaults?.value.defaultMetaTitle || !seoDefaults?.value.defaultMetaDescription;

    return {
      metrics: [
        {
          key: "draft_posts",
          label: "Draft Posts",
          value: posts.filter((item) => getContentStatus(item) === "draft").length,
          helper: "Articles still being prepared",
          href: adminRoutes.blogPosts,
        },
        {
          key: "published_pages",
          label: "Published Pages",
          value: pages.filter((item) => getContentStatus(item) === "published").length,
          helper: "Live public pages",
          href: adminRoutes.pages,
        },
        {
          key: "published_posts",
          label: "Published Posts",
          value: publishedPosts.length,
          helper: `${posts.length - publishedPosts.length} drafts waiting`,
          href: adminRoutes.blogPosts,
        },
        {
          key: "open_jobs",
          label: "Open Job Listings",
          value: openJobs.length,
          helper: `${jobs.length - openJobs.length} not live`,
          href: adminRoutes.jobs,
        },
      ],
      alerts: [
        ...(seoFallbacksMissing
          ? [
              {
                id: "seo-defaults-missing",
                severity: "warning" as const,
                title: "SEO defaults incomplete",
                message: "Default title or description is missing in SEO Defaults.",
                href: adminRoutes.settingsSeo,
              },
            ]
          : []),
      ],
      recent_activity: buildFallbackEvents(),
      content_pipeline: [...posts.slice(0, 3), ...pages.slice(0, 3)].map((item) => ({
        id: `${"featured_image" in item ? "post" : "page"}-${item.id}`,
        title: item.title,
        slug: item.slug,
        kind: "featured_image" in item ? "blog_post" : "page",
        status: getContentStatus(item),
        seo_health: seoHealthForRecord(item),
        completion_percent: contentCompletion(item),
        href:
          "featured_image" in item
            ? adminRoutes.blogPostEdit(item.id)
            : adminRoutes.pageEdit(item.id),
      })),
      open_jobs: openJobs.slice(0, 4).map((job) => ({
        id: job.id,
        title: job.title,
        slug: job.slug,
        department: job.department,
        employment_type: job.employment_type,
        location: [job.city, job.country].filter(Boolean).join(", "),
        status: (job.status ?? "draft") as ApiContentStatus,
        posted_at: job.published_at,
        href: adminRoutes.jobEdit(job.slug),
      })),
    };
  }
}
