import type {
  ApiActivityEvent,
  ApiAdminDashboardAlert,
  ApiAdminDashboardSummary,
} from '@exxonim/admin-core/types/api';

import { adminRoutes } from '@exxonim/admin-core/lib/adminRoutes';

import type { NotificationItemProps } from './notifications-popover';

function mapAlertIcon(alert: ApiAdminDashboardAlert) {
  switch (alert.severity) {
    case 'error':
      return { icon: 'solar:danger-triangle-bold', color: 'error' as const };
    case 'warning':
      return { icon: 'solar:shield-warning-bold', color: 'warning' as const };
    default:
      return { icon: 'solar:bell-bing-bold', color: 'info' as const };
  }
}

function mapActivityIcon(activity: ApiActivityEvent) {
  switch (activity.resource_type) {
    case 'consultation':
      return { icon: 'solar:chat-round-call-bold', color: 'secondary' as const };
    case 'blog_post':
      return { icon: 'solar:document-text-bold', color: 'primary' as const };
    case 'page':
      return { icon: 'solar:documents-bold', color: 'info' as const };
    case 'seo':
      return { icon: 'solar:global-bold', color: 'warning' as const };
    case 'job':
      return { icon: 'solar:case-round-bold', color: 'secondary' as const };
    default:
      return { icon: 'solar:settings-bold', color: 'default' as const };
  }
}

function mapAlert(alert: ApiAdminDashboardAlert): NotificationItemProps {
  const meta = mapAlertIcon(alert);

  return {
    id: `alert-${alert.id}`,
    title: alert.title,
    description: alert.message,
    isUnRead: true,
    postedAt: new Date().toISOString(),
    href: alert.href ?? adminRoutes.dashboard,
    icon: meta.icon,
    color: meta.color,
  };
}

function mapActivity(activity: ApiActivityEvent, index: number): NotificationItemProps {
  const meta = mapActivityIcon(activity);
  const detail = activity.detail?.trim();

  return {
    id: `activity-${activity.id}`,
    title: activity.target_label,
    description: detail || `${activity.actor_name} updated this item.`,
    isUnRead: index < 2,
    postedAt: activity.created_at,
    href: activity.target_url ?? adminRoutes.dashboard,
    icon: meta.icon,
    color: meta.color,
  };
}

export function mapDashboardNotifications(summary?: ApiAdminDashboardSummary | null) {
  if (!summary) {
    return [] satisfies NotificationItemProps[];
  }

  return [
    ...summary.alerts.map(mapAlert),
    ...summary.recent_activity.map(mapActivity),
  ].slice(0, 7);
}
