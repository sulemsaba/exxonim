import type { MouseEvent } from 'react';
import type { IconButtonProps } from '@mui/material/IconButton';

import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Fade from '@mui/material/Fade';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import { RouterLink } from 'src/routes/components';

import { fToNow } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

// ----------------------------------------------------------------------

type NotificationColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type NotificationItemProps = {
  id: string;
  title: string;
  description: string;
  isUnRead: boolean;
  postedAt: string | number | null;
  icon: string;
  href?: string | null;
  color?: NotificationColor;
};

export type NotificationsPopoverProps = IconButtonProps & {
  data?: NotificationItemProps[];
  viewAllHref?: string;
};

export function NotificationsPopover({
  data = [],
  sx,
  viewAllHref,
  ...other
}: NotificationsPopoverProps) {
  const [notifications, setNotifications] = useState(data);
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    setNotifications(data);
  }, [data]);

  const totalUnRead = notifications.filter((item) => item.isUnRead).length;
  const freshItems = notifications.slice(0, 3);
  const earlierItems = notifications.slice(3);

  const handleOpenPopover = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
  }, []);

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
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar fillContent sx={{ minHeight: 200, maxHeight: 420 }}>
          {notifications.length ? (
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
                    onSelect={handleClosePopover}
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
                      onSelect={handleClosePopover}
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
                Exxonim alerts and activity will appear here.
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
                component={RouterLink}
                href={viewAllHref}
                onClick={handleClosePopover}
              >
                Open dashboard
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
  notification: NotificationItemProps;
  onSelect: () => void;
}) {
  const color = notification.color ?? 'default';
  const clickableProps = notification.href
    ? {
        component: RouterLink,
        href: notification.href,
        onClick: onSelect,
      }
    : {
        onClick: onSelect,
      };

  return (
    <ListItemButton
      {...clickableProps}
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        alignItems: 'flex-start',
        ...(notification.isUnRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar
          sx={(theme) => ({
            bgcolor:
              color === 'default'
                ? theme.vars.palette.background.neutral
                : theme.vars.palette[color].lighter,
            color:
              color === 'default'
                ? theme.vars.palette.text.primary
                : theme.vars.palette[color].dark,
          })}
        >
          <Iconify icon={notification.icon} width={18} />
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={
          <Typography variant="subtitle2" sx={{ pr: 1 }}>
            {notification.title}
          </Typography>
        }
        secondary={
          <>
            <Typography
              variant="body2"
              sx={{
                mt: 0.5,
                color: 'text.secondary',
                display: '-webkit-box',
                overflow: 'hidden',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {notification.description}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                mt: 0.75,
                gap: 0.5,
                display: 'flex',
                alignItems: 'center',
                color: 'text.disabled',
              }}
            >
              <Iconify width={14} icon="solar:clock-circle-outline" />
              {fToNow(notification.postedAt)}
            </Typography>
          </>
        }
      />
    </ListItemButton>
  );
}
