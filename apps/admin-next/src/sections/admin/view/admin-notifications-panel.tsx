import type {
  ApiAdminNotification,
  ApiAdminNotificationCategory,
  ApiAdminNotificationSeverity,
  ApiAdminNotificationPreference,
} from '@exxonim/admin-core/types/api';

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { getAdminErrorMessage } from '@exxonim/admin-core/utils/admin';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  apiAdminNotificationCategories,
  apiAdminNotificationSeverities,
} from '@exxonim/admin-core/types/api';
import {
  listAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  getAdminNotificationPreferences,
  updateAdminNotificationPreferences,
} from '@exxonim/admin-core/services/adminNotificationService';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Tabs from '@mui/material/Tabs';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';

import {
  getAdminNotificationIcon,
  getAdminNotificationEventLabel,
  getAdminNotificationCategoryLabel,
  getAdminNotificationSeverityColor,
  getAdminNotificationSeverityLabel,
} from 'src/sections/admin/utils/admin-notification-metadata';

// ----------------------------------------------------------------------

const CATEGORY_OPTIONS: Array<{
  value: ApiAdminNotificationCategory;
  label: string;
}> = apiAdminNotificationCategories.map((value) => ({
  value,
  label: getAdminNotificationCategoryLabel(value),
}));

const SEVERITY_OPTIONS: Array<{
  value: ApiAdminNotificationSeverity;
  label: string;
}> = apiAdminNotificationSeverities.map((value) => ({
  value,
  label: getAdminNotificationSeverityLabel(value),
}));

