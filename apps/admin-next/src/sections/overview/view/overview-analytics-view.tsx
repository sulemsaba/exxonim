import type { ApiConsultation, ApiActivityEvent } from '@exxonim/admin-core/types/api';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminErrorMessage } from '@exxonim/admin-core/utils/admin';
import { getAdminDashboardSummary } from '@exxonim/admin-core/services/adminDashboardService';
import { listAdminConsultations } from '@exxonim/admin-core/services/adminConsultationService';

import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsOrderTimeline } from '../analytics-order-timeline';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';

// ----------------------------------------------------------------------

const SERVICE_LABELS = ['Registration', 'Licensing', 'Tax & Returns', 'Compliance'] as const;
const CHANNEL_LABELS = ['Website Form', 'WhatsApp', 'Email', 'Referral'] as const;
const BRAND_MARK = '/assets/branding/exxonim-favicon-light.png';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

type ServiceLabel = (typeof SERVICE_LABELS)[number];
type ChannelLabel = (typeof CHANNEL_LABELS)[number];
type TimeWindow = {
  label: string;
  start: Date;
  end: Date;
};

function shiftDays(value: Date, days: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfWeek(value: Date) {
  const next = new Date(value);
  next.setHours(0, 0, 0, 0);
  const weekdayOffset = (next.getDay() + 6) % 7;
  next.setDate(next.getDate() - weekdayOffset);
  return next;
}

function startOfMonth(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), 1);
}

function buildWeekWindows(count: number, now: Date): TimeWindow[] {
  const current = startOfWeek(now);

  return Array.from({ length: count }, (_, index) => {
    const start = shiftDays(current, (index - (count - 1)) * 7);
    const end = shiftDays(start, 7);

    return {
      label: new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(start),
      start,
      end,
    };
  });
}

function buildMonthWindows(count: number, now: Date): TimeWindow[] {
  const current = startOfMonth(now);

  return Array.from({ length: count }, (_, index) => {
    const start = new Date(current.getFullYear(), current.getMonth() - (count - 1) + index, 1);
    const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

    return {
      label: new Intl.DateTimeFormat(undefined, { month: 'short' }).format(start),
      start,
      end,
    };
  });
}

function inWindow(value: string | number | null | undefined, start: Date, end: Date) {
  if (!value) {
    return false;
  }

  const next = new Date(value);
  return next >= start && next < end;
}

function countByWindows<T>(
  items: T[],
  windows: TimeWindow[],
  getDate: (item: T) => string | number | null | undefined,
  predicate?: (item: T) => boolean
) {
  return windows.map((window) =>
    items.filter((item) => (!predicate || predicate(item)) && inWindow(getDate(item), window.start, window.end))
      .length
  );
}

function countInDays<T>(
  items: T[],
  getDate: (item: T) => string | number | null | undefined,
  end: Date,
  days: number,
  predicate?: (item: T) => boolean
) {
  const start = shiftDays(end, -days);
  return items.filter((item) => (!predicate || predicate(item)) && inWindow(getDate(item), start, end)).length;
}

