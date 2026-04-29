import type { ApiAdminRole } from '@exxonim/admin-core/types/api';

// ----------------------------------------------------------------------

export type DashboardViewType = 'operations' | 'content' | 'combined' | 'administrator';

export interface DashboardWidgetsConfig {
  metrics: boolean;
  consultations: boolean;
  contentPipeline: boolean;
  activityFeed: boolean;
  quickActions: boolean;
  alerts: boolean;
  pageShortcuts: boolean;
}

export interface DashboardLayoutConfig {
  layout: string[][];
}

export interface DashboardConfig {
  viewType: DashboardViewType;
  description: string;
  widgets: DashboardWidgetsConfig;
  layout: string[][];
  availableViews: Array<{
    id: DashboardViewType;
    label: string;
    description: string;
    icon: string;
  }>;
}

export interface DashboardData {
  metrics: Array<{
    key: string;
    label: string;
    value: number;
    helper?: string;
    href?: string;
  }>;
  consultations: any[];
  contentPipeline: any[];
  recentActivity: any[];
  quickActions: any[];
  alerts: any[];
  worklists: any[];
  pageShortcuts: any[];
}

// ----------------------------------------------------------------------

// View configurations
const VIEW_CONFIGS: Record<DashboardViewType, Omit<DashboardConfig, 'availableViews'>> = {
  operations: {
    viewType: 'operations',
    description: 'Service request tracking, case management, and operational metrics',
    widgets: {
      metrics: true,
      consultations: true,
      contentPipeline: false,
      activityFeed: true,
      quickActions: true,
      alerts: true,
      pageShortcuts: false,
    },
    layout: [
      ['alerts'],
      ['metrics', 'metrics', 'metrics', 'metrics'],
      ['consultations', 'activity-feed'],
      ['quick-actions'],
    ],
  },
  
  content: {
    viewType: 'content',
    description: 'Content publishing, SEO health, and editorial workflow management',
    widgets: {
      metrics: true,
      consultations: false,
      contentPipeline: true,
      activityFeed: true,
      quickActions: true,
      alerts: true,
      pageShortcuts: true,
    },
    layout: [
      ['alerts'],
      ['metrics', 'metrics', 'metrics', 'metrics'],
      ['content-pipeline', 'activity-feed'],
      ['page-shortcuts', 'quick-actions'],
    ],
  },
  
  combined: {
    viewType: 'combined',
    description: 'Complete overview of operations, content, and site management',
    widgets: {
      metrics: true,
      consultations: true,
      contentPipeline: true,
      activityFeed: true,
      quickActions: true,
      alerts: true,
      pageShortcuts: true,
    },
    layout: [
      ['alerts'],
      ['metrics', 'metrics', 'metrics', 'metrics'],
      ['consultations', 'content-pipeline'],
      ['activity-feed', 'page-shortcuts'],
      ['quick-actions'],
    ],
  },
  
  administrator: {
    viewType: 'administrator',
    description: 'Administrative overview with system health and user management',
    widgets: {
      metrics: true,
      consultations: true,
      contentPipeline: true,
      activityFeed: true,
      quickActions: true,
      alerts: true,
      pageShortcuts: true,
    },
    layout: [
      ['alerts'],
      ['metrics', 'metrics', 'metrics', 'metrics'],
      ['consultations', 'content-pipeline'],
      ['activity-feed', 'page-shortcuts'],
      ['quick-actions'],
    ],
  },
};

// Available views for switcher
const AVAILABLE_VIEWS = [
  {
    id: 'operations' as DashboardViewType,
    label: 'Operations Dashboard',
    description: 'Service requests and case management',
    icon: 'solar:chat-round-call-bold',
  },
  {
    id: 'content' as DashboardViewType,
    label: 'Content Dashboard',
    description: 'Publishing and editorial workflow',
    icon: 'solar:document-text-bold',
  },
  {
    id: 'combined' as DashboardViewType,
    label: 'Combined View',
    description: 'Complete operations and content overview',
    icon: 'solar:widget-5-bold',
  },
  {
    id: 'administrator' as DashboardViewType,
    label: 'Administrator View',
    description: 'System health and management',
    icon: 'solar:shield-user-bold',
  },
];

// Permission checks
function hasPermission(permissions: string[] | null | undefined, permission: string): boolean {
  if (!permissions || permissions.length === 0) {
    return false;
  }
  return permissions.includes(permission);
}

// Determine default view based on role and permissions
function getDefaultView(
  role?: string | null, 
  permissions?: string[] | null
): DashboardViewType {
  // Check for specific permissions first
  const hasConsultationAccess = hasPermission(permissions, 'consultation.read');
  const hasContentAccess = hasPermission(permissions, 'blog_post.read') || 
                          hasPermission(permissions, 'page.read');
  
  // Role-based defaults
  if (role === 'superuser' || role === 'administrator') {
    return 'administrator';
  }
  
  if (role === 'editor' || (hasContentAccess && !hasConsultationAccess)) {
    return 'content';
  }
  
  if (role === 'operations' || (hasConsultationAccess && !hasContentAccess)) {
    return 'operations';
  }
  
  // Default to combined if user has both or role doesn't match
  return 'combined';
}

// Filter available views based on permissions
function getAvailableViews(
  role?: string | null,
  permissions?: string[] | null
): typeof AVAILABLE_VIEWS {
  const hasConsultationAccess = hasPermission(permissions, 'consultation.read');
  const hasContentAccess = hasPermission(permissions, 'blog_post.read') || 
                          hasPermission(permissions, 'page.read');
  
  return AVAILABLE_VIEWS.filter(view => {
    switch (view.id) {
      case 'operations':
        return hasConsultationAccess;
      
      case 'content':
        return hasContentAccess;
      
      case 'combined':
        return hasConsultationAccess || hasContentAccess;
      
      case 'administrator':
        return role === 'superuser' || role === 'administrator';
      
      default:
        return true;
    }
  });
}

// Main configuration function
export function getDashboardConfig(
  role?: string | null,
  permissions?: string[] | null
): DashboardConfig {
  const defaultView = getDefaultView(role, permissions);
  const availableViews = getAvailableViews(role, permissions);
  
  // Get base config for the view
  const baseConfig = VIEW_CONFIGS[defaultView];
  
  // Adjust widgets based on actual permissions
  const adjustedWidgets = {
    ...baseConfig.widgets,
    consultations: baseConfig.widgets.consultations && hasPermission(permissions, 'consultation.read'),
    contentPipeline: baseConfig.widgets.contentPipeline && 
                    (hasPermission(permissions, 'blog_post.read') || hasPermission(permissions, 'page.read')),
    pageShortcuts: baseConfig.widgets.pageShortcuts && hasPermission(permissions, 'page.read'),
  };
  
  return {
    ...baseConfig,
    widgets: adjustedWidgets,
    availableViews,
  };
}