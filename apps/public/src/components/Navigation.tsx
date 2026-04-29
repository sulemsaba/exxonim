import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
} from "react";
import { normalizePathname, routes } from "../routes";
import type { BrandAssets, CompanyInfo, NavigationItem, Theme } from "../types";
import {
  findNavigationLinksByTitle,
  getNavigationColumns,
  getNavigationRoot,
  getPrimaryLinks,
} from "../utils/navigation";

interface NavigationProps {
  brand: BrandAssets;
  company: CompanyInfo;
  navigationItems: NavigationItem[];
  pathname: string;
  theme: Theme;
  onToggleTheme: () => void;
}

type MenuKey = "services" | "resources";

interface MenuItem {
  label: string;
  href: string;
}

interface MenuColumn {
  title: string;
  items: MenuItem[];
  borderLeft?: boolean;
}

function getFocusableElements(node: HTMLElement) {
  return Array.from(
    node.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute("disabled"));
}


function renderThemeToggle(className: string, theme: Theme, onToggleTheme: () => void) {
  return (
    <button
      className={className}
      type="button"
      data-theme={theme}
      aria-pressed={theme === "dark"}
      onClick={onToggleTheme}
      aria-label={`Toggle theme. Current theme is ${theme}.`}
    >
      <span className="tutorial-toggle__orb" aria-hidden="true">
        <svg className="tutorial-toggle__icon tutorial-toggle__icon--sun" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm4.22 3.22a1 1 0 0 1 1.415 0l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414ZM18 10a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm-3.78 5.364a1 1 0 0 1 0 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0ZM10 18a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm-4.22-3.22a1 1 0 0 1-1.415 0l-.707-.707a1 1 0 0 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414ZM2 10a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm1.78-4.586a1 1 0 0 1 0-1.414l.707-.707A1 1 0 0 1 5.903 4.72l-.707.707a1 1 0 0 1-1.414 0ZM10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
            clipRule="evenodd"
          />
        </svg>
        <svg className="tutorial-toggle__icon tutorial-toggle__icon--moon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 0 1 6.707 2.707a8 8 0 1 0 10.586 10.586Z" />
        </svg>
      </span>
    </button>
  );
}