function percentChange(current: number, previous: number) {
  if (!current && !previous) {
    return 0;
  }

  if (!previous) {
    return current > 0 ? 100 : 0;
  }

  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function formatTrend(value: number) {
  const rounded = Number(value.toFixed(1));
  return `${rounded >= 0 ? '+' : ''}${rounded}%`;
}

function seriesDelta(series: number[]) {
  return percentChange(series.at(-1) ?? 0, series.at(-2) ?? 0);
}

function clipText(value: string | null | undefined, limit: number) {
  const normalized = value?.replace(/\s+/g, ' ').trim() ?? '';

  if (normalized.length <= limit) {
    return normalized;
  }

  return `${normalized.slice(0, limit - 1).trimEnd()}…`;
}

function isActiveConsultation(item: ApiConsultation) {
  return item.status === 'pending' || item.status === 'contacted';
}

function consultationText(item: ApiConsultation) {
  return [item.company, item.message, item.notes, item.public_notes]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function inferService(item: ApiConsultation): ServiceLabel {
  const text = consultationText(item);

  if (
    text.includes('registration') ||
    text.includes('register') ||
    text.includes('incorporat') ||
    text.includes('brela') ||
    text.includes('ngo')
  ) {
    return 'Registration';
  }

  if (text.includes('license') || text.includes('licence') || text.includes('permit') || text.includes('renewal')) {
    return 'Licensing';
  }

  if (
    text.includes('tax') ||
    text.includes('vat') ||
    text.includes('tin') ||
    text.includes('return') ||
    text.includes('returns') ||
    text.includes('tra')
  ) {
    return 'Tax & Returns';
  }

  return 'Compliance';
}

function inferChannel(item: ApiConsultation): ChannelLabel {
  const text = consultationText(item);

  if (text.includes('whatsapp') || text.includes('call') || text.includes('phone')) {
    return 'WhatsApp';
  }

  if (text.includes('referral') || text.includes('referred') || text.includes('recommended')) {
    return 'Referral';
  }

  if (text.includes('email') || text.includes('mail')) {
    return 'Email';
  }

  return 'Website Form';
}

function countByLabel<T extends string>(labels: readonly T[], resolver: (label: T) => number) {
  return labels.map((label) => ({ label, value: resolver(label) }));
}

function timelineType(activity: ApiActivityEvent) {
  switch (activity.action_type) {
    case 'consultation_received':
      return 'order1';
    case 'published':
      return 'order2';
    case 'updated':
      return 'order3';
    case 'settings_updated':
      return 'order4';
    default:
      return 'order5';
  }
}

function activityTitle(activity: ApiActivityEvent) {
  return clipText(activity.detail || activity.target_label, 72) || activity.target_label;
}

function priorityDescription(item: ApiConsultation) {
  const service = inferService(item);
  const statusCopy =
    item.status === 'pending'
      ? 'is awaiting follow-up.'
      : item.status === 'contacted'
        ? 'is in active delivery.'
        : item.status === 'completed'
          ? 'has been completed.'
          : 'is currently closed.';

  return `${service} request ${statusCopy} ${clipText(item.message, 88)}`;
}

function consultationPriority(item: ApiConsultation) {
  switch (item.status) {
    case 'pending':
      return 0;
    case 'contacted':
      return 1;
    case 'completed':
      return 2;
    default:
      return 3;
  }
}

export function OverviewAnalyticsView() {
  const summaryQuery = useQuery({
    queryKey: ['admin-next', 'dashboard', 'overview-summary'],
    queryFn: getAdminDashboardSummary,
  });

  const consultationsQuery = useQuery({
    queryKey: ['admin-next', 'dashboard', 'overview-consultations'],
    queryFn: () => listAdminConsultations({ page: 1, limit: 100 }),
  });

  const dashboard = useMemo(() => {
    if (!summaryQuery.data || !consultationsQuery.data) {
      return null;
    }

    const now = new Date();
    const weeklyWindows = buildWeekWindows(8, now);
    const radarWindows = buildWeekWindows(6, now);
    const monthlyWindows = buildMonthWindows(6, now);
    const consultations = consultationsQuery.data;
    const summary = summaryQuery.data;
    const activeConsultations = consultations.filter(isActiveConsultation);
    const pendingConsultations = consultations.filter((item) => item.status === 'pending');
    const completedConsultations = consultations.filter((item) => item.status === 'completed');
    const consultationActivity = summary.recent_activity.filter((item) => item.resource_type === 'consultation');
    const unassignedActiveCases = activeConsultations.filter((item) => !item.assigned_to).length;
    const overdueCases = activeConsultations.filter((item) => {
      const updatedAt = new Date(item.updated_at);
      return now.getTime() - updatedAt.getTime() > 3 * MS_PER_DAY;
    }).length;

    const newRequestsThisWeek = countInDays(consultations, (item) => item.created_at, now, 7);
    const unreadUpdatesThisWeek = countInDays(consultationActivity, (item) => item.created_at, now, 7);

    const newRequestSeries = countByWindows(consultations, weeklyWindows, (item) => item.created_at);
    const activeCaseSeries = weeklyWindows.map((window) =>
      consultations.filter(
        (item) => isActiveConsultation(item) && new Date(item.created_at) < window.end
      ).length
    );
    const pendingSeries = weeklyWindows.map((window) =>
      consultations.filter((item) => item.status === 'pending' && new Date(item.created_at) < window.end)
        .length
    );
    const unreadSeries = countByWindows(consultationActivity, weeklyWindows, (item) => item.created_at);

    const serviceCounts = countByLabel(SERVICE_LABELS, (label) =>
      activeConsultations.filter((item) => inferService(item) === label).length
    );
    const requestChannels = CHANNEL_LABELS.map((label) => ({
      label,
      total: consultations.filter((item) => inferChannel(item) === label).length,
      value:
        label === 'Website Form'
          ? 'website'
          : label === 'WhatsApp'
            ? 'whatsapp'
            : label === 'Email'
              ? 'email'
              : 'referral',
    }));

    const monthlyNewRequests = countByWindows(consultations, monthlyWindows, (item) => item.created_at);
    const monthlyActiveWork = countByWindows(
      consultations,
      monthlyWindows,
      (item) => item.updated_at,
      isActiveConsultation
    );
    const currentMonthRequests = monthlyNewRequests.at(-1) ?? 0;
    const previousMonthRequests = monthlyNewRequests.at(-2) ?? 0;

    const completionSeries = SERVICE_LABELS.map((label) => {
      const currentMonthItems = consultations.filter(
        (item) =>
          inferService(item) === label &&
          inWindow(item.created_at, monthlyWindows.at(-1)?.start ?? now, monthlyWindows.at(-1)?.end ?? now)
      );
      const previousMonthItems = consultations.filter(
        (item) =>
          inferService(item) === label &&
          inWindow(item.created_at, monthlyWindows.at(-2)?.start ?? now, monthlyWindows.at(-2)?.end ?? now)
      );

      const currentRate = currentMonthItems.length
        ? Math.round(
            (currentMonthItems.filter((item) => item.status === 'completed').length / currentMonthItems.length) *
              100
          )
        : 0;
      const previousRate = previousMonthItems.length
        ? Math.round(
            (previousMonthItems.filter((item) => item.status === 'completed').length / previousMonthItems.length) *
              100
          )
        : 0;

      return { currentRate, previousRate };
    });

    const currentCompletionAverage =
      completionSeries.reduce((total, item) => total + item.currentRate, 0) / SERVICE_LABELS.length;
    const previousCompletionAverage =
      completionSeries.reduce((total, item) => total + item.previousRate, 0) / SERVICE_LABELS.length;

    const priorityCases = [...consultations]
      .sort((left, right) => {
        const priorityDifference = consultationPriority(left) - consultationPriority(right);

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return new Date(right.updated_at).getTime() - new Date(left.updated_at).getTime();
      })
      .slice(0, 5)
      .map((item) => ({
        id: String(item.id),
        title: item.company || item.full_name,
        coverUrl: BRAND_MARK,
        description: priorityDescription(item),
        postedAt: item.updated_at,
      }));

    const consultationTimeline = consultationActivity.length
      ? consultationActivity.slice(0, 5).map((item) => ({
          id: item.id,
          type: timelineType(item),
          title: activityTitle(item),
          time: item.created_at,
        }))
      : consultations.slice(0, 5).map((item) => ({
          id: `consultation-${item.id}`,
          type: item.status === 'pending' ? 'order1' : 'order3',
          title: clipText(`New request received ${item.tracking_id}`, 72),
          time: item.created_at,
        }));

    const taskItems = [
      {
        id: 'task-review-requests',
        name: `Review new consultation requests (${newRequestsThisWeek})`,
      },
      {
        id: 'task-assign-cases',
        name: `Assign consultants to pending cases (${unassignedActiveCases})`,
      },
      {
        id: 'task-follow-up-documents',
        name: `Follow up client documents (${pendingConsultations.length})`,
      },
      {
        id: 'task-overdue-cases',
        name: `Check overdue consultations (${overdueCases})`,
      },
      {
        id: 'task-send-updates',
        name: `Send status updates (${unreadUpdatesThisWeek})`,
      },
      {
        id: 'task-verify-files',
        name: `Verify completed files (${completedConsultations.length})`,
      },
    ];

    return {
      statCards: [
        {
          title: 'New Requests',
          total: newRequestsThisWeek,
          percent: seriesDelta(newRequestSeries),
          subtitle: `${newRequestsThisWeek} this week`,
          icon: <Iconify icon="solar:chat-round-call-bold" width={28} />,
          chart: newRequestSeries,
        },
        {
          title: 'Active Consultations',
          total: activeConsultations.length,
          percent: seriesDelta(activeCaseSeries),
          subtitle: `${activeConsultations.length} open cases`,
          icon: <Iconify icon="solar:file-text-bold" width={28} />,
          color: 'secondary' as const,
          chart: activeCaseSeries,
        },
        {
          title: 'Awaiting Client Action',
          total: pendingConsultations.length,
          percent: seriesDelta(pendingSeries),
          subtitle: `${pendingConsultations.length} pending`,
          icon: <Iconify icon="solar:clock-circle-bold" width={28} />,
          color: 'warning' as const,
          chart: pendingSeries,
        },
        {
          title: 'Unread Updates',
          total: unreadUpdatesThisWeek,
          percent: seriesDelta(unreadSeries),
          subtitle: `${unreadUpdatesThisWeek} new messages`,
          icon: <Iconify icon="solar:bell-bing-bold" width={28} />,
          color: 'error' as const,
          chart: unreadSeries,
        },
      ],
      currentCaseLoad: serviceCounts.map((item) => ({ label: item.label, value: item.value })),
      consultationRequests: {
        categories: monthlyWindows.map((item) => item.label),
        series: [
          { name: 'New Requests', data: monthlyNewRequests },
          { name: 'In Progress', data: monthlyActiveWork },
        ],
        subheader: `(${formatTrend(percentChange(currentMonthRequests, previousMonthRequests))}) than last month`,
      },
      completionRate: {
        categories: SERVICE_LABELS,
        series: [
          { name: 'This month', data: completionSeries.map((item) => item.currentRate) },
          { name: 'Last month', data: completionSeries.map((item) => item.previousRate) },
        ],
        subheader: `(${formatTrend(percentChange(currentCompletionAverage, previousCompletionAverage))}) than last month`,
      },
      caseTrends: {
        categories: radarWindows.map((item) => item.label),
        series: [
          {
            name: 'Received',
            data: countByWindows(consultations, radarWindows, (item) => item.created_at),
          },
          {
            name: 'In Progress',
            data: countByWindows(
              consultations,
              radarWindows,
              (item) => item.updated_at,
              isActiveConsultation
            ),
          },
          {
            name: 'Completed',
            data: countByWindows(
              consultations,
              radarWindows,
              (item) => item.updated_at,
              (item) => item.status === 'completed'
            ),
          },
        ],
      },
      priorityCases,
      consultationTimeline,
      requestChannels,
      taskItems,
    };
  }, [consultationsQuery.data, summaryQuery.data]);

  if (summaryQuery.isLoading || consultationsQuery.isLoading) {
    return (
      <DashboardContent maxWidth="xl">
        <Alert severity="info">Loading Exxonim consultation operations...</Alert>
      </DashboardContent>
    );
  }

  if (summaryQuery.isError || consultationsQuery.isError) {
    return (
      <DashboardContent maxWidth="xl">
        <Alert severity="error">
          {getAdminErrorMessage(
            summaryQuery.error || consultationsQuery.error,
            'Unable to load the consultation dashboard.'
          )}
        </Alert>
      </DashboardContent>
    );
  }

  if (!dashboard) {
    return (
      <DashboardContent maxWidth="xl">
        <Alert severity="info">Consultation dashboard data is not available yet.</Alert>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 1.5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Typography variant="body1" sx={{ mb: { xs: 3, md: 5 }, color: 'text.secondary' }}>
        Here&apos;s what is happening across consultations, client requests, and service delivery
        today.
      </Typography>

      <Grid container spacing={3}>
        {dashboard.statCards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
            <AnalyticsWidgetSummary
              title={card.title}
              percent={card.percent}
              total={card.total}
              subtitle={card.subtitle}
              color={card.color}
              icon={card.icon}
              chart={{
                categories: buildWeekWindows(card.chart.length, new Date()).map((item) => item.label),
                series: card.chart,
              }}
            />
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Current Case Load"
            chart={{
              series: dashboard.currentCaseLoad,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Consultation Requests"
            subheader={dashboard.consultationRequests.subheader}
            chart={{
              categories: dashboard.consultationRequests.categories,
              valueSuffix: ' requests',
              series: dashboard.consultationRequests.series,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Completion Rate"
            subheader={dashboard.completionRate.subheader}
            chart={{
              categories: [...dashboard.completionRate.categories],
              series: dashboard.completionRate.series,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentSubject
            title="Case Trends"
            chart={{
              categories: dashboard.caseTrends.categories,
              series: dashboard.caseTrends.series,
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsNews
            title="Priority Cases"
            subheader="Consultations that need attention first."
            list={dashboard.priorityCases}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsOrderTimeline
            title="Consultation Timeline"
            subheader="Latest intake and follow-up activity."
            list={dashboard.consultationTimeline}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsTrafficBySite
            title="Requests by Channel"
            subheader="Source mix based on captured and inferred intake signals."
            list={dashboard.requestChannels}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsTasks
            title="Today’s Tasks"
            subheader="Operational follow-up from the live consultation queue."
            list={dashboard.taskItems}
          />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
