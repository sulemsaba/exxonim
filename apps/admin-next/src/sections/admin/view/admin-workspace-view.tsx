import type { ReactNode } from 'react';
import type {
  ApiPage,
  ApiAdminRole,
  ApiCareerJob,
  ApiBlogAuthor,
  ApiPricingPlan,
  ApiTestimonial,
  ApiBlogCategory,
  ApiNavigationItem,
  ApiAdminManagedUser,
  ApiAdminDashboardSummary,
} from '@exxonim/admin-core/types/api';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@exxonim/admin-core/contexts/AuthContext';
import { getAdminPricingPlans } from '@exxonim/admin-core/services/adminPricingService';
import { getAdminNavigation } from '@exxonim/admin-core/services/adminNavigationService';
import { getAdminJob, getAdminJobs } from '@exxonim/admin-core/services/adminJobsService';
import { getAdminPage, getAdminPages } from '@exxonim/admin-core/services/adminPageService';
import { getAdminTestimonials } from '@exxonim/admin-core/services/adminTestimonialService';
import { getAdminDashboardSummary } from '@exxonim/admin-core/services/adminDashboardService';
import {
  getAdminRoles,
  getAdminUsers,
} from '@exxonim/admin-core/services/adminAccessRolesService';
import {
  listAdminBlogAuthors,
  listAdminBlogCategories,
} from '@exxonim/admin-core/services/adminBlogService';
import {
  getFooterSetting,
  getSeoDefaultsSetting,
} from '@exxonim/admin-core/services/adminStructuredSettingsService';
import {
  matchAdminRoute,
  type AdminRouteMatch,
  isAdminSectionRestrictedForRole,
} from '@exxonim/admin-core/lib/adminRoutes';
import {
  prettyJson,
  formatAdminRole,
  getAdminStatusTone,
  getAdminErrorMessage,
  flattenNavigationItems,
} from '@exxonim/admin-core/utils/admin';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { DashboardContent } from 'src/layouts/dashboard';

import { NotFoundView } from 'src/sections/error';
import { OverviewAnalyticsView } from 'src/sections/overview/view';
import { BlogPostsRoutePanel } from 'src/sections/admin/view/admin-blog-panels';
import {
  BrandSettingsPanel,
  ContactSettingsPanel,
} from 'src/sections/admin/view/admin-settings-panels';

// ----------------------------------------------------------------------

type MuiChipColor = 'default' | 'success' | 'warning' | 'error' | 'info';

