import type { BrandAssets, NavLink, Theme } from "../types";

interface HeaderProps {
  brand: BrandAssets;
  navLinks: NavLink[];
  theme: Theme;
  isNavOpen: boolean;
  onToggleTheme: () => void;
  onToggleNav: () => void;
  onNavLinkClick: () => void;
}

export function Header({
  brand,
  navLinks,
  theme,
  isNavOpen,
  onToggleTheme,
  onToggleNav,
  onNavLinkClick,
}: HeaderProps) {
  const isDarkTheme = theme === "dark";

  return (
    <header className="site-header">
      <div className="container nav-wrap">
        <a className="brand" href="#top" aria-label={`${brand.name} home`}>
          <img
            className="brand-logo brand-logo--light"
            src={brand.lightLogoSrc}
            alt=""
            width="288"
            height="90"
            loading="eager"
            decoding="async"
          />
          <img
            className="brand-logo brand-logo--dark"
            src={brand.darkLogoSrc}
            alt=""
            width="288"
            height="90"
            decoding="async"
          />
        </a>

        <nav className={`site-nav${isNavOpen ? " is-open" : ""}`} id="site-nav">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={onNavLinkClick}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="header-tools">
          <button
            className="theme-toggle"
            type="button"
            aria-pressed={isDarkTheme}
            aria-label="Toggle theme"
            onClick={onToggleTheme}
          >
            <span className="theme-toggle__track" aria-hidden="true">
              <span className="theme-toggle__thumb"></span>
            </span>
            <span className="theme-toggle__label">Theme</span>
          </button>

          <div className="nav-actions">
            <a className="button button-primary header-cta" href="#contact">
              Book a consultation
            </a>
          </div>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={isNavOpen}
            aria-controls="site-nav"
            onClick={onToggleNav}
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}
