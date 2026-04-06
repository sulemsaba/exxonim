import type { AdminRouteMatch } from '@exxonim/admin-core/lib/adminRoutes';
import type {
  ApiConsultationStatus,
  ApiServiceRequestPriority,
  ApiServiceRequestQueueView,
  ApiServiceRequestSourceChannel,
} from '@exxonim/admin-core/types/api';

import { useLocation, useNavigate } from 'react-router';
import { useState, useEffect, useCallback } from 'react';
import { adminRoutes } from '@exxonim/admin-core/lib/adminRoutes';
import { useAuth } from '@exxonim/admin-core/contexts/AuthContext';
import { getAdminErrorMessage } from '@exxonim/admin-core/utils/admin';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listAdminStaff } from '@exxonim/admin-core/services/adminStaffService';
import {
  getAdminConsultation,
  updateAdminConsultation,
  listAdminConsultationsPage,
} from '@exxonim/admin-core/services/adminConsultationService';
import {
  markAdminServiceRequestRead,
  bulkAssignAdminServiceRequests,
  bulkMarkAdminServiceRequestsRead,
  bulkUpdateAdminServiceRequestStatuses,
  bulkUpdateAdminServiceRequestPriorities,
} from '@exxonim/admin-core/services/adminServiceRequestService';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import Snackbar from '@mui/material/Snackbar';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Tab, { tabClasses } from '@mui/material/Tab';
import TableContainer from '@mui/material/TableContainer';

import { RouterLink } from 'src/routes/components';

import { fToNow } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type FormMessage = { tone: 'success' | 'error'; text: string } | null;
type StatusFilterValue = 'all' | ApiConsultationStatus;
type QueueViewValue = ApiServiceRequestQueueView;
type PriorityFilterValue = 'all' | ApiServiceRequestPriority;
type SourceChannelFilterValue = 'all' | ApiServiceRequestSourceChannel;
type MuiChipColor = 'default' | 'success' | 'warning' | 'error' | 'info';

const statusOptions: Array<{ value: ApiConsultationStatus; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];
const queueViewOptions: Array<{ value: QueueViewValue; label: string }> = [
  { value: 'all_active', label: 'All active' },
  { value: 'mine', label: 'Mine' },
  { value: 'unassigned', label: 'Unassigned' },
  { value: 'unread', label: 'Unread' },
  { value: 'completed', label: 'Completed' },
];
const priorityOptions: Array<{ value: ApiServiceRequestPriority; label: string }> = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];
const sourceChannelOptions: Array<{ value: ApiServiceRequestSourceChannel; label: string }> = [
  { value: 'public_consultation_form', label: 'Consultation form' },
  { value: 'public_contact_form', label: 'Contact form' },
  { value: 'admin_created', label: 'Admin created' },
  { value: 'migration_legacy', label: 'Legacy import' },
];
const serviceTypeOptions = [
  { value: 'registration', label: 'Registration' },
  { value: 'licensing', label: 'Licensing' },
  { value: 'tax_returns', label: 'Tax & Returns' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'general_consultation', label: 'General consultation' },
] as const;

function isQueueViewValue(value: string | null): value is QueueViewValue {
  return queueViewOptions.some((option) => option.value === value);
}

function isPriorityFilterValue(value: string | null): value is ApiServiceRequestPriority {
  return priorityOptions.some((option) => option.value === value);
}

function isSourceChannelFilterValue(value: string | null): value is ApiServiceRequestSourceChannel {
  return sourceChannelOptions.some((option) => option.value === value);
}

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
  switch (status) {
    case 'completed':
      return 'success';
    case 'contacted':
      return 'info';
    case 'cancelled':
      return 'error';
    case 'pending':
      return 'warning';
    default:
      return 'default';
  }
}

function priorityColor(priority?: string | null): MuiChipColor {
  switch (priority) {
    case 'urgent':
      return 'error';
    case 'high':
      return 'warning';
    case 'normal':
      return 'info';
    case 'low':
      return 'default';
    default:
      return 'default';
  }
}

