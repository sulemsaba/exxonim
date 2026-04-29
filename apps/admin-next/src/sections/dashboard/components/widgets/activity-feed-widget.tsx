import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  time: string;
  detail?: string;
}

interface ActivityFeedWidgetProps {
  recentActivity: ActivityItem[];
  visible: boolean;
}

function formatDateTime(value: string) {
  const date = new Date(value);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'order1': // Blog post
      return 'solar:document-text-bold';
    case 'order2': // Page
      return 'solar:document-bold';
    case 'order3': // Consultation
      return 'solar:chat-round-call-bold';
    case 'order4': // Job
      return 'solar:case-bold';
    case 'order5': // Settings
      return 'solar:settings-bold';
    default:
      return 'solar:clock-circle-bold';
  }
}

function getActivityColor(type: string) {
  switch (type) {
    case 'order1':
      return 'primary.main';
    case 'order2':
      return 'info.main';
    case 'order3':
      return 'secondary.main';
    case 'order4':
      return 'warning.main';
    case 'order5':
      return 'success.main';
    default:
      return 'text.secondary';
  }
}

export function ActivityFeedWidget({ recentActivity, visible }: ActivityFeedWidgetProps) {
  // If widget is not visible, return null
  if (!visible) {
    return null;
  }

  // If no activity
  if (recentActivity.length === 0) {
    return (
      <Card>
        <CardHeader
          title="Recent Activity"
          subheader="No recent activity"
        />
        <Divider />
        <CardContent>
          <Alert severity="info">
            No recent activity to display. Activity will appear here as users make changes.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Recent Activity"
        subheader="Latest changes across Exxonim"
      />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          {recentActivity.slice(0, 5).map((activity) => (
            <Stack 
              key={activity.id} 
              direction="row" 
              spacing={2} 
              sx={{ 
                alignItems: 'flex-start',
                '&:not(:last-child)': {
                  pb: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  display: 'flex',
                  flexShrink: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  bgcolor: `${getActivityColor(activity.type)}20`,
                  color: getActivityColor(activity.type),
                }}
              >
                <Iconify icon={getActivityIcon(activity.type)} width={18} />
              </Box>
              
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.25 }}>
                  {activity.title}
                </Typography>
                
                {activity.detail && (
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    {activity.detail}
                  </Typography>
                )}
                
                <Typography variant="caption" sx={{ color: 'text.disabled', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Iconify icon="solar:clock-circle-outline" width={14} />
                  {formatDateTime(activity.time)}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>

        {recentActivity.length > 5 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              +{recentActivity.length - 5} more activities
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}