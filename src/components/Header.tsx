import { useEffect, useRef, useState } from "react";
import type { FocusEvent, MouseEvent as ReactMouseEvent } from "react";
import type { BrandAssets, Theme } from "../types";

interface HeaderProps {
  brand: BrandAssets;
  theme: Theme;
  isNavOpen: boolean;
  onToggleTheme: () => void;
  onToggleNav: () => void;
  onCloseNav: () => void;
  onNavLinkClick: () => void;
}

interface HeaderMenuLink {
  label: string;
  href: string;
}

interface HeaderMenuSection {
  title?: string;
  links: HeaderMenuLink[];
}

interface HeaderMenuAction extends HeaderMenuLink {
  variant?: "primary" | "secondary";
}

interface HeaderMenuItem {
  label: string;
  href: string;
  align?: "left" | "center" | "right";
  sections?: HeaderMenuSection[];
  actions?: HeaderMenuAction[];
}

const serviceMenuSections: HeaderMenuSection[] = [
  {
    title: "Registration & Setup",
    links: [
      { label: "Company Registration", href: "#company" },
      { label: "Business Name Registration", href: "#business-name" },
      { label: "NGO / Organization Registration", href: "#ngo" },
      { label: "Trademark Registration", href: "#trademark" },
    ],
  },
  {
    title: "Tax, Licensing & BOT",
    links: [
      { label: "TIN Application", href: "#tin" },
      { label: "Annual Statutory Returns", href: "#returns" },
      { label: "Business License Applications", href: "#license" },
      { label: "BOT / Central Bank Licensing", href: "#bot" },
    ],
  },
  {
    title: "Institutional & Support",
    links: [
      { label: "CRB / ERB Registration", href: "#crb" },
      { label: "OSHA Registration", href: "#osha" },
      { label: "NSSF / WCF Registration", href: "#nssf" },
      { label: "Business Plan Preparation", href: "#plan" },
    ],
  },
];

