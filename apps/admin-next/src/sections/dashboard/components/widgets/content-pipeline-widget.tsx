import type { ApiAdminDashboardPipelineItem } from '@exxonim/admin-core/types/api';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';

import { RouterLink } from 'src/routes/components';

import { adminRoutes } from '@exxonim/admin-core/lib/adminRoutes';

// ----------------------------------------------------------------------

interface ContentPipelineWidgetProps {
  contentPipeline: ApiAdminDashboardPipelineItem[];
  visible: boolean;
}

function statusColor(status?: string | null) {
  switch (status) {
    case 'published':
      return 'success' as const;
    case 'draft':
      return 'warning' as const;
    case 'pending_review':
      return 'info' as const;
    case 'rejected':
      return 'error' as const;
    case 'archived':
      return 'default' as const;
    default:
      return 'default' as const;
  }
}

function seoHealthColor(health?: string | null) {
  switch (health) {
    case 'clean':
      return 'success' as const;
    case 'warning':
      return 'warning' as const;
    case 'error':
      return 'error' as const;
    default:
      return 'default' as const;
  }
}

export function ContentPipelineWidget({ contentPipeline, visible }: ContentPipelineWidgetProps) {
  // If widget is not visible, return null
  if (!visible) {
    return null;
  }

  // Filter to show items that need attention (drafts, low completion, poor SEO)
  const attentionItems = contentPipeline.filter(item => 
    item.status === 'draft' || 
    item.completion_percent < 80 || 
    item.seo_health === 'warning' || 
    item.seo_health === 'error'
  );

  // If no items need attention
  if (attentionItems.length === 0) {
    return (
      <Card>
        <CardHeader
          title="Content Pipeline"
          subheader="All content is up to date"
        />
        <Divider />
        <CardContent>
          <Alert severity="success">
            No content items need immediate attention. All posts and pages are either published or sufficiently complete.
          </Alert>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Link
              component={RouterLink}
              href={adminRoutes.blogPosts}
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              View Blog Posts
            </Link>
            <Typography sx={{ color: 'text.secondary' }}>•</Typography>
            <Link
              component={RouterLink}
              href={adminRoutes.pages}
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              View All Pages
            </Link>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        title="Content Pipeline"
        subheader={`${attentionItems.length} items need attention`}
        action={
          <Stack direction="row" spacing={1}>
            <Link
              component={RouterLink}
              href={adminRoutes.blogPosts}
              underline="hover"
              sx={{ fontWeight: 600, fontSize: '0.875rem' }}
            >
              Posts
            </Link>
            <Link
              component={RouterLink}
              href={adminRoutes.pages}
              underline="hover"
              sx={{ fontWeight: 600, fontSize: '0.875rem' }}
            >
              Pages
            </Link>
          </Stack>
        }
      />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          {attentionItems.slice(0, 5).map((item) => (
            <Paper key={item.id} variant="outlined" sx={{ p: 2, borderRadius: 2.5 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="flex-start">
                  <Box sx={{ minWidth: 0 }}>
                    {item.href ? (
                      <Link
                        component={RouterLink}
                        href={item.href}
                        underline="hover"
                        color="inherit"
                        sx={{ fontWeight: 700 }}
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <Typography variant="subtitle2">{item.title}</Typography>
                    )}
                    <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                      {item.kind === 'blog_post' ? 'Blog post' : 'Page'} • /{item.slug}
                    </Typography>
                  </Box>

                  <Chip
                    size="small"
                    label={item.status}
                    color={statusColor(item.status)}
                    variant="outlined"
                  />
                </Stack>

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip 
                    size="small" 
                    label={`SEO ${item.seo_health}`} 
                    color={seoHealthColor(item.seo_health)} 
                  />
                  <Chip 
                    size="small" 
                    label={`${item.completion_percent}% complete`} 
                    color={item.completion_percent < 50 ? 'error' : item.completion_percent < 80 ? 'warning' : 'success'}
                  />
                  {item.kind === 'blog_post' && (
                    <Chip size="small" label="Blog" variant="outlined" />
                  )}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Stack>

        {attentionItems.length > 5 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              +{attentionItems.length - 5} more items need attention
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}