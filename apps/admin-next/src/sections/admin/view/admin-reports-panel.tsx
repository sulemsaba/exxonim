import type { ReactNode } from 'react';
import type {
  ApiReportGrain,
  ApiAdminActivityRow,
  ApiReportSummaryCard,
  ApiServiceRequestStatus,
  ApiServiceRequestSourceChannel,
} from '@exxonim/admin-core/types/api';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiReportGrains } from '@exxonim/admin-core/types/api';
import { useAuth } from '@exxonim/admin-core/contexts/AuthContext';
import { getAdminErrorMessage } from '@exxonim/admin-core/utils/admin';
import { listAdminStaff } from '@exxonim/admin-core/services/adminStaffService';
import { listAdminServiceTypes } from '@exxonim/admin-core/services/adminServiceTypeService';
import {
  getAdminActivityReport,
  getAdminOperationsReport,
  getAdminContentActivityReport,
} from '@exxonim/admin-core/services/adminReportsService';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';

import { RouterLink } from 'src/routes/components';

// ----------------------------------------------------------------------

type ReportsTabValue = 'operations' | 'activity';

const sourceChannelOptions: Array<{ value: ApiServiceRequestSourceChannel; label: string }> = [
  { value: 'public_consultation_form', label: 'Consultation form' },
  { value: 'public_contact_form', label: 'Contact form' },
  { value: 'admin_created', label: 'Admin created' },
  { value: 'migration_legacy', label: 'Legacy import' },
];

