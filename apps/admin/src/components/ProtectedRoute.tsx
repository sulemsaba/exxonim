import { useEffect, type PropsWithChildren } from "react";
import { useAuth } from "../contexts/AuthContext";
import { routes } from "../routes";
import { LoadingSpinner } from "./LoadingSpinner";

interface ProtectedRouteProps extends PropsWithChildren {
  pathname: string;
}

export function ProtectedRoute({
  children,
  pathname,
}: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      const next = encodeURIComponent(pathname);
      window.location.replace(`${routes.adminLogin}?next=${next}`);
    }
  }, [isAuthenticated, pathname]);

  if (!isAuthenticated) {
    return <LoadingSpinner label="Redirecting to admin login..." />;
  }

  return <>{children}</>;
}
