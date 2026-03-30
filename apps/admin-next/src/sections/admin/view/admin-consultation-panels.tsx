import type { AdminRouteMatch } from '@exxonim/admin-core/lib/adminRoutes';
import type { ApiConsultationStatus } from '@exxonim/admin-core/types/api';

import { useState, useEffect } from 'react';
import { adminRoutes } from '@exxonim/admin-core/lib/adminRoutes';
import { getAdminErrorMessage } from '@exxonim/admin-core/utils/admin';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listAdminStaff } from '@exxonim/admin-core/services/adminStaffService';
import {
  getAdminConsultation,
  updateAdminConsultation,
  listAdminConsultationsPage,
} from '@exxonim/admin-core/services/adminConsultationService';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
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
import TableContainer from '@mui/material/TableContainer';

import { RouterLink } from 'src/routes/components';

import { fToNow } from 'src/utils/format-time';

// ----------------------------------------------------------------------

type FormMessage = { tone: 'success' | 'error'; text: string } | null;
type StatusFilterValue = 'all' | ApiConsultationStatus;
type MuiChipColor = 'default' | 'success' | 'warning' | 'error' | 'info';

const statusOptions: Array<{ value: ApiConsultationStatus; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');

  const query = useQuery({
    queryKey: ['admin-next', 'consultations', page, statusFilter, search],
    queryFn: () =>
      listAdminConsultationsPage({
        page,
        limit: 10,
        search: search.trim() || undefined,
        status: statusFilter === 'all' ? '' : statusFilter,
      }),
  });

  const totalPages = query.data?.total_pages ?? 1;

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField
                fullWidth
                size="small"
                label="Search consultations"
                placeholder="Tracking ID, name, email, or company"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
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
              <Button
                fullWidth
                variant="outlined"
                size="small"
                sx={{ height: 1 }}
                onClick={() => {
                  setSearch('');
                  setStatusFilter('all');
                  setPage(1);
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
          title="Consultation queue"
          subheader={
            query.data
              ? `${query.data.total} tracked requests across the Exxonim follow-up pipeline.`
              : 'Loading tracked consultation requests.'
          }
        />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          {query.isLoading ? (
            <Box sx={{ p: 3 }}>
              <Alert severity="info">Loading consultations...</Alert>
            </Box>
          ) : query.isError ? (
            <Box sx={{ p: 3 }}>
              <Alert severity="error">
                {getAdminErrorMessage(query.error, 'Unable to load consultations.')}
              </Alert>
            </Box>
          ) : query.data?.items.length ? (
            <>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Lead</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Assigned</TableCell>
                      <TableCell>Updated</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {query.data.items.map((item) => (
                      <TableRow hover key={item.id}>
                        <TableCell sx={{ minWidth: 280 }}>
                          <Stack spacing={0.5}>
                            <Typography variant="subtitle2">{item.full_name}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {item.tracking_id} • {item.company || item.email}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <StatusChip status={item.status} />
                        </TableCell>
                        <TableCell>
                          {item.assigned_admin?.email || 'Unassigned'}
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.25}>
                            <Typography variant="body2">{formatDateTime(item.updated_at)}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {fToNow(item.updated_at)}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            component={RouterLink}
                            href={adminRoutes.consultationDetail(item.id)}
                            size="small"
                            color="inherit"
                          >
                            Open
                          </Button>
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

  const consultation = consultationQuery.data;

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
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={3}>
              <Card>
                <CardHeader title="Request summary" subheader="What the lead submitted." />
                <Divider />
                <CardContent>
                  <Stack spacing={1.5}>
                    <StatusChip status={consultation.status} />
                    <Typography variant="body2">
                      Created {formatDateTime(consultation.created_at)}
                    </Typography>
                    <Typography variant="body2">
                      Updated {formatDateTime(consultation.updated_at)}
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
                <CardHeader title="History" subheader="Latest follow-up changes." />
                <Divider />
                <CardContent>
                  <Stack spacing={1.5}>
                    {consultation.status_history?.length ? (
                      consultation.status_history.map((entry) => (
                        <Box key={entry.id} sx={{ pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                          <Typography variant="subtitle2">
                            {entry.old_status ? `${entry.old_status} → ${entry.new_status}` : entry.new_status}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.25 }}>
                            {entry.changed_by_admin?.email || 'System'} • {formatDateTime(entry.created_at)}
                          </Typography>
                          {entry.comment ? (
                            <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary' }}>
                              {entry.comment}
                            </Typography>
                          ) : null}
                        </Box>
                      ))
                    ) : (
                      <Alert severity="info">No follow-up history recorded yet.</Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 7 }}>
            <Card>
              <CardHeader title="Follow-up controls" subheader="Status, ownership, and notes." />
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
                      label="Assigned admin"
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
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      multiline
                      minRows={3}
                      label="Public notes"
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
