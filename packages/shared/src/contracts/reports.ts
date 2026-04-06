import type {
  ApiServiceRequestSourceChannel,
  ApiServiceRequestStatus,
} from "./service-requests";

export const apiReportGrains = ["day", "week", "month"] as const;

export type ApiReportGrain = (typeof apiReportGrains)[number];

export interface ApiReportFilters {
  from: string;
  to: string;
  grain: ApiReportGrain;
  timezone: string;
  service_type_id?: string | null;
  assignee_id?: number | null;
  source_channel?: ApiServiceRequestSourceChannel | null;
  status?: ApiServiceRequestStatus | null;
}

export interface ApiReportSummaryCard {
  key: string;
  label: string;
  value: number;
  helper?: string | null;
  href?: string | null;
}

export interface ApiReportSeriesPoint {
  key: string;
  label: string;
  bucket_start: string;
  value: number;
}

export interface ApiReportBreakdownRow {
  key: string;
  label: string;
  value: number;
  helper?: string | null;
  href?: string | null;
}

export interface ApiReportOpenResolvedPoint {
  key: string;
  label: string;
  bucket_start: string;
  open_value: number;
  resolved_value: number;
}

export interface ApiReportWorkloadRow {
  admin_id: number;
  admin_label: string;
  active_open_assignments: number;
  unread_count: number;
  overdue_count: number;
  completions_in_range: number;
  href?: string | null;
}

export interface ApiReportTransitionRow {
  key: string;
  from_status?: string | null;
  to_status: string;
  count: number;
}

export interface ApiReportResponseTimeSummary {
  first_handled_average_hours?: number | null;
  first_handled_samples: number;
  first_customer_response_average_hours?: number | null;
  first_customer_response_samples: number;
}

export interface ApiOperationsReport {
  filters: ApiReportFilters;
  summary_cards: ApiReportSummaryCard[];
  enquiry_series: ApiReportSeriesPoint[];
  source_channel_breakdown: ApiReportBreakdownRow[];
  service_type_breakdown: ApiReportBreakdownRow[];
  open_vs_resolved_trend: ApiReportOpenResolvedPoint[];
  aging_buckets: ApiReportBreakdownRow[];
  staff_workload: ApiReportWorkloadRow[];
  funnel_current_status: ApiReportBreakdownRow[];
  funnel_transition_counts: ApiReportTransitionRow[];
  repeat_customer_breakdown: ApiReportBreakdownRow[];
  response_times: ApiReportResponseTimeSummary;
}

export interface ApiAdminActivityRow {
  key: string;
  actor_label: string;
  action: string;
  count: number;
  href?: string | null;
}

export interface ApiAdminActivityReport {
  filters: ApiReportFilters;
  summary_cards: ApiReportSummaryCard[];
  activity_series: ApiReportSeriesPoint[];
  actor_breakdown: ApiReportBreakdownRow[];
  action_breakdown: ApiReportBreakdownRow[];
  rows: ApiAdminActivityRow[];
}

export type ApiContentActivityType = "page" | "blog_post" | "testimonial";
export type ApiContentActivityAction =
  | "create"
  | "submit"
  | "approve"
  | "reject"
  | "publish"
  | "archive";

export interface ApiContentActivityRow {
  key: string;
  content_type: ApiContentActivityType;
  action: ApiContentActivityAction;
  count: number;
  href?: string | null;
}

export interface ApiContentActivityReport {
  filters: ApiReportFilters;
  summary_cards: ApiReportSummaryCard[];
  activity_series: ApiReportSeriesPoint[];
  content_type_breakdown: ApiReportBreakdownRow[];
  action_breakdown: ApiReportBreakdownRow[];
  rows: ApiContentActivityRow[];
}

export interface ApiReportParams {
  from?: string;
  to?: string;
  grain?: ApiReportGrain;
  service_type_id?: string;
  assignee_id?: number;
  source_channel?: ApiServiceRequestSourceChannel | "";
  status?: ApiServiceRequestStatus | "";
}