function PriorityChip({ priority }: { priority?: string | null }) {
  return (
    <Chip
      size="small"
      label={priority || 'normal'}
      color={priorityColor(priority)}
      variant="outlined"
    />
  );
}

function sourceChannelLabel(value?: string | null) {
  if (!value) {
    return 'Unknown source';
  }

  return value.replaceAll('_', ' ');
}

function StatusChip({ status }: { status?: string | null }) {
  return (
    <Chip
      size="small"
      label={status || 'unknown'}
      color={statusColor(status)}
      variant="outlined"
    />
  );
}

function QueueTabs({
  value,
  onChange,
}: {
  value: QueueViewValue;
  onChange: (nextValue: QueueViewValue) => void;
}) {
  return (
    <Tabs
      value={value}
      onChange={(_, nextValue) => onChange(nextValue as QueueViewValue)}
      variant="scrollable"
      allowScrollButtonsMobile
      sx={{
        px: 2,
        [`& .${tabClasses.root}`]: {
          minHeight: 52,
          textTransform: 'none',
          alignItems: 'flex-start',
        },
      }}
    >
      {queueViewOptions.map((option) => (
        <Tab key={option.value} value={option.value} label={option.label} />
      ))}
    </Tabs>
  );
}

function ActionToast({
  message,
  onClose,
}: {
  message: FormMessage;
  onClose: () => void;
}) {
  return (
    <Snackbar
      open={Boolean(message)}
      autoHideDuration={3200}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      onClose={(_, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        onClose();
      }}
    >
      <Alert
        variant="filled"
        severity={message?.tone === 'success' ? 'success' : 'error'}
        onClose={onClose}
        sx={{ width: '100%', boxShadow: 6 }}
      >
        {message?.text}
      </Alert>
    </Snackbar>
  );
}

