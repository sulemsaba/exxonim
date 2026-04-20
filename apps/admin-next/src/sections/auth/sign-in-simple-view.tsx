import type { FormEvent } from 'react';

import { useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { adminRoutes } from '@exxonim/admin-core/lib/adminRoutes';
import { useAuth } from '@exxonim/admin-core/contexts/AuthContext';
import { getAdminErrorMessage } from '@exxonim/admin-core/utils/admin';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInSimpleView() {
  const location = useLocation();
  const router = useRouter();
  const theme = useTheme();
  const { isAuthenticated, isHydrating, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    return next || adminRoutes.dashboard;
  }, [location.search]);

  if (!isHydrating && isAuthenticated) {
    router.replace(nextPath);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login({ email, password });
      router.replace(nextPath);
    } catch (requestError) {
      setError(getAdminErrorMessage(requestError, 'Sign in failed. Check your credentials.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' }
    }}>
      {/* Left side - Design/Info Section (hidden on mobile) */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 8,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 70%)`,
          }}
        />

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 500 }}>
          <Typography variant="h2" sx={{ mb: 3, fontWeight: 800, color: 'primary.main' }}>
            Exxonim Admin
          </Typography>
          
          <Typography variant="h5" sx={{ mb: 4, color: 'text.secondary' }}>
            Manage your entire website from one powerful dashboard
          </Typography>

          <Stack spacing={3} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                }}
              >
                <Iconify icon="solar:document-bold" width={24} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Content Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Publish articles, pages, and media without touching code
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: alpha(theme.palette.secondary.main, 0.1),
                  color: 'secondary.main',
                }}
              >
                <Iconify icon="solar:users-group-rounded-bold" width={24} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Client Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track consultations and manage client relationships
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: alpha(theme.palette.info.main, 0.1),
                  color: 'info.main',
                }}
              >
                <Iconify icon="solar:settings-bold" width={24} />
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Site Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Control global settings, navigation, and branding
                </Typography>
              </Box>
            </Box>
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            Secure access for authorized administrators only. All activities are logged for security.
          </Typography>
        </Box>
      </Box>

      {/* Right side - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 4, md: 8 },
          background: theme.palette.background.default,
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          <Box sx={{ mb: 5, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h4" sx={{ mb: 1 }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sign in to access the Exxonim admin dashboard
            </Typography>
          </Box>

          {error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : null}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                name="email"
                type="email"
                label="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                slotProps={{ inputLabel: { shrink: true } }}
              />

              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                slotProps={{
                  inputLabel: { shrink: true },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => setShowPassword((prev) => !prev)}
                          onMouseDown={(event) => event.preventDefault()}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          <Iconify icon={showPassword ? 'solar:eye-closed-bold' : 'solar:eye-bold'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{
                  mt: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`,
                  },
                }}
              >
                {submitting ? 'Signing in...' : 'Sign in'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Need help? Contact your system administrator
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}