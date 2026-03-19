import { useQuery } from "@tanstack/react-query";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import {
  adminNavGroups,
  adminNavItems,
  adminRoutes,
  isAdminSectionRestrictedForEditor,
  type AdminBreadcrumb,
  type AdminSection,
} from "../../lib/adminRoutes";
import { getAdminPosts } from "../../services/adminBlogService";
import { getAdminConsultations } from "../../services/adminConsultationService";
import { getAdminJobs } from "../../services/adminJobsService";
import { getBrandSetting, getCompanyInfoSetting } from "../../services/adminStructuredSettingsService";
import {
  formatAdminRole,
  getContentStatus,
  getAdminInitials,
  getAdminLabel,
  getReadableForegroundColor,
  normalizeHexColor,
} from "../../utils/admin";
import { useAuth } from "../../contexts/AuthContext";
import { AdminSidebar } from "./AdminSidebar";

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

function SearchIcon() {
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
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ThemeIcon({ theme }: { theme: "light" | "dark" }) {
  if (theme === "dark") {
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
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.5" />
        <path d="M12 19.5V22" />
        <path d="M4.93 4.93l1.77 1.77" />
        <path d="M17.3 17.3l1.77 1.77" />
        <path d="M2 12h2.5" />
        <path d="M19.5 12H22" />
        <path d="M4.93 19.07l1.77-1.77" />
        <path d="M17.3 6.7l1.77-1.77" />
      </svg>
    );
  }

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
      <path d="M21 12.79A9 9 0 1 1 11.21 3c0 .27 0 .54.02.8A7 7 0 0 0 20.2 12.77c.27.02.54.02.8.02Z" />
    </svg>
  );
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
  const drawerRef = useRef<HTMLElement>(null);
  const drawerToggleRef = useRef<HTMLButtonElement>(null);
  const searchBlurTimeoutRef = useRef<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const deferredSearch = useDeferredValue(searchValue);
  const adminRole = admin?.role ?? "admin";
  const roleLabel = formatAdminRole(adminRole);
  const adminLabel = getAdminLabel(admin?.email, admin?.full_name);
  const adminInitials = getAdminInitials(admin?.email, admin?.full_name);

  const brandQuery = useQuery({
    queryKey: ["admin", "site-settings", "brand"],
    queryFn: getBrandSetting,
  });
  const companyQuery = useQuery({
    queryKey: ["admin", "site-settings", "company_info"],
    queryFn: getCompanyInfoSetting,
  });
  const pendingConsultationsCountQuery = useQuery({
    queryKey: ["admin", "consultations", "pending-count"],
    queryFn: () => getAdminConsultations({ page: 1, limit: 1, status: "pending" }),
    select: (response) => response.total,
  });
  const blogDraftCountQuery = useQuery({
    queryKey: ["admin", "blog", "posts"],
    queryFn: getAdminPosts,
    select: (posts) =>
      posts.filter((post) => getContentStatus(post) === "draft").length,
  });
  const openJobsCountQuery = useQuery({
    queryKey: ["admin", "jobs"],
    queryFn: getAdminJobs,
    select: (jobs) =>
      jobs.filter((job) => getContentStatus(job) === "published").length,
  });

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
    setSearchValue("");
    setIsSearchOpen(false);
  }, [activeSection]);

  useEffect(() => {
    return () => {
      if (searchBlurTimeoutRef.current) {
        window.clearTimeout(searchBlurTimeoutRef.current);
      }
    };
  }, []);

  const branding = useMemo(
    () => ({
      name:
        brandQuery.data?.value.name ??
        companyQuery.data?.value.name ??
        "Exxonim",
      shortName:
        brandQuery.data?.value.companyShortName ??
        companyQuery.data?.value.companyShortName ??
        "Exxonim",
      lightLogoSrc: brandQuery.data?.value.lightLogoSrc ?? null,
      darkLogoSrc: brandQuery.data?.value.darkLogoSrc ?? null,
    }),
    [brandQuery.data, companyQuery.data]
  );

  const brandPrimary = normalizeHexColor(
    brandQuery.data?.value.brandColors?.primary,
    "#0f5c63"
  );
  const brandSecondary = normalizeHexColor(
    brandQuery.data?.value.brandColors?.secondary,
    "#73c7bb"
  );
  const layoutStyle = useMemo(
    () =>
      ({
        "--adminx-accent": brandPrimary,
        "--adminx-accent-strong": brandPrimary,
        "--adminx-accent-contrast": getReadableForegroundColor(brandPrimary),
        "--adminx-teal": brandSecondary,
        "--adminx-blue": brandPrimary,
      }) as CSSProperties,
    [brandPrimary, brandSecondary]
  );

  const navGroupLookup = useMemo(
    () =>
      new Map(
        adminNavGroups.flatMap((group) =>
          group.items.map((item) => [item.section, group.label] as const)
        )
      ),
    []
  );

  const searchIndex = useMemo(
    () =>
      adminNavItems
        .filter((item) =>
          adminRole === "editor"
            ? !isAdminSectionRestrictedForEditor(item.section)
            : true
        )
        .map((item) => ({
          ...item,
          groupLabel: navGroupLookup.get(item.section) ?? "Workspace",
        })),
    [adminRole, navGroupLookup]
  );

  const searchQuery = deferredSearch.trim().toLowerCase();
  const searchResults = useMemo(() => {
    if (!searchQuery) {
      return searchIndex.slice(0, 6);
    }

    return searchIndex
      .filter((item) =>
        [item.label, item.description, item.groupLabel]
          .join(" ")
          .toLowerCase()
          .includes(searchQuery)
      )
      .slice(0, 8);
  }, [searchIndex, searchQuery]);
  const sidebarCounts = useMemo(
    () => ({
      pendingConsultations: pendingConsultationsCountQuery.data ?? 0,
      blogDrafts: blogDraftCountQuery.data ?? 0,
      openJobs: openJobsCountQuery.data ?? 0,
    }),
    [
      pendingConsultationsCountQuery.data,
      blogDraftCountQuery.data,
      openJobsCountQuery.data,
    ]
  );

  function handleLogout() {
    logout();

    if (typeof window !== "undefined") {
      window.location.assign("/admin/login/");
    }
  }

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!searchResults.length || typeof window === "undefined") {
      return;
    }

    window.location.assign(searchResults[0].href);
  }

  function handleSearchFocus() {
    if (searchBlurTimeoutRef.current) {
      window.clearTimeout(searchBlurTimeoutRef.current);
    }

    setIsSearchOpen(true);
  }

  function handleSearchBlur() {
    searchBlurTimeoutRef.current = window.setTimeout(() => {
      setIsSearchOpen(false);
    }, 120);
  }

  return (
    <div className="adminx-shell" style={layoutStyle}>
      <div className="adminx-layout">
        <AdminSidebar
          activeSection={activeSection}
          admin={admin}
          branding={branding}
          theme={theme}
          isDrawerOpen={isDrawerOpen}
          containerRef={drawerRef}
          onClose={() => setIsDrawerOpen(false)}
          onLogout={handleLogout}
          counts={sidebarCounts}
        />

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

              <div className="adminx-topbar__title-block">
                <div className="adminx-breadcrumbs" aria-label="Breadcrumb">
                  {breadcrumbs.map((breadcrumb, index) => (
                    <span key={`${breadcrumb.label}-${index}`}>
                      {breadcrumb.href ? (
                        <a href={breadcrumb.href}>{breadcrumb.label}</a>
                      ) : (
                        breadcrumb.label
                      )}
                    </span>
                  ))}
                </div>

                <div className="adminx-page-title">
                  <h1>{title}</h1>
                  <span className="adminx-page-title__role">{roleLabel}</span>
                </div>
              </div>
            </div>

            <div className="adminx-topbar__center">
              <div className={`adminx-search${isSearchOpen ? " is-open" : ""}`}>
                <form className="adminx-search__form" onSubmit={handleSearchSubmit}>
                  <label className="adminx-visually-hidden" htmlFor="adminx-search-input">
                    Search admin workspaces
                  </label>
                  <span className="adminx-search__icon">
                    <SearchIcon />
                  </span>
                  <input
                    id="adminx-search-input"
                    type="search"
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    onFocus={handleSearchFocus}
                    onBlur={handleSearchBlur}
                    placeholder="Search pages, jobs, posts, and settings"
                    autoComplete="off"
                  />
                </form>

                {isSearchOpen ? (
                  <div
                    className="adminx-search__results"
                    aria-label="Search results"
                    onFocusCapture={handleSearchFocus}
                    onBlurCapture={handleSearchBlur}
                  >
                    {searchResults.length ? (
                      searchResults.map((item) => (
                        <a
                          key={item.href}
                          className="adminx-search__result"
                          href={item.href}
                        >
                          <strong>{item.label}</strong>
                          <span>{item.groupLabel}</span>
                        </a>
                      ))
                    ) : (
                      <div className="adminx-search__empty">
                        No workspaces match "{searchValue.trim()}".
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="adminx-topbar__actions">
              <button
                className="adminx-icon-button"
                type="button"
                onClick={onToggleTheme}
                aria-label={
                  theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
                }
                title={theme === "dark" ? "Light mode" : "Dark mode"}
              >
                <ThemeIcon theme={theme} />
              </button>

              <a
                className="adminx-icon-button"
                href={adminRoutes.settingsBrand}
                aria-label="Open brand settings"
                title="Brand settings"
              >
                <SettingsIcon />
              </a>

              <div className="adminx-topbar-profile">
                <div className="adminx-topbar-profile__avatar" aria-hidden="true">
                  {adminInitials}
                </div>
                <div className="adminx-topbar-profile__info">
                  <strong>{adminLabel}</strong>
                  <span>{roleLabel}</span>
                </div>
              </div>
            </div>
          </header>

          <div className="adminx-content">
            <section className="adminx-page-header">
              <div className="adminx-page-header__copy">
                <span className="adminx-page-header__eyebrow">Workspace context</span>
                <p>{description}</p>
              </div>
              {actions ? (
                <div className="adminx-page-header__actions">{actions}</div>
              ) : null}
            </section>

            <section className="adminx-page-body">{children}</section>
          </div>
        </main>
      </div>
    </div>
  );
}
