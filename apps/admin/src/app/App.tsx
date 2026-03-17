import { useEffect } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AdminLoginPage } from "../features/auth";
import { AdminApp } from "../features/dashboard";
import { useTheme } from "../hooks/useTheme";
import { matchAdminRoute } from "./adminRoutes";
import { normalizePathname, routes } from "./routes";
import { ErrorMessage } from "../components/ErrorMessage";

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const pathname =
    typeof window === "undefined"
      ? normalizePathname(routes.admin)
      : normalizePathname(window.location.pathname === "/" ? routes.admin : window.location.pathname);
  const adminMatch = matchAdminRoute(pathname);
  const isAdminLoginRoute = pathname === normalizePathname(routes.adminLogin);

  useEffect(() => {
    document.documentElement.classList.add("js");
  }, []);

  const page = isAdminLoginRoute ? (
    <AdminLoginPage />
  ) : adminMatch ? (
    <ProtectedRoute pathname={pathname}>
      <AdminApp match={adminMatch} theme={theme} onToggleTheme={toggleTheme} />
    </ProtectedRoute>
  ) : (
    <ErrorMessage
      title="Admin route not found."
      detail="Check the admin URL and try again."
    />
  );

  return (
    <div className="site-shell">
      <div className="cinematic-bg" aria-hidden="true">
        <div className="cinematic-bg__orb cinematic-bg__orb--one"></div>
        <div className="cinematic-bg__orb cinematic-bg__orb--two"></div>
        <div className="cinematic-bg__glow"></div>
      </div>
      <main id="top" className="site-main">
        {page}
      </main>
    </div>
  );
}
