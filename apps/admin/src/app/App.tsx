import { useEffect } from "react";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AdminLoginPage } from "../features/auth";
import { AdminApp } from "../features/dashboard";
import { useTheme } from "../hooks/useTheme";
import { matchAdminRoute } from "./adminRoutes";
import { normalizePathname, routes } from "./routes";
import { ErrorMessage } from "../components/ErrorMessage";

const deprecatedBannerStyles = {
  background:
    "linear-gradient(135deg, rgba(155, 28, 28, 0.96) 0%, rgba(127, 29, 29, 0.98) 100%)",
  borderBottom: "1px solid rgba(254, 202, 202, 0.28)",
  color: "#fff7f7",
  padding: "14px 18px",
  textAlign: "center" as const,
  fontSize: "0.95rem",
  fontWeight: 600,
  letterSpacing: "0.01em",
};

const deprecatedLinkStyles = {
  color: "#ffffff",
  fontWeight: 700,
  textDecoration: "underline",
};

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
      <div role="note" aria-live="polite" style={deprecatedBannerStyles}>
        This admin panel is deprecated. Please use the new admin interface from
        {" "}
        <a href="/admin/" style={deprecatedLinkStyles}>
          apps/admin-next
        </a>
        {" "}
        for ongoing work.
      </div>
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
