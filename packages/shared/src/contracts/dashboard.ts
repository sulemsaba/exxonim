export interface ApiActivityEvent {
  id: string;
  actor_name: string;
  actor_role?: string | null;
  actor_type: "admin" | "editor" | "system";
  action_type:
    | "published"
    | "draft_created"
    | "updated"
    | "consultation_received"
    | "settings_updated"
    | "job_posted"
    | "seo_warning";
  resource_type:
    | "blog_post"
    | "consultation"
    | "page"
    | "setting"
    | "job"
    | "navigation"
    | "pricing"
    | "testimonial"
    | "seo";
  target_label: string;
  target_url?: string | null;
  detail?: string | null;
  created_at: string;
}

export interface ApiAdminDashboardMetric {
  key: string;
  label: string;
  value: number;
  helper?: string | null;
  href?: string | null;
}

export interface ApiAdminDashboardAlert {
  id: string;
  severity: "info" | "warning" | "error";
  title: string;
  message: string;
  href?: string | null;
}

export interface ApiAdminDashboardPoint {
  label: string;
  count: number;
}

export interface ApiAdminDashboardPipelineItem {
  id: string;
  title: string;
  slug: string;
  kind: "blog_post" | "page";
  status: string;
  seo_health: "clean" | "warning" | "error";
  completion_percent: number;
  href?: string | null;
}


export interface ApiAdminDashboardJobItem {
  id: number;
  title: string;
  slug: string;
  department: string;
  employment_type: string;
  location: string;
  status: string;
  posted_at?: string | null;
  href?: string | null;
}

export interface ApiAdminDashboardConsultationItem {
  id: number;
  tracking_id: string;
  full_name: string;
  company?: string | null;
  status: string;
  assigned_admin_label?: string | null;
  created_at: string;
  updated_at: string;
  href?: string | null;
}

export interface ApiAdminDashboardSummary {
  metrics: ApiAdminDashboardMetric[]; 
  alerts: ApiAdminDashboardAlert[];
  recent_activity: ApiActivityEvent[];
  content_pipeline: ApiAdminDashboardPipelineItem[];
  consultations: ApiAdminDashboardConsultationItem[];
  open_jobs: ApiAdminDashboardJobItem[];
}
