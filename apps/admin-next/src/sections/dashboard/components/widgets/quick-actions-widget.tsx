import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface QuickAction {
  id: string;
  label: string;
  href: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

interface QuickActionsWidgetProps {
  quickActions: QuickAction[];
  visible: boolean;
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'error' as const;
    case 'medium':
      return 'warning' as const;
    case 'low':
      return 'primary' as const;
    default:
      return 'inherit' as const;
  }
}

export function QuickActionsWidget({ quickActions, visible }: QuickActionsWidgetProps) {
  // If widget is not visible, return null
  if (!visible) {
    return null;
  }

  // If no quick actions
  if (quickActions.length === 0) {
    return (
      <Card>
        <CardHeader
          title="Quick Actions"
          subheader="No actions needed"
        />
        <Divider />
        <CardContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
            All tasks are up to date. Check back later for new actions.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Sort by priority (high first)
  const sortedActions = [...quickActions].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <Card>
      <CardHeader
        title="Quick Actions"
        subheader="Tasks that need your attention"
      />
      <Divider />
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {sortedActions.map((action) => (
            <Button
              key={action.id}
              component={RouterLink}
              href={action.href}
              variant="outlined"
              color={getPriorityColor(action.priority)}
              startIcon={<Iconify icon={action.icon} width={18} />}
              sx={{
                justifyContent: 'flex-start',
                py: 1.5,
                textAlign: 'left',
                '& .MuiButton-startIcon': {
                  mr: 1.5,
                },
              }}
            >
              <Box sx={{ flexGrow: 1, textAlign: 'left' }}>
                {action.label}
              </Box>
            </Button>
          ))}
        </Box>

        <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
            Priority Legend
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main' }} />
              <Typography variant="caption">High</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'warning.main' }} />
              <Typography variant="caption">Medium</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
              <Typography variant="caption">Low</Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}