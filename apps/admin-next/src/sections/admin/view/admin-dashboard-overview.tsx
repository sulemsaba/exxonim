import type { PaletteColorKey } from 'src/theme/core';
import type {
  ApiActivityEvent,
  ApiAdminDashboardAlert,
  ApiAdminDashboardMetric,
  ApiAdminDashboardSummary,
} from '@exxonim/admin-core/types/api';

import { useMemo } from 'react';
import { varAlpha } from 'minimal-shared/utils';
import { useQuery } from '@tanstack/react-query';
import { adminRoutes } from '@exxonim/admin-core/lib/adminRoutes';
import { getAdminStatusTone, getAdminErrorMessage } from '@exxonim/admin-core/utils/admin';
import { getAdminDashboardSummary } from '@exxonim/admin-core/services/adminDashboardService';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

import { AnalyticsCurrentVisits } from 'src/sections/overview/analytics-current-visits';
import { AnalyticsWebsiteVisits } from 'src/sections/overview/analytics-website-visits';
import { AnalyticsOrderTimeline } from 'src/sections/overview/analytics-order-timeline';

// ----------------------------------------------------------------------

type ShortcutItem = {
  title: string;
  description: string;
  href: string;
  icon: string;
};

type MetricCardProps = {
  metric: ApiAdminDashboardMetric;
  color: PaletteColorKey;
  icon: string;
};

type MuiChipColor = 'default' | 'success' | 'warning' | 'error' | 'info';

const BRAND_MARK_SRC = '/assets/branding/exxonim-favicon-light.png';
const BRAND_WORDMARK_SRC = '/assets/branding/exxonim-wordmark.webp';

const pageShortcuts: ShortcutItem[] = [
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
    title: 'Career Page',
    description: 'Hiring narrative and recruiting landing copy.',
    href: adminRoutes.pageShortcut('careers'),
    icon: 'solar:case-round-bold',
  },
];

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function seoHealthScore(value: string) {
  switch (value) {
    case 'clean':
      return 100;
    case 'warning':
      return 68;
    default:
      return 36;
  }
}

function statusColor(status?: string | null): MuiChipColor {
  if (status === 'clean') {
    return 'success';
  }

  if (status === 'error') {
    return 'error';
  }

  switch (getAdminStatusTone(status)) {
    case 'published':
    case 'active':
      return 'success';
    case 'danger':
    case 'inactive':
      return 'error';
    case 'warning':
      return 'warning';
    default:
      return 'default';
  }
}

function LoadingState({ label }: { label: string }) {
  return (
    <DashboardContent maxWidth="xl">
      <Alert severity="info">{label}</Alert>
    </DashboardContent>
  );
}

function ErrorState({ error }: { error: unknown }) {
  return (
    <DashboardContent maxWidth="xl">
      <Alert severity="error">{getAdminErrorMessage(error)}</Alert>
    </DashboardContent>
  );
}

function getMetric(summary: ApiAdminDashboardSummary, key: string, fallbackLabel: string) {
  return (
    summary.metrics.find((metric) => metric.key === key) ??
    summary.metrics.find((metric) => metric.label === fallbackLabel) ?? {
      key,
      label: fallbackLabel,
      value: 0,
      helper: '',
      href: undefined,
    }
  );
}

function timelineTypeFor(activity: ApiActivityEvent) {
  switch (activity.resource_type) {
    case 'blog_post':
      return 'order1';
    case 'page':
      return 'order2';
    case 'job':
      return 'order3';
    case 'setting':
    case 'navigation':
    case 'pricing':
    case 'testimonial':
      return 'order4';
    default:
      return 'order5';
  }
}

function MetricCard({ metric, color, icon }: MetricCardProps) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        p: 3,
        boxShadow: 'none',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 3,
        backgroundColor: 'common.white',
        color: `${color}.darker`,
        backgroundImage: `linear-gradient(135deg, ${varAlpha(theme.vars.palette[color].lighterChannel, 0.54)} 0%, ${varAlpha(theme.vars.palette[color].lightChannel, 0.72)} 100%)`,
      }}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={(currentTheme) => ({
            width: 52,
            height: 52,
            display: 'grid',
            flexShrink: 0,
            placeItems: 'center',
            borderRadius: 2,
            color: currentTheme.vars.palette.common.white,
            bgcolor: currentTheme.vars.palette[color].main,
            boxShadow: `0 12px 24px ${varAlpha(currentTheme.vars.palette[color].mainChannel, 0.28)}`,
          })}
        >
          <Iconify icon={icon} width={26} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline" sx={{ display: 'block', color: 'inherit', opacity: 0.84 }}>
            {metric.label}
          </Typography>
          <Typography variant="h3" sx={{ mt: 0.75, color: 'inherit' }}>
            {metric.value}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1.25, color: 'inherit', opacity: 0.82 }}>
            {metric.helper || 'Live Exxonim admin data'}
          </Typography>

          {metric.href ? (
            <Link
              component={RouterLink}
              href={metric.href}
              underline="hover"
              sx={{ mt: 2, display: 'inline-flex', color: 'inherit', fontWeight: 700 }}
            >
              Open section
            </Link>
          ) : null}
        </Box>
      </Stack>

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: -24,
          right: -16,
          width: 180,
          height: 180,
          opacity: 0.22,
          position: 'absolute',
          color: `${color}.main`,
        }}
      />
    </Card>
  );
}

