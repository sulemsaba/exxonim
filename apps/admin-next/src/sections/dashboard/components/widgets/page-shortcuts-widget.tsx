import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { RouterLink } from 'src/routes/components';

import { Iconify } from 'src/components/iconify';
import { varAlpha } from 'minimal-shared/utils';

// ----------------------------------------------------------------------

interface PageShortcut {
  title: string;
  description: string;
  href: string;
  icon: string;
}

interface PageShortcutsWidgetProps {
  pageShortcuts: PageShortcut[];
  visible: boolean;
}

export function PageShortcutsWidget({ pageShortcuts, visible }: PageShortcutsWidgetProps) {
  // If widget is not visible, return null
  if (!visible) {
    return null;
  }

  // If no page shortcuts
  if (pageShortcuts.length === 0) {
    return (
      <Card>
        <CardHeader
          title="Page Shortcuts"
          subheader="No page shortcuts available"
        />
        <Divider />
        <CardContent>
          <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
            You don't have permission to access page shortcuts.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Page Shortcuts"
        subheader="Quick access to Exxonim public pages"
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          {pageShortcuts.map((item) => (
            <Grid key={item.href} size={{ xs: 12, sm: 6 }}>
              <Paper
                component={RouterLink}
                href={item.href}
                variant="outlined"
                sx={{
                  p: 2,
                  gap: 1.25,
                  height: '100%',
                  display: 'flex',
                  color: 'inherit',
                  borderRadius: 2.5,
                  textDecoration: 'none',
                  flexDirection: 'column',
                  transition: (theme) =>
                    theme.transitions.create(['transform', 'box-shadow', 'border-color'], {
                      duration: theme.transitions.duration.shorter,
                    }),
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    borderColor: 'primary.main',
                    boxShadow: (theme) => `0 14px 32px ${varAlpha(theme.vars.palette.primary.mainChannel, 0.12)}`,
                  },
                }}
              >
                <Box
                  sx={(theme) => ({
                    width: 42,
                    height: 42,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 2,
                    color: 'primary.main',
                    bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
                  })}
                >
                  <Iconify icon={item.icon} width={24} />
                </Box>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">{item.title}</Typography>
                  <Typography variant="body2" sx={{ mt: 0.75, color: 'text.secondary' }}>
                    {item.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}