const resourceMenuSections: HeaderMenuSection[] = [
  {
    title: "Insights",
    links: [
      { label: "Blog", href: "#resources" },
      { label: "Case Examples", href: "#case-examples" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Sectors", href: "#industries" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

const headerMenuItems: HeaderMenuItem[] = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  {
    label: "Services",
    href: "#services",
    align: "left",
    sections: serviceMenuSections,
    actions: [
      { label: "See More Services", href: "#services", variant: "primary" },
      {
        label: "Track Your Consultation",
        href: "#track-consultation",
        variant: "secondary",
      },
    ],
  },
  {
    label: "Resources",
    href: "#resources",
    align: "center",
    sections: resourceMenuSections,
    actions: [
      { label: "See More", href: "#resources", variant: "primary" },
      { label: "Ask a Question", href: "#contact", variant: "secondary" },
    ],
  },
  { label: "Career", href: "#career" },
  { label: "Contact", href: "#contact" },
];

const mobilePrimaryLinks: HeaderMenuLink[] = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Career", href: "#career" },
  { label: "Contact", href: "#contact" },
];

function getFlyoutSizeClass(sectionCount: number) {
  if (sectionCount >= 3) {
    return "site-nav-flyout--wide";
  }

  if (sectionCount === 2) {
    return "site-nav-flyout--medium";
  }

  return "site-nav-flyout--compact";
}

export function Header({
  brand,
  theme,
  isNavOpen,
  onToggleTheme,
  onToggleNav,
  onCloseNav,
  onNavLinkClick,
}: HeaderProps) {
  const isDarkTheme = theme === "dark";
  const [openMenuLabel, setOpenMenuLabel] = useState<string | null>(null);
  const closeMenuTimerRef = useRef<number | null>(null);

  const cancelScheduledClose = () => {
    if (closeMenuTimerRef.current !== null) {
      window.clearTimeout(closeMenuTimerRef.current);
      closeMenuTimerRef.current = null;
    }
  };

  const scheduleMenuClose = () => {
    cancelScheduledClose();
    closeMenuTimerRef.current = window.setTimeout(() => {
      setOpenMenuLabel(null);
      closeMenuTimerRef.current = null;
    }, 180);
  };

  useEffect(() => {
    if (isNavOpen) {
      cancelScheduledClose();
      setOpenMenuLabel(null);
    }
  }, [isNavOpen]);

  useEffect(() => () => cancelScheduledClose(), []);

  const handleMenuBlur = (event: FocusEvent<HTMLLIElement>, label: string) => {
    const nextTarget = event.relatedTarget as Node | null;

    if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
      if (openMenuLabel === label) {
        scheduleMenuClose();
      }
    }
  };

  const handleNavLinkClick = () => {
    cancelScheduledClose();
    setOpenMenuLabel(null);
    onNavLinkClick();
  };

  const handleMobileFrameClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCloseNav();
    }
  };

  const mobileMenuItems = headerMenuItems.filter((item) => item.sections?.length);

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <a
          className="brand brand--marketing"
          href="#top"
          aria-label={`${brand.name} home`}
        >
          <img
            className="brand-logo brand-logo--light"
            src={brand.lightLogoSrc}
            alt=""
            width="184"
            height="58"
            loading="eager"
            decoding="async"
          />
          <img
            className="brand-logo brand-logo--dark"
            src={brand.darkLogoSrc}
            alt=""
            width="184"
            height="58"
            decoding="async"
          />
        </a>

        <nav className="site-nav" aria-label="Primary">
          <ul className="site-nav__list">
            {headerMenuItems.map((item) => {
              const hasMenu = Boolean(item.sections?.length);
              const isMenuOpen = openMenuLabel === item.label;
              const flyoutSizeClass = hasMenu
                ? getFlyoutSizeClass(item.sections?.length ?? 0)
                : "";
              const flyoutAlignClass = hasMenu
                ? ` site-nav-flyout--align-${item.align ?? "center"}`
                : "";
              const menuId = `site-nav-${item.label.toLowerCase().replace(/\s+/g, "-")}`;

              return (
                <li
                  key={item.label}
                  className={`site-nav-item${hasMenu ? " site-nav-item--has-menu" : ""}${isMenuOpen ? " is-open" : ""}`}
                  onBlurCapture={
                    hasMenu ? (event) => handleMenuBlur(event, item.label) : undefined
                  }
                  onFocusCapture={
                    hasMenu
                      ? () => {
                          cancelScheduledClose();
                          setOpenMenuLabel(item.label);
                        }
                      : undefined
                  }
                  onMouseEnter={
                    hasMenu
                      ? () => {
                          cancelScheduledClose();
                          setOpenMenuLabel(item.label);
                        }
                      : undefined
                  }
                  onMouseLeave={hasMenu ? () => scheduleMenuClose() : undefined}
                >
                  {hasMenu ? (
                    <>
                      <button
                        className="site-nav-trigger"
                        type="button"
                        aria-expanded={isMenuOpen}
                        aria-controls={menuId}
                        onClick={() => {
                          cancelScheduledClose();
                          setOpenMenuLabel(isMenuOpen ? null : item.label);
                        }}
                      >
                        <span>{item.label}</span>
                        <span className="site-nav-trigger__chevron" aria-hidden="true"></span>
                      </button>

                      <div
                        className={`site-nav-flyout ${flyoutSizeClass}${flyoutAlignClass}${isMenuOpen ? " is-visible" : ""}`}
                        id={menuId}
                      >
                        <div className="site-nav-flyout__inner">
                          {item.sections?.map((section) => (
                            <div
                              key={`${item.label}-${section.title ?? "links"}`}
                              className="site-nav-panel"
                            >
                              {section.title ? (
                                <p className="site-nav-panel__title">{section.title}</p>
                              ) : null}

                              <ul className="site-nav-panel__list">
                                {section.links.map((link) => (
                                  <li key={`${item.label}-${link.label}`}>
                                    <a
                                      className="site-nav-panel__link"
                                      href={link.href}
                                      onClick={handleNavLinkClick}
                                    >
                                      {link.label}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        {item.actions?.length ? (
                          <div className="site-nav-flyout__footer">
                            {item.actions.map((action) => (
                              <a
                                key={`${item.label}-${action.label}`}
                                className={`site-nav-flyout__action site-nav-flyout__action--${action.variant ?? "secondary"}`}
                                href={action.href}
                                onClick={handleNavLinkClick}
                              >
                                {action.label}
                              </a>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <a
                      className="site-nav__link"
                      href={item.href}
                      onClick={handleNavLinkClick}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-tools">
          <button
            className={`theme-toggle${isDarkTheme ? " is-dark" : ""}`}
            type="button"
            aria-pressed={isDarkTheme}
            aria-label={`Switch to ${isDarkTheme ? "light" : "dark"} theme`}
            onClick={onToggleTheme}
          >
            <span className="theme-toggle__labels" aria-hidden="true">
              <span className="theme-toggle__text theme-toggle__text--dark">Dark</span>
              <span className="theme-toggle__text theme-toggle__text--light">Light</span>
            </span>
            <span className="theme-toggle__bubble" aria-hidden="true">
              <svg
                className="theme-toggle__icon theme-toggle__icon--sun"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm4.22 3.22a1 1 0 0 1 1.415 0l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414ZM18 10a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm-3.78 5.364a1 1 0 0 1 0 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0ZM10 18a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm-4.22-3.22a1 1 0 0 1-1.415 0l-.707-.707a1 1 0 0 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414ZM2 10a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm1.78-4.586a1 1 0 0 1 0-1.414l.707-.707A1 1 0 0 1 5.903 4.72l-.707.707a1 1 0 0 1-1.414 0ZM10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                className="theme-toggle__icon theme-toggle__icon--moon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M17.293 13.293A8 8 0 0 1 6.707 2.707a8 8 0 1 0 10.586 10.586Z" />
              </svg>
            </span>
          </button>

          <div className="header-auth">
            <a
              className="header-auth__button header-auth__button--call"
              href="tel:+255794689099"
              onClick={handleNavLinkClick}
            >
              <span className="header-auth__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path
                    className="header-auth__ring"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5Z"
                  />
                </svg>
              </span>
              <span className="header-auth__copy">
                <span className="header-auth__eyebrow">Call Now</span>
                <strong className="header-auth__number">+255 794 689 099</strong>
              </span>
            </a>
            <a
              className="header-auth__button header-auth__button--track"
              href="#track-consultation"
              onClick={handleNavLinkClick}
            >
              Track Your Consultation
            </a>
          </div>

            <button
              className={`menu-toggle${isNavOpen ? " is-open" : ""}`}
              type="button"
              aria-expanded={isNavOpen}
              aria-controls="mobile-nav"
              aria-label={isNavOpen ? "Close menu" : "Open menu"}
              onClick={onToggleNav}
            >
              <svg
                className="menu-toggle__icon menu-toggle__icon--menu"
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
              >
                <path strokeLinecap="round" d="M 7 10 h 18 M 7 16 h 18 M 7 22 h 18" />
              </svg>
              <svg
                className="menu-toggle__icon menu-toggle__icon--close"
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
              >
                <path strokeLinecap="round" d="M 10 10 L 22 22 M 22 10 L 10 22" />
              </svg>
            </button>
          </div>
        </div>

      <div
        className={`mobile-nav${isNavOpen ? " is-open" : ""}`}
        id="mobile-nav"
        aria-hidden={!isNavOpen}
      >
        <button
          className="mobile-nav__overlay"
          type="button"
          aria-label="Close navigation"
          onClick={onCloseNav}
        ></button>
        <div className="mobile-nav__frame" onClick={handleMobileFrameClick}>
          <nav className="mobile-nav__panel" aria-label="Mobile navigation">
            <div className="mobile-nav__grid">
              <div className="mobile-nav__top-links">
                {mobilePrimaryLinks.map((link) => (
                  <a
                    key={link.label}
                    className="mobile-nav__top-link"
                    href={link.href}
                    onClick={handleNavLinkClick}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {mobileMenuItems.map((item) => (
                <section key={item.label} className="mobile-nav__card">
                  <p className="mobile-nav__eyebrow">{item.label}</p>

                  <div className="mobile-nav__groups">
                    {item.sections?.map((section) => (
                      <div
                        key={`${item.label}-${section.title ?? "links"}`}
                        className="mobile-nav__group"
                      >
                        {section.title ? (
                          <p className="mobile-nav__group-title">{section.title}</p>
                        ) : null}

                        <div className="mobile-nav__list">
                          {section.links.map((link) => (
                            <a
                              key={`${item.label}-${link.label}`}
                              className="mobile-nav__list-link"
                              href={link.href}
                              onClick={handleNavLinkClick}
                            >
                              {link.label}
                            </a>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {item.actions?.length ? (
                    <div className="mobile-nav__card-actions">
                      {item.actions.map((action) => (
                        <a
                          key={`${item.label}-${action.label}`}
                          className={`mobile-nav__card-action mobile-nav__card-action--${action.variant ?? "secondary"}`}
                          href={action.href}
                          onClick={handleNavLinkClick}
                        >
                          {action.label}
                        </a>
                      ))}
                    </div>
                  ) : null}
                </section>
              ))}

              <div className="mobile-nav__actions">
                <a
                  className="header-auth__button header-auth__button--call"
                  href="tel:+255794689099"
                  onClick={handleNavLinkClick}
                >
                  <span className="header-auth__icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        className="header-auth__ring"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5Z"
                      />
                    </svg>
                  </span>
                  <span className="header-auth__copy">
                    <span className="header-auth__eyebrow">Call Now</span>
                    <strong className="header-auth__number">+255 794 689 099</strong>
                  </span>
                </a>
                <a
                  className="header-auth__button header-auth__button--track"
                  href="#track-consultation"
                  onClick={handleNavLinkClick}
                >
                  Track Your Consultation
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
