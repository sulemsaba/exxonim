import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

// ----------------------------------------------------------------------

type NotFoundViewProps = {
  embedded?: boolean;
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function NotFoundView({
  embedded = false,
  title = 'Admin page not found',
  description = 'This Exxonim admin route is not available in the current workspace. Check the URL or jump back to a live section.',
  primaryHref = '/admin',
  primaryLabel = 'Go to dashboard',
  secondaryHref = '/admin/blog/posts',
  secondaryLabel = 'Open content',
}: NotFoundViewProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const card = (
    <Box
      sx={{
        overflow: 'hidden',
        borderRadius: 4,
        border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
        bgcolor: alpha(theme.palette.background.paper, isDark ? 0.9 : 0.96),
        boxShadow: theme.shadows[12],
        backdropFilter: 'blur(16px)',
      }}
    >
      <Stack direction={{ xs: 'column', md: 'row' }}>
        <Stack
          spacing={3}
          sx={{
            flex: 1,
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 5 },
            alignItems: { xs: 'center', md: 'flex-start' },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Box
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: 999,
              typography: 'overline',
              letterSpacing: 1.2,
              color: 'primary.main',
              bgcolor: alpha(theme.palette.primary.main, isDark ? 0.18 : 0.08),
            }}
          >
            Exxonim admin
          </Box>

          <Box>
            <Typography variant={embedded ? 'h3' : 'h2'} sx={{ mb: 2 }}>
              {title}
            </Typography>

            <Typography sx={{ color: 'text.secondary', maxWidth: 520 }}>{description}</Typography>
          </Box>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button component={RouterLink} href={primaryHref} size="large" variant="contained" color="inherit">
              {primaryLabel}
            </Button>

            <Button component={RouterLink} href={secondaryHref} size="large" variant="outlined" color="inherit">
              {secondaryLabel}
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: { xs: 3, md: 4 },
            py: { xs: 4, md: 5 },
            bgcolor: alpha(theme.palette.primary.main, isDark ? 0.16 : 0.06),
            borderTop: {
              xs: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
              md: 'none',
            },
            borderLeft: {
              xs: 'none',
              md: `1px solid ${alpha(theme.palette.grey[500], 0.12)}`,
            },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 360 }}>
            <Box
              component="img"
              alt="Exxonim admin page not found"
              src="/assets/illustrations/illustration-404.svg"
              sx={{
                width: '100%',
                height: 'auto',
                mb: 3,
              }}
            />

            <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
              {['Dashboard', 'Content', 'Settings'].map((label) => (
                <Box
                  key={label}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 999,
                    typography: 'caption',
                    fontWeight: 700,
                    color: 'text.secondary',
                    bgcolor: alpha(theme.palette.background.paper, isDark ? 0.16 : 0.8),
                    border: `1px solid ${alpha(theme.palette.grey[500], 0.14)}`,
                  }}
                >
                  {label}
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Stack>
    </Box>
  );

  if (embedded) {
    return card;
  }

  return (
    <>
      <Logo isSingle={false} sx={{ position: 'fixed', top: 24, left: 24, display: { xs: 'none', sm: 'inline-flex' } }} />

      <Container
        maxWidth="lg"
        sx={{
          minHeight: '100vh',
          py: 10,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {card}
      </Container>
    </>
  );
}