function DashboardHero({ summary }: { summary: ApiAdminDashboardSummary }) {
  const theme = useTheme();
  const focusItems = summary.content_pipeline.slice(0, 3);

  return (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 4,
        color: 'common.white',
        background: `linear-gradient(135deg, ${theme.vars.palette.primary.dark} 0%, ${theme.vars.palette.primary.main} 54%, ${theme.vars.palette.secondary.dark} 100%)`,
      }}
    >
      <Grid container>
        <Grid size={{ xs: 12, lg: 7 }}>
          <Stack spacing={3} sx={{ p: { xs: 3, md: 4 } }}>
            <Box>
              <Box
                component="img"
                alt="Exxonim"
                src={BRAND_WORDMARK_SRC}
                sx={{ height: 34, width: 'auto', display: 'block' }}
              />
              <Typography variant="h2" sx={{ mt: 2, maxWidth: 560 }}>
                Dashboard
              </Typography>
              <Typography variant="body1" sx={{ mt: 1.25, maxWidth: 460, opacity: 0.88 }}>
                Live content, site, and settings.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                label={`${summary.alerts.length} active alerts`}
                sx={{ bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.14), color: 'inherit' }}
              />
              <Chip
                label={`${summary.content_pipeline.length} content items in focus`}
                sx={{ bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.14), color: 'inherit' }}
              />
              <Chip
                label={`${summary.open_jobs.length} open roles`}
                sx={{ bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.14), color: 'inherit' }}
              />
            </Stack>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
              <Button
                component={RouterLink}
                href={adminRoutes.blogPosts}
                variant="contained"
                color="secondary"
                endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} />}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
              >
                Posts
              </Button>

              <Button
                component={RouterLink}
                href={adminRoutes.pages}
                variant="outlined"
                color="inherit"
                endIcon={<Iconify icon="solar:documents-bold" width={18} />}
                sx={{
                  alignSelf: { xs: 'stretch', sm: 'flex-start' },
                  borderColor: varAlpha(theme.vars.palette.common.whiteChannel, 0.32),
                }}
              >
                Pages
              </Button>

              <Button
                component={RouterLink}
                href={adminRoutes.settingsBrand}
                variant="text"
                color="inherit"
                endIcon={<Iconify icon="solar:palette-round-bold" width={18} />}
                sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
              >
                Brand
              </Button>
            </Stack>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 5 }}>
          <Box
            sx={{
              height: 1,
              p: { xs: 3, md: 4 },
              bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.08),
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="overline" sx={{ opacity: 0.8 }}>
              Focus
            </Typography>

            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <Box
                component="img"
                alt="Exxonim mark"
                src={BRAND_MARK_SRC}
                sx={{ width: 64, height: 64, display: 'block' }}
              />

              {focusItems.length ? (
                focusItems.map((item) => (
                  <Paper
                    key={item.id}
                    sx={{
                      p: 2,
                      borderRadius: 2.5,
                      color: 'inherit',
                      bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.12),
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle2" noWrap>
                          {item.title}
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, opacity: 0.8 }}>
                          {item.kind === 'blog_post' ? 'Post' : 'Page'} • SEO {item.seo_health} • {item.completion_percent}%
                        </Typography>
                      </Box>
                      {item.href ? (
                        <Link
                          component={RouterLink}
                          href={item.href}
                          color="inherit"
                          underline="hover"
                          sx={{ flexShrink: 0, fontWeight: 700 }}
                        >
                          Open
                        </Link>
                      ) : null}
                    </Stack>
                  </Paper>
                ))
              ) : (
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 2.5,
                    color: 'inherit',
                    bgcolor: varAlpha(theme.vars.palette.common.whiteChannel, 0.12),
                  }}
                >
                  <Typography variant="subtitle2">Queue clear</Typography>
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.8 }}>
                    No active focus items.
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Box>
        </Grid>
      </Grid>

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          right: -80,
          bottom: -120,
          width: 340,
          height: 340,
          opacity: 0.16,
          position: 'absolute',
          color: 'common.white',
        }}
      />
    </Card>
  );
}

