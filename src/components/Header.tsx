import type {
  BrandAssets,
  NavLink,
  ServiceNavGroup,
  Theme,
} from "../types";

interface HeaderProps {
  brand: BrandAssets;
  navLinks: NavLink[];
  serviceGroups: ServiceNavGroup[];
  theme: Theme;
  isAtTop: boolean;
  isNavOpen: boolean;
  onToggleTheme: () => void;
  onToggleNav: () => void;
  onNavLinkClick: () => void;
}

export function Header({
  brand,
  navLinks,
  serviceGroups,
  theme,
  isAtTop,
  isNavOpen,
  onToggleTheme,
  onToggleNav,
  onNavLinkClick,
}: HeaderProps) {
  const isDarkTheme = theme === "dark";
  const [homeLink, aboutLink, ...tailLinks] = navLinks;

  return (
    <header
      className={`site-header${isAtTop ? " site-header--hero" : " site-header--scrolled"}`}
    >
      <div className="container nav-wrap">
        <a className="brand" href="#top" aria-label={`${brand.name} home`}>
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

        <nav className={`site-nav${isNavOpen ? " is-open" : ""}`} id="site-nav">
          {homeLink ? (
            <a
              key={`${homeLink.label}-${homeLink.href}`}
              className="site-nav__link"
              href={homeLink.href}
              onClick={onNavLinkClick}
            >
              {homeLink.label}
            </a>
          ) : null}

          {aboutLink ? (
            <a
              key={`${aboutLink.label}-${aboutLink.href}`}
              className="site-nav__link"
              href={aboutLink.href}
              onClick={onNavLinkClick}
            >
              {aboutLink.label}
            </a>
          ) : null}

          <details className="nav-dropdown">
            <summary className="nav-dropdown__summary">
              <span>Services</span>
              <span className="nav-dropdown__chevron" aria-hidden="true"></span>
            </summary>

            <div className="nav-dropdown__menu">
              <div className="nav-dropdown__grid">
                {serviceGroups.map((group) => (
                  <a
                    key={group.title}
                    className="nav-group"
                    href={group.href}
                    onClick={onNavLinkClick}
                  >
                    <strong className="nav-group__title">{group.title}</strong>
                    <p className="nav-group__summary">{group.summary}</p>
                    <ul className="nav-group__list">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </a>
                ))}
              </div>
            </div>
          </details>

          {tailLinks.map((link) => (
            <a
              key={`${link.label}-${link.href}`}
              className="site-nav__link"
              href={link.href}
              onClick={onNavLinkClick}
            >
              {link.label}
            </a>
          ))}

          <div className="site-nav__mobile-actions">
            <a
              className="header-call header-call--mobile"
              href="tel:+255794689099"
              onClick={onNavLinkClick}
            >
              <span className="header-call__eyebrow">Call Now</span>
              <strong>+255 794 689 099</strong>
            </a>
            <a
              className="button button-primary site-nav__mobile-cta"
              href="#contact"
              onClick={onNavLinkClick}
            >
              Get Consultation
            </a>
          </div>
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
            <a className="header-call" href="tel:+255794689099">
              <span className="header-call__eyebrow">Call Now</span>
              <strong>+255 794 689 099</strong>
            </a>
            <a className="button button-primary header-cta" href="#contact">
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
