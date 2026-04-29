import type { ReactNode } from 'react';
import type { ApiAdminDashboardSummary } from '@exxonim/admin-core/types/api';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@exxonim/admin-core/contexts/AuthContext';
import { getAdminErrorMessage } from '@exxonim/admin-core/utils/admin';
import { getAdminDashboardSummary } from '@exxonim/admin-core/services/adminDashboardService';
import { listAdminConsultations } from '@exxonim/admin-core/services/adminConsultationService';
import { getAdminDashboardWorklists } from '@exxonim/admin-core/services/adminServiceRequestService';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { DashboardSwitcher } from './components/dashboard-switcher';
import { UnifiedDashboard } from './components/unified-dashboard';
import { getDashboardConfig } from './config/dashboard-config';
import { buildDashboardData } from './utils/dashboard-data';

// ----------------------------------------------------------------------

function LoadingState({ label }: { label: string }) {
  return (
    <DashboardContent maxWidth="xl">
      <Alert severity="info">{label}</Alert>
    </DashboardContent>
  );
}

function ErrorState({ error }: { error: unknown }) {
  return (
    <DashboardContent maxWidth="xl">
      <Alert severity="error">{getAdminErrorMessage(error)}</Alert>
    </DashboardContent>
  );
}

export function DashboardView() {
  const { admin } = useAuth();
  
  // Fetch all dashboard data
  const summaryQuery = useQuery({
    queryKey: ['admin-next', 'dashboard', 'summary'],
    queryFn: getAdminDashboardSummary,
  });

  const consultationsQuery = useQuery({
    queryKey: ['admin-next', 'dashboard', 'consultations'],
    queryFn: () => listAdminConsultations({ page: 1, limit: 100 }),
  });

  const worklistsQuery = useQuery({
    queryKey: ['admin-next', 'dashboard', 'worklists'],
    queryFn: getAdminDashboardWorklists,
  });

  // Get dashboard configuration based on user role and permissions
  const dashboardConfig = useMemo(() => 
    getDashboardConfig(admin?.role, admin?.permissions),
    [admin?.role, admin?.permissions]
  );

  // Build unified dashboard data
  const dashboardData = useMemo(() => {
    if (!summaryQuery.data || !consultationsQuery.data || !worklistsQuery.data) {
      return null;
    }

    return buildDashboardData({
      summary: summaryQuery.data,
      consultations: consultationsQuery.data,
      worklists: worklistsQuery.data,
      role: admin?.role,
      permissions: admin?.permissions,
    });
  }, [summaryQuery.data, consultationsQuery.data, worklistsQuery.data, admin?.role, admin?.permissions]);

  // Loading state
  if (summaryQuery.isLoading || consultationsQuery.isLoading || worklistsQuery.isLoading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  // Error state
  if (summaryQuery.isError || consultationsQuery.isError || worklistsQuery.isError) {
    return <ErrorState error={summaryQuery.error || consultationsQuery.error || worklistsQuery.error} />;
  }

  // No data state
  if (!dashboardData) {
    return <LoadingState label="Dashboard data is not available yet." />;
  }

  return (
    <DashboardContent maxWidth="xl">
      <Stack spacing={3}>
        {/* Dashboard header with switcher */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Dashboard
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {dashboardConfig.description}
            </Typography>
          </Box>
          
          <DashboardSwitcher 
            currentView={dashboardConfig.viewType}
            availableViews={dashboardConfig.availableViews}
          />
        </Box>

        {/* Unified dashboard */}
        <UnifiedDashboard
          config={dashboardConfig}
          data={dashboardData}
        />
      </Stack>
    </DashboardContent>
  );
}