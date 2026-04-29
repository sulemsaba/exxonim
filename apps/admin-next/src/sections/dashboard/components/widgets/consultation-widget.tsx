import type { ApiConsultation } from '@exxonim/admin-core/types/api';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';

import { RouterLink } from 'src/routes/components';

import { adminRoutes } from '@exxonim/admin-core/lib/adminRoutes';

// ----------------------------------------------------------------------

interface ConsultationWidgetProps {
  consultations: ApiConsultation[];
  worklists: any[];
  visible: boolean;
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function statusColor(status?: string | null) {
  switch (status) {
    case 'pending':
      return 'warning' as const;
    case 'contacted':
      return 'info' as const;
    case 'completed':
      return 'success' as const;
    default:
      return 'default' as const;
  }
}

export function ConsultationWidget({ consultations, worklists, visible }: ConsultationWidgetProps) {
  // Filter to show only active consultations
  const activeConsultations = useMemo(() => 
    consultations.filter(c => c.status === 'pending' || c.status === 'contacted'),
    [consultations]
  );

  // If widget is not visible, return null
  if (!visible) {
    return null;
  }

  // If no consultations but widget is visible (user has permission)
  if (activeConsultations.length === 0) {
    return (
      <Card>
        <CardHeader
          title="Service Requests"
          subheader="No active service requests"
        />
        <Divider />
        <CardContent>
          <Alert severity="info">
            All service requests are up to date. Check back later for new requests.
          </Alert>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button
              component={RouterLink}
              href={adminRoutes.consultations}
              variant="outlined"
              size="small"
            >
              View All Requests
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Service Requests"
        subheader={`${activeConsultations.length} active requests needing attention`}
        action={
          <Button
            component={RouterLink}
            href={adminRoutes.consultations}
            size="small"
            variant="outlined"
          >
            View All
          </Button>
        }
      />
      <Divider />
      <Box sx={{ p: 1.5 }}>
        <Stack spacing={1}>
          {activeConsultations.slice(0, 5).map((consultation) => (
            <ListItem
              key={consultation.id}
              secondaryAction={
                <Button 
                  component={RouterLink}
                  href={adminRoutes.consultationDetail(consultation.id)}
                  size="small" 
                  color="inherit"
                >
                  Open
                </Button>
              }
              sx={{
                px: 1.5,
                py: 1.25,
                borderRadius: 2,
                alignItems: 'flex-start',
                '&:hover': {
                  bgcolor: 'background.neutral',
                },
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle2">
                      {consultation.full_name || consultation.company || 'Anonymous'}
                    </Typography>
                    <Chip
                      size="small"
                      label={consultation.status}
                      color={statusColor(consultation.status)}
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {consultation.tracking_id} • {consultation.company || 'Independent'} • 
                    {consultation.assigned_admin_label ? ` Assigned to ${consultation.assigned_admin_label}` : ' Unassigned'} • 
                    {` Updated ${formatDateTime(consultation.updated_at)}`}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </Stack>
        
        {activeConsultations.length > 5 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              +{activeConsultations.length - 5} more requests
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Quick worklists section */}
      {worklists && worklists.length > 0 && (
        <>
          <Divider />
          <CardContent>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              Quick Worklists
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              {worklists.slice(0, 3).map((worklist) => (
                <Button
                  key={worklist.key}
                  component={worklist.href ? RouterLink : 'button'}
                  href={worklist.href || undefined}
                  variant={worklist.count ? 'contained' : 'outlined'}
                  color={
                    worklist.tone === 'error'
                      ? 'error'
                      : worklist.tone === 'warning'
                        ? 'warning'
                        : worklist.tone === 'info'
                          ? 'info'
                          : 'inherit'
                  }
                  size="small"
                >
                  {worklist.label} ({worklist.count})
                </Button>
              ))}
            </Stack>
          </CardContent>
        </>
      )}
    </Card>
  );
}