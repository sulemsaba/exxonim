import type { 
  ApiAdminDashboardSummary,
  ApiConsultation,
  ApiAdminDashboardAlert,
  ApiActivityEvent,
  ApiAdminDashboardPipelineItem,
  ApiAdminDashboardJobItem,
} from '@exxonim/admin-core/types/api';
import type { DashboardData } from '../config/dashboard-config';

import { adminRoutes } from '@exxonim/admin-core/lib/adminRoutes';

// ----------------------------------------------------------------------

const BRAND_MARK_SRC = '/assets/branding/exxonim-favicon-light.png';

interface BuildDashboardDataParams {
  summary: ApiAdminDashboardSummary;
  consultations: ApiConsultation[];
  worklists: any[];
  role?: string | null;
  permissions?: string[] | null;
}

export function buildDashboardData({
  summary,
  consultations,
  worklists,
  role,
  permissions,
}: BuildDashboardDataParams): DashboardData {
  // Extract metrics
  const metrics = summary.metrics.map(metric => ({
    key: metric.key,
    label: metric.label,
    value: typeof metric.value === 'number' ? metric.value : parseInt(metric.value) || 0,
    helper: metric.helper ?? undefined,
    href: metric.href ?? undefined,
  }));

  // Filter consultations based on permissions
  const filteredConsultations = permissions?.includes('consultation.read') 
    ? consultations 
    : [];

  // Filter content pipeline based on permissions
  const filteredContentPipeline = (permissions?.includes('blog_post.read') || permissions?.includes('page.read'))
    ? summary.content_pipeline
    : [];

  // Build recent activity
  const recentActivity = summary.recent_activity.map(activity => ({
    id: activity.id,
    type: getActivityType(activity),
    title: `${activity.actor_name} • ${activity.target_label}`,
    time: activity.created_at,
    detail: activity.detail,
  }));

  // Build quick actions
  const quickActions = buildQuickActions(summary, consultations, role, permissions);

  // Build alerts
  const alerts = summary.alerts.map(alert => ({
    id: alert.id,
    severity: alert.severity,
    title: alert.title,
    message: alert.message,
    href: alert.href,
  }));

  // Build page shortcuts
  const pageShortcuts = buildPageShortcuts(permissions);

  return {
    metrics,
    consultations: filteredConsultations,
    contentPipeline: filteredContentPipeline,
    recentActivity,
    quickActions,
    alerts,
    worklists,
    pageShortcuts,
  };
}

// Helper functions
function getActivityType(activity: ApiActivityEvent): string {
  switch (activity.resource_type) {
    case 'consultation':
      return 'order3';
    case 'blog_post':
      return 'order1';
    case 'page':
      return 'order2';
    case 'job':
      return 'order4';
    case 'setting':
    case 'navigation':
    case 'pricing':
    case 'testimonial':
      return 'order5';
    default:
      return 'order2';
  }
}

function buildQuickActions(
  summary: ApiAdminDashboardSummary,
  consultations: ApiConsultation[],
  role?: string | null,
  permissions?: string[] | null
) {
  const actions = [];

  // Consultation actions
  if (permissions?.includes('consultation.read')) {
    const pendingConsultations = consultations.filter(c => c.status === 'pending').length;
    if (pendingConsultations > 0) {
      actions.push({
        id: 'review-consultations',
        label: `Review new service requests (${pendingConsultations})`,
        href: adminRoutes.consultations,
        icon: 'solar:chat-round-call-bold',
        priority: 'high' as const,
      });
    }
  }

  // Content actions
  if (permissions?.includes('blog_post.read') || permissions?.includes('page.read')) {
    const draftItems = summary.content_pipeline.filter(item => 
      item.status === 'draft' || item.completion_percent < 80
    ).length;
    
    if (draftItems > 0) {
      actions.push({
        id: 'complete-drafts',
        label: `Complete draft content (${draftItems})`,
        href: adminRoutes.blogPosts,
        icon: 'solar:pen-bold',
        priority: 'medium' as const,
      });
    }
  }

  // Review queue actions
  if (permissions?.includes('review_queue.read')) {
    const reviewItems = summary.content_pipeline.filter(item => 
      item.status === 'pending_review'
    ).length;
    
    if (reviewItems > 0) {
      actions.push({
        id: 'review-queue',
        label: `Items in review queue (${reviewItems})`,
        href: adminRoutes.reviewQueue,
        icon: 'solar:document-check-bold',
        priority: 'high' as const,
      });
    }
  }

  // Admin actions
  if (role === 'superuser' || role === 'administrator') {
    const activeAlerts = summary.alerts.filter(alert => 
      alert.severity === 'error' || alert.severity === 'warning'
    ).length;
    
    if (activeAlerts > 0) {
      actions.push({
        id: 'resolve-alerts',
        label: `Resolve system alerts (${activeAlerts})`,
        href: '#', // Would link to alerts management
        icon: 'solar:shield-warning-bold',
        priority: 'high' as const,
      });
    }
  }

  // Default action if none found
  if (actions.length === 0) {
    actions.push({
      id: 'explore-dashboard',
      label: 'Explore dashboard features',
      href: adminRoutes.dashboard,
      icon: 'solar:compass-bold',
      priority: 'low' as const,
    });
  }

  return actions.slice(0, 5); // Limit to 5 actions
}

function buildPageShortcuts(permissions?: string[] | null) {
  if (!permissions?.includes('page.read')) {
    return [];
  }

  return [
    {
      title: 'Home Page',
      description: 'Homepage copy, sections, and publishing status.',
      href: adminRoutes.pageShortcut('home'),
      icon: 'solar:home-angle-bold',
    },
    {
      title: 'Services',
      description: 'Service positioning and page-level SEO.',
      href: adminRoutes.pageShortcut('services'),
      icon: 'solar:bolt-circle-bold',
    },
    {
      title: 'About',
      description: 'Company story, positioning, and proof.',
      href: adminRoutes.pageShortcut('about'),
      icon: 'solar:buildings-3-bold',
    },
    {
      title: 'FAQ',
      description: 'Support answers and conversion objections.',
      href: adminRoutes.pageShortcut('faq'),
      icon: 'solar:question-circle-bold',
    },
    {
      title: 'Contact',
      description: 'Page-level contact copy and CTA framing.',
      href: adminRoutes.pageShortcut('contact'),
      icon: 'solar:phone-calling-rounded-bold',
    },
    {
      title: 'Careers',
      description: 'Hiring narrative, recruiting copy, and live positions.',
      href: adminRoutes.jobs,
      icon: 'solar:case-round-bold',
    },
  ];
}