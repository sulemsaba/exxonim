import { useQuery } from '@tanstack/react-query';
import { getAdminErrorMessage } from '@exxonim/admin-core/utils/admin';
import { getAdminReviewQueue } from '@exxonim/admin-core/services/adminServiceRequestService';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import TableContainer from '@mui/material/TableContainer';

function formatDateTime(value?: string | null) {
  if (!value) {
    return '-';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function formatContentType(value: string) {
  return value.replaceAll('_', ' ');
}

export function ReviewQueueRoutePanel() {
  const reviewQueueQuery = useQuery({
    queryKey: ['admin-next', 'review-queue'],
    queryFn: getAdminReviewQueue,
  });

  return (
    <Card>
      <CardHeader
        title="Review Queue"
        subheader="Content waiting for approval across pages, blog posts, and testimonials."
      />
      <Divider />
      <Box sx={{ p: 3 }}>
        {reviewQueueQuery.isLoading ? (
          <Alert severity="info">Loading the review queue...</Alert>
        ) : reviewQueueQuery.isError ? (
          <Alert severity="error">
            {getAdminErrorMessage(reviewQueueQuery.error, 'Unable to load the review queue.')}
          </Alert>
        ) : reviewQueueQuery.data?.length ? (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Content</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Submitted</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reviewQueueQuery.data.map((item) => (
                  <TableRow key={item.id} hover>
                    <TableCell sx={{ minWidth: 320 }}>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2">{item.title}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {formatContentType(item.content_type)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>{item.status.replaceAll('_', ' ')}</TableCell>
                    <TableCell>{formatDateTime(item.submitted_at)}</TableCell>
                    <TableCell align="right">
                      {item.href ? (
                        <Button component="a" href={item.href} size="small" color="inherit">
                          Review
                        </Button>
                      ) : (
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          No route yet
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Alert severity="success">Nothing is waiting for review right now.</Alert>
        )}
      </Box>
    </Card>
  );
}
