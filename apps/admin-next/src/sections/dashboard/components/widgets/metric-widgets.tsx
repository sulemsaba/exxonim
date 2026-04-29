import type { PaletteColorKey } from 'src/theme/core';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';

import { fShortenNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

interface Metric {
  key: string;
  label: string;
  value: number;
  helper?: string;
  href?: string;
}

interface MetricWidgetsProps {
  metrics: Metric[];
}

// Map metric keys to colors and icons
function getMetricConfig(key: string): { color: PaletteColorKey; icon: string } {
  const configs: Record<string, { color: PaletteColorKey; icon: string }> = {
    // Content metrics
    'published_posts': { color: 'primary', icon: 'solar:document-text-bold' },
    'draft_posts': { color: 'warning', icon: 'solar:pen-bold' },
    'published_pages': { color: 'info', icon: 'solar:documents-bold' },
    'pending_posts': { color: 'warning', icon: 'solar:clock-circle-bold' },
    
    // Consultation metrics
    'pending_consultations': { color: 'secondary', icon: 'solar:chat-round-call-bold' },
    'active_consultations': { color: 'info', icon: 'solar:file-text-bold' },
    'completed_consultations': { color: 'success', icon: 'solar:check-circle-bold' },
    
    // User metrics
    'active_users': { color: 'primary', icon: 'solar:users-group-rounded-bold' },
    'new_users': { color: 'success', icon: 'solar:user-plus-bold' },
    
    // Default fallback
    'default': { color: 'primary', icon: 'solar:chart-square-bold' },
  };

  return configs[key] || configs.default;
}

function MetricCard({ metric }: { metric: Metric }) {
  const theme = useTheme();
  const config = getMetricConfig(metric.key);
  
  return (
    <Card
      sx={{
        p: 2.5,
        height: 1,
        boxShadow: 'none',
        minHeight: 160,
        display: 'flex',
        position: 'relative',
        flexDirection: 'column',
        justifyContent: 'space-between',
        color: `${config.color}.darker`,
        backgroundColor: 'common.white',
        backgroundImage: `linear-gradient(135deg, ${varAlpha(theme.vars.palette[config.color].lighterChannel, 0.48)}, ${varAlpha(theme.vars.palette[config.color].lightChannel, 0.48)})`,
      }}
    >
      <Box sx={{ width: 40, height: 40, mb: 2 }}>
        <Box
          sx={(currentTheme) => ({
            width: 40,
            height: 40,
            display: 'grid',
            placeItems: 'center',
            borderRadius: 2,
            color: currentTheme.vars.palette.common.white,
            bgcolor: currentTheme.vars.palette[config.color].main,
            boxShadow: `0 8px 16px ${varAlpha(currentTheme.vars.palette[config.color].mainChannel, 0.24)}`,
          })}
        >
          <Iconify icon={config.icon} width={22} />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ mb: 0.5, minHeight: 32, typography: 'subtitle2' }}>
            {metric.label}
          </Box>

          <Box sx={{ typography: 'h4' }}>
            {fShortenNumber(metric.value)}
          </Box>

          {metric.helper ? (
            <Box sx={{ mt: 0.25, typography: 'body2', color: 'text.secondary' }}>
              {metric.helper}
            </Box>
          ) : null}
        </Box>
      </Box>

      <SvgColor
        src="/assets/background/shape-square.svg"
        sx={{
          top: 0,
          left: -20,
          width: 200,
          zIndex: -1,
          height: 200,
          opacity: 0.2,
          position: 'absolute',
          color: `${config.color}.main`,
        }}
      />
    </Card>
  );
}

export function MetricWidgets({ metrics }: MetricWidgetsProps) {
  // Take first 4 metrics (or all if less than 4)
  const displayMetrics = metrics.slice(0, 4);
  
  if (displayMetrics.length === 0) {
    return null;
  }

  return (
    <Grid container spacing={2}>
      {displayMetrics.map((metric) => (
        <Grid key={metric.key} size={{ xs: 12, sm: 6, md: 3 }}>
          <MetricCard metric={metric} />
        </Grid>
      ))}
    </Grid>
  );
}