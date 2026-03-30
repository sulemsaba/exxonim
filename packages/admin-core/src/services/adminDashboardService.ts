import api from "../api/axios";
import { apiRoutes } from "@exxonim/shared/api/routes";
import type {
  ApiActivityEvent,
  ApiAdminDashboardSummary,
  ApiContentStatus,
} from "../types/api";
import { listAdminBlogPosts } from "./adminBlogService";
import { listAdminConsultations } from "./adminConsultationService";
import { getAdminPages } from "./adminPageService";
import { getSeoDefaultsSetting } from "./adminStructuredSettingsService";
import { getContentStatus } from "../utils/admin";
import { adminRoutes } from "../lib/adminRoutes";

function seoHealthForRecord(record: {
  meta_title?: string | null;
  meta_description?: string | null;
  featured_image?: string | null;
  og_image_url?: string | null;
}, options?: { requireShareImage?: boolean }) {
  const requireShareImage = options?.requireShareImage ?? false;
  const shareImage = record.featured_image ?? record.og_image_url;

  if (
    record.meta_title &&
    record.meta_description &&
    (shareImage || !requireShareImage)
  ) {
    return "clean" as const;
  }

  if (record.meta_title || record.meta_description || shareImage) {
    return "warning" as const;
  }

  return "error" as const;
}

function hasArticleBody(content: unknown) {
  if (!content || typeof content !== "object") {
    return false;
  }

  const value = content as {
    html?: string | null;
    introduction?: string | null;
    sections?: Array<{ heading?: string | null; paragraphs?: string[] | null }> | null;
  };

  if (value.html?.trim() || value.introduction?.trim()) {
    return true;
  }

  return Boolean(
    value.sections?.some(
      (section) =>
        section.heading?.trim() ||
        section.paragraphs?.some((paragraph) => paragraph?.trim())
    )
  );
}

function completionPercent(parts: boolean[]) {
  if (!parts.length) {
    return 0;
  }

  const complete = parts.filter(Boolean).length;
  return Math.round((complete / parts.length) * 100);
}

function contentCompletionForPost(record: {
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  category_id?: number | null;
  author_id?: number | null;
  featured_image?: string | null;
  content?: unknown;
}) {
  return completionPercent([
    Boolean(record.title?.trim()),
    Boolean(record.slug?.trim()),
    Boolean(record.excerpt?.trim()),
    typeof record.category_id === "number",
    typeof record.author_id === "number",
    Boolean(record.featured_image?.trim()),
    hasArticleBody(record.content),
  ]);
}

function contentCompletionForPage(record: {
  title?: string | null;
  slug?: string | null;
  content?: unknown;
  meta_title?: string | null;
  meta_description?: string | null;
}) {
  return completionPercent([
    Boolean(record.title?.trim()),
    Boolean(record.slug?.trim()),
    hasArticleBody(record.content),
    Boolean(record.meta_title?.trim()),
    Boolean(record.meta_description?.trim()),
  ]);
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

export async function getAdminDashboardSummary(): Promise<ApiAdminDashboardSummary> {
  try {
    const response = await api.get<ApiAdminDashboardSummary>(
      apiRoutes.admin.dashboard.summary
    );
    return response.data;
  } catch {
    const [posts, pages, seoDefaults, consultations] = await Promise.all([
      listAdminBlogPosts(),
      getAdminPages(),
      getSeoDefaultsSetting(),
      listAdminConsultations().catch(() => []),
    ]);

    const publishedPosts = posts.filter((item) => getContentStatus(item) === "published");
    const draftPosts = posts.filter((item) => getContentStatus(item) === "draft");
    const publishedPages = pages.filter((item) => getContentStatus(item) === "published");
    const pendingConsultations = consultations.filter((item) => item.status === "pending");
    const seoFallbacksMissing =
      !seoDefaults?.value.defaultMetaTitle || !seoDefaults?.value.defaultMetaDescription;
    const recentConsultations = [...consultations]
      .sort(
        (left, right) =>
          new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime()
      )
      .slice(0, 4);

    const consultationEvents: ApiActivityEvent[] = recentConsultations.map((item) => ({
      id: `consultation-${item.id}`,
      actor_name: item.full_name,
      actor_role: item.company || "Lead",
      actor_type: "system",
      action_type: "consultation_received",
      resource_type: "consultation",
      target_label: item.full_name,
      detail: `Consultation is currently ${item.status}.`,
      target_url: adminRoutes.consultationDetail(item.id),
      created_at: item.updated_at,
    }));

    return {
      metrics: [
        {
          key: "draft_posts",
          label: "Draft Posts",
          value: draftPosts.length,
          helper: "Articles still being prepared",
          href: adminRoutes.blogPosts,
        },
        {
          key: "published_pages",
          label: "Published Pages",
          value: publishedPages.length,
          helper: "Live public pages",
          href: adminRoutes.pages,
        },
        {
          key: "pending_consultations",
          label: "Pending Consultations",
          value: pendingConsultations.length,
          helper: `${consultations.length - pendingConsultations.length} already reviewed`,
          href: adminRoutes.consultations,
        },
        {
          key: "published_posts",
          label: "Published Posts",
          value: publishedPosts.length,
          helper: `${draftPosts.length} drafts waiting`,
          href: adminRoutes.blogPosts,
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
        ...(pendingConsultations.length
          ? [
              {
                id: "consultations-pending",
                severity: "warning" as const,
                title: "Consultations waiting for follow-up",
                message: `${pendingConsultations.length} consultation requests are still pending review.`,
                href: adminRoutes.consultations,
              },
            ]
          : []),
      ],
      recent_activity: [...consultationEvents, ...buildFallbackEvents()]
        .sort(
          (left, right) =>
            new Date(right.created_at).getTime() - new Date(left.created_at).getTime()
        )
        .slice(0, 8),
      content_pipeline: [...posts.slice(0, 3), ...pages.slice(0, 3)].map((item) => ({
        id: `${"featured_image" in item ? "post" : "page"}-${item.id}`,
        title: item.title,
        slug: item.slug,
        kind: "featured_image" in item ? "blog_post" : "page",
        status: getContentStatus(item),
        seo_health: "featured_image" in item
          ? seoHealthForRecord(item, { requireShareImage: true })
          : seoHealthForRecord(item),
        completion_percent: "featured_image" in item
          ? contentCompletionForPost(item)
          : contentCompletionForPage(item),
        href:
          "featured_image" in item
            ? adminRoutes.blogPostEdit(item.id)
            : adminRoutes.pageEdit(item.id),
      })),
      consultations: recentConsultations.map((item) => ({
        id: item.id,
        tracking_id: item.tracking_id,
        full_name: item.full_name,
        company: item.company,
        status: item.status,
        assigned_admin_label: item.assigned_admin?.email ?? null,
        created_at: item.created_at,
        updated_at: item.updated_at,
        href: adminRoutes.consultationDetail(item.id),
      })),
      open_jobs: [] as Array<{
        id: number;
        title: string;
        slug: string;
        department: string;
        employment_type: string;
        location: string;
        status: ApiContentStatus;
        posted_at?: string | null;
        href?: string | null;
      }>,
    };
  }
}
