import type { ReactNode } from 'react';
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState, useEffect } from 'react';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import type { NavItem, NavGroup, NavChildItem } from '../nav-config-dashboard';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: NavGroup[];
  slots?: {
    topArea?: ReactNode;
    bottomArea?: ReactNode;
  };
  sx?: SxProps<Theme>;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  collapseLocked?: boolean;
};

function normalizePath(pathname: string) {
  if (!pathname || pathname === '/') {
    return pathname;
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

function isItemActive(pathname: string, item: Pick<NavItem | NavChildItem, 'path' | 'matchPrefixes'>) {
  const currentPath = normalizePath(pathname);
  const prefixes = item.matchPrefixes ?? [item.path];

  return prefixes.some((prefix) => {
    const normalizedPrefix = normalizePath(prefix);

    if (normalizedPrefix === '/admin') {
      return currentPath === '/admin';
    }

    return currentPath === normalizedPrefix || currentPath.startsWith(`${normalizedPrefix}/`);
  });
}

function hasActiveChild(pathname: string, children?: NavChildItem[]) {
  return children?.some((child) => isItemActive(pathname, child)) ?? false;
}

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
  collapsed = false,
  onToggleCollapse,
  collapseLocked = false,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: collapsed ? 1.25 : 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid ${varAlpha(theme.vars.palette.common.whiteChannel, 0.08)}`,
        bgcolor: '#08383D',
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent
        data={data}
        slots={slots}
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        collapseLocked={collapseLocked}
      />
    </Box>
  );
}

export function NavMobile({ sx, data, open, slots, onClose }: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          width: 'var(--layout-nav-mobile-width)',
          color: 'common.white',
          backgroundColor: '#08383D',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} />
    </Drawer>
  );
}

export function NavContent({
  data,
  slots,
  sx,
  collapsed = false,
  onToggleCollapse,
  collapseLocked = false,
}: NavContentProps) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setExpanded((current) => {
      let changed = false;
      const next = { ...current };

      data.forEach((group) => {
        group.items.forEach((item) => {
          if (!item.children?.length) {
            return;
          }

          if ((isItemActive(pathname, item) || hasActiveChild(pathname, item.children)) && !next[item.path]) {
            next[item.path] = true;
            changed = true;
          }
        });
      });

      return changed ? next : current;
    });
  }, [data, pathname]);

  const toggleExpanded = (path: string) => {
    setExpanded((current) => ({
      ...current,
      [path]: !current[path],
    }));
  };

  return (
    <>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 0.75,
        }}
      >
        <Logo inverted isSingle={collapsed} />

        {onToggleCollapse && !collapseLocked ? (
          <Tooltip title={collapsed ? 'Expand navigation' : 'Collapse navigation'} placement="right">
            <IconButton
              size="small"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              sx={{
                color: 'common.white',
                border: `1px solid ${varAlpha('255 255 255', 0.16)}`,
                bgcolor: varAlpha('255 255 255', 0.06),
                '&:hover': {
                  bgcolor: varAlpha('255 255 255', 0.12),
                },
              }}
            >
              <Iconify
                width={16}
                icon={collapsed ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
              />
            </IconButton>
          </Tooltip>
        ) : null}
      </Box>

      {slots?.topArea}

      <Scrollbar fillContent>
        <Box
          component="nav"
          sx={[
            {
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: collapsed ? 1.5 : 2.5 }}>
            {data.map((group) => (
              <Box key={group.subheader}>
                {!collapsed ? (
                  <Typography
                    variant="overline"
                    sx={{
                      px: 2,
                      display: 'block',
                      color: varAlpha('255 255 255', 0.48),
                      letterSpacing: '0.14em',
                    }}
                  >
                    {group.subheader}
                  </Typography>
                ) : null}

                <Box
                  component="ul"
                  sx={{
                    mt: collapsed ? 0 : 0.75,
                    gap: 0.5,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {group.items.map((item) => {
                    const active = isItemActive(pathname, item) || hasActiveChild(pathname, item.children);
                    const isExpanded = item.children?.length
                      ? (expanded[item.path] ?? false) || hasActiveChild(pathname, item.children)
                      : false;

                    return (
                      <ListItem disableGutters disablePadding key={item.title} sx={{ display: 'block' }}>
                        <Tooltip title={collapsed ? item.title : ''} placement="right">
                          <ListItemButton
                            disableGutters
                            component={RouterLink}
                            href={item.path}
                            onClick={(event) => {
                              if (collapsed) {
                                return;
                              }

                              if (item.children?.length) {
                                if (active || hasActiveChild(pathname, item.children)) {
                                  event.preventDefault();
                                  toggleExpanded(item.path);
                                } else {
                                  setExpanded((current) => ({
                                    ...current,
                                    [item.path]: true,
                                  }));
                                }
                              }
                            }}
                            sx={{
                              pl: collapsed ? 0 : 2,
                              py: 1,
                              gap: collapsed ? 0 : 2,
                              pr: collapsed ? 0 : 1.5,
                              borderRadius: 0.75,
                              justifyContent: collapsed ? 'center' : 'flex-start',
                              typography: 'body2',
                              fontWeight: active ? 'fontWeightSemiBold' : 'fontWeightMedium',
                              color: active ? 'common.white' : varAlpha('255 255 255', 0.72),
                              minHeight: 44,
                              bgcolor: active ? varAlpha('255 255 255', 0.12) : 'transparent',
                              '&:hover': {
                                bgcolor: active
                                  ? varAlpha('255 255 255', 0.16)
                                  : varAlpha('255 255 255', 0.08),
                              },
                            }}
                          >
                            <Box
                              component="span"
                              sx={{
                                width: 24,
                                height: 24,
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                              }}
                            >
                              {item.icon}
                            </Box>

                            {!collapsed ? (
                              <Box component="span" sx={{ flexGrow: 1, minWidth: 0 }}>
                                {item.title}
                              </Box>
                            ) : null}

                            {!collapsed ? (
                              item.children?.length ? (
                                <Iconify
                                  width={16}
                                  icon={
                                    isExpanded
                                      ? 'eva:arrow-ios-upward-fill'
                                      : 'eva:arrow-ios-downward-fill'
                                  }
                                />
                              ) : (
                                item.info
                              )
                            ) : null}
                          </ListItemButton>
                        </Tooltip>

                        {!collapsed && item.children?.length ? (
                          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                            <Box sx={{ pt: 0.5, pl: 5.5 }}>
                              {item.children.map((child) => {
                                const childActive = isItemActive(pathname, child);

                                return (
                                  <ListItem disableGutters disablePadding key={child.path}>
                                    <ListItemButton
                                      disableGutters
                                      component={RouterLink}
                                      href={child.path}
                                      sx={{
                                        py: 0.75,
                                        px: 2,
                                        minHeight: 36,
                                        borderRadius: 0.75,
                                        color: childActive ? 'common.white' : varAlpha('255 255 255', 0.6),
                                        bgcolor: childActive ? varAlpha('255 255 255', 0.08) : 'transparent',
                                        '&:hover': {
                                          bgcolor: varAlpha('255 255 255', 0.08),
                                        },
                                      }}
                                    >
                                      <ListItemText
                                        primary={child.title}
                                        primaryTypographyProps={{
                                          variant: 'body2',
                                          fontWeight: childActive ? 700 : 500,
                                        }}
                                      />
                                    </ListItemButton>
                                  </ListItem>
                                );
                              })}
                            </Box>
                          </Collapse>
                        ) : null}
                      </ListItem>
                    );
                  })}
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}
    </>
  );
}
