import { useEffect, useId, useRef, useState, type FocusEvent } from 'react'
import { Sun, Moon, ChevronDown, Phone, Menu, X } from 'lucide-react'
import { cn } from '../utils/cn'
import { normalizePathname, routes } from '../routes'
import type { BrandAssets, CompanyInfo, NavigationItem, Theme } from '../types'
import {
  findNavigationLinksByTitle,
  getNavigationColumns,
  getNavigationRoot,
  getPrimaryLinks,
} from '../utils/navigation'

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


function ThemeToggle({ className, theme, onToggleTheme }: { className?: string; theme: Theme; onToggleTheme: () => void }) {
  return (
    <button
      className={cn(
        'relative inline-flex items-center justify-center w-12 h-7 rounded-full border border-border-soft bg-surface-soft transition-all',
        'hover:border-accent/50 dark:border-border-dark-soft dark:bg-surface-dark-soft',
        className
      )}
      type="button"
      data-theme={theme}
      aria-pressed={theme === 'dark'}
      onClick={onToggleTheme}
      aria-label={`Toggle theme. Current theme is ${theme}.`}
    >
      <span
        className={cn(
          'absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 flex items-center justify-center',
          theme === 'dark' ? 'translate-x-2.5' : '-translate-x-2.5'
        )}
        aria-hidden="true"
      >
        <Sun className={cn('w-3 h-3 text-amber-500 transition-opacity', theme === 'dark' ? 'opacity-0' : 'opacity-100')} />
        <Moon className={cn('absolute w-3 h-3 text-indigo-400 transition-opacity', theme === 'dark' ? 'opacity-100' : 'opacity-0')} />
      </span>
    </button>
  )
}

