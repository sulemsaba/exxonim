import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { routes } from '@exxonim/admin-core/routes';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@exxonim/admin-core/contexts/AuthContext';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

const AdminPage = lazy(() => import('src/pages/admin'));
const SignInPage = lazy(() => import('src/pages/sign-in'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

const fallback = (
  <Box
    sx={{
      minHeight: '40vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress color="inherit" />
  </Box>
);

function RequireAdminAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAuthenticated, isHydrating } = useAuth();

  if (isHydrating) {
    return fallback;
  }

  if (!isAuthenticated) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate replace to={`${routes.adminLogin}?next=${next}`} />;
  }

  return <>{children}</>;
}

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: <Navigate replace to={routes.admin} />,
  },
  {
    path: '/admin/login',
    element: (
      <Suspense fallback={fallback}>
        <SignInPage />
      </Suspense>
    ),
  },
  {
    path: '/admin/*',
    element: (
      <RequireAdminAuth>
        <DashboardLayout>
          <Suspense fallback={fallback}>
            <AdminPage />
          </Suspense>
        </DashboardLayout>
      </RequireAdminAuth>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={fallback}>
        <Page404 />
      </Suspense>
    ),
  },
];
