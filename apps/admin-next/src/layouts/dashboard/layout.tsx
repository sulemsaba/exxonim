import type { Breakpoint } from '@mui/material/styles';

import { useState } from 'react';
import { merge } from 'es-toolkit';
import { useBoolean } from 'minimal-shared/hooks';
import { routes } from '@exxonim/admin-core/routes';
import { useAuth } from '@exxonim/admin-core/contexts/AuthContext';

import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { _notifications } from 'src/_mock';

import { Iconify } from 'src/components/iconify';

import { NavMobile, NavDesktop } from './nav';
import { layoutClasses } from '../core/classes';
import { dashboardLayoutVars } from './css-vars';
import { MainSection } from '../core/main-section';
import { Searchbar } from '../components/searchbar';
import { getNavData } from '../nav-config-dashboard';
import { MenuButton } from '../components/menu-button';
import { HeaderSection } from '../core/header-section';
import { LayoutSection } from '../core/layout-section';
import { ThemeToggleButton } from '../components/theme-toggle-button';
import { NotificationsPopover } from '../components/notifications-popover';

import type { MainSectionProps } from '../core/main-section';
import type { HeaderSectionProps } from '../core/header-section';
import type { LayoutSectionProps } from '../core/layout-section';

// ----------------------------------------------------------------------

type LayoutBaseProps = Pick<LayoutSectionProps, 'sx' | 'children' | 'cssVars'>;

export type DashboardLayoutProps = LayoutBaseProps & {
  layoutQuery?: Breakpoint;
  slotProps?: {
    header?: HeaderSectionProps;
    main?: MainSectionProps;
  };
};

export function DashboardLayout({
  sx,
  cssVars,
  children,
  slotProps,
  layoutQuery = 'lg',
}: DashboardLayoutProps) {
  const theme = useTheme();
  const { logout, admin } = useAuth();
  const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();
  const [navCollapsed, setNavCollapsed] = useState(false);
  const navData = getNavData(admin?.role);

  const renderHeader = () => {
    const headerSlotProps: HeaderSectionProps['slotProps'] = {
      container: {
        maxWidth: false,
      },
    };

    const headerSlots: HeaderSectionProps['slots'] = {
      leftArea: (
        <>
          <MenuButton
            onClick={onOpen}
            sx={{ mr: 1, ml: -1, [theme.breakpoints.up(layoutQuery)]: { display: 'none' } }}
          />
          <NavMobile data={navData} open={open} onClose={onClose} />
        </>
      ),
      rightArea: (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0, sm: 0.75 } }}>
          <Searchbar />
          <NotificationsPopover data={_notifications} />
          <ThemeToggleButton />
          <IconButton
            aria-label="Sign out"
            onClick={() => {
              logout();
              window.location.assign(routes.adminLogin);
            }}
          >
            <Iconify icon="solar:logout-3-bold" />
          </IconButton>
        </Box>
      ),
    };

    return (
      <HeaderSection
        disableElevation
        layoutQuery={layoutQuery}
        {...slotProps?.header}
        slots={{ ...headerSlots, ...slotProps?.header?.slots }}
        slotProps={merge(headerSlotProps, slotProps?.header?.slotProps ?? {})}
        sx={slotProps?.header?.sx}
      />
    );
  };

  const renderFooter = () => null;

  const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

  return (
    <LayoutSection
      headerSection={renderHeader()}
      sidebarSection={
        <NavDesktop
          data={navData}
          layoutQuery={layoutQuery}
          collapsed={navCollapsed}
          onToggleCollapse={() => setNavCollapsed((current) => !current)}
        />
      }
      footerSection={renderFooter()}
      cssVars={{
        ...dashboardLayoutVars(theme),
        '--layout-nav-vertical-width': navCollapsed ? '96px' : '280px',
        ...cssVars,
      }}
      sx={[
        {
          [`& .${layoutClasses.sidebarContainer}`]: {
            [theme.breakpoints.up(layoutQuery)]: {
              pl: 'var(--layout-nav-vertical-width)',
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
            },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {renderMain()}
    </LayoutSection>
  );
}
