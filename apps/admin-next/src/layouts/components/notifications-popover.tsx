import type { MouseEvent } from 'react';
import type { IconButtonProps } from '@mui/material/IconButton';
import type { ApiAdminNotification } from '@exxonim/admin-core/types/api';

import { useNavigate } from 'react-router';
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  listAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
} from '@exxonim/admin-core/services/adminNotificationService';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Fade from '@mui/material/Fade';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import {
  getAdminNotificationIcon,
  getAdminNotificationSeverityColor,
} from 'src/sections/admin/utils/admin-notification-metadata';

// ----------------------------------------------------------------------

export type NotificationsPopoverProps = IconButtonProps & {
  viewAllHref?: string;
};

export function NotificationsPopover({
  sx,
  viewAllHref,
  ...other
}: NotificationsPopoverProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const notificationsQuery = useQuery({
    queryKey: ['admin-next', 'notifications', 'bell'],
    queryFn: () =>
      listAdminNotifications({
        status: 'all',
        page: 1,
        limit: 7,
      }),
    staleTime: 15_000,
    refetchInterval: 30_000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });

  const markReadMutation = useMutation({
    mutationFn: (notificationId: string) => markAdminNotificationRead(notificationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-next', 'notifications'] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => markAllAdminNotificationsRead(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-next', 'notifications'] });
    },
  });

  const totalUnRead = notificationsQuery.data?.unread_total ?? 0;
  const notifications = notificationsQuery.data?.items ?? [];
  const freshItems = notifications.slice(0, 3);
  const earlierItems = notifications.slice(3);

  const handleOpenPopover = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    void markAllMutation.mutateAsync();
  }, [markAllMutation]);

  const handleSelectNotification = useCallback(
    async (notification: ApiAdminNotification) => {
      if (!notification.is_read) {
        try {
          await markReadMutation.mutateAsync(notification.id);
        } catch {
          // Keep navigation responsive even if the read-state update fails.
        }
      }

      handleClosePopover();

      if (notification.href) {
        navigate(notification.href);
      }
    },
    [handleClosePopover, markReadMutation, navigate]
  );

  return (
    <>
      <IconButton
        color={openPopover ? 'primary' : 'default'}
        onClick={handleOpenPopover}
        sx={sx}
        {...other}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify width={24} icon="solar:bell-bing-bold-duotone" />
        </Badge>
      </IconButton>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slots={{ transition: Fade }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
          },
        }}
      >
        <Box
          sx={{
            py: 2,
            pl: 2.5,
            pr: 1.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {totalUnRead > 0 ? `${totalUnRead} items need attention` : 'You are caught up'}
            </Typography>
          </Box>

          {totalUnRead > 0 ? (
            <Tooltip title="Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead} disabled={markAllMutation.isPending}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar fillContent sx={{ minHeight: 200, maxHeight: 420 }}>
          {notificationsQuery.isLoading ? (
            <Box sx={{ px: 2.5, py: 2 }}>
              {[0, 1, 2].map((item) => (
                <Box key={item} sx={{ py: 1.5 }}>
                  <Skeleton variant="rounded" height={56} />
                </Box>
              ))}
            </Box>
          ) : notificationsQuery.isError ? (
            <Box
              sx={{
                px: 2.5,
                py: 5,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <Iconify icon="solar:notification-unread-lines-bold-duotone" width={36} />
              <Typography variant="subtitle2" sx={{ mt: 1.5 }}>
                Notifications are temporarily unavailable
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.75 }}>
                Your inbox will refresh automatically when the API responds again.
              </Typography>
            </Box>
          ) : notifications.length ? (
            <>
              <List
                disablePadding
                subheader={
                  <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                    Current
                  </ListSubheader>
                }
              >
                {freshItems.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onSelect={handleSelectNotification}
                  />
                ))}
              </List>

              {earlierItems.length ? (
                <List
                  disablePadding
                  subheader={
                    <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                      Earlier
                    </ListSubheader>
                  }
                >
                  {earlierItems.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onSelect={handleSelectNotification}
                    />
                  ))}
                </List>
              ) : null}
            </>
          ) : (
            <Box
              sx={{
                px: 2.5,
                py: 5,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <Iconify icon="solar:check-circle-bold-duotone" width={36} />
              <Typography variant="subtitle2" sx={{ mt: 1.5 }}>
                No notifications right now
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.75 }}>
                Exxonim in-app alerts will appear here as real work arrives.
              </Typography>
            </Box>
          )}
        </Scrollbar>

        {viewAllHref ? (
          <>
            <Divider sx={{ borderStyle: 'dashed' }} />

            <Box sx={{ p: 1 }}>
              <Button
                fullWidth
                color="inherit"
                onClick={() => {
                  handleClosePopover();
                  navigate(viewAllHref);
                }}
              >
                Open notifications
              </Button>
            </Box>
          </>
        ) : null}
      </Popover>
    </>
  );
}

// ----------------------------------------------------------------------

function NotificationItem({
  notification,
  onSelect,
}: {
  notification: ApiAdminNotification;
  onSelect: (notification: ApiAdminNotification) => void | Promise<void>;
}) {
  const color = getAdminNotificationSeverityColor(notification.severity);

  return (
    <ListItemButton
      onClick={() => {
        void onSelect(notification);
      }}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        alignItems: 'flex-start',
        ...(notification.is_read
          ? null
          : {
              bgcolor: 'action.selected',
            }),
      }}
    >
      <ListItemAvatar>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: `${color}.lighter`,
            color: `${color}.main`,
          }}
        >
          <Iconify icon={getAdminNotificationIcon(notification)} width={18} />
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Typography variant="subtitle2">
            {notification.title}
            {notification.occurrence_count > 1 ? ` (${notification.occurrence_count})` : ''}
          </Typography>
        }
        secondary={
          <>
            <Typography
              variant="body2"
              sx={{ mt: 0.5, color: 'text.secondary' }}
            >
              {notification.body || 'Open the related record for more detail.'}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                mt: 0.75,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Iconify
                width={14}
                icon="solar:clock-circle-bold"
                sx={{ mr: 0.5, flexShrink: 0 }}
              />
              {fToNow(notification.last_occurred_at)}
            </Typography>
          </>
        }
      />
    </ListItemButton>
  );
}
