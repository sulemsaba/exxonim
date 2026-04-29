import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface DashboardAlert {
  id: string;
  severity: 'info' | 'warning' | 'error';
  title: string;
  message: string;
  href?: string;
}

interface AlertsWidgetProps {
  alerts: DashboardAlert[];
  visible: boolean;
}

export function AlertsWidget({ alerts, visible }: AlertsWidgetProps) {
  // If widget is not visible, return null
  if (!visible) {
    return null;
  }

  // If no alerts
  if (alerts.length === 0) {
    return (
      <Card sx={{ p: 2.5, borderRadius: 2.5 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 2,
              bgcolor: 'success.lighter',
              color: 'success.main',
            }}
          >
            <Iconify icon="solar:verified-check-bold" width={22} />
          </Box>
          <Box>
            <Typography variant="subtitle2">No urgent alerts</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Exxonim admin is clear right now.
            </Typography>
          </Box>
        </Stack>
      </Card>
    );
  }

  // Count alerts by severity
  const errorCount = alerts.filter(a => a.severity === 'error').length;
  const warningCount = alerts.filter(a => a.severity === 'warning').length;
  const infoCount = alerts.filter(a => a.severity === 'info').length;

  // Show only high priority alerts (errors and warnings)
  const highPriorityAlerts = alerts.filter(a => a.severity === 'error' || a.severity === 'warning');

  return (
    <Card sx={{ p: 2.5, borderRadius: 2.5 }}>
      <Stack spacing={2}>
        {/* Alert summary */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              System Alerts
            </Typography>
            <Stack direction="row" spacing={1.5}>
              {errorCount > 0 && (
                <Typography variant="caption" sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Iconify icon="solar:danger-circle-bold" width={14} />
                  {errorCount} error{alerts.length > 1 ? 's' : ''}
                </Typography>
              )}
              {warningCount > 0 && (
                <Typography variant="caption" sx={{ color: 'warning.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Iconify icon="solar:warning-circle-bold" width={14} />
                  {warningCount} warning{warningCount > 1 ? 's' : ''}
                </Typography>
              )}
              {infoCount > 0 && (
                <Typography variant="caption" sx={{ color: 'info.main', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Iconify icon="solar:info-circle-bold" width={14} />
                  {infoCount} info
                </Typography>
              )}
            </Stack>
          </Box>
          
          {alerts.length > 3 && (
            <Button size="small" variant="text" color="inherit">
              View All ({alerts.length})
            </Button>
          )}
        </Box>

        {/* High priority alerts */}
        {highPriorityAlerts.length > 0 ? (
          <Grid container spacing={1.5}>
            {highPriorityAlerts.slice(0, 3).map((alert) => (
              <Grid key={alert.id} size={{ xs: 12, md: highPriorityAlerts.length === 1 ? 12 : 6 }}>
                <Alert
                  severity={alert.severity}
                  action={
                    alert.href ? (
                      <Button 
                        component={RouterLink}
                        href={alert.href}
                        color="inherit" 
                        size="small"
                        sx={{ minWidth: 'auto' }}
                      >
                        Open
                      </Button>
                    ) : undefined
                  }
                  sx={{ 
                    height: '100%', 
                    alignItems: 'flex-start',
                    '& .MuiAlert-message': { flexGrow: 1 },
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      {alert.title}
                    </Typography>
                    <Typography variant="body2">
                      {alert.message}
                    </Typography>
                  </Box>
                </Alert>
              </Grid>
            ))}
          </Grid>
        ) : (
          // Only info alerts
          <Alert severity="info">
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              {alerts[0]?.title || 'Information'}
            </Typography>
            <Typography variant="body2">
              {alerts[0]?.message || 'No important alerts at this time.'}
            </Typography>
          </Alert>
        )}

        {/* Alert tips */}
        {errorCount > 0 && (
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 1.5, 
            bgcolor: 'error.lighter',
            border: '1px solid',
            borderColor: 'error.light',
          }}>
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <Iconify icon="solar:danger-triangle-bold" width={18} sx={{ color: 'error.main', mt: 0.25 }} />
              <Box>
                <Typography variant="caption" sx={{ color: 'error.dark', fontWeight: 600 }}>
                  Action Required
                </Typography>
                <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mt: 0.25 }}>
                  Please address error{alerts.length > 1 ? 's' : ''} promptly to ensure system stability.
                </Typography>
              </Box>
            </Stack>
          </Box>
        )}
      </Stack>
    </Card>
  );
}