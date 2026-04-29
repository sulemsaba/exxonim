import type { ReactNode } from 'react';
import type { DashboardConfig, DashboardData } from '../config/dashboard-config';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';

import { MetricWidgets } from './widgets/metric-widgets';
import { ConsultationWidget } from './widgets/consultation-widget';
import { ContentPipelineWidget } from './widgets/content-pipeline-widget';
import { ActivityFeedWidget } from './widgets/activity-feed-widget';
import { QuickActionsWidget } from './widgets/quick-actions-widget';
import { AlertsWidget } from './widgets/alerts-widget';
import { PageShortcutsWidget } from './widgets/page-shortcuts-widget';

// ----------------------------------------------------------------------

export interface UnifiedDashboardProps {
  config: DashboardConfig;
  data: DashboardData;
}

export function UnifiedDashboard({ config, data }: UnifiedDashboardProps) {
  const { widgets, layout } = config;
  
  // Render widget based on type
  const renderWidget = (widgetType: string): ReactNode => {
    switch (widgetType) {
      case 'metrics':
        return <MetricWidgets metrics={data.metrics} />;
      
      case 'consultations':
        return (
          <ConsultationWidget 
            consultations={data.consultations}
            worklists={data.worklists}
            visible={widgets.consultations}
          />
        );
      
      case 'content-pipeline':
        return (
          <ContentPipelineWidget 
            contentPipeline={data.contentPipeline}
            visible={widgets.contentPipeline}
          />
        );
      
      case 'activity-feed':
        return (
          <ActivityFeedWidget 
            recentActivity={data.recentActivity}
            visible={widgets.activityFeed}
          />
        );
      
      case 'quick-actions':
        return (
          <QuickActionsWidget 
            quickActions={data.quickActions}
            visible={widgets.quickActions}
          />
        );
      
      case 'alerts':
        return (
          <AlertsWidget 
            alerts={data.alerts}
            visible={widgets.alerts}
          />
        );
      
      case 'page-shortcuts':
        return (
          <PageShortcutsWidget 
            pageShortcuts={data.pageShortcuts}
            visible={widgets.pageShortcuts}
          />
        );
      
      default:
        return (
          <Alert severity="warning">
            Unknown widget type: {widgetType}
          </Alert>
        );
    }
  };

  // If no widgets are visible, show message
  const visibleWidgets = Object.values(widgets).filter(Boolean).length;
  if (visibleWidgets === 0) {
    return (
      <Alert severity="info">
        No dashboard widgets are available for your current role and permissions.
        Please contact an administrator to configure your dashboard access.
      </Alert>
    );
  }

  return (








    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {layout.map((row, rowIndex) => {
        // Filter visible widgets in this row
        const visibleWidgetsInRow = row.filter(
          widgetType => widgets[widgetType as keyof typeof widgets]
        );















        // Skip empty rows
        if (visibleWidgetsInRow.length === 0) {
          return null;
        }

        return (
          <Grid key={rowIndex} container spacing={3}>
            {row.map((widgetType, colIndex) => {
              // Skip if widget is not visible
              if (!widgets[widgetType as keyof typeof widgets]) {
                return null;
              }

              return (
                <Grid
                  key={`${rowIndex}-${colIndex}`}
                  size={{ xs: 12, ...getGridSize(widgetType) }}
                >
                  <Box sx={{ height: '100%' }}>
                    {renderWidget(widgetType)}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        );
      })}
    </Box>
  );
}

// Helper function to determine grid size based on widget type
function getGridSize(widgetType: string) {
  switch (widgetType) {
    case 'metrics':
      return { sm: 6, md: 6, lg: 3 }; // 4 metrics per row on large screens
    
    case 'consultations':
    case 'content-pipeline':
      return { lg: 7 }; // Wider widgets
    
    case 'activity-feed':
    case 'quick-actions':
    case 'page-shortcuts':
      return { lg: 5 }; // Narrower widgets
    
    case 'alerts':
      return { xs: 12 }; // Full width
    
    default:
      return { xs: 12, md: 6 };
  }
}