export function NotificationsRoutePanel() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<'unread' | 'all'>('unread');
  const [categoryFilter, setCategoryFilter] = useState<ApiAdminNotificationCategory | ''>('');
  const [severityFilter, setSeverityFilter] = useState<ApiAdminNotificationSeverity | ''>('');
  const [page, setPage] = useState(1);

  const notificationParams = useMemo(
    () => ({
      status: statusFilter,
      category: categoryFilter || undefined,
      severity: severityFilter || undefined,
      page,
      limit: 12,
    }),
    [categoryFilter, page, severityFilter, statusFilter]
  );

  const notificationsQuery = useQuery({
    queryKey: ['admin-next', 'notifications', 'page', notificationParams],
    queryFn: () => listAdminNotifications(notificationParams),
    staleTime: 15_000,
    refetchInterval: 60_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  const preferencesQuery = useQuery({
    queryKey: ['admin-next', 'notifications', 'preferences'],
    queryFn: getAdminNotificationPreferences,
    staleTime: 60_000,
  });

  const markReadMutation = useMutation({
    mutationFn: (notificationId: string) => markAdminNotificationRead(notificationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-next', 'notifications'] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () =>
      markAllAdminNotificationsRead({
        category: categoryFilter || null,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-next', 'notifications'] });
    },
  });

  const preferenceMutation = useMutation({
    mutationFn: (payload: ApiAdminNotificationPreference[]) =>
      updateAdminNotificationPreferences(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-next', 'notifications', 'preferences'] });
    },
  });

  const handleOpenNotification = async (notification: ApiAdminNotification) => {
    if (!notification.is_read) {
      try {
        await markReadMutation.mutateAsync(notification.id);
      } catch {
        // Keep the action path responsive even if the read-state update fails.
      }
    }

    if (notification.href) {
      navigate(notification.href);
    }
  };

  const togglePreference = (preference: ApiAdminNotificationPreference) => {
    void preferenceMutation.mutateAsync([
      {
        category: preference.category,
        in_app_enabled: !preference.in_app_enabled,
      },
    ]);
  };

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
              <Typography variant="h5">Notifications inbox</Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary' }}>
                Real in-app notifications with read state, filters, and linked records.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<Iconify icon="eva:done-all-fill" />}
              disabled={markAllMutation.isPending || (notificationsQuery.data?.unread_total ?? 0) === 0}
              onClick={() => {
                void markAllMutation.mutateAsync();
              }}
            >
              Mark all as read
            </Button>
          </Stack>

          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <Tabs
              value={statusFilter}
              onChange={(_, value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              sx={{ minHeight: 44 }}
            >
              <Tab value="unread" label={`Unread (${notificationsQuery.data?.unread_total ?? 0})`} />
              <Tab value="all" label={`All (${notificationsQuery.data?.total ?? 0})`} />
            </Tabs>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ flexGrow: 1 }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel id="notifications-category-label">Category</InputLabel>
                <Select
                  labelId="notifications-category-label"
                  label="Category"
                  value={categoryFilter}
                  onChange={(event) => {
                    setCategoryFilter(event.target.value as ApiAdminNotificationCategory | '');
                    setPage(1);
                  }}
                >
                  <MenuItem value="">All categories</MenuItem>
                  {CATEGORY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel id="notifications-severity-label">Severity</InputLabel>
                <Select
                  labelId="notifications-severity-label"
                  label="Severity"
                  value={severityFilter}
                  onChange={(event) => {
                    setSeverityFilter(event.target.value as ApiAdminNotificationSeverity | '');
                    setPage(1);
                  }}
                >
                  <MenuItem value="">All severities</MenuItem>
                  {SEVERITY_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction={{ xs: 'column', xl: 'row' }} spacing={3} alignItems="stretch">
        <Card sx={{ flex: 1 }}>
          <CardContent>
            {notificationsQuery.isLoading ? (
              <Stack spacing={2}>
                {[0, 1, 2, 3].map((item) => (
                  <Skeleton key={item} variant="rounded" height={96} />
                ))}
              </Stack>
            ) : notificationsQuery.isError ? (
              <Alert severity="error">
                {getAdminErrorMessage(
                  notificationsQuery.error,
                  'Unable to load notifications right now.'
                )}
              </Alert>
            ) : notificationsQuery.data && notificationsQuery.data.items.length > 0 ? (
              <Stack spacing={2}>
                {notificationsQuery.data.items.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onOpen={handleOpenNotification}
                    onMarkRead={() => {
                      void markReadMutation.mutateAsync(notification.id);
                    }}
                    busy={markReadMutation.isPending}
                  />
                ))}

                {notificationsQuery.data.pages > 1 ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1 }}>
                    <Pagination
                      page={page}
                      count={notificationsQuery.data.pages}
                      onChange={(_, value) => setPage(value)}
                      color="primary"
                    />
                  </Box>
                ) : null}
              </Stack>
            ) : (
              <Alert severity="info">
                No notifications match the current filters.
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card sx={{ width: { xs: '100%', xl: 360 }, flexShrink: 0 }}>
          <CardContent>
            <Typography variant="h6">Notification preferences</Typography>
            <Typography variant="body2" sx={{ mt: 0.5, mb: 2, color: 'text.secondary' }}>
              Keep the signals you want and mute categories that do not help your daily work.
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {preferencesQuery.isLoading ? (
              <Stack spacing={1.5}>
                {[0, 1, 2, 3, 4].map((item) => (
                  <Skeleton key={item} variant="rounded" height={42} />
                ))}
              </Stack>
            ) : preferencesQuery.isError ? (
              <Alert severity="error">
                {getAdminErrorMessage(
                  preferencesQuery.error,
                  'Unable to load notification preferences.'
                )}
              </Alert>
            ) : (
              <Stack spacing={1}>
                {preferencesQuery.data?.map((preference) => (
                  <FormControlLabel
                    key={preference.category}
                    control={
                      <Switch
                        checked={preference.in_app_enabled}
                        onChange={() => togglePreference(preference)}
                        disabled={preferenceMutation.isPending}
                      />
                    }
                    label={getAdminNotificationCategoryLabel(preference.category)}
                    sx={{
                      mx: 0,
                      justifyContent: 'space-between',
                    }}
                    labelPlacement="start"
                  />
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}

function NotificationCard({
  notification,
  onOpen,
  onMarkRead,
  busy = false,
}: {
  notification: ApiAdminNotification;
  onOpen: (notification: ApiAdminNotification) => void | Promise<void>;
  onMarkRead: () => void;
  busy?: boolean;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: notification.is_read ? 'divider' : 'primary.light',
        bgcolor: notification.is_read ? 'background.paper' : 'action.hover',
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                bgcolor: `${getAdminNotificationSeverityColor(notification.severity)}.lighter`,
                color: `${getAdminNotificationSeverityColor(notification.severity)}.main`,
                flexShrink: 0,
              }}
            >
              <Iconify icon={getAdminNotificationIcon(notification)} width={22} />
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
              >
                <Typography variant="subtitle1">{notification.title}</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip
                    size="small"
                    label={getAdminNotificationCategoryLabel(notification.category)}
                    variant="outlined"
                  />
                  <Chip
                    size="small"
                    color={getAdminNotificationSeverityColor(notification.severity)}
                    label={getAdminNotificationSeverityLabel(notification.severity)}
                  />
                </Stack>
              </Stack>

              <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: 'text.disabled' }}>
                {getAdminNotificationEventLabel(notification)}
              </Typography>

              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                {notification.body || 'Open the related record for more detail.'}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {fToNow(notification.last_occurred_at)}
                </Typography>
                {notification.occurrence_count > 1 ? (
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${notification.occurrence_count} events`}
                  />
                ) : null}
                {!notification.is_read ? (
                  <Chip size="small" color="primary" label="Unread" />
                ) : null}
              </Stack>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            {!notification.is_read ? (
              <Button size="small" color="inherit" onClick={onMarkRead} disabled={busy}>
                Mark read
              </Button>
            ) : null}
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                void onOpen(notification);
              }}
              disabled={!notification.href}
            >
              {notification.href ? 'Open record' : 'Link unavailable'}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