function renderMenuColumns(columns: MenuColumn[], onNavigate: () => void) {
  return columns.map((column) => (
    <div
      key={column.title}
      className="nav-shell__menu-column"
      data-border={column.borderLeft ? "true" : undefined}
    >
      <h3 className="nav-shell__menu-title">{column.title}</h3>
      <ul className="nav-shell__menu-list">
        {column.items.map((item) => (
          <li key={item.href}>
            <a className="nav-shell__menu-link" href={item.href} onClick={onNavigate}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  ));
}

function getHrefPath(href: string) {
  return normalizePathname(href.split("#")[0]);
}

export function Navigation({
  brand,
  company,
  navigationItems,
  pathname,
  theme,
  onToggleTheme,
}: NavigationProps) {
  const headerRef = useRef<HTMLElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const servicesMenuId = useId();
  const resourcesMenuId = useId();
  const mobileMenuId = useId();

  const currentPath = normalizePathname(pathname);
  const [desktopMenu, setDesktopMenu] = useState<MenuKey | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const servicesRoot = getNavigationRoot(navigationItems, "Services");
  const resourcesRoot = getNavigationRoot(navigationItems, "Resources");
  const desktopLinks = getPrimaryLinks(navigationItems);
  const servicesColumns = getNavigationColumns(servicesRoot) as MenuColumn[];
  const resourcesColumns = getNavigationColumns(resourcesRoot) as MenuColumn[];
  const mobileServices = findNavigationLinksByTitle(
    servicesRoot ? [servicesRoot] : navigationItems,
    [
      "Company Registration",
      "TIN Application",
      "Business License Applications",
    ]
  );
  const mobileResources = findNavigationLinksByTitle(navigationItems, [
    "Blog",
    "FAQ",
  ]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
    };

    syncHeaderHeight();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(syncHeaderHeight);
      observer.observe(header);

      return () => {
        observer.disconnect();
        document.documentElement.style.setProperty("--header-height", "0px");
      };
    }

    window.addEventListener("resize", syncHeaderHeight);

    return () => {
      window.removeEventListener("resize", syncHeaderHeight);
      document.documentElement.style.setProperty("--header-height", "0px");
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const panel = mobilePanelRef.current;
    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

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

      if (
        previousActiveElement &&
        typeof previousActiveElement.focus === "function"
      ) {
        previousActiveElement.focus();
      } else {
        mobileToggleRef.current?.focus();
      }
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleViewportChange = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
      setDesktopMenu(null);
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopMenu(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setDesktopMenu(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => getHrefPath(href) === currentPath;
  const servicesActive = currentPath === normalizePathname(routes.services);
  const resourcesActive = currentPath === normalizePathname(routes.resources);
  const primaryPhone = company.phones[0];
  const callHref = primaryPhone
    ? `tel:${primaryPhone.replace(/\s+/g, "")}`
    : routes.contact;

  const closeAllMenus = () => {
    setDesktopMenu(null);
    setMobileMenuOpen(false);
  };

  const handleDropdownBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }
    setDesktopMenu(null);
  };

  return (
    <>
<header ref={headerRef} className="nav-shell" data-theme={theme}>
        <div className="nav-shell__bar">
          <a className="nav-shell__brand" href={routes.home} onClick={closeAllMenus}>
            <img
              className="nav-shell__logo nav-shell__logo--light"
              src={brand.lightLogoSrc}
              alt={brand.name}
            />
            <img
              className="nav-shell__logo nav-shell__logo--dark"
              src={brand.darkLogoSrc}
              alt=""
              aria-hidden="true"
            />
          </a>

          <div className="nav-shell__desktop">
            <nav className="nav-shell__pill" aria-label="Primary navigation">
              {desktopLinks.slice(0, 2).map((link) => (
                <a
                  key={link.href}
                  className="nav-shell__tab nav-shell__link"
                  href={link.href}
                  data-active={isActive(link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={closeAllMenus}
                >
                  {link.label}
                </a>
              ))}

              <div
                className="nav-shell__dropdown"
                onMouseEnter={() => setDesktopMenu("services")}
                onMouseLeave={() => setDesktopMenu(null)}
                onFocusCapture={() => setDesktopMenu("services")}
                onBlur={handleDropdownBlur}
              >
                <a
                  className="nav-shell__tab nav-shell__trigger"
                  href={routes.services}
                  data-active={servicesActive}
                  data-open={desktopMenu === "services" ? "true" : undefined}
                  aria-expanded={desktopMenu === "services"}
                  aria-controls={servicesMenuId}
                  aria-current={servicesActive ? "page" : undefined}
                  onClick={closeAllMenus}
                >
                  Services
                  <svg className="nav-shell__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>

                <div
                  id={servicesMenuId}
                  className="nav-shell__menu nav-shell__menu--services"
                  data-open={desktopMenu === "services"}
                  aria-hidden={desktopMenu !== "services"}
                >
                  <div className="nav-shell__menu-card">
                    <div className="nav-shell__menu-grid nav-shell__menu-grid--services">
                      {renderMenuColumns(servicesColumns, closeAllMenus)}
                    </div>
                    <div className="nav-shell__menu-footer">
                      <a className="nav-shell__cta-primary" href={routes.services} onClick={closeAllMenus}>
                        See More Services
                      </a>
                      <a className="nav-shell__cta-secondary" href={routes.contact} onClick={closeAllMenus}>
                        Contact Exxonim
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="nav-shell__dropdown"
                onMouseEnter={() => setDesktopMenu("resources")}
                onMouseLeave={() => setDesktopMenu(null)}
                onFocusCapture={() => setDesktopMenu("resources")}
                onBlur={handleDropdownBlur}
              >
                <a
                  className="nav-shell__tab nav-shell__trigger"
                  href={routes.resources}
                  data-active={resourcesActive}
                  data-open={desktopMenu === "resources" ? "true" : undefined}
                  aria-expanded={desktopMenu === "resources"}
                  aria-controls={resourcesMenuId}
                  aria-current={resourcesActive ? "page" : undefined}
                  onClick={closeAllMenus}
                >
                  Resources
                  <svg className="nav-shell__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>

                <div
                  id={resourcesMenuId}
                  className="nav-shell__menu"
                  data-open={desktopMenu === "resources"}
                  aria-hidden={desktopMenu !== "resources"}
                >
                  <div className="nav-shell__menu-card">
                    <div className="nav-shell__menu-grid nav-shell__menu-grid--resources">
                      {renderMenuColumns(resourcesColumns, closeAllMenus)}
                    </div>
                    <div className="nav-shell__menu-footer">
                      <a className="nav-shell__cta-primary" href={routes.resources} onClick={closeAllMenus}>
                        See More
                      </a>
                      <a className="nav-shell__cta-secondary" href={routes.contact} onClick={closeAllMenus}>
                        Ask a Question
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {desktopLinks.slice(2).map((link) => (
                <a
                  key={link.href}
                  className="nav-shell__tab nav-shell__link"
                  href={link.href}
                  data-active={isActive(link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={closeAllMenus}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="nav-shell__actions">
            {renderThemeToggle("tutorial-toggle nav-shell__theme-desktop", theme, onToggleTheme)}
            {renderThemeToggle("tutorial-toggle tutorial-toggle--mobile nav-shell__theme-mobile", theme, onToggleTheme)}

            <a className="nav-shell__call-button" href={callHref}>
              <div className="nav-shell__call-icon">
                <svg className="animate-ring" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div className="nav-shell__call-copy">
                <span className="nav-shell__call-label">
                  {primaryPhone ? "Call Now" : "Contact Exxonim"}
                </span>
                <span className="nav-shell__call-number">
                  {primaryPhone || "Open the contact page"}
                </span>
              </div>
            </a>

            <button
              ref={mobileToggleRef}
              className={`nav-shell__toggle${mobileMenuOpen ? " is-open" : ""}`}
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              onClick={() => {
                setDesktopMenu(null);
                setMobileMenuOpen((open) => !open);
              }}
            >
              <span className="nav-shell__sr-only">Toggle navigation</span>

              <svg
                className="nav-shell__toggle-icon--menu"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M 7 10 h 18 M 7 16 h 18 M 7 22 h 18" />
              </svg>

              <svg
                className="nav-shell__toggle-icon--close"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M 10 10 L 22 22 M 22 10 L 10 22" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        className="nav-shell__mobile"
        data-theme={theme}
        data-open={mobileMenuOpen}
        id={mobileMenuId}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          className="nav-shell__mobile-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="nav-shell__mobile-wrap">
          <div
            ref={mobilePanelRef}
            className="nav-shell__mobile-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            tabIndex={-1}
          >
            <div className="nav-shell__mobile-grid">
              <div className="nav-shell__mobile-quick-links">
                {desktopLinks.map((link) => (
                  <a
                    key={link.href}
                    className="nav-shell__mobile-quick-link"
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="nav-shell__mobile-card">
                <p className="nav-shell__mobile-card-title">Services</p>
                <div className="nav-shell__mobile-card-links">
                  {mobileServices.map((item) => (
                    <a
                      key={item.href}
                      className="nav-shell__mobile-card-link"
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="nav-shell__mobile-card-actions">
                  <a
                    className="nav-shell__mobile-card-primary"
                    href={routes.services}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    See More Services
                  </a>
                  <a
                    className="nav-shell__mobile-card-secondary"
                    href={routes.contact}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact Exxonim
                  </a>
                </div>
              </div>

              <div className="nav-shell__mobile-card">
                <p className="nav-shell__mobile-card-title">Resources</p>
                <div className="nav-shell__mobile-card-links">
                  {mobileResources.map((item) => (
                    <a
                      key={item.href}
                      className="nav-shell__mobile-card-link"
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="nav-shell__mobile-bottom">
                <a
                  className="nav-shell__mobile-bottom-link"
                  href={callHref}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-shell__mobile-bottom-label">
                    {primaryPhone ? "Call Now" : "Contact Exxonim"}
                  </span>
                  <span className="nav-shell__mobile-bottom-number">
                    {primaryPhone || "Open the contact page"}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
