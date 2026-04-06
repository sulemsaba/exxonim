import type {
  ApiAdminNotification,
  ApiAdminNotificationCategory,
  ApiAdminNotificationSeverity,
  ApiAdminNotificationEventType,
} from '@exxonim/admin-core/types/api';

export type AdminNotificationTone =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

const NOTIFICATION_CATEGORY_LABELS: Record<ApiAdminNotificationCategory, string> = {
  request_ops: 'Request operations',
  content_review: 'Content review',
  security: 'Security',
  reporting: 'Reporting',
  system: 'System',
};

const NOTIFICATION_SEVERITY_LABELS: Record<ApiAdminNotificationSeverity, string> = {
  info: 'Info',
  success: 'Success',
  warning: 'Warning',
  error: 'Error',
};

const NOTIFICATION_EVENT_METADATA: Record<
  ApiAdminNotificationEventType,
  { icon: string; label: string }
> = {
  'request.submitted': {
    icon: 'solar:inbox-bold-duotone',
    label: 'Request submitted',
  },
  'request.inbound_message': {
    icon: 'solar:chat-round-dots-bold-duotone',
    label: 'Inbound customer reply',
  },
  'request.assigned': {
    icon: 'solar:user-check-bold-duotone',
    label: 'Request assigned',
  },
  'request.overdue': {
    icon: 'solar:danger-circle-bold-duotone',
    label: 'Request overdue',
  },
  'content.pending_review': {
    icon: 'solar:clipboard-check-bold-duotone',
    label: 'Content awaiting review',
  },
  'security.suspicious_login': {
    icon: 'solar:shield-warning-bold-duotone',
    label: 'Suspicious login activity',
  },
  'security.admin_role_changed': {
    icon: 'solar:shield-user-bold-duotone',
    label: 'Admin role changed',
  },
  'security.admin_status_changed': {
    icon: 'solar:user-block-bold-duotone',
    label: 'Admin status changed',
  },
  'report.generated': {
    icon: 'solar:chart-square-bold-duotone',
    label: 'Report generated',
  },
};

export function getAdminNotificationCategoryLabel(
  category: ApiAdminNotificationCategory
) {
  return NOTIFICATION_CATEGORY_LABELS[category] ?? category;
}

export function getAdminNotificationSeverityLabel(
  severity: ApiAdminNotificationSeverity
) {
  return NOTIFICATION_SEVERITY_LABELS[severity] ?? severity;
}

export function getAdminNotificationSeverityColor(
  severity: ApiAdminNotificationSeverity
): 'info' | 'success' | 'warning' | 'error' {
  switch (severity) {
    case 'success':
      return 'success';
    case 'warning':
      return 'warning';
    case 'error':
      return 'error';
    default:
      return 'info';
  }
}

export function getAdminNotificationEventMeta(
  eventType: ApiAdminNotificationEventType
) {
  return NOTIFICATION_EVENT_METADATA[eventType];
}

export function getAdminNotificationIcon(
  notification: Pick<ApiAdminNotification, 'event_type'>
) {
  return getAdminNotificationEventMeta(notification.event_type)?.icon ?? 'solar:bell-bing-bold-duotone';
}

export function getAdminNotificationEventLabel(
  notification: Pick<ApiAdminNotification, 'event_type'>
) {
  return getAdminNotificationEventMeta(notification.event_type)?.label ?? notification.event_type;
}