const statusOptions: Array<{ value: ApiServiceRequestStatus; label: string }> = [
  { value: 'new', label: 'New' },
  { value: 'triaged', label: 'Triaged' },
  { value: 'waiting_customer', label: 'Waiting customer' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

function formatDateInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

function formatActionLabel(value: string) {
  return value.replaceAll('_', ' ').replaceAll('.', ' / ');
}

function formatMetricValue(value: number) {
  return Number.isInteger(value) ? value.toLocaleString() : value.toFixed(2);
}

function SummaryCards({ cards }: { cards: ApiReportSummaryCard[] }) {
  return (
    <Grid container spacing={2}>
      {cards.map((card) => (
        <Grid key={card.key} size={{ xs: 12, sm: 6, lg: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline" sx={{ color: 'text.secondary' }}>
                {card.label}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {formatMetricValue(card.value)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary', minHeight: 40 }}>
                {card.helper ?? ' '}
              </Typography>
              {card.href ? (
                <Button
                  component={RouterLink}
                  href={card.href}
                  size="small"
                  color="inherit"
                  sx={{ mt: 1 }}
                >
                  Open queue
                </Button>
              ) : null}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

function SimpleTableCard({
  title,
  subtitle,
  headers,
  rows,
  emptyMessage = 'No data for this range.',
}: {
  title: string;
  subtitle?: string;
  headers: string[];
  rows: Array<Array<ReactNode>>;
  emptyMessage?: string;
}) {
  return (
    <Card>
      <CardHeader title={title} subheader={subtitle} />
      <Divider />
      <CardContent sx={{ p: 0 }}>
        {rows.length ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableCell key={header}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow hover key={`${title}-${index}`}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={`${title}-${index}-${cellIndex}`}>{cell}</TableCell>
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

function ActivityRowTable({
  rows,
  title,
}: {
  rows: ApiAdminActivityRow[];
  title: string;
}) {
  return (
    <SimpleTableCard
      title={title}
      headers={['Actor', 'Action', 'Count', 'Link']}
      rows={rows.map((row) => [
        row.actor_label,
        formatActionLabel(row.action),
        row.count,
        row.href ? (
          <Button component={RouterLink} href={row.href} size="small" color="inherit">
            Open
          </Button>
        ) : (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            None
          </Typography>
        ),
      ])}
    />
  );
}

export function ReportsRoutePanel() {
  const { admin } = useAuth();
  const [tab, setTab] = useState<ReportsTabValue>('operations');
  const [fromDate, setFromDate] = useState(() => formatDateInput(new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)));
  const [toDate, setToDate] = useState(() => formatDateInput(new Date()));
  const [grain, setGrain] = useState<ApiReportGrain>('day');
  const [serviceTypeId, setServiceTypeId] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [sourceChannel, setSourceChannel] = useState<ApiServiceRequestSourceChannel | ''>('');
  const [status, setStatus] = useState<ApiServiceRequestStatus | ''>('');

  const operationsParams = useMemo(
    () => ({
      from: fromDate,
      to: toDate,
      grain,
      service_type_id: serviceTypeId || undefined,
      assignee_id: assigneeId ? Number(assigneeId) : undefined,
      source_channel: sourceChannel || undefined,
      status: status || undefined,
    }),
    [assigneeId, fromDate, grain, serviceTypeId, sourceChannel, status, toDate]
  );

  const activityParams = useMemo(
    () => ({
      from: fromDate,
      to: toDate,
      grain,
    }),
    [fromDate, grain, toDate]
  );

  const serviceTypesQuery = useQuery({
    queryKey: ['admin-next', 'service-types'],
    queryFn: listAdminServiceTypes,
    staleTime: 60_000,
    enabled: admin?.permissions?.includes('service_request.read') ?? false,
  });

  const staffQuery = useQuery({
    queryKey: ['admin-next', 'staff'],
    queryFn: listAdminStaff,
    staleTime: 60_000,
    enabled: admin?.permissions?.includes('user.read') ?? false,
  });

  const operationsQuery = useQuery({
    queryKey: ['admin-next', 'reports', 'operations', operationsParams],
    queryFn: () => getAdminOperationsReport(operationsParams),
    enabled: admin?.permissions?.includes('report.read') ?? false,
  });

  const adminActivityQuery = useQuery({
    queryKey: ['admin-next', 'reports', 'activity-admin', activityParams],
    queryFn: () => getAdminActivityReport(activityParams),
    enabled: admin?.permissions?.includes('report.read') ?? false,
  });

  const contentActivityQuery = useQuery({
    queryKey: ['admin-next', 'reports', 'activity-content', activityParams],
    queryFn: () => getAdminContentActivityReport(activityParams),
    enabled: admin?.permissions?.includes('report.read') ?? false,
  });

  if (!(admin?.permissions?.includes('report.read') ?? false)) {
    return <Alert severity="warning">Your account does not currently have access to reporting.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5">Reports</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                Read-only reporting built from service-request history, audit logs, assignments, and inbox activity.
              </Typography>
            </Box>

            <Tabs value={tab} onChange={(_, value) => setTab(value)}>
              <Tab value="operations" label="Operations" />
              <Tab value="activity" label="Activity" />
            </Tabs>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="From"
                  value={fromDate}
                  onChange={(event) => setFromDate(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="To"
                  value={toDate}
                  onChange={(event) => setToDate(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <FormControl fullWidth>
                  <InputLabel id="report-grain-label">Grain</InputLabel>
                  <Select
                    labelId="report-grain-label"
                    label="Grain"
                    value={grain}
                    onChange={(event) => setGrain(event.target.value as ApiReportGrain)}
                  >
                    {apiReportGrains.map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth disabled={tab !== 'operations'}>
                  <InputLabel id="report-service-type-label">Service type</InputLabel>
                  <Select
                    labelId="report-service-type-label"
                    label="Service type"
                    value={serviceTypeId}
                    onChange={(event) => setServiceTypeId(event.target.value)}
                  >
                    <MenuItem value="">All service types</MenuItem>
                    {serviceTypesQuery.data?.map((serviceType) => (
                      <MenuItem key={serviceType.id} value={serviceType.id}>
                        {serviceType.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth disabled={tab !== 'operations'}>
                  <InputLabel id="report-assignee-label">Assignee</InputLabel>
                  <Select
                    labelId="report-assignee-label"
                    label="Assignee"
                    value={assigneeId}
                    onChange={(event) => setAssigneeId(event.target.value)}
                  >
                    <MenuItem value="">All assignees</MenuItem>
                    {staffQuery.data?.map((staffMember) => (
                      <MenuItem key={staffMember.id} value={String(staffMember.id)}>
                        {staffMember.full_name || staffMember.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth disabled={tab !== 'operations'}>
                  <InputLabel id="report-source-channel-label">Source channel</InputLabel>
                  <Select
                    labelId="report-source-channel-label"
                    label="Source channel"
                    value={sourceChannel}
                    onChange={(event) => setSourceChannel(event.target.value as ApiServiceRequestSourceChannel | '')}
                  >
                    <MenuItem value="">All channels</MenuItem>
                    {sourceChannelOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <FormControl fullWidth disabled={tab !== 'operations'}>
                  <InputLabel id="report-status-label">Status</InputLabel>
                  <Select
                    labelId="report-status-label"
                    label="Status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value as ApiServiceRequestStatus | '')}
                  >
                    <MenuItem value="">All statuses</MenuItem>
                    {statusOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
      </Card>

      {tab === 'operations' ? (
        operationsQuery.isLoading ? (
          <Alert severity="info">Loading operations report...</Alert>
        ) : operationsQuery.isError ? (
          <Alert severity="error">
            {getAdminErrorMessage(operationsQuery.error, 'Unable to load operations reporting right now.')}
          </Alert>
        ) : operationsQuery.data ? (
          <Stack spacing={3}>
            <SummaryCards cards={operationsQuery.data.summary_cards} />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, xl: 6 }}>
                <SimpleTableCard
                  title="Enquiry Trend"
                  subtitle="Requests opened in the selected period."
                  headers={['Bucket', 'Count']}
                  rows={operationsQuery.data.enquiry_series.map((point) => [point.label, point.value])}
                />
              </Grid>
              <Grid size={{ xs: 12, xl: 6 }}>
                <SimpleTableCard
                  title="Open vs Resolved"
                  subtitle="Current status split for the selected cohort."
                  headers={['Bucket', 'Open', 'Resolved']}
                  rows={operationsQuery.data.open_vs_resolved_trend.map((point) => [
                    point.label,
                    point.open_value,
                    point.resolved_value,
                  ])}
                />
              </Grid>
              <Grid size={{ xs: 12, xl: 6 }}>
                <SimpleTableCard
                  title="Service Type Breakdown"
                  headers={['Service type', 'Count', 'Link']}
                  rows={operationsQuery.data.service_type_breakdown.map((row) => [
                    row.label,
                    row.value,
                    row.href ? (
                      <Button component={RouterLink} href={row.href} size="small" color="inherit">
                        Open
                      </Button>
                    ) : (
                      'None'
                    ),
                  ])}
                />
              </Grid>
              <Grid size={{ xs: 12, xl: 6 }}>
                <SimpleTableCard
                  title="Source Channel Breakdown"
                  headers={['Source', 'Count', 'Link']}
                  rows={operationsQuery.data.source_channel_breakdown.map((row) => [
                    row.label,
                    row.value,
                    row.href ? (
                      <Button component={RouterLink} href={row.href} size="small" color="inherit">
                        Open
                      </Button>
                    ) : (
                      'None'
                    ),
                  ])}
                />
              </Grid>
              <Grid size={{ xs: 12, xl: 6 }}>
                <SimpleTableCard
                  title="Aging Buckets"
                  headers={['Age', 'Count']}
                  rows={operationsQuery.data.aging_buckets.map((row) => [row.label, row.value])}
                />
              </Grid>
              <Grid size={{ xs: 12, xl: 6 }}>
                <SimpleTableCard
                  title="Repeat Customers"
                  headers={['Customer mix', 'Count']}
                  rows={operationsQuery.data.repeat_customer_breakdown.map((row) => [row.label, row.value])}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <SimpleTableCard
                  title="Staff Workload"
                  subtitle="Current assignment load with overdue, unread, and completion context."
                  headers={['Admin', 'Open assignments', 'Unread', 'Overdue', 'Completed in range', 'Link']}
                  rows={operationsQuery.data.staff_workload.map((row) => [
                    row.admin_label,
                    row.active_open_assignments,
                    row.unread_count,
                    row.overdue_count,
                    row.completions_in_range,
                    row.href ? (
                      <Button component={RouterLink} href={row.href} size="small" color="inherit">
                        Open queue
                      </Button>
                    ) : (
                      'None'
                    ),
                  ])}
                />
              </Grid>
              <Grid size={{ xs: 12, xl: 6 }}>
                <SimpleTableCard
                  title="Current Funnel"
                  headers={['Status', 'Count', 'Link']}
                  rows={operationsQuery.data.funnel_current_status.map((row) => [
                    row.label,
                    row.value,
                    row.href ? (
                      <Button component={RouterLink} href={row.href} size="small" color="inherit">
                        Open
                      </Button>
                    ) : (
                      'None'
                    ),
                  ])}
                />
              </Grid>
              <Grid size={{ xs: 12, xl: 6 }}>
                <SimpleTableCard
                  title="Transition Counts"
                  headers={['From', 'To', 'Count']}
                  rows={operationsQuery.data.funnel_transition_counts.map((row) => [
                    row.from_status ? formatActionLabel(row.from_status) : 'Initial',
                    formatActionLabel(row.to_status),
                    row.count,
                  ])}
                />
              </Grid>
            </Grid>

            <Card>
              <CardHeader title="Response Times" subheader="Average hours from intake to first handled work and first outbound admin response." />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2">First handled time</Typography>
                    <Typography variant="h5" sx={{ mt: 1 }}>
                      {operationsQuery.data.response_times.first_handled_average_hours ?? '—'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Samples: {operationsQuery.data.response_times.first_handled_samples}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle2">First customer response time</Typography>
                    <Typography variant="h5" sx={{ mt: 1 }}>
                      {operationsQuery.data.response_times.first_customer_response_average_hours ?? '—'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Samples: {operationsQuery.data.response_times.first_customer_response_samples}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        ) : null
      ) : adminActivityQuery.isLoading || contentActivityQuery.isLoading ? (
        <Alert severity="info">Loading activity reporting...</Alert>
      ) : adminActivityQuery.isError ? (
        <Alert severity="error">
          {getAdminErrorMessage(adminActivityQuery.error, 'Unable to load admin activity right now.')}
        </Alert>
      ) : contentActivityQuery.isError ? (
        <Alert severity="error">
          {getAdminErrorMessage(contentActivityQuery.error, 'Unable to load content activity right now.')}
        </Alert>
      ) : adminActivityQuery.data && contentActivityQuery.data ? (
        <Stack spacing={3}>
          <SummaryCards cards={adminActivityQuery.data.summary_cards} />
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, xl: 6 }}>
              <SimpleTableCard
                title="Admin Activity Trend"
                headers={['Bucket', 'Events']}
                rows={adminActivityQuery.data.activity_series.map((point) => [point.label, point.value])}
              />
            </Grid>
            <Grid size={{ xs: 12, xl: 6 }}>
              <SimpleTableCard
                title="Admin Actions"
                headers={['Action', 'Count']}
                rows={adminActivityQuery.data.action_breakdown.map((row) => [formatActionLabel(row.label), row.value])}
              />
            </Grid>
            <Grid size={{ xs: 12, xl: 6 }}>
              <SimpleTableCard
                title="Actor Breakdown"
                headers={['Actor', 'Count']}
                rows={adminActivityQuery.data.actor_breakdown.map((row) => [row.label, row.value])}
              />
            </Grid>
            <Grid size={{ xs: 12, xl: 6 }}>
              <SimpleTableCard
                title="Content Activity Trend"
                headers={['Bucket', 'Events']}
                rows={contentActivityQuery.data.activity_series.map((point) => [point.label, point.value])}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <ActivityRowTable rows={adminActivityQuery.data.rows} title="Actor / Action Summary" />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <SimpleTableCard
                title="Content Workflow Summary"
                headers={['Content type', 'Action', 'Count', 'Link']}
                rows={contentActivityQuery.data.rows.map((row) => [
                  row.content_type.replaceAll('_', ' '),
                  formatActionLabel(row.action),
                  row.count,
                  row.href ? (
                    <Button component={RouterLink} href={row.href} size="small" color="inherit">
                      Open
                    </Button>
                  ) : (
                    'None'
                  ),
                ])}
              />
            </Grid>
          </Grid>
        </Stack>
      ) : null}
    </Stack>
  );
}
