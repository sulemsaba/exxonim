import type { BrandAssets } from "../types";

interface FooterProps {
  brand: BrandAssets;
}

const footerAnchorIds = [
  "career",
  "support",
  "terms",
  "privacy",
] as const;

const quickLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Track Your Consultation", href: "#track-consultation" },
  { label: "Help (FAQ)", href: "#faq" },
  { label: "Blogs", href: "#blogs" },
  { label: "Contact", href: "#contact" },
];

const otherResources = [
  { label: "Career", href: "#career" },
  { label: "Support", href: "#support" },
  { label: "Terms of Use", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
];

export function Footer({ brand }: FooterProps) {
  return (
    <footer className="site-footer dark-grid-section" id="contact">
      {footerAnchorIds.map((anchorId) => (
        <span key={anchorId} className="section-anchor" id={anchorId} aria-hidden="true"></span>
      ))}

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
          <p>Where Innovation Meets Efficiency</p>
        </div>

        <div className="footer-column">
          <p className="footer-eyebrow">Quick Links</p>
          <nav className="footer-list" aria-label="Footer navigation">
            {quickLinks.map((link) => (
              <a key={`${link.label}-${link.href}`} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="footer-column">
          <p className="footer-eyebrow">Other Resources</p>
          <div className="footer-list">
            {otherResources.map((link) => (
              <a key={`${link.label}-${link.href}`} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <p className="footer-eyebrow">Contact Us</p>
          <div className="footer-list footer-list--contact">
            <div className="footer-contact-item">
              <svg
                className="footer-contact-icon"
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.657 16.657 13.414 20.9a1.998 1.998 0 0 1-2.827 0l-4.244-4.243a8 8 0 1 1 11.314 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <span className="footer-contact-copy">
                Mbezi Beach B, Africana, Bagamoyo Road, Block no H, House number 9,
                Dar es Salaam
              </span>
            </div>

            <div className="footer-contact-item">
              <svg
                className="footer-contact-icon"
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m3 8 7.89 5.26a2 2 0 0 0 2.22 0L21 8"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2Z"
                />
              </svg>
              <div className="footer-contact-copy footer-contact-copy--stacked">
                <a href="mailto:info@exxonim.tz">info@exxonim.tz</a>
                <a href="mailto:md@exxonim.tz">md@exxonim.tz</a>
              </div>
            </div>

            <div className="footer-contact-item">
              <svg
                className="footer-contact-icon"
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5Z"
                />
              </svg>
              <div className="footer-contact-copy footer-contact-copy--stacked">
                <a href="tel:+255794689099">+255 794 689 099</a>
                <a href="tel:+255685525224">+255 685 525 224</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container footer-divider"></div>

      <div className="container footer-bottom">
        <p>&copy; 2026 Exxonim. All rights reserved.</p>
      </div>
    </footer>
  );
}