function MenuColumns({ columns, onNavigate }: { columns: MenuColumn[]; onNavigate: () => void }) {
  return (
    <>
      {columns.map((column, index) => (
        <div
          key={column.title}
          className={cn(
            'flex-1 min-w-[140px]',
            column.borderLeft && index > 0 && 'pl-6 border-l border-border-soft dark:border-border-dark-soft'
          )}
        >
          <h3 className="text-xs font-extrabold tracking-[0.14em] uppercase text-accent mb-3 dark:text-accent-dark">
            {column.title}
          </h3>
          <ul className="grid gap-1.5">
            {column.items.map((item) => (
              <li key={item.href}>
                <a
                  className="text-sm text-text-muted hover:text-accent transition-colors dark:text-text-dark-muted dark:hover:text-accent-dark"
                  href={item.href}
                  onClick={onNavigate}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
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

  const navLinkBase = 'relative inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-text rounded-full transition-all hover:bg-accent-soft dark:text-text-dark dark:hover:bg-accent-dark-soft'
  const navLinkActive = 'bg-accent-soft text-accent dark:bg-accent-dark-soft dark:text-accent-dark'

  return (
    <>
      <header
        ref={headerRef}
        data-theme={theme}
        className="fixed top-0 inset-x-0 z-50 h-[70px] bg-surface/86 backdrop-blur-xl border-b border-border-soft transition-all dark:bg-surface-dark/78 dark:border-border-dark-soft"
        style={{ '--header-height': '70px' } as React.CSSProperties}
      >
        <div className="container h-full mx-auto px-[clamp(16px,4vw,48px)] flex items-center justify-between gap-4">
          {/* Brand */}
          <a href={routes.home} onClick={closeAllMenus} className="flex items-center">
            <img
              src={brand.lightLogoSrc}
              alt={brand.name}
              className="block h-8 w-auto dark:hidden"
            />
            <img
              src={brand.darkLogoSrc}
              alt=""
              aria-hidden="true"
              className="hidden h-8 w-auto dark:block"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center">
            <nav className="inline-flex items-center gap-1 p-1.5 rounded-full bg-surface-soft border border-border-soft dark:bg-surface-dark-soft dark:border-border-dark-soft" aria-label="Primary navigation">
              {desktopLinks.slice(0, 2).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  onClick={closeAllMenus}
                  className={cn(navLinkBase, isActive(link.href) && navLinkActive)}
                >
                  {link.label}
                </a>
              ))}

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setDesktopMenu('services')}
                onMouseLeave={() => setDesktopMenu(null)}
                onFocusCapture={() => setDesktopMenu('services')}
                onBlur={handleDropdownBlur}
              >
                <a
                  href={routes.services}
                  aria-expanded={desktopMenu === 'services'}
                  aria-controls={servicesMenuId}
                  aria-current={servicesActive ? 'page' : undefined}
                  onClick={closeAllMenus}
                  className={cn(navLinkBase, servicesActive && navLinkActive, 'group')}
                >
                  Services
                  <ChevronDown className={cn('ml-1 w-4 h-4 transition-transform', desktopMenu === 'services' && 'rotate-180')} aria-hidden="true" />
                </a>

                <div
                  id={servicesMenuId}
                  aria-hidden={desktopMenu !== 'services'}
                  className={cn(
                    'absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all',
                    desktopMenu === 'services' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                  )}
                >
                  <div className="p-4 rounded-2xl bg-surface border border-border-soft shadow-popover min-w-[360px] dark:bg-surface-dark dark:border-border-dark-soft dark:shadow-popover-dark">
                    <div className="flex gap-6">
                      <MenuColumns columns={servicesColumns} onNavigate={closeAllMenus} />
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-soft dark:border-border-dark-soft">
                      <a href={routes.services} onClick={closeAllMenus} className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-accent text-white text-sm font-extrabold hover:bg-accent-hover transition-all">
                        See More Services
                      </a>
                      <a href={routes.contact} onClick={closeAllMenus} className="text-sm font-medium text-accent hover:underline dark:text-accent-dark">
                        Contact Exxonim
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resources Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setDesktopMenu('resources')}
                onMouseLeave={() => setDesktopMenu(null)}
                onFocusCapture={() => setDesktopMenu('resources')}
                onBlur={handleDropdownBlur}
              >
                <a
                  href={routes.resources}
                  aria-expanded={desktopMenu === 'resources'}
                  aria-controls={resourcesMenuId}
                  aria-current={resourcesActive ? 'page' : undefined}
                  onClick={closeAllMenus}
                  className={cn(navLinkBase, resourcesActive && navLinkActive, 'group')}
                >
                  Resources
                  <ChevronDown className={cn('ml-1 w-4 h-4 transition-transform', desktopMenu === 'resources' && 'rotate-180')} aria-hidden="true" />
                </a>

                <div
                  id={resourcesMenuId}
                  aria-hidden={desktopMenu !== 'resources'}
                  className={cn(
                    'absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all',
                    desktopMenu === 'resources' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                  )}
                >
                  <div className="p-4 rounded-2xl bg-surface border border-border-soft shadow-popover min-w-[280px] dark:bg-surface-dark dark:border-border-dark-soft dark:shadow-popover-dark">
                    <div className="flex gap-6">
                      <MenuColumns columns={resourcesColumns} onNavigate={closeAllMenus} />
                    </div>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border-soft dark:border-border-dark-soft">
                      <a href={routes.resources} onClick={closeAllMenus} className="inline-flex items-center justify-center h-10 px-5 rounded-full bg-accent text-white text-sm font-extrabold hover:bg-accent-hover transition-all">
                        See More
                      </a>
                      <a href={routes.contact} onClick={closeAllMenus} className="text-sm font-medium text-accent hover:underline dark:text-accent-dark">
                        Ask a Question
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {desktopLinks.slice(2).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? 'page' : undefined}
                  onClick={closeAllMenus}
                  className={cn(navLinkBase, isActive(link.href) && navLinkActive)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle className="hidden xl:inline-flex" theme={theme} onToggleTheme={onToggleTheme} />
            <ThemeToggle className="xl:hidden" theme={theme} onToggleTheme={onToggleTheme} />

            {/* Call Button */}
            <a href={callHref} className="hidden md:inline-flex items-center gap-3 h-12 pl-3 pr-5 rounded-full bg-accent-soft hover:bg-accent-soft-hover transition-all dark:bg-accent-dark-soft dark:hover:bg-accent-dark-soft-hover">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white animate-phone-ring">
                <Phone className="w-4 h-4" aria-hidden="true" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent dark:text-accent-dark">
                  {primaryPhone ? 'Call Now' : 'Contact Exxonim'}
                </span>
                <span className="text-sm font-medium text-text dark:text-text-dark">
                  {primaryPhone || 'Open the contact page'}
                </span>
              </div>
            </a>

            {/* Mobile Menu Toggle */}
            <button
              ref={mobileToggleRef}
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
              aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              onClick={() => {
                setDesktopMenu(null)
                setMobileMenuOpen((open) => !open)
              }}
              className={cn(
                'inline-flex xl:hidden items-center justify-center w-11 h-11 rounded-full border transition-all',
                mobileMenuOpen
                  ? 'bg-accent text-white border-accent'
                  : 'bg-surface text-text border-border-soft hover:border-accent dark:bg-surface-dark dark:text-text-dark dark:border-border-dark-soft'
              )}
            >
              <span className="sr-only">Toggle navigation</span>
              <Menu className={cn('w-6 h-6', mobileMenuOpen && 'hidden')} aria-hidden="true" />
              <X className={cn('w-6 h-6', !mobileMenuOpen && 'hidden')} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        id={mobileMenuId}
        aria-hidden={!mobileMenuOpen}
        className={cn(
          'fixed inset-0 z-40 xl:hidden transition-opacity',
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
          className="absolute inset-0 bg-surface-strong/60 backdrop-blur-sm dark:bg-surface-dark-strong/60"
        />

        {/* Panel */}
        <div className="absolute top-[70px] right-4 left-4 max-w-md ml-auto">
          <div
            ref={mobilePanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            tabIndex={-1}
            className={cn(
              'max-h-[calc(100vh-100px)] overflow-y-auto rounded-2xl border bg-surface p-4 shadow-popover transition-all dark:bg-surface-dark dark:border-border-dark-soft dark:shadow-popover-dark',
              mobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
            )}
          >
            <div className="grid gap-4">
              {/* Quick Links */}
              <div className="flex flex-wrap gap-2">
                {desktopLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'inline-flex items-center h-10 px-4 rounded-full text-sm font-medium transition-colors',
                      isActive(link.href)
                        ? 'bg-accent text-white'
                        : 'bg-surface-soft text-text hover:bg-accent-soft dark:bg-surface-dark-soft dark:text-text-dark dark:hover:bg-accent-dark-soft'
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* Services Card */}
              <div className="p-4 rounded-xl border border-border-soft bg-surface-elevated dark:bg-surface-dark-elevated dark:border-border-dark-soft">
                <p className="text-xs font-extrabold tracking-[0.14em] uppercase text-accent mb-3 dark:text-accent-dark">
                  Services
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {mobileServices.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm text-text-muted hover:text-accent transition-colors dark:text-text-dark-muted dark:hover:text-accent-dark"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-border-soft dark:border-border-dark-soft">
                  <a
                    href={routes.services}
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-accent text-white text-sm font-extrabold hover:bg-accent-hover transition-all"
                  >
                    See More Services
                  </a>
                  <a
                    href={routes.contact}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-accent hover:underline dark:text-accent-dark"
                  >
                    Contact Exxonim
                  </a>
                </div>
              </div>

              {/* Resources Card */}
              <div className="p-4 rounded-xl border border-border-soft bg-surface-elevated dark:bg-surface-dark-elevated dark:border-border-dark-soft">
                <p className="text-xs font-extrabold tracking-[0.14em] uppercase text-accent mb-3 dark:text-accent-dark">
                  Resources
                </p>
                <div className="flex flex-wrap gap-3">
                  {mobileResources.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-sm text-text-muted hover:text-accent transition-colors dark:text-text-dark-muted dark:hover:text-accent-dark"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              {/* Bottom CTA */}
              <a
                href={callHref}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-3 h-14 rounded-full bg-accent text-white hover:bg-accent-hover transition-all"
              >
                <Phone className="w-5 h-5 animate-phone-ring" aria-hidden="true" />
                <span className="font-extrabold">
                  {primaryPhone ? 'Call Now' : 'Contact Exxonim'}
                </span>
                {primaryPhone && <span className="text-white/80">{primaryPhone}</span>}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
