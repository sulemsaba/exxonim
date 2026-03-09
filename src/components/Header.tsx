import { useEffect, useRef, useState } from "react";
import type { FocusEvent } from "react";
import type { BrandAssets, Theme } from "../types";

interface HeaderProps {
  brand: BrandAssets;
  theme: Theme;
  isAtTop: boolean;
  isNavOpen: boolean;
  onToggleTheme: () => void;
  onToggleNav: () => void;
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

interface HeaderMenuItem {
  label: string;
  href: string;
  align?: "left" | "center" | "right";
  sections?: HeaderMenuSection[];
}

const headerMenuItems: HeaderMenuItem[] = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  {
    label: "Services",
    href: "#services",
    align: "left",
    sections: [
      {
        title: "Registration & Setup",
        links: [
          { label: "Company Registration", href: "#services" },
          { label: "Business Name Registration", href: "#services" },
          { label: "NGO / Organization Registration", href: "#services" },
          { label: "Trademark Registration", href: "#services" },
        ],
      },
      {
        title: "Tax, Licensing & BOT",
        links: [
          { label: "TIN Application", href: "#results" },
          { label: "Annual Statutory Returns", href: "#results" },
          { label: "Business License Applications", href: "#services" },
          { label: "BOT / Central Bank Licensing", href: "#services" },
        ],
      },
      {
        title: "Institutional & Support",
        links: [
          { label: "CRB / ERB Registration", href: "#industries" },
          { label: "OSHA Registration", href: "#industries" },
          { label: "NSSF / WCF Registration", href: "#industries" },
          { label: "Business Plan Preparation", href: "#services" },
        ],
      },
    ],
  },
  { label: "Results", href: "#results" },
  {
    label: "Resources",
    href: "#resources",
    align: "center",
    sections: [
      {
        title: "Insights",
        links: [
          { label: "Blog", href: "#resources" },
          { label: "Case Examples", href: "#results" },
          { label: "FAQs", href: "#faqs" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "Sectors", href: "#industries" },
          { label: "Career", href: "#career" },
          { label: "Contact", href: "#contact" },
        ],
      },
    ],
  },
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
  isAtTop,
  isNavOpen,
  onToggleTheme,
  onToggleNav,
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
    if (!isNavOpen) {
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

  return (
    <header className={`site-header${isAtTop ? " site-header--hero" : " site-header--scrolled"}`}>
      <div className="container nav-wrap">
        <a className="brand brand--marketing" href="#top" aria-label={`${brand.name} home`}>
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

        <nav className={`site-nav${isNavOpen ? " is-open" : ""}`} id="site-nav" aria-label="Primary">
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
                  onBlurCapture={hasMenu ? (event) => handleMenuBlur(event, item.label) : undefined}
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
                      </div>
                    </>
                  ) : (
                    <a className="site-nav__link" href={item.href} onClick={handleNavLinkClick}>
                      {item.label}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="site-nav__mobile-actions">
            <a
              className="header-auth__button header-auth__button--primary header-auth__button--call"
              href="tel:+255794689099"
              onClick={handleNavLinkClick}
            >
              <span className="header-auth__eyebrow">Call Now</span>
              <strong className="header-auth__number">+255 794 689 099</strong>
            </a>
            <a
              className="header-auth__button header-auth__button--secondary"
              href="#contact"
              onClick={handleNavLinkClick}
            >
              Get Consultation
            </a>
          </div>
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
              className="header-auth__button header-auth__button--primary header-auth__button--call"
              href="tel:+255794689099"
              onClick={handleNavLinkClick}
            >
              <span className="header-auth__eyebrow">Call Now</span>
              <strong className="header-auth__number">+255 794 689 099</strong>
            </a>
            <a
              className="header-auth__button header-auth__button--secondary"
              href="#contact"
              onClick={handleNavLinkClick}
            >
              Get Consultation
            </a>
          </div>

          <button
            className={`menu-toggle${isNavOpen ? " is-open" : ""}`}
            type="button"
            aria-expanded={isNavOpen}
            aria-controls="site-nav"
            aria-label={isNavOpen ? "Close menu" : "Open menu"}
            onClick={onToggleNav}
          >
            <span className="menu-toggle__bars" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
