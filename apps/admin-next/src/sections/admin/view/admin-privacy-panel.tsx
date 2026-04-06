import type {
  ApiPrivacyRequestType,
  ApiPrivacyRequestStatus,
} from '@exxonim/admin-core/types/api';

import { useMemo, useState } from 'react';
import { useAuth } from '@exxonim/admin-core/contexts/AuthContext';
import { getAdminErrorMessage } from '@exxonim/admin-core/utils/admin';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiPrivacyRequestTypes,
  apiPrivacyRequestStatuses,
} from '@exxonim/admin-core/types/api';
import {
  listAdminPrivacyRequests,
  createAdminPrivacyRequest,
  updateAdminPrivacyRequest,
} from '@exxonim/admin-core/services/adminPrivacyService';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
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
import InputLabel from '@mui/material/InputLabel';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import TableContainer from '@mui/material/TableContainer';

// ----------------------------------------------------------------------

type FormMessage = { tone: 'success' | 'error'; text: string } | null;

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatLabel(value: string) {
  return value.replaceAll('_', ' ');
}

export function PrivacyRequestsRoutePanel() {
  const queryClient = useQueryClient();
  const { admin } = useAuth();
  const canManage = admin?.permissions?.includes('privacy_request.manage') ?? false;
  const canRead = admin?.permissions?.includes('privacy_request.read') ?? false;
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApiPrivacyRequestStatus | ''>('');
  const [typeFilter, setTypeFilter] = useState<ApiPrivacyRequestType | ''>('');
  const [requestType, setRequestType] = useState<ApiPrivacyRequestType>('access');
  const [requesterName, setRequesterName] = useState('');
  const [requesterEmail, setRequesterEmail] = useState('');
  const [summary, setSummary] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [formMessage, setFormMessage] = useState<FormMessage>(null);

  const listParams = useMemo(
    () => ({
      page,
      limit: 10,
      search: search || undefined,
      status: statusFilter || undefined,
      request_type: typeFilter || undefined,
    }),
    [page, search, statusFilter, typeFilter]
  );

  const privacyQuery = useQuery({
    queryKey: ['admin-next', 'privacy-requests', listParams],
    queryFn: () => listAdminPrivacyRequests(listParams),
    enabled: canRead,
  });

  const createMutation = useMutation({
    mutationFn: createAdminPrivacyRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-next', 'privacy-requests'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApiPrivacyRequestStatus }) =>
      updateAdminPrivacyRequest(id, { status }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-next', 'privacy-requests'] });
    },
  });

  const resetForm = () => {
    setRequestType('access');
    setRequesterName('');
    setRequesterEmail('');
    setSummary('');
    setInternalNotes('');
  };

  const handleCreateRequest = async () => {
    if (!requesterName.trim() || !requesterEmail.trim() || !summary.trim()) {
      setFormMessage({ tone: 'error', text: 'Name, email, and summary are required.' });
      return;
    }

    try {
      await createMutation.mutateAsync({
        request_type: requestType,
        requester_name: requesterName.trim(),
        requester_email: requesterEmail.trim(),
        summary: summary.trim(),
        internal_notes: internalNotes.trim() || undefined,
      });
      resetForm();
      setFormMessage({ tone: 'success', text: 'Privacy request logged successfully.' });
    } catch (error) {
      setFormMessage({
        tone: 'error',
        text: getAdminErrorMessage(error, 'Unable to log the privacy request.'),
      });
    }
  };

  if (!canRead) {
    return <Alert severity="warning">Your account does not currently have access to privacy requests.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Card>
        <CardContent>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="h5">Privacy Requests</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                Internal workflow for access, correction, and deletion requests logged through existing support channels.
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Audit-safe handling only. No self-service portal in this phase.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {canManage ? (
        <Card>
          <CardHeader
            title="Log a Privacy Request"
            subheader="Use this when staff receives a request through support, contact, or another assisted channel."
          />
          <Divider />
          <CardContent>
            <Stack spacing={2}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel id="privacy-request-type-label">Request type</InputLabel>
                  <Select
                    labelId="privacy-request-type-label"
                    label="Request type"
                    value={requestType}
                    onChange={(event) => setRequestType(event.target.value as ApiPrivacyRequestType)}
                  >
                    {apiPrivacyRequestTypes.map((value) => (
                      <MenuItem key={value} value={value}>
                        {formatLabel(value)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Requester name"
                  value={requesterName}
                  onChange={(event) => setRequesterName(event.target.value)}
                />
                <TextField
                  fullWidth
                  type="email"
                  label="Requester email"
                  value={requesterEmail}
                  onChange={(event) => setRequesterEmail(event.target.value)}
                />
              </Stack>

              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Request summary"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
              />

              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Internal notes"
                value={internalNotes}
                onChange={(event) => setInternalNotes(event.target.value)}
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={() => {
                    void handleCreateRequest();
                  }}
                  disabled={createMutation.isPending}
                >
                  Log request
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader title="Request Queue" subheader="Auditable queue of privacy requests and their current handling status." />
        <Divider />
        <CardContent>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="privacy-status-filter-label">Status</InputLabel>
              <Select
                labelId="privacy-status-filter-label"
                label="Status"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as ApiPrivacyRequestStatus | '');
                  setPage(1);
                }}
              >
                <MenuItem value="">All statuses</MenuItem>
                {apiPrivacyRequestStatuses.map((value) => (
                  <MenuItem key={value} value={value}>
                    {formatLabel(value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="privacy-type-filter-label">Request type</InputLabel>
              <Select
                labelId="privacy-type-filter-label"
                label="Request type"
                value={typeFilter}
                onChange={(event) => {
                  setTypeFilter(event.target.value as ApiPrivacyRequestType | '');
                  setPage(1);
                }}
              >
                <MenuItem value="">All types</MenuItem>
                {apiPrivacyRequestTypes.map((value) => (
                  <MenuItem key={value} value={value}>
                    {formatLabel(value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>

          {privacyQuery.isLoading ? (
            <Alert severity="info">Loading privacy requests...</Alert>
          ) : privacyQuery.isError ? (
            <Alert severity="error">
              {getAdminErrorMessage(privacyQuery.error, 'Unable to load privacy requests.')}
            </Alert>
          ) : privacyQuery.data?.items.length ? (
            <Stack spacing={2}>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Requester</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Summary</TableCell>
                      <TableCell>Logged</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {privacyQuery.data.items.map((item) => (
                      <TableRow hover key={item.id}>
                        <TableCell sx={{ minWidth: 220 }}>
                          <Stack spacing={0.5}>
                            <Typography variant="subtitle2">{item.requester_name}</Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {item.requester_email}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{formatLabel(item.request_type)}</TableCell>
                        <TableCell sx={{ minWidth: 180 }}>
                          {canManage ? (
                            <FormControl size="small" fullWidth>
                              <Select
                                value={item.status}
                                onChange={(event) => {
                                  void updateMutation.mutateAsync({
                                    id: item.id,
                                    status: event.target.value as ApiPrivacyRequestStatus,
                                  });
                                }}
                              >
                                {apiPrivacyRequestStatuses.map((value) => (
                                  <MenuItem key={value} value={value}>
                                    {formatLabel(value)}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          ) : (
                            formatLabel(item.status)
                          )}
                        </TableCell>
                        <TableCell sx={{ minWidth: 320 }}>
                          <Stack spacing={0.5}>
                            <Typography variant="body2">{item.summary}</Typography>
                            {item.internal_notes ? (
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Internal notes: {item.internal_notes}
                              </Typography>
                            ) : null}
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Stack spacing={0.5}>
                            <Typography variant="body2">{formatDateTime(item.created_at)}</Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              By {item.created_by_admin.full_name || item.created_by_admin.email}
                            </Typography>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {privacyQuery.data.total_pages > 1 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    page={page}
                    count={privacyQuery.data.total_pages}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                  />
                </Box>
              ) : null}
            </Stack>
          ) : (
            <Alert severity="info">No privacy requests match the current filters.</Alert>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={Boolean(formMessage)}
        autoHideDuration={4000}
        onClose={() => setFormMessage(null)}
        message={formMessage?.text}
      />
    </Stack>
  );
}