function AlertsStrip({ alerts }: { alerts: ApiAdminDashboardAlert[] }) {
  if (!alerts.length) {
    return (
      <Paper
        variant="outlined"
        sx={{
          p: 2.25,
          borderRadius: 3,
          bgcolor: 'background.paper',
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Iconify icon="solar:verified-check-bold" width={22} />
          <Box>
            <Typography variant="subtitle2">No urgent alerts</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              All clear.
            </Typography>
          </Box>
        </Stack>
      </Paper>
    );
  }

  return (
    <Grid container spacing={2}>
      {alerts.map((alert) => (
        <Grid key={alert.id} size={{ xs: 12, md: 6, xl: 4 }}>
          <Alert
            severity={alert.severity}
            action={
              alert.href ? (
                <Button component={RouterLink} href={alert.href} color="inherit" size="small">
                  Open
                </Button>
              ) : undefined
            }
            sx={{ height: '100%', borderRadius: 2.5, alignItems: 'center' }}
          >
            <Typography variant="subtitle2">{alert.title}</Typography>
            <Typography variant="body2">{alert.message}</Typography>
          </Alert>
        </Grid>
      ))}
    </Grid>
  );
}

function FocusQueueCard({ summary }: { summary: ApiAdminDashboardSummary }) {
  return (
    <Card>
      <CardHeader
        title="Publishing focus"
        subheader="Items needing review."
      />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          {summary.content_pipeline.length ? (
            summary.content_pipeline.map((item) => (
              <Paper key={item.id} variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
                    <Box sx={{ minWidth: 0 }}>
                      {item.href ? (
                        <Link
                          component={RouterLink}
                          href={item.href}
                          underline="hover"
                          color="inherit"
                          sx={{ fontWeight: 700 }}
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <Typography variant="subtitle2">{item.title}</Typography>
                      )}
                      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                        {item.kind === 'blog_post' ? 'Blog post' : 'Page'} • /{item.slug}
                      </Typography>
                    </Box>

                    <Chip
                      size="small"
                      label={item.status}
                      color={statusColor(item.status)}
                      variant="outlined"
                    />
                  </Stack>

                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip size="small" label={`SEO ${item.seo_health}`} color={statusColor(item.seo_health)} />
                    <Chip size="small" label={`${item.completion_percent}% complete`} />
                  </Stack>
                </Stack>
              </Paper>
            ))
          ) : (
            <Alert severity="info">No content items are waiting in the current pipeline summary.</Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

function PageShortcutsCard() {
  return (
    <Card>
      <CardHeader
        title="Page shortcuts"
        subheader="Core public pages."
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          {pageShortcuts.map((item) => (
            <Grid key={item.href} size={{ xs: 12, sm: 6, xl: 4 }}>
              <Paper
                component={RouterLink}
                href={item.href}
                variant="outlined"
                sx={{
                  p: 2,
                  gap: 1.25,
                  height: '100%',
                  display: 'flex',
                  color: 'inherit',
                  borderRadius: 2.5,
                  textDecoration: 'none',
                  flexDirection: 'column',
                  transition: (theme) =>
                    theme.transitions.create(['transform', 'box-shadow', 'border-color'], {
                      duration: theme.transitions.duration.shorter,
                    }),
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main',
                    boxShadow: (theme) => `0 14px 32px ${varAlpha(theme.vars.palette.primary.mainChannel, 0.12)}`,
                  },
                }}
              >
                <Box
                  sx={(theme) => ({
                    width: 42,
                    height: 42,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2,
                    color: 'primary.main',
                    bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                  })}
                >
                  <Iconify icon={item.icon} width={24} />
                </Box>

                <Box>
                  <Typography variant="subtitle2">{item.title}</Typography>
                  <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary' }}>
                    {item.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}

function OpenJobsCard({ summary }: { summary: ApiAdminDashboardSummary }) {
  return (
    <Card>
      <CardHeader title="Open job listings" subheader="Published roles." />
      <Divider />
      <Box sx={{ p: 1.5 }}>
        {summary.open_jobs.length ? (
          summary.open_jobs.map((job) => (
            <ListItem
              key={job.id}
              secondaryAction={
                job.href ? (
                  <Button component={RouterLink} href={job.href} size="small" color="inherit">
                    Open
                  </Button>
                ) : null
              }
              sx={{
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                alignItems: 'flex-start',
                '&:not(:last-of-type)': { mb: 0.75 },
                '&:hover': {
                  bgcolor: 'background.neutral',
                },
              }}
            >
              <ListItemText
                primary={job.title}
                secondary={`${job.department} • ${job.employment_type} • ${job.location || 'Location pending'}${
                  job.posted_at ? ` • ${formatDateTime(job.posted_at)}` : ''
                }`}
                primaryTypographyProps={{ variant: 'subtitle2' }}
                secondaryTypographyProps={{ variant: 'body2', sx: { mt: 0.5 } }}
              />
              <Chip
                size="small"
                label={job.status}
                color={statusColor(job.status)}
                variant="outlined"
                sx={{ mr: 1.5, mt: 0.25 }}
              />
            </ListItem>
          ))
        ) : (
          <Box sx={{ p: 2 }}>
            <Alert severity="info">No published job listings are visible in the current summary.</Alert>
          </Box>
        )}
      </Box>
    </Card>
  );
}

export function AdminDashboardOverview() {
  const theme = useTheme();
  const query = useQuery({
    queryKey: ['admin-next', 'dashboard'],
    queryFn: getAdminDashboardSummary,
  });

  const dashboard = useMemo(() => {
    if (!query.data) {
      return null;
    }

    const summary = query.data;
    const draftPosts = getMetric(summary, 'draft_posts', 'Draft Posts');
    const publishedPages = getMetric(summary, 'published_pages', 'Published Pages');
    const publishedPosts = getMetric(summary, 'published_posts', 'Published Posts');
    const openJobs = getMetric(summary, 'open_jobs', 'Open Job Listings');

    return {
      summary,
      metrics: [
        { metric: publishedPosts, color: 'primary' as const, icon: 'solar:document-text-bold' },
        { metric: draftPosts, color: 'warning' as const, icon: 'solar:pen-bold' },
        { metric: publishedPages, color: 'info' as const, icon: 'solar:documents-bold' },
        { metric: openJobs, color: 'secondary' as const, icon: 'solar:case-bold' },
      ],
      mixChart: {
        series: [
          { label: 'Published posts', value: publishedPosts.value },
          { label: 'Draft posts', value: draftPosts.value },
          { label: 'Live pages', value: publishedPages.value },
          { label: 'Open roles', value: openJobs.value },
        ],
      },
      readinessChart: {
        categories: summary.content_pipeline.map((item) => item.title.length > 18 ? `${item.title.slice(0, 18)}...` : item.title),
        series: [
          {
            name: 'Completion',
            data: summary.content_pipeline.map((item) => item.completion_percent),
          },
          {
            name: 'SEO readiness',
            data: summary.content_pipeline.map((item) => seoHealthScore(item.seo_health)),
          },
        ],
      },
      activityList: summary.recent_activity.map((activity) => ({
        id: activity.id,
        type: timelineTypeFor(activity),
        title: `${activity.actor_name} • ${activity.target_label}`,
        time: activity.created_at,
      })),
    };
  }, [query.data]);

  if (query.isLoading) {
    return <LoadingState label="Loading Exxonim dashboard..." />;
  }

  if (query.isError) {
    return <ErrorState error={query.error} />;
  }

  if (!dashboard) {
    return <LoadingState label="Dashboard summary unavailable." />;
  }

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={3}>
        <DashboardHero summary={dashboard.summary} />

        <AlertsStrip alerts={dashboard.summary.alerts} />

        <Grid container spacing={3}>
          {dashboard.metrics.map((item) => (
            <Grid key={item.metric.key} size={{ xs: 12, sm: 6, xl: 3 }}>
              <MetricCard metric={item.metric} color={item.color} icon={item.icon} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <AnalyticsWebsiteVisits
              title="Content readiness"
              subheader="Completion versus SEO readiness across the current publishing queue"
              chart={{
                categories: dashboard.readinessChart.categories,
                colors: [hexAlpha(theme.palette.primary.dark, 0.88), hexAlpha(theme.palette.secondary.dark, 0.78)],
                series: dashboard.readinessChart.series,
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <AnalyticsCurrentVisits
              title="Operational mix"
              subheader="Live distribution of the dashboard summary totals"
              chart={{
                colors: [
                  theme.palette.primary.main,
                  theme.palette.warning.main,
                  theme.palette.info.main,
                  theme.palette.secondary.dark,
                ],
                series: dashboard.mixChart.series,
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <FocusQueueCard summary={dashboard.summary} />
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <AnalyticsOrderTimeline
              title="Recent activity"
              subheader="Latest events coming back from the dashboard service"
              list={dashboard.activityList}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <PageShortcutsCard />
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <OpenJobsCard summary={dashboard.summary} />
          </Grid>
        </Grid>
      </Stack>
    </DashboardContent>
  );
}
