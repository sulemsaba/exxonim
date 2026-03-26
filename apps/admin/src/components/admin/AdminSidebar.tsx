import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type Ref,
} from "react";
import "../../styles/admin-sidebar.css";
import type { ApiAdminUser } from "../../types/api";
import {
  adminNavGroups,
  adminRoutes,
  isAdminSectionRestrictedForRole,
  type AdminNavItem,
  type AdminSection,
} from "../../lib/adminRoutes";
import {
  formatAdminRole,
  getAdminInitials,
  getAdminLabel,
} from "../../utils/admin";

export interface AdminSidebarCounts {
  blogDrafts?: number;
  openJobs?: number;
}

export interface AdminSidebarBranding {
  name: string;
  shortName: string;
  lightLogoSrc?: string | null;
  darkLogoSrc?: string | null;
}

interface AdminSidebarProps {
  activeSection: AdminSection;
  admin: ApiAdminUser | null;
  branding: AdminSidebarBranding;
  theme: "light" | "dark";
  isDrawerOpen: boolean;
  containerRef: Ref<HTMLElement>;
  onClose: () => void;
  onLogout: () => void;
  counts?: AdminSidebarCounts;
}

const operationSections: AdminSection[] = ["dashboard"];
const contentSections: AdminSection[] = [
  "blog-posts",
  "blog-analytics",
  "blog-categories",
  "blog-authors",
  "jobs",
];
const pageSections: AdminSection[] = [
  "page-home",
  "page-services",
  "page-about",
  "page-faq",
  "page-contact",
  "page-careers",
];
const configurationSections: AdminSection[] = [
  "brand-settings",
  "contact-settings",
  "navigation",
  "pricing",
  "testimonials",
  "footer-settings",
  "seo-settings",
  "access-roles",
];

function BrandMarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2 2 7l10 5 10-5-10-5Z" />
      <path d="m2 17 10 5 10-5" />
      <path d="m2 12 10 5 10-5" />
    </svg>
  );
}

