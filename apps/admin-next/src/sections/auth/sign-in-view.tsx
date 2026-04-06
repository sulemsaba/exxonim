import type { FormEvent } from 'react';

import { useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { adminRoutes } from '@exxonim/admin-core/lib/adminRoutes';
import { useAuth } from '@exxonim/admin-core/contexts/AuthContext';
import { getAdminErrorMessage } from '@exxonim/admin-core/utils/admin';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export function SignInView() {
  const location = useLocation();
  const router = useRouter();
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
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={1.5} sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4">Exxonim Admin</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Sign in with an admin account to manage content, service requests, and operations.
        </Typography>
      </Stack>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : null}

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

        <Button fullWidth size="large" type="submit" color="inherit" variant="contained" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign in'}
        </Button>
      </Stack>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Link href={adminRoutes.dashboard} underline="hover" color="inherit">
          Go to admin home
        </Link>
      </Box>
    </Box>
  );
}
