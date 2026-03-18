import { useEffect, useMemo, useRef, useState, type PropsWithChildren, type ReactNode } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  adminNavGroups,
  type AdminBreadcrumb,
  type AdminNavItem,
  type AdminSection,
} from "../../lib/adminRoutes";

interface AdminLayoutProps extends PropsWithChildren {
  activeSection: AdminSection;
  title: string;
  description: string;
  breadcrumbs: AdminBreadcrumb[];
  theme: "light" | "dark";
  onToggleTheme: () => void;
  actions?: ReactNode;
}

function getFocusableElements(node: HTMLElement) {
  return Array.from(
    node.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute("disabled"));
}

function getAdminLabel(email?: string | null, fullName?: string | null) {
  if (fullName?.trim()) {
    return fullName.trim();
  }

  if (email?.trim()) {
    return email.trim();
  }

  return "Admin User";
}

function getAdminInitials(email?: string | null, fullName?: string | null) {
  const source = fullName?.trim() || email?.split("@")[0] || "exxonim";
  const parts = source.split(/[.\s_-]+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return source.slice(0, 2).toUpperCase();
}

function formatRole(role?: string | null) {
  if (!role) {
    return "Administrator";
  }

  return role === "editor" ? "Editor" : "Administrator";
}

function iconFor(name: AdminNavItem["icon"]) {
  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M3 13.5 12 4l9 9" />
          <path d="M5.5 10.5V20h13V10.5" />
        </svg>
      );
    case "consultations":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 5h16v10H8l-4 4V5Z" />
        </svg>
      );
    case "posts":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M6 4h12v16H6z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      );
    case "categories":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h10" />
        </svg>
      );
    case "authors":
    case "roles":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      );
    case "services":
    case "pricing":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 7h16l-2 10H6L4 7Z" />
          <path d="M9 7V4h6v3" />
        </svg>
      );
    case "about":
    case "faq":
    case "contact":
    case "page":
    case "all-pages":
    case "footer":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M6 3h9l3 3v15H6z" />
          <path d="M15 3v4h4" />
        </svg>
      );
    case "careers":
    case "jobs":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M7 7V5h10v2" />
          <path d="M3 8h18v10H3z" />
          <path d="M10 12h4" />
        </svg>
      );
    case "brand":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z" />
        </svg>
      );
    case "map":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      );
    case "navigation":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M4 7h16M4 12h10M4 17h7" />
        </svg>
      );
    case "testimonials":
    case "seo":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="m12 3 2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L4.8 8.2l5-.7L12 3Z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="7" />
        </svg>
      );
  }
}

function isRestrictedForEditor(section: AdminSection) {
  return [
    "brand-settings",
    "contact-settings",
    "navigation",
    "pricing",
    "testimonials",
    "footer-settings",
    "seo-settings",
    "access-roles",
  ].includes(section);
}

export function AdminLayout({
  activeSection,
  title,
  description,
  breadcrumbs,
  theme,
  onToggleTheme,
  actions,
  children,
}: AdminLayoutProps) {
  const { admin, logout } = useAuth();
  const drawerRef = useRef<HTMLDivElement>(null);
  const drawerToggleRef = useRef<HTMLButtonElement>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const adminRole = admin?.role ?? "admin";
  const adminLabel = getAdminLabel(admin?.email, admin?.full_name);
  const adminInitials = getAdminInitials(admin?.email, admin?.full_name);
  const nowLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    []
  );

  const visibleGroups = useMemo(
    () =>
      adminNavGroups
        .map((group) => ({
          ...group,
          items: group.items.filter((item) =>
            adminRole === "editor" ? !isRestrictedForEditor(item.section) : true
          ),
        }))
        .filter((group) => group.items.length > 0),
    [adminRole]
  );

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const panel = drawerRef.current;
    const previousActiveElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    if (!panel) {
      return;
    }

    const focusableElements = getFocusableElements(panel);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (firstElement) {
      firstElement.focus();
    } else {
      panel.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      if (!focusableElements.length) {
        event.preventDefault();
        panel.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (previousActiveElement && typeof previousActiveElement.focus === "function") {
        previousActiveElement.focus();
      } else {
        drawerToggleRef.current?.focus();
      }
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [activeSection]);

  function handleLogout() {
    logout();

    if (typeof window !== "undefined") {
      window.location.assign("/admin/login/");
    }
  }

  return (
    <div className="adminx-layout">
      <div
        className={`adminx-overlay${isDrawerOpen ? " is-visible" : ""}`}
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      ></div>

      <aside className={`adminx-sidebar${isDrawerOpen ? " is-open" : ""}`} aria-label="Admin navigation">
        <div className="adminx-sidebar__brand">
          <div className="adminx-sidebar__mark" aria-hidden="true">
            SX
          </div>
          <div className="adminx-sidebar__brand-copy">
            <strong>SystemOS Admin</strong>
            <span>Operations, content, settings, and hiring in one workspace.</span>
          </div>
        </div>

        <nav className="adminx-sidebar__nav" ref={drawerRef} role="dialog" aria-modal="true" tabIndex={-1}>
          {visibleGroups.map((group) => (
            <div key={group.label} className="adminx-sidebar__group">
              <p className="adminx-sidebar__group-label">{group.label}</p>
              <div className="adminx-sidebar__group-items">
                {group.items.map((item) => {
                  const active = item.section === activeSection;
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`adminx-nav-item${active ? " is-active" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="adminx-nav-item__icon">{iconFor(item.icon)}</span>
                      <span className="adminx-nav-item__copy">
                        <strong>{item.label}</strong>
                        <span>{item.description}</span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="adminx-sidebar__footer">
          <div className="adminx-user-card">
            <div className="adminx-user-card__avatar" aria-hidden="true">
              {adminInitials}
            </div>
            <div className="adminx-user-card__copy">
              <strong>{adminLabel}</strong>
              <span>{formatRole(adminRole)}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="adminx-main">
        <header className="adminx-topbar">
          <div className="adminx-topbar__left">
            <button
              ref={drawerToggleRef}
              className="adminx-icon-button adminx-mobile-toggle"
              type="button"
              onClick={() => setIsDrawerOpen((open) => !open)}
              aria-label={isDrawerOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={isDrawerOpen}
            >
              <span className="adminx-mobile-toggle__line"></span>
              <span className="adminx-mobile-toggle__line"></span>
              <span className="adminx-mobile-toggle__line"></span>
            </button>
            <div className="adminx-breadcrumbs" aria-label="Breadcrumb">
              {breadcrumbs.map((breadcrumb, index) => (
                <span key={`${breadcrumb.label}-${index}`}>
                  {breadcrumb.href ? <a href={breadcrumb.href}>{breadcrumb.label}</a> : breadcrumb.label}
                </span>
              ))}
            </div>
          </div>

          <div className="adminx-topbar__actions">
            <span className="adminx-date-chip">{nowLabel}</span>
            <button className="adminx-icon-button" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
              {theme === "dark" ? "Light" : "Dark"}
            </button>
            <button className="adminx-icon-button" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <div className="adminx-content">
          <section className="adminx-page-header">
            <div className="adminx-page-header__copy">
              <span className="adminx-page-header__eyebrow">{formatRole(adminRole)}</span>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
            {actions ? <div className="adminx-page-header__actions">{actions}</div> : null}
          </section>

          <section className="adminx-page-body">{children}</section>
        </div>
      </main>
    </div>
  );
}