function NavIcon({ name }: { name: AdminNavItem["icon"] }) {
  const props = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "dashboard":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "posts":
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="13" y2="17" />
        </svg>
      );
    case "analytics":
      return (
        <svg {...props}>
          <path d="M4 19h16" />
          <path d="M7 16V9" />
          <path d="M12 16V5" />
          <path d="M17 16v-4" />
        </svg>
      );
    case "categories":
      return (
        <svg {...props}>
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
      );
    case "authors":
      return (
        <svg {...props}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "roles":
      return (
        <svg {...props}>
          <path d="M12 2L3 7v5c0 5.25 3.83 10.15 9 11.32C17.17 22.15 21 17.25 21 12V7z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "all-pages":
      return (
        <svg {...props}>
          <path d="M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path d="M3 9h18" />
          <path d="M9 21V9" />
        </svg>
      );
    case "page":
    case "about":
    case "contact":
    case "footer":
      return (
        <svg {...props}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
    case "faq":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "services":
      return (
        <svg {...props}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      );
    case "careers":
    case "jobs":
      return (
        <svg {...props}>
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          <line x1="12" y1="12" x2="12" y2="16" />
          <line x1="10" y1="14" x2="14" y2="14" />
        </svg>
      );
    case "brand":
      return (
        <svg {...props}>
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case "map":
      return (
        <svg {...props}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      );
    case "navigation":
      return (
        <svg {...props}>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="15" y2="12" />
          <line x1="3" y1="18" x2="10" y2="18" />
        </svg>
      );
    case "pricing":
      return (
        <svg {...props}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      );
    case "testimonials":
      return (
        <svg {...props}>
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </svg>
      );
    case "seo":
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="14" x2="14" y2="14" />
          <line x1="11" y1="11" x2="11" y2="17" />
          <line x1="8" y1="11" x2="8" y2="14" />
        </svg>
      );
    default:
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.25" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.33 1V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-.33-1A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1-.33H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1-.33A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06A2 2 0 1 1 7.04 3.3l.06.06A1.65 1.65 0 0 0 8 4.6h.01a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .33-1V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 .33 1A1.65 1.65 0 0 0 15 4.6h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 8v.01a1.65 1.65 0 0 0 .6 1 1.65 1.65 0 0 0 1 .33H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1 .33 1.65 1.65 0 0 0-.51 1.33Z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function getBadge(
  section: AdminSection,
  counts: AdminSidebarCounts,
  adminRole: string
): { value: string; variant: "amber" | "teal" | "blue" | "red" } | null {

  if (section === "blog-posts" && counts.blogDrafts) {
    return {
      value: counts.blogDrafts > 99 ? "99+" : String(counts.blogDrafts),
      variant: "teal",
    };
  }

  if (section === "jobs" && counts.openJobs) {
    return {
      value: counts.openJobs > 99 ? "99+" : String(counts.openJobs),
      variant: "blue",
    };
  }

  if (section === "access-roles" && adminRole === "admin") {
    return { value: "Admin", variant: "red" };
  }

  return null;
}

export function AdminSidebar({
  activeSection,
  admin,
  branding,
  theme,
  isDrawerOpen,
  containerRef,
  onClose,
  onLogout,
  counts = {},
}: AdminSidebarProps) {
  const adminRole = admin?.role ?? "admin";
  const adminLabel = getAdminLabel(admin?.email, admin?.full_name);
  const adminInitials = getAdminInitials(admin?.email, admin?.full_name);
  const [isMobile, setIsMobile] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("adminx-sidebar-collapsed") === "true";
    } catch {
      return false;
    }
  });
  const [isPagesOpen, setIsPagesOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem("adminx-pages-open") !== "false";
    } catch {
      return true;
    }
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const isCompact = isCollapsed && !isMobile;
  const brandName = branding.shortName || branding.name || "Exxonim";
  const brandToggleLabel = isMobile
    ? "Close navigation"
    : isCompact
      ? "Expand navigation"
      : "Collapse navigation";

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 960px)");
    const syncViewport = () => setIsMobile(mediaQuery.matches);

    syncViewport();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncViewport);

      return () => {
        mediaQuery.removeEventListener("change", syncViewport);
      };
    }

    mediaQuery.addListener(syncViewport);

    return () => {
      mediaQuery.removeListener(syncViewport);
    };
  }, []);

  useEffect(() => {
    if (!isProfileOpen) {
      return undefined;
    }

    const handlePointerDown = (event: globalThis.MouseEvent) => {
      if (!footerRef.current?.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileOpen]);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed((previousValue) => {
      const nextValue = !previousValue;

      try {
        localStorage.setItem("adminx-sidebar-collapsed", String(nextValue));
      } catch {
        return nextValue;
      }

      return nextValue;
    });
  }, []);

  const openPages = useCallback(() => {
    setIsPagesOpen(true);

    try {
      localStorage.setItem("adminx-pages-open", "true");
    } catch {
      return;
    }
  }, []);

  const togglePages = useCallback(() => {
    setIsPagesOpen((previousValue) => {
      const nextValue = !previousValue;

      try {
        localStorage.setItem("adminx-pages-open", String(nextValue));
      } catch {
        return nextValue;
      }

      return nextValue;
    });
  }, []);

  const visibleItems = useMemo(
    () =>
      adminNavGroups
        .flatMap((group) => group.items)
        .filter((item) => !isAdminSectionRestrictedForRole(adminRole, item.section)),
    [adminRole]
  );

  const itemsBySection = useMemo(
    () =>
      new Map<AdminSection, AdminNavItem>(
        visibleItems.map((item) => [item.section, item])
      ),
    [visibleItems]
  );

  const operationItems = operationSections
    .map((section) => itemsBySection.get(section))
    .filter((item): item is AdminNavItem => Boolean(item));
  const contentItems = contentSections
    .map((section) => itemsBySection.get(section))
    .filter((item): item is AdminNavItem => Boolean(item));
  const pageItems = pageSections
    .map((section) => itemsBySection.get(section))
    .filter((item): item is AdminNavItem => Boolean(item));
  const configurationItems = configurationSections
    .map((section) => itemsBySection.get(section))
    .filter((item): item is AdminNavItem => Boolean(item));
  const allPagesItem = itemsBySection.get("pages") ?? null;

  const isPageGroupActive =
    activeSection === "pages" ||
    pageItems.some((item) => item.section === activeSection);
  const sidebarClassName = [
    "adminx-sb",
    isDrawerOpen ? "is-open" : "",
    isCompact ? "is-collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (isPageGroupActive) {
      openPages();
    }
  }, [isPageGroupActive, openPages]);

  const handleNavClick = useCallback(() => {
    setIsProfileOpen(false);

    if (isDrawerOpen) {
      onClose();
    }
  }, [isDrawerOpen, onClose]);

  const handleSidebarToggle = useCallback(() => {
    setIsProfileOpen(false);

    if (isMobile) {
      onClose();
      return;
    }

    toggleCollapse();
  }, [isMobile, onClose, toggleCollapse]);

  const handlePagesParentClick = useCallback(
    (event: ReactMouseEvent<HTMLAnchorElement>) => {
      setIsProfileOpen(false);

      if (activeSection === "pages") {
        event.preventDefault();
        togglePages();
        return;
      }

      openPages();

      if (isDrawerOpen) {
        onClose();
      }
    },
    [activeSection, isDrawerOpen, onClose, openPages, togglePages]
  );

  const secondaryActionHref =
    adminRole === "admin" ? adminRoutes.settingsBrand : adminRoutes.blogPosts;
  const secondaryActionLabel =
    adminRole === "admin" ? "Workspace settings" : "Open content";

  const renderNavItem = (item: AdminNavItem) => {
    const isActive = item.section === activeSection;
    const badge = getBadge(item.section, counts, adminRole);
    const tooltip = isCompact ? item.label : undefined;

    return (
      <a
        key={item.href}
        href={item.href}
        className={`adminx-nav-item${isActive ? " is-active" : ""}`}
        aria-current={isActive ? "page" : undefined}
        aria-label={isCompact ? item.label : undefined}
        data-tip={tooltip}
        title={tooltip}
        onClick={handleNavClick}
      >
        <span className="adminx-nav-ico">
          <NavIcon name={item.icon} />
        </span>
        <span className="adminx-nav-lbl">{item.label}</span>
        {badge ? (
          <span
            className={`adminx-nb adminx-nb--${badge.variant}`}
            aria-label={`${badge.value} ${item.label.toLowerCase()}`}
          >
            {badge.value}
          </span>
        ) : null}
      </a>
    );
  };

  const renderGroup = (
    label: string,
    items: AdminNavItem[],
    isFirst = false
  ) => {
    if (!items.length) {
      return null;
    }

    return (
      <>
        <div className="adminx-grp-lbl" aria-hidden="true">
          {label}
        </div>
        <div
          className={`adminx-grp-div${isFirst ? " is-first" : ""}`}
          aria-hidden="true"
        />
        {items.map(renderNavItem)}
      </>
    );
  };

  return (
    <>
      <div
        className={`adminx-overlay${isDrawerOpen ? " is-visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        ref={containerRef}
        className={sidebarClassName}
        aria-label="Admin navigation"
        data-theme={theme}
        tabIndex={-1}
      >
        <div className="adminx-sb-head">
          <button
            className="adminx-sb-toggle"
            type="button"
            onClick={handleSidebarToggle}
            aria-label={brandToggleLabel}
            title={brandToggleLabel}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="16" y2="12" />
              <line x1="4" y1="18" x2="12" y2="18" />
            </svg>
          </button>

          <button
            className="adminx-sb-brand"
            type="button"
            onClick={handleSidebarToggle}
            aria-label={brandToggleLabel}
            title={brandToggleLabel}
          >
            <span className="adminx-brand-mark" aria-hidden="true">
              <BrandMarkIcon />
            </span>
            <span className="adminx-brand-text">
              <span className="adminx-brand-name">{brandName}</span>
              <span className="adminx-brand-ver">admin workspace</span>
            </span>
          </button>
        </div>

        <nav className="adminx-sb-nav" aria-label="Main navigation">
          {renderGroup("Operations", operationItems, true)}
          {renderGroup("Content", contentItems)}

          {allPagesItem || pageItems.length ? (
            <>
              <div className="adminx-grp-lbl" aria-hidden="true">
                Pages
              </div>
              <div
                className={`adminx-grp-div${
                  !operationItems.length && !contentItems.length ? " is-first" : ""
                }`}
                aria-hidden="true"
              />

              {allPagesItem ? (
                <a
                  href={allPagesItem.href}
                  className={`adminx-nav-item${
                    isPageGroupActive ? " is-active" : ""
                  }`}
                  aria-current={activeSection === "pages" ? "page" : undefined}
                  aria-expanded={isPagesOpen}
                  aria-label={isCompact ? allPagesItem.label : undefined}
                  data-tip={isCompact ? allPagesItem.label : undefined}
                  title={isCompact ? allPagesItem.label : undefined}
                  onClick={handlePagesParentClick}
                >
                  <span className="adminx-nav-ico">
                    <NavIcon name={allPagesItem.icon} />
                  </span>
                  <span className="adminx-nav-lbl">{allPagesItem.label}</span>
                  <span
                    className={`adminx-chev${isPagesOpen ? " is-open" : ""}`}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </a>
              ) : null}

              <div
                className={`adminx-sub-wrap${isPagesOpen ? " is-open" : ""}`}
                aria-hidden={!isPagesOpen || isCompact}
              >
                {pageItems.map((item) => {
                  const isActive = item.section === activeSection;
                  const isCareersPage = item.section === "page-careers";

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`adminx-sub-item${isActive ? " is-active" : ""}`}
                      aria-current={isActive ? "page" : undefined}
                      onClick={handleNavClick}
                    >
                      <span>{item.label}</span>
                      {isCareersPage ? (
                        <span className="adminx-sub-hint">+jobs</span>
                      ) : null}
                    </a>
                  );
                })}
              </div>
            </>
          ) : null}

          {renderGroup("Configuration", configurationItems)}
        </nav>

        <div className="adminx-sb-footer" ref={footerRef}>
          <div
            className={`adminx-profile-popover${isProfileOpen ? " is-open" : ""}`}
            role="dialog"
            aria-label="User profile"
          >
            <div className="adminx-pop-head">
              <div className="adminx-pop-av">
                {adminInitials}
                <span className="adminx-pop-av-dot" />
              </div>
              <div className="adminx-pop-info">
                <div className="adminx-pop-name">{adminLabel}</div>
                <div className="adminx-pop-role">
                  <span className="adminx-pop-role-dot" />
                  Online · {formatAdminRole(adminRole)}
                </div>
              </div>
            </div>

            <div className="adminx-pop-actions">
              <a
                className="adminx-pop-item"
                href={adminRoutes.dashboard}
                onClick={handleNavClick}
              >
                <NavIcon name="dashboard" />
                Open Dashboard
              </a>

              <a
                className="adminx-pop-item"
                href={secondaryActionHref}
                onClick={handleNavClick}
              >
                {adminRole === "admin" ? <SettingsIcon /> : <NavIcon name="posts" />}
                {secondaryActionLabel}
              </a>

              <div className="adminx-pop-divider" />

              <button
                className="adminx-pop-item adminx-pop-item--danger"
                type="button"
                onClick={onLogout}
              >
                <LogoutIcon />
                Sign Out
              </button>
            </div>
          </div>

          <button
            className={`adminx-user-card${isProfileOpen ? " is-active" : ""}`}
            type="button"
            onClick={() => setIsProfileOpen((currentValue) => !currentValue)}
            aria-haspopup="dialog"
            aria-expanded={isProfileOpen}
            aria-label={isCompact ? adminLabel : undefined}
            title={isCompact ? adminLabel : undefined}
          >
            <span className="adminx-user-av" aria-hidden="true">
              {adminInitials}
              <span className="adminx-av-dot" />
            </span>
            <span className="adminx-user-info">
              <span className="adminx-user-name">{adminLabel}</span>
              <span className="adminx-user-role">
                {formatAdminRole(adminRole)}
              </span>
            </span>
            <svg
              className="adminx-user-caret"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
