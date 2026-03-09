import type { BrandAssets } from "../types";

interface FooterProps {
  brand: BrandAssets;
}

const quickLinks = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Industries", href: "#industries" },
  { label: "Results", href: "#results" },
  { label: "Insights", href: "#resources" },
];

const serviceLinks = [
  { label: "Company Registration", href: "#services" },
  { label: "Trademark Registration", href: "#services" },
  { label: "TIN Application", href: "#results" },
  { label: "Business Licensing", href: "#services" },
  { label: "Annual Returns", href: "#results" },
];

export function Footer({ brand }: FooterProps) {
  return (
    <footer className="site-footer dark-grid-section" id="contact">
      <div className="container footer-main">
        <div className="footer-brand-panel">
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
          <p>
            Exxonim supports founders, firms, and growing organizations with
            business registration, tax, licensing, and compliance services in
            Tanzania.
          </p>
          <a className="footer-call" href="tel:+255794689099">
            <span>Call Exxonim</span>
            <strong>+255 794 689 099</strong>
          </a>
        </div>

        <div className="footer-column">
          <p className="footer-eyebrow">Quick Links</p>
          <nav className="footer-list" aria-label="Footer navigation">
            {quickLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-column">
          <p className="footer-eyebrow">Core Services</p>
          <div className="footer-list">
            {serviceLinks.map((link) => (
              <a key={`${link.label}-${link.href}`} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <p className="footer-eyebrow">Contact</p>
          <div className="footer-list footer-list--contact">
            <span className="footer-contact-label">Phone</span>
            <a href="tel:+255794689099">+255 794 689 099</a>
            <span className="footer-contact-label">Coverage</span>
            <span>BRELA, TIN, BOT, licensing, and compliance support.</span>
            <a href="#services">Explore services</a>
          </div>
        </div>
      </div>

      <div className="container footer-divider"></div>

      <div className="container footer-bottom">
        <p>Copyright 2026 Exxonim. All rights reserved.</p>
        <p>Built for business registration, tax, licensing, and compliance.</p>
      </div>
    </footer>
  );
}
