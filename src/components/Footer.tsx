import type { BrandAssets, FooterLinkGroup } from "../types";

interface FooterProps {
  brand: BrandAssets;
  linkGroups: FooterLinkGroup[];
}

export function Footer({ brand, linkGroups }: FooterProps) {
  return (
    <footer className="site-footer dark-grid-section" id="contact">
      <div className="container footer-brand-block">
        <a
          className="brand footer-brand__logo"
          href="#top"
          aria-label={`${brand.name} home`}
        >
          <img
            className="brand-logo brand-logo--footer brand-logo--light"
            src={brand.lightLogoSrc}
            alt=""
          />
          <img
            className="brand-logo brand-logo--footer brand-logo--dark"
            src={brand.darkLogoSrc}
            alt=""
          />
        </a>
        <p>Business consulting for organizations navigating growth and change.</p>
        <div className="footer-socials">
          <a href="#x" aria-label="X">
            X
          </a>
          <a href="#linkedin" aria-label="LinkedIn">
            in
          </a>
          <a href="#youtube" aria-label="YouTube">
            YT
          </a>
          <a href="#instagram" aria-label="Instagram">
            IG
          </a>
          <a href="#email" aria-label="Email">
            @
          </a>
        </div>
      </div>

      <div className="container footer-divider"></div>

      <div className="container footer-links">
        {linkGroups.map((group) => (
          <div key={group.title}>
            <h3>{group.title}</h3>
            {group.links.map((link) => (
              <a key={`${group.title}-${link.href}-${link.label}`} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div className="container footer-divider footer-divider--bottom"></div>

      <div className="container footer-bottom">
        <p>Copyright 2026 Exxonim. All rights reserved.</p>
        <div>
          <a href="#terms">Terms &amp; Conditions</a>
          <a href="#privacy">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