function ConsultationsListPanel() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [view, setView] = useState<QueueViewValue>('all_active');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilterValue>('all');
  const [assigneeFilter, setAssigneeFilter] = useState('');
  const [sourceChannelFilter, setSourceChannelFilter] = useState<SourceChannelFilterValue>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [message, setMessage] = useState<FormMessage>(null);

  const updateRouteFilters = useCallback(
    (
      updates: Partial<
        Record<'search' | 'view' | 'priority' | 'assignee' | 'source_channel', string | null>
      >
    ) => {
      const nextParams = new URLSearchParams(location.search);

      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === 'all' || (key === 'view' && value === 'all_active')) {
          nextParams.delete(key);
        } else {
          nextParams.set(key, value);
        }
      }

      navigate(
        {
          pathname: location.pathname,
          search: nextParams.toString() ? `?${nextParams.toString()}` : '',
        },
        { replace: true }
      );
    },
    [location.pathname, location.search, navigate]
  );

  const staffQuery = useQuery({
    queryKey: ['admin-next', 'admin-staff'],
    queryFn: listAdminStaff,
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nextView = params.get('view');
    const nextPriority = params.get('priority');
    const nextSourceChannel = params.get('source_channel');

    setSearch(params.get('search') ?? '');
    setView(isQueueViewValue(nextView) ? nextView : 'all_active');
    setPriorityFilter(isPriorityFilterValue(nextPriority) ? nextPriority : 'all');
    setAssigneeFilter(params.get('assignee') ?? '');
    setSourceChannelFilter(
      isSourceChannelFilterValue(nextSourceChannel) ? nextSourceChannel : 'all'
    );
    setPage(1);
    setSelectedIds([]);
  }, [location.search]);

  const invalidateQueue = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['admin-next', 'consultations'] }),
      queryClient.invalidateQueries({ queryKey: ['admin-next', 'dashboard'] }),
      queryClient.invalidateQueries({ queryKey: ['admin-next', 'review-queue'] }),
    ]);
  };

  const handleActionError = (error: unknown, fallback: string) => {
    setMessage({
      tone: 'error',
      text: getAdminErrorMessage(error, fallback),
    });
  };

  const hasPermission = (permission: string) => admin?.permissions?.includes(permission) ?? false;
  const canBulkUpdate = hasPermission('service_request.bulk_update');
  const canMarkRead = hasPermission('service_request.mark_read');

  const query = useQuery({
    queryKey: [
      'admin-next',
      'consultations',
      page,
      search,
      view,
      statusFilter,
      serviceTypeFilter,
      priorityFilter,
      assigneeFilter,
      sourceChannelFilter,
    ],
    queryFn: () =>
      listAdminConsultationsPage({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter === 'all' ? '' : statusFilter,
        service_type: serviceTypeFilter === 'all' ? undefined : serviceTypeFilter,
        priority: priorityFilter === 'all' ? '' : priorityFilter,
        assignee_id: assigneeFilter ? Number(assigneeFilter) : undefined,
        source_channel: sourceChannelFilter === 'all' ? '' : sourceChannelFilter,
        view,
        sort: 'last_activity',
        order: 'desc',
      }),
  });

  const markReadMutation = useMutation({
    mutationFn: async (serviceRequestId: string) => markAdminServiceRequestRead(serviceRequestId),
    onSuccess: async () => {
      setMessage({ tone: 'success', text: 'Conversation marked as read.' });
      await invalidateQueue();
    },
    onError: (error) => handleActionError(error, 'Unable to mark the conversation as read.'),
  });

  const bulkMarkReadMutation = useMutation({
    mutationFn: async (requestIds: string[]) =>
      bulkMarkAdminServiceRequestsRead({ request_ids: requestIds }),
    onSuccess: async (_, requestIds) => {
      setSelectedIds((current) => current.filter((id) => !requestIds.includes(id)));
      setMessage({ tone: 'success', text: 'Selected conversations marked as read.' });
      await invalidateQueue();
    },
    onError: (error) => handleActionError(error, 'Unable to update the selected read states.'),
  });

  const bulkAssignToMeMutation = useMutation({
    mutationFn: async (requestIds: string[]) => {
      if (!admin?.id) {
        throw new Error('Your admin account is not fully loaded yet.');
      }

      return bulkAssignAdminServiceRequests({
        request_ids: requestIds,
        admin_user_id: admin.id,
        assignment_role: 'lead',
      });
    },
    onSuccess: async (_, requestIds) => {
      setSelectedIds((current) => current.filter((id) => !requestIds.includes(id)));
      setMessage({ tone: 'success', text: 'Selected requests are now assigned to you.' });
      await invalidateQueue();
    },
    onError: (error) => handleActionError(error, 'Unable to assign the selected requests.'),
  });

  const bulkStartWorkMutation = useMutation({
    mutationFn: async (requestIds: string[]) =>
      bulkUpdateAdminServiceRequestStatuses({
        request_ids: requestIds,
        status: 'in_progress',
        comment: 'Started from the operations queue.',
      }),
    onSuccess: async (_, requestIds) => {
      setSelectedIds((current) => current.filter((id) => !requestIds.includes(id)));
      setMessage({ tone: 'success', text: 'Selected requests moved into active delivery.' });
      await invalidateQueue();
    },
    onError: (error) => handleActionError(error, 'Unable to update the selected request statuses.'),
  });

  const bulkRaisePriorityMutation = useMutation({
    mutationFn: async (requestIds: string[]) =>
      bulkUpdateAdminServiceRequestPriorities({
        request_ids: requestIds,
        priority: 'high',
      }),
    onSuccess: async () => {
      setMessage({ tone: 'success', text: 'Selected requests were raised to high priority.' });
      await invalidateQueue();
    },
    onError: (error) => handleActionError(error, 'Unable to update the selected priorities.'),
  });

  useEffect(() => {
    const visibleIds = new Set(
      (query.data?.items ?? [])
        .map((item) => item.service_request_id)
        .filter((value): value is string => Boolean(value))
    );
    setSelectedIds((current) => current.filter((id) => visibleIds.has(id)));
  }, [query.data?.items]);

  const totalPages = query.data?.total_pages ?? 1;
  const selectedCount = selectedIds.length;
  const visibleRequestIds = (query.data?.items ?? [])
    .map((item) => item.service_request_id)
    .filter((value): value is string => Boolean(value));
  const allSelected = visibleRequestIds.length > 0 && visibleRequestIds.every((id) => selectedIds.includes(id));
  const actionsPending =
    markReadMutation.isPending ||
    bulkMarkReadMutation.isPending ||
    bulkAssignToMeMutation.isPending ||
    bulkStartWorkMutation.isPending ||
    bulkRaisePriorityMutation.isPending;

  const toggleSelected = (serviceRequestId: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked ? [...new Set([...current, serviceRequestId])] : current.filter((id) => id !== serviceRequestId)
    );
  };

  return (
    <>
      <Stack spacing={3}>
        <Card>
          <QueueTabs
            value={view}
            onChange={(nextView) => {
              setView(nextView);
              setPage(1);
              setSelectedIds([]);
              updateRouteFilters({ view: nextView });
            }}
          />
        </Card>

        {selectedCount ? (
          <Card>
            <CardContent>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', md: 'center' }}
                justifyContent="space-between"
              >
                <Typography variant="subtitle2">
                  {selectedCount} request{selectedCount === 1 ? '' : 's'} selected
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {canMarkRead ? (
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={actionsPending}
                      onClick={() => bulkMarkReadMutation.mutate(selectedIds)}
                    >
                      Mark read
                    </Button>
                  ) : null}
                  {canBulkUpdate && admin?.id ? (
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={actionsPending}
                      onClick={() => bulkAssignToMeMutation.mutate(selectedIds)}
                    >
                      Assign to me
                    </Button>
                  ) : null}
                  {canBulkUpdate ? (
                    <Button
                      size="small"
                      variant="outlined"
                      disabled={actionsPending}
                      onClick={() => bulkStartWorkMutation.mutate(selectedIds)}
                    >
                      Start work
                    </Button>
                  ) : null}
                  {canBulkUpdate ? (
                    <Button
                      size="small"
                      color="warning"
                      variant="outlined"
                      disabled={actionsPending}
                      onClick={() => bulkRaisePriorityMutation.mutate(selectedIds)}
                    >
                      Raise priority
                    </Button>
                  ) : null}
                  <Button size="small" color="inherit" onClick={() => setSelectedIds([])}>
                    Clear selection
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ) : null}

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Search consultations"
                placeholder="Tracking ID, name, email, or company"
                value={search}
                onChange={(event) => {
                  const nextSearch = event.target.value;
                  setSearch(nextSearch);
                  setPage(1);
                  updateRouteFilters({ search: nextSearch });
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as StatusFilterValue);
                  setPage(1);
                }}
              >
                <MenuItem value="all">All statuses</MenuItem>
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Service"
                value={serviceTypeFilter}
                onChange={(event) => {
                  setServiceTypeFilter(event.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="all">All services</MenuItem>
                {serviceTypeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Priority"
                value={priorityFilter}
                onChange={(event) => {
                  const nextPriority = event.target.value as PriorityFilterValue;
                  setPriorityFilter(nextPriority);
                  setPage(1);
                  updateRouteFilters({ priority: nextPriority });
                }}
              >
                <MenuItem value="all">All priorities</MenuItem>
                {priorityOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Assignee"
                value={assigneeFilter}
                onChange={(event) => {
                  const nextAssignee = event.target.value;
                  setAssigneeFilter(nextAssignee);
                  setPage(1);
                  updateRouteFilters({ assignee: nextAssignee });
                }}
                helperText={staffQuery.isError ? 'Staff list unavailable.' : undefined}
              >
                <MenuItem value="">Anyone</MenuItem>
                {(staffQuery.data ?? []).map((member) => (
                  <MenuItem key={member.id} value={String(member.id)}>
                    {member.email}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Source"
                value={sourceChannelFilter}
                onChange={(event) => {
                  const nextSourceChannel = event.target.value as SourceChannelFilterValue;
                  setSourceChannelFilter(nextSourceChannel);
                  setPage(1);
                  updateRouteFilters({ source_channel: nextSourceChannel });
                }}
              >
                <MenuItem value="all">All sources</MenuItem>
                {sourceChannelOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  setSearch('');
                  setView('all_active');
                  setStatusFilter('all');
                  setServiceTypeFilter('all');
                  setPriorityFilter('all');
                  setAssigneeFilter('');
                  setSourceChannelFilter('all');
                  setPage(1);
                  setSelectedIds([]);
                  updateRouteFilters({
                    search: null,
                    view: null,
                    priority: null,
                    assignee: null,
                    source_channel: null,
                  });
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card>
        <CardHeader
          title="Service request queue"
          subheader={
            query.data
              ? `${query.data.total} tracked requests across the Exxonim follow-up pipeline.`
              : 'Loading tracked service requests.'
          }
        />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          {query.isLoading ? (
            <Box sx={{ p: 3 }}>
              <Alert severity="info">Loading service requests...</Alert>
            </Box>
          ) : query.isError ? (
            <Box sx={{ p: 3 }}>
              <Alert severity="error">
                {getAdminErrorMessage(query.error, 'Unable to load service requests.')}
              </Alert>
            </Box>
          ) : query.data?.items.length ? (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={allSelected}
                          indeterminate={selectedCount > 0 && !allSelected}
                          onChange={(event) => {
                            setSelectedIds(event.target.checked ? visibleRequestIds : []);
                          }}
                        />
                      </TableCell>
                      <TableCell>Lead</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Priority</TableCell>
                      <TableCell>Assigned</TableCell>
                      <TableCell>Last activity</TableCell>
                      <TableCell>Unread</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {query.data.items.map((item) => (
                      <TableRow hover key={item.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            disabled={!item.service_request_id}
                            checked={item.service_request_id ? selectedIds.includes(item.service_request_id) : false}
                            onChange={(event) => {
                              if (!item.service_request_id) {
                                return;
                              }
                              toggleSelected(item.service_request_id, event.target.checked);
                            }}
                          />
                        </TableCell>
                        <TableCell sx={{ minWidth: 280 }}>
                          <Stack spacing={0.5}>
                            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                              <Typography variant="subtitle2">{item.full_name}</Typography>
                              {item.unread ? (
                                <Chip
                                  size="small"
                                  color="warning"
                                  label={`${item.unread_count || 1} unread`}
                                />
                              ) : null}
                            </Stack>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {item.tracking_id} • {item.company || item.email}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {item.service_type?.label || 'General consultation'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {sourceChannelLabel(item.source_channel)} •{' '}
                              {item.customer?.company_name || item.customer?.display_name || item.email}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={item.status} />
                        </TableCell>
                        <TableCell>
                          <PriorityChip priority={item.priority} />
                        </TableCell>
                        <TableCell>
                          {item.assigned_admin?.email || 'Unassigned'}
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.25}>
                            <Typography variant="body2">
                              {formatDateTime(item.last_activity_at || item.updated_at)}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {fToNow(item.last_activity_at || item.updated_at)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          {item.unread ? (
                            <Typography variant="caption" sx={{ color: 'warning.main', fontWeight: 600 }}>
                              Customer reply waiting
                            </Typography>
                          ) : (
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              Up to date
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap" useFlexGap>
                            {item.unread && item.service_request_id && canMarkRead ? (
                              <Button
                                size="small"
                                variant="outlined"
                                disabled={actionsPending}
                                onClick={() => markReadMutation.mutate(item.service_request_id!)}
                              >
                                Mark read
                              </Button>
                            ) : null}
                            {item.service_request_id && canBulkUpdate && admin?.id && item.assigned_to !== admin.id ? (
                              <Button
                                size="small"
                                variant="outlined"
                                disabled={actionsPending}
                                onClick={() => bulkAssignToMeMutation.mutate([item.service_request_id!])}
                              >
                                Assign to me
                              </Button>
                            ) : null}
                            <Button
                              component={RouterLink}
                              href={adminRoutes.consultationDetail(item.id)}
                              size="small"
                              color="inherit"
                            >
                              Open
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Pagination
                  page={page}
                  count={Math.max(totalPages, 1)}
                  color="primary"
                  size="small"
                  onChange={(_, nextPage) => setPage(nextPage)}
                />
              </Box>
            </>
          ) : (
            <Box sx={{ p: 3 }}>
              <Alert severity="info">No consultations matched the current filter.</Alert>
            </Box>
          )}
        </CardContent>
      </Card>
      </Stack>

      <ActionToast message={message} onClose={() => setMessage(null)} />
    </>
  );
}

function ConsultationDetailPanel({ consultationId }: { consultationId: number }) {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState<FormMessage>(null);
  const [status, setStatus] = useState<ApiConsultationStatus>('pending');
  const [assignedTo, setAssignedTo] = useState('');
  const [notes, setNotes] = useState('');
  const [publicNotes, setPublicNotes] = useState('');
  const [comment, setComment] = useState('');

  const consultationQuery = useQuery({
    queryKey: ['admin-next', 'consultations', consultationId],
    queryFn: () => getAdminConsultation(consultationId),
  });

  const staffQuery = useQuery({
    queryKey: ['admin-next', 'admin-staff'],
    queryFn: listAdminStaff,
  });

  useEffect(() => {
    if (!consultationQuery.data) {
      return;
    }

    setStatus(consultationQuery.data.status);
    setAssignedTo(consultationQuery.data.assigned_to ? String(consultationQuery.data.assigned_to) : '');
    setNotes(consultationQuery.data.notes || '');
    setPublicNotes(consultationQuery.data.public_notes || '');
  }, [consultationQuery.data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      updateAdminConsultation(consultationId, {
        status,
        assigned_to: assignedTo ? Number(assignedTo) : null,
        notes: notes.trim() || null,
        public_notes: publicNotes.trim() || null,
        comment: comment.trim() || null,
      }),
    onSuccess: async () => {
      setComment('');
      setMessage({ tone: 'success', text: 'Consultation updated.' });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'consultations'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'dashboard'] }),
      ]);
    },
    onError: (error) => {
      setMessage({
        tone: 'error',
        text: getAdminErrorMessage(error, 'Unable to update consultation.'),
      });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async (serviceRequestId: string) => markAdminServiceRequestRead(serviceRequestId),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'consultations'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-next', 'dashboard'] }),
      ]);
    },
    onError: (error) => {
      setMessage({
        tone: 'error',
        text: getAdminErrorMessage(error, 'Unable to mark this request as read.'),
      });
    },
  });

  const consultation = consultationQuery.data;

  useEffect(() => {
    if (!consultation?.service_request_id || !consultation.unread || markReadMutation.isPending) {
      return;
    }

    markReadMutation.mutate(consultation.service_request_id);
  }, [consultation?.service_request_id, consultation?.unread, markReadMutation]);

  if (consultationQuery.isLoading) {
    return <Alert severity="info">Loading consultation details...</Alert>;
  }

  if (consultationQuery.isError || !consultation) {
    return (
      <Alert severity="error">
        {getAdminErrorMessage(consultationQuery.error, 'Unable to load consultation.')}
      </Alert>
    );
  }

  return (
    <>
      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Stack spacing={1}>
              <Button
                component={RouterLink}
                href={adminRoutes.consultations}
                size="small"
                color="inherit"
                sx={{ alignSelf: 'flex-start' }}
              >
                Back to consultations
              </Button>
              <Typography variant="h4">{consultation.full_name}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {consultation.tracking_id} • {consultation.email} • {consultation.company || 'Independent inquiry'}
              </Typography>
              {consultation.unread ? (
                <Chip
                  size="small"
                  color="warning"
                  label={
                    consultation.unread_count === 1
                      ? '1 unread reply'
                      : `${consultation.unread_count || 1} unread replies`
                  }
                  sx={{ alignSelf: 'flex-start' }}
                />
              ) : null}
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={3}>
              <Card>
                <CardHeader title="Customer profile" subheader="Canonical customer identity for this request." />
                <Divider />
                <CardContent>
                  {consultation.customer ? (
                    <Stack spacing={1.25}>
                      <Typography variant="h6">{consultation.customer.display_name}</Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {consultation.customer.company_name || 'Individual customer'}
                      </Typography>
                      <Typography variant="body2">
                        Email: {consultation.customer.primary_email || consultation.email}
                      </Typography>
                      {consultation.customer.primary_phone || consultation.phone ? (
                        <Typography variant="body2">
                          Phone: {consultation.customer.primary_phone || consultation.phone}
                        </Typography>
                      ) : null}
                      <Typography variant="body2">
                        Source: {consultation.customer.source.replaceAll('_', ' ')}
                      </Typography>
                    </Stack>
                  ) : (
                    <Alert severity="info">Customer details have not been linked yet.</Alert>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Request summary" subheader="Canonical service request context." />
                <Divider />
                <CardContent>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <StatusChip status={consultation.status} />
                      <PriorityChip priority={consultation.priority} />
                    </Stack>
                    <Typography variant="body2">
                      Service: {consultation.service_type?.label || 'General consultation'}
                    </Typography>
                    <Typography variant="body2">
                      Created {formatDateTime(consultation.created_at)}
                    </Typography>
                    {consultation.opened_at ? (
                      <Typography variant="body2">
                        Opened {formatDateTime(consultation.opened_at)}
                      </Typography>
                    ) : null}
                    {consultation.closed_at ? (
                      <Typography variant="body2">
                        Closed {formatDateTime(consultation.closed_at)}
                      </Typography>
                    ) : null}
                    <Typography variant="body2">
                      Updated {formatDateTime(consultation.updated_at)}
                    </Typography>
                    <Typography variant="body2">
                      Last activity {formatDateTime(consultation.last_activity_at || consultation.updated_at)}
                    </Typography>
                    <Typography variant="body2">
                      Assigned to {consultation.assigned_admin?.email || 'nobody yet'}
                    </Typography>
                    {consultation.phone ? (
                      <Typography variant="body2">Phone: {consultation.phone}</Typography>
                    ) : null}
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle2">Message</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                      {consultation.message}
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Assignments" subheader="Lead and collaborator ownership." />
                <Divider />
                <CardContent>
                  <Stack spacing={1.5}>
                    {consultation.assignments?.length ? (
                      consultation.assignments.map((assignment) => (
                        <Box key={assignment.id} sx={{ pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Chip size="small" label={assignment.assignment_role} variant="outlined" />
                            <Typography variant="subtitle2">{assignment.admin_user.email}</Typography>
                          </Stack>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            Assigned {formatDateTime(assignment.assigned_at)}
                          </Typography>
                          {assignment.unassigned_at ? (
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                              Unassigned {formatDateTime(assignment.unassigned_at)}
                            </Typography>
                          ) : null}
                        </Box>
                      ))
                    ) : (
                      <Alert severity="info">No assignments recorded yet.</Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Documents" subheader="Protected files linked to this request." />
                <Divider />
                <CardContent>
                  <Stack spacing={1.5}>
                    {consultation.documents?.length ? (
                      consultation.documents.map((document) => (
                        <Box key={document.id} sx={{ pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="subtitle2">{document.original_filename}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
                            {document.classification.replaceAll('_', ' ')} • {formatDateTime(document.created_at)}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            {document.mime_type} • {(document.file_size / 1024).toFixed(1)} KB
                          </Typography>
                          {document.download_url ? (
                            <Button
                              component="a"
                              href={document.download_url}
                              size="small"
                              color="inherit"
                              sx={{ mt: 1 }}
                            >
                              Download
                            </Button>
                          ) : null}
                        </Box>
                      ))
                    ) : (
                      <Alert severity="info">No protected documents are linked yet.</Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack spacing={3}>
              <Card>
                <CardHeader title="Follow-up controls" subheader="Status, ownership, and compatibility notes." />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Status"
                        value={status}
                        onChange={(event) => setStatus(event.target.value as ApiConsultationStatus)}
                      >
                        {statusOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        select
                        fullWidth
                        label="Lead assignee"
                        value={assignedTo}
                        onChange={(event) => setAssignedTo(event.target.value)}
                        helperText={staffQuery.isError ? 'Staff list unavailable.' : undefined}
                      >
                        <MenuItem value="">Unassigned</MenuItem>
                        {(staffQuery.data ?? []).map((member) => (
                          <MenuItem key={member.id} value={String(member.id)}>
                            {member.email}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={4}
                        label="Internal notes"
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        helperText="Compatibility summary shown alongside the canonical note feed below."
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={3}
                        label="Customer-safe notes"
                        value={publicNotes}
                        onChange={(event) => setPublicNotes(event.target.value)}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        label="Timeline comment"
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        helperText="Optional note recorded with this update."
                      />
                    </Grid>
                  </Grid>

                  <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? 'Saving...' : 'Save changes'}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Thread" subheader="Primary internal thread for this request." />
                <Divider />
                <CardContent>
                  {consultation.unread && consultation.service_request_id ? (
                    <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        disabled={markReadMutation.isPending}
                        onClick={() => markReadMutation.mutate(consultation.service_request_id!)}
                      >
                        Mark read
                      </Button>
                    </Stack>
                  ) : null}
                  <Stack spacing={1.5}>
                    {consultation.messages?.length ? (
                      consultation.messages.map((entry) => (
                        <Box key={entry.id} sx={{ pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Chip size="small" label={entry.direction} variant="outlined" />
                            <Typography variant="subtitle2">
                              {entry.author_admin?.email || entry.customer_author_name || entry.customer_author_email || 'Customer'}
                            </Typography>
                          </Stack>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}>
                            {entry.channel.replaceAll('_', ' ')} • {formatDateTime(entry.created_at)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                            {entry.body}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Alert severity="info">No thread messages have been recorded yet.</Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Canonical notes" subheader="Internal and customer-safe note records." />
                <Divider />
                <CardContent>
                  <Stack spacing={1.5}>
                    {consultation.notes_records?.length ? (
                      consultation.notes_records.map((entry) => (
                        <Box key={entry.id} sx={{ pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                            <Chip size="small" label={entry.visibility} variant="outlined" />
                            <Typography variant="subtitle2">{entry.created_by_admin.email}</Typography>
                          </Stack>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}>
                            {formatDateTime(entry.created_at)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                            {entry.body}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Alert severity="info">No canonical notes have been recorded yet.</Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Timeline" subheader="Derived activity across status, assignments, messages, notes, and documents." />
                <Divider />
                <CardContent>
                  <Stack spacing={1.5}>
                    {consultation.timeline?.length ? (
                      consultation.timeline.map((entry) => (
                        <Box key={entry.id} sx={{ pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="subtitle2">{entry.summary}</Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
                            {entry.actor_name} • {formatDateTime(entry.created_at)}
                          </Typography>
                          {entry.body ? (
                            <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                              {entry.body}
                            </Typography>
                          ) : null}
                        </Box>
                      ))
                    ) : (
                      <Alert severity="info">No derived timeline events are available yet.</Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Stack>

      <ActionToast message={message} onClose={() => setMessage(null)} />
    </>
  );
}

export function ConsultationsRoutePanel({ match }: { match: AdminRouteMatch }) {
  if (match.mode === 'edit' && match.entityId) {
    return <ConsultationDetailPanel consultationId={match.entityId} />;
  }

  return <ConsultationsListPanel />;
}
