import type { BrandAssets } from "../types";
import { routes } from "../routes";

interface FooterProps {
  brand: BrandAssets;
}

const footerAnchorIds = [
  "support",
  "terms",
  "privacy",
] as const;

const quickLinks = [
  { label: "About", href: routes.about },
  { label: "Services", href: routes.services },
  { label: "Track Your Consultation", href: routes.tracking },
  { label: "Help (FAQ)", href: `${routes.resources}#faq` },
  { label: "Blogs", href: routes.resources },
  { label: "Contact", href: routes.contact },
];

const otherResources = [
  { label: "Career", href: routes.career },
  { label: "Support", href: "#support" },
  { label: "Terms of Use", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
];

const footerStyles = String.raw`
.footer-shell{
  position:relative;
  z-index:10;
  margin-top:5rem;
  padding:4.25rem 0 1.75rem;
  border-top:1px solid rgba(0,0,0,.06);
  background:
    radial-gradient(circle at top left, rgba(255,255,255,.62), rgba(255,255,255,.38) 42%, rgba(255,255,255,.32) 100%);
  backdrop-filter:blur(18px);
  -webkit-backdrop-filter:blur(18px);
}

.footer-shell,
.footer-shell *{
  box-sizing:border-box;
}

.footer-shell__anchor{
  display:block;
  height:0;
}

.footer-shell__inner{
  width:min(1240px, calc(100% - 2rem));
  margin:0 auto;
}

.footer-shell__main{
  display:grid;
  grid-template-columns:minmax(0,1.45fr) repeat(3,minmax(10rem,1fr));
  gap:2rem 2.4rem;
  padding-bottom:1.9rem;
}

.footer-shell__brand-panel{
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  gap:1rem;
  max-width:29rem;
}

.footer-shell__brand-link{
  display:inline-flex;
  align-items:center;
  text-decoration:none;
}

.footer-shell__brand-logo{
  display:block;
  width:min(8.5rem, 100%);
  height:auto;
}

.footer-shell__brand-logo--dark{
  display:none;
}

html[data-theme="dark"] .footer-shell__brand-logo--light{
  display:none;
}

html[data-theme="dark"] .footer-shell__brand-logo--dark{
  display:block;
}

.footer-shell__tagline{
  margin:0;
  max-width:16rem;
  font-size:.95rem;
  line-height:1.6;
  color:rgba(17,35,37,.76);
}

.footer-shell__column{
  display:flex;
  flex-direction:column;
  gap:.95rem;
}

.footer-shell__eyebrow{
  margin:0;
  font-family:ui-monospace,"SFMono-Regular","Menlo","Monaco","Consolas","Liberation Mono","Courier New",monospace;
  font-size:.76rem;
  font-weight:700;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:rgba(17,35,37,.52);
}

.footer-shell__list{
  display:grid;
  gap:.8rem;
}

.footer-shell__list a,
.footer-shell__list span{
  display:block;
  line-height:1.6;
}

.footer-shell__list a{
  color:rgba(17,35,37,.78);
  text-decoration:none;
  transition:color 180ms ease, opacity 180ms ease;
}

.footer-shell__list a:hover,
.footer-shell__list a:focus-visible{
  color:#094449;
  outline:none;
}

.footer-shell__list--contact{
  gap:1rem;
}

.footer-shell__contact-item{
  display:flex;
  align-items:flex-start;
  gap:.75rem;
}

.footer-shell__contact-icon{
  width:1.25rem;
  height:1.25rem;
  flex-shrink:0;
  margin-top:.1rem;
  color:#094449;
}

.footer-shell__contact-copy{
  display:block;
  line-height:1.6;
  color:rgba(17,35,37,.78);
}

.footer-shell__contact-copy--stacked{
  display:grid;
  gap:.35rem;
}

.footer-shell__divider{
  height:1px;
  width:min(1240px, calc(100% - 2rem));
  margin:0 auto;
  background:rgba(9,68,73,.14);
}

.footer-shell__bottom{
  width:min(1240px, calc(100% - 2rem));
  margin:0 auto;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:1rem;
  padding-top:1.25rem;
}

.footer-shell__bottom p{
  margin:0;
  line-height:1.6;
  color:rgba(17,35,37,.7);
}

html[data-theme="dark"] .footer-shell{
  border-top-color:rgba(255,255,255,.06);
  background:
    radial-gradient(circle at top left, rgba(11,33,36,.74), rgba(6,28,31,.52) 42%, rgba(6,28,31,.48) 100%);
}

html[data-theme="dark"] .footer-shell__tagline,
html[data-theme="dark"] .footer-shell__contact-copy,
html[data-theme="dark"] .footer-shell__bottom p,
html[data-theme="dark"] .footer-shell__list a{
  color:rgba(226,232,255,.76);
}

html[data-theme="dark"] .footer-shell__eyebrow{
  color:rgba(226,232,255,.52);
}

html[data-theme="dark"] .footer-shell__divider{
  background:rgba(255,255,255,.1);
}

html[data-theme="dark"] .footer-shell__contact-icon{
  color:#72c2c7;
}

html[data-theme="dark"] .footer-shell__list a:hover,
html[data-theme="dark"] .footer-shell__list a:focus-visible{
  color:#72c2c7;
}

@media (max-width: 1439px){
  .footer-shell__main{
    grid-template-columns:repeat(2, minmax(0,1fr));
  }
}

@media (max-width: 1279px){
  .footer-shell__main{
    grid-template-columns:1fr;
  }

  .footer-shell__bottom{
    flex-direction:column;
    align-items:flex-start;
  }
}

@media (max-width: 640px){
  .footer-shell{
    margin-top:4rem;
    padding:3.5rem 0 1.5rem;
  }

  .footer-shell__inner,
  .footer-shell__divider,
  .footer-shell__bottom{
    width:min(1240px, calc(100% - 1rem));
  }
}
`;

export function Footer({ brand }: FooterProps) {
  return (
    <>
      <style>{footerStyles}</style>

      <footer className="footer-shell" id="site-footer">
        {footerAnchorIds.map((anchorId) => (
          <span key={anchorId} className="footer-shell__anchor" id={anchorId} aria-hidden="true"></span>
        ))}

        <div className="footer-shell__inner footer-shell__main">
          <div className="footer-shell__brand-panel">
            <a
              className="footer-shell__brand-link"
              href={routes.home}
              aria-label={`${brand.name} home`}
            >
              <img
                className="footer-shell__brand-logo footer-shell__brand-logo--light"
                src={brand.lightLogoSrc}
                alt={brand.name}
              />
              <img
                className="footer-shell__brand-logo footer-shell__brand-logo--dark"
                src={brand.darkLogoSrc}
                alt=""
                aria-hidden="true"
              />
            </a>
            <p className="footer-shell__tagline">Where Innovation Meets Efficiency</p>
          </div>

          <div className="footer-shell__column">
            <p className="footer-shell__eyebrow">Quick Links</p>
            <nav className="footer-shell__list" aria-label="Footer navigation">
              {quickLinks.map((link) => (
                <a key={`${link.label}-${link.href}`} href={link.href}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="footer-shell__column">
            <p className="footer-shell__eyebrow">Other Resources</p>
            <div className="footer-shell__list">
              {otherResources.map((link) => (
                <a key={`${link.label}-${link.href}`} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="footer-shell__column">
            <p className="footer-shell__eyebrow">Contact Us</p>
            <div className="footer-shell__list footer-shell__list--contact">
              <div className="footer-shell__contact-item">
                <svg
                  className="footer-shell__contact-icon"
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
                <span className="footer-shell__contact-copy">
                  Mbezi Beach B, Africana, Bagamoyo Road, Block no H, House number 9,
                  Dar es Salaam
                </span>
              </div>

              <div className="footer-shell__contact-item">
                <svg
                  className="footer-shell__contact-icon"
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
                <div className="footer-shell__contact-copy footer-shell__contact-copy--stacked">
                  <a href="mailto:info@exxonim.tz">info@exxonim.tz</a>
                  <a href="mailto:md@exxonim.tz">md@exxonim.tz</a>
                </div>
              </div>

              <div className="footer-shell__contact-item">
                <svg
                  className="footer-shell__contact-icon"
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
                <div className="footer-shell__contact-copy footer-shell__contact-copy--stacked">
                  <a href="tel:+255794689099">+255 794 689 099</a>
                  <a href="tel:+255685525224">+255 685 525 224</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-shell__divider"></div>

        <div className="footer-shell__bottom">
          <p>&copy; 2026 Exxonim. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