type TableColumn<Row> = {
  header: string;
  render: (row: Row) => ReactNode;
  align?: 'left' | 'center' | 'right';
};

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function statusColor(status?: string | null): MuiChipColor {
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

function StatusChip({ status }: { status?: string | null }) {
  return <Chip size="small" label={status || 'unknown'} color={statusColor(status)} variant="outlined" />;
}

function LoadingState({ label }: { label: string }) {
  return <Alert severity="info">{label}</Alert>;
}

function ErrorState({ error }: { error: unknown }) {
  return <Alert severity="error">{getAdminErrorMessage(error)}</Alert>;
}

function JsonCard({ title, value, subtitle }: { title: string; value: unknown; subtitle?: string }) {
  return (
    <Card>
      <CardHeader title={title} subheader={subtitle} />
      <Divider />
      <CardContent>
        <Box
          component="pre"
          sx={{
            m: 0,
            p: 2,
            borderRadius: 2,
            bgcolor: 'grey.100',
            color: 'text.secondary',
            overflowX: 'auto',
            fontSize: 13,
          }}
        >
          {prettyJson(value)}
        </Box>
      </CardContent>
    </Card>
  );
}

function RecordsCard<Row>({ title, subtitle, rows, columns, emptyMessage = 'No records found.' }: { title: string; subtitle?: string; rows: Row[]; columns: TableColumn<Row>[]; emptyMessage?: string }) {
  return (
    <Card>
      <CardHeader title={title} subheader={subtitle} />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {rows.length ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.header} align={column.align ?? 'left'}>
                    {column.header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow hover key={index}>
                  {columns.map((column) => (
                    <TableCell key={column.header} align={column.align ?? 'left'}>
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Box sx={{ p: 3 }}>
            <Alert severity="info">{emptyMessage}</Alert>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function MigrationNotice({ match, title, detail }: { match: AdminRouteMatch; title: string; detail: string }) {
  return (
    <Alert severity="warning" sx={{ mb: 3 }}>
      <strong>{title}</strong> {detail} Route mode: <code>{match.mode}</code>.
    </Alert>
  );
}

function PageShell({ match, children }: { match: AdminRouteMatch; children: ReactNode }) {
  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={3}>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, color: 'text.secondary' }}>
            {match.breadcrumbs.map((breadcrumb, index) => (
              <Box key={`${breadcrumb.label}-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                {breadcrumb.href ? (
                  <Link component={RouterLink} href={breadcrumb.href} color="inherit" underline="hover">
                    {breadcrumb.label}
                  </Link>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {breadcrumb.label}
                  </Typography>
                )}
                {index < match.breadcrumbs.length - 1 ? <Typography variant="body2">/</Typography> : null}
              </Box>
            ))}
          </Box>
          <Typography variant="h3">{match.title}</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 900 }}>
            {match.description}
          </Typography>
        </Stack>
        {children}
      </Stack>
    </DashboardContent>
  );
}

function BlogAnalyticsPanel() {
  const query = useQuery({
    queryKey: ['admin-next', 'blog-analytics'],
    queryFn: getAdminDashboardSummary,
  });

  if (query.isLoading) {
    return <LoadingState label="Loading blog analytics..." />;
  }
  if (query.isError) {
    return <ErrorState error={query.error} />;
  }

  const dashboard = query.data;

  if (!dashboard) {
    return <LoadingState label="Blog analytics unavailable." />;
  }

  const metrics = dashboard.metrics.filter((metric) => metric.key.includes('post') || metric.key.includes('draft'));
  const summary: ApiAdminDashboardSummary = { ...dashboard, metrics };

  return (
    <Stack spacing={3}>
      <Grid container spacing={3}>
        {summary.metrics.map((metric) => (
          <Grid key={metric.key} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                  {metric.label}
                </Typography>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {metric.value}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                  {metric.helper || 'Live blog metric'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <RecordsCard
        title="Blog pipeline"
        subtitle="SEO and publishing health from the dashboard composition service"
        rows={dashboard.content_pipeline.filter((item) => item.kind === 'blog_post')}
        columns={[
          { header: 'Title', render: (row) => row.title },
          { header: 'Status', render: (row) => <StatusChip status={row.status} /> },
          { header: 'SEO', render: (row) => row.seo_health },
          { header: 'Complete', render: (row) => `${row.completion_percent}%`, align: 'right' },
        ]}
      />
    </Stack>
  );
}

function BlogCategoriesPanel() {
  const query = useQuery({ queryKey: ['admin-next', 'blog-categories'], queryFn: listAdminBlogCategories });

  if (query.isLoading) return <LoadingState label="Loading blog categories..." />;
  if (query.isError) return <ErrorState error={query.error} />;
  if (!query.data) return <LoadingState label="Blog categories unavailable." />;

  return (
    <RecordsCard<ApiBlogCategory>
      title="Blog categories"
      subtitle="Live taxonomy records"
      rows={query.data}
      columns={[
        { header: 'Name', render: (row) => row.name },
        { header: 'Slug', render: (row) => row.slug },
        { header: 'Description', render: (row) => row.description || '-' },
      ]}
    />
  );
}

function BlogAuthorsPanel() {
  const query = useQuery({ queryKey: ['admin-next', 'blog-authors'], queryFn: listAdminBlogAuthors });

  if (query.isLoading) return <LoadingState label="Loading blog authors..." />;
  if (query.isError) return <ErrorState error={query.error} />;
  if (!query.data) return <LoadingState label="Blog authors unavailable." />;

  return (
    <RecordsCard<ApiBlogAuthor>
      title="Blog authors"
      subtitle="Visible author identities from the admin API"
      rows={query.data}
      columns={[
        { header: 'Name', render: (row) => row.name },
        { header: 'Slug', render: (row) => row.slug },
        { header: 'Role', render: (row) => row.role || '-' },
      ]}
    />
  );
}

function PagesPanel({ match }: { match: AdminRouteMatch }) {
  const pagesQuery = useQuery({
    queryKey: ['admin-next', 'pages'],
    queryFn: getAdminPages,
    enabled: match.mode === 'index' || match.mode === 'shortcut',
  });
  const pageQuery = useQuery({
    queryKey: ['admin-next', 'page', match.entityId],
    queryFn: () => getAdminPage(match.entityId!),
    enabled: match.mode === 'edit' && Boolean(match.entityId),
  });

  if (match.mode === 'new') {
    return <MigrationNotice match={match} title="New page editor pending." detail="The route is mapped and ready, but the Material Kit page editor has not been rebuilt yet." />;
  }

  if (match.mode === 'edit') {
    if (pageQuery.isLoading) return <LoadingState label="Loading page record..." />;
    if (pageQuery.isError) return <ErrorState error={pageQuery.error} />;
    if (!pageQuery.data) return <LoadingState label="Page record unavailable." />;

    return (
      <Stack spacing={3}>
        <MigrationNotice match={match} title="Page editor pending." detail="The new workspace shows the live page payload while the editor UI is still under construction." />
        <JsonCard title={pageQuery.data.title} subtitle={pageQuery.data.slug} value={pageQuery.data} />
      </Stack>
    );
  }

  if (pagesQuery.isLoading) return <LoadingState label="Loading pages..." />;
  if (pagesQuery.isError) return <ErrorState error={pagesQuery.error} />;
  if (!pagesQuery.data) return <LoadingState label="Pages unavailable." />;

  if (match.mode === 'shortcut' && match.pageSlug) {
    const page = pagesQuery.data.find((item) => item.slug === match.pageSlug);

    return (
      <Stack spacing={3}>
        <MigrationNotice match={match} title="Shortcut route captured." detail="Shortcut pages resolve correctly inside the new admin shell." />
        <JsonCard title={page?.title || 'Page not found'} subtitle={match.pageSlug} value={page || { slug: match.pageSlug, missing: true }} />
      </Stack>
    );
  }

  return (
    <RecordsCard<ApiPage>
      title="Pages"
      subtitle="Public content records available through the admin API"
      rows={pagesQuery.data}
      columns={[
        { header: 'Title', render: (row) => row.title },
        { header: 'Slug', render: (row) => row.slug },
        { header: 'Status', render: (row) => <StatusChip status={row.status} /> },
        { header: 'Updated', render: (row) => formatDateTime(row.updated_at), align: 'right' },
      ]}
    />
  );
}

function JobsPanel({ match }: { match: AdminRouteMatch }) {
  const jobsQuery = useQuery({
    queryKey: ['admin-next', 'jobs'],
    queryFn: getAdminJobs,
    enabled: match.mode === 'index',
  });
  const jobQuery = useQuery({
    queryKey: ['admin-next', 'job', match.entitySlug],
    queryFn: () => getAdminJob(match.entitySlug!),
    enabled: match.mode === 'edit' && Boolean(match.entitySlug),
  });

  if (match.mode === 'new') {
    return <MigrationNotice match={match} title="New job form pending." detail="The listing route is reserved in Material Kit, but the full form is still on the migration backlog." />;
  }

  if (match.mode === 'edit') {
    if (jobQuery.isLoading) return <LoadingState label="Loading job listing..." />;
    if (jobQuery.isError) return <ErrorState error={jobQuery.error} />;
    if (!jobQuery.data) return <LoadingState label="Job listing unavailable." />;

    return (
      <Stack spacing={3}>
        <MigrationNotice match={match} title="Job editor pending." detail="The live record is loaded so you can inspect data shape before rebuilding the full form." />
        <JsonCard title={jobQuery.data.title} subtitle={jobQuery.data.slug} value={jobQuery.data} />
      </Stack>
    );
  }

  if (jobsQuery.isLoading) return <LoadingState label="Loading job listings..." />;
  if (jobsQuery.isError) return <ErrorState error={jobsQuery.error} />;
  if (!jobsQuery.data) return <LoadingState label="Job listings unavailable." />;

  return (
    <RecordsCard<ApiCareerJob>
      title="Job listings"
      subtitle="Roles currently available in the Exxonim admin API"
      rows={jobsQuery.data}
      columns={[
        { header: 'Title', render: (row) => row.title },
        { header: 'Department', render: (row) => row.department },
        { header: 'Location', render: (row) => [row.city, row.country].filter(Boolean).join(', ') || '-' },
        { header: 'Status', render: (row) => <StatusChip status={row.status} /> },
      ]}
    />
  );
}

function SettingsPanel({ title, subtitle, queryValue }: { title: string; subtitle?: string; queryValue: ReturnType<typeof useQuery> }) {
  if (queryValue.isLoading) return <LoadingState label={`Loading ${title.toLowerCase()}...`} />;
  if (queryValue.isError) return <ErrorState error={queryValue.error} />;
  return <JsonCard title={title} subtitle={subtitle} value={queryValue.data} />;
}

function NavigationPanel() {
  const query = useQuery({ queryKey: ['admin-next', 'navigation'], queryFn: getAdminNavigation });

  if (query.isLoading) return <LoadingState label="Loading navigation items..." />;
  if (query.isError) return <ErrorState error={query.error} />;
  if (!query.data) return <LoadingState label="Navigation unavailable." />;

  const rows = flattenNavigationItems<ApiNavigationItem>(query.data);

  return (
    <RecordsCard<(ApiNavigationItem & { depth: number })>
      title="Navigation"
      subtitle="Flattened header/footer navigation tree"
      rows={rows}
      columns={[
        { header: 'Title', render: (row) => `${'  '.repeat(row.depth)}${row.title}` },
        { header: 'URL', render: (row) => row.url },
        { header: 'Kind', render: (row) => row.kind },
        { header: 'Status', render: (row) => <StatusChip status={row.status} /> },
      ]}
    />
  );
}

function PricingPanel() {
  const query = useQuery({ queryKey: ['admin-next', 'pricing'], queryFn: getAdminPricingPlans });

  if (query.isLoading) return <LoadingState label="Loading pricing plans..." />;
  if (query.isError) return <ErrorState error={query.error} />;
  if (!query.data) return <LoadingState label="Pricing plans unavailable." />;

  return (
    <RecordsCard<ApiPricingPlan>
      title="Pricing plans"
      subtitle="Service plan inventory from the admin API"
      rows={query.data}
      columns={[
        { header: 'Name', render: (row) => row.name },
        { header: 'Badge', render: (row) => row.badge || '-' },
        { header: 'Recommended', render: (row) => (row.recommended ? 'Yes' : 'No') },
        { header: 'Status', render: (row) => <StatusChip status={row.status} /> },
      ]}
    />
  );
}

function TestimonialsPanel() {
  const query = useQuery({ queryKey: ['admin-next', 'testimonials'], queryFn: getAdminTestimonials });

  if (query.isLoading) return <LoadingState label="Loading testimonials..." />;
  if (query.isError) return <ErrorState error={query.error} />;
  if (!query.data) return <LoadingState label="Testimonials unavailable." />;

  return (
    <RecordsCard<ApiTestimonial>
      title="Testimonials"
      subtitle="Customer proof content from the live admin API"
      rows={query.data}
      columns={[
        { header: 'Author', render: (row) => row.author },
        { header: 'Role', render: (row) => row.author_role || '-' },
        { header: 'Rating', render: (row) => row.rating ?? '-' },
        { header: 'Status', render: (row) => <StatusChip status={row.status} /> },
      ]}
    />
  );
}

function FooterSettingsPanel() {
  return <SettingsPanel title="Footer content" subtitle="Footer CTA and legal payload" queryValue={useQuery({ queryKey: ['admin-next', 'settings', 'footer'], queryFn: getFooterSetting })} />;
}

function SeoSettingsPanel() {
  return <SettingsPanel title="SEO defaults" subtitle="Site-wide fallback SEO payload" queryValue={useQuery({ queryKey: ['admin-next', 'settings', 'seo'], queryFn: getSeoDefaultsSetting })} />;
}

function AccessRolesPanel() {
  const usersQuery = useQuery({ queryKey: ['admin-next', 'users'], queryFn: () => getAdminUsers({ limit: 50 }) });
  const rolesQuery = useQuery({ queryKey: ['admin-next', 'roles'], queryFn: getAdminRoles });

  if (usersQuery.isLoading || rolesQuery.isLoading) return <LoadingState label="Loading access roles..." />;
  if (usersQuery.isError) return <ErrorState error={usersQuery.error} />;
  if (rolesQuery.isError) return <ErrorState error={rolesQuery.error} />;
  if (!usersQuery.data || !rolesQuery.data) return <LoadingState label="Access roles unavailable." />;

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader title="Available roles" subheader="Role names exposed by the access API" />
        <Divider />
        <CardContent>
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {rolesQuery.data.map((role: ApiAdminRole) => (
              <Chip key={role} label={formatAdminRole(role)} color="primary" variant="outlined" />
            ))}
          </Stack>
        </CardContent>
      </Card>

      <RecordsCard<ApiAdminManagedUser>
        title="Admin users"
        subtitle="Managed users loaded from the access API"
        rows={usersQuery.data}
        columns={[
          { header: 'Name', render: (row) => row.full_name || row.email },
          { header: 'Email', render: (row) => row.email },
          { header: 'Role', render: (row) => formatAdminRole(row.role) },
          { header: 'Status', render: (row) => <StatusChip status={row.is_active ? 'active' : 'inactive'} /> },
        ]}
      />
    </Stack>
  );
}

function NotFoundPanel() {
  return (
    <NotFoundView
      embedded
      title="Admin route not found"
      description="This Exxonim admin address does not map to a live screen in the Material Kit workspace yet. Return to the dashboard or jump to a content section."
      primaryHref="/admin"
      primaryLabel="Go to dashboard"
      secondaryHref="/admin/blog/posts"
      secondaryLabel="Open blog posts"
    />
  );
}

function RestrictedPanel({ adminRole, title }: { adminRole: string; title: string }) {
  return (
    <Alert severity="warning">
      {formatAdminRole(adminRole)} accounts cannot access <strong>{title}</strong>. Use an administrator account for this
      section.
    </Alert>
  );
}

export function AdminWorkspaceView() {
  const pathname = usePathname();
  const match = useMemo(() => matchAdminRoute(pathname), [pathname]);
  const { admin } = useAuth();
  const adminRole = admin?.role ?? 'admin';

  if (!match) {
    return (
      <DashboardContent maxWidth="lg">
        <NotFoundPanel />
      </DashboardContent>
    );
  }

  if (isAdminSectionRestrictedForRole(adminRole, match.section)) {
    return <PageShell match={match}><RestrictedPanel adminRole={adminRole} title={match.title} /></PageShell>;
  }

  if (match.section === 'dashboard') {
    return <OverviewAnalyticsView />;
  }

  let content: ReactNode = <NotFoundPanel />;

  if (match.section === 'blog-posts') {
    content = <BlogPostsRoutePanel match={match} />;
  } else if (match.section === 'blog-analytics') {
    content = <BlogAnalyticsPanel />;
  } else if (match.section === 'blog-categories') {
    content = <BlogCategoriesPanel />;
  } else if (match.section === 'blog-authors') {
    content = <BlogAuthorsPanel />;
  } else if (
    ['page-home', 'page-services', 'page-about', 'page-faq', 'page-contact', 'page-careers', 'pages'].includes(match.section)
  ) {
    content = <PagesPanel match={match} />;
  } else if (match.section === 'jobs') {
    content = <JobsPanel match={match} />;
  } else if (match.section === 'brand-settings') {
    content = <BrandSettingsPanel />;
  } else if (match.section === 'contact-settings') {
    content = <ContactSettingsPanel />;
  } else if (match.section === 'navigation') {
    content = <NavigationPanel />;
  } else if (match.section === 'pricing') {
    content = <PricingPanel />;
  } else if (match.section === 'testimonials') {
    content = <TestimonialsPanel />;
  } else if (match.section === 'footer-settings') {
    content = <FooterSettingsPanel />;
  } else if (match.section === 'seo-settings') {
    content = <SeoSettingsPanel />;
  } else if (match.section === 'access-roles') {
    content = <AccessRolesPanel />;
  }

  return <PageShell match={match}>{content}</PageShell>;
}
