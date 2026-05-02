import { MapPin, Mail, Phone } from 'lucide-react'
import { Container } from './primitives/Container'
import { routes } from '../routes'
import type { BrandAssets, CompanyInfo } from '../types'
import type { SiteSettingFooterValue, SiteSettingSocialLinkValue } from '../types/api'

function socialLabel(link: SiteSettingSocialLinkValue) {
  return link.label?.trim() || link.platform.charAt(0).toUpperCase() + link.platform.slice(1);
}

const footerSocialPlatforms: SiteSettingSocialLinkValue["platform"][] = [
  "linkedin",
  "instagram",
  "x",
];

function renderSocialIcon(platform: SiteSettingSocialLinkValue["platform"]) {
  switch (platform) {
    case "facebook":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 21v-7.2h2.43l.37-2.8H13.5V9.2c0-.81.23-1.36 1.39-1.36H16.4V5.33c-.73-.08-1.47-.12-2.21-.11-2.18 0-3.67 1.33-3.67 3.78V11H8v2.8h2.52V21h2.98Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm8.37 1.73H7.88A4.15 4.15 0 0 0 3.73 7.88v8.24a4.15 4.15 0 0 0 4.15 4.15h8.24a4.15 4.15 0 0 0 4.15-4.15V7.88a4.15 4.15 0 0 0-4.15-4.15Zm-4.12 3.54A4.73 4.73 0 1 1 7.27 12 4.73 4.73 0 0 1 12 7.27Zm0 1.73A3 3 0 1 0 15 12a3 3 0 0 0-3-3Zm5.02-2.62a1.13 1.13 0 1 1-1.13 1.13 1.13 1.13 0 0 1 1.13-1.13Z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.94 8.5A1.69 1.69 0 1 0 6.9 5.12a1.69 1.69 0 0 0 .04 3.38ZM5.47 18.88h2.86V9.72H5.47v9.16Zm4.46 0h2.85v-5.11c0-1.35.26-2.66 1.93-2.66 1.65 0 1.67 1.54 1.67 2.75v5.02h2.86v-5.61c0-2.76-.59-4.88-3.82-4.88-1.55 0-2.58.85-3.01 1.65h-.04V9.72H9.93c.04.73 0 9.16 0 9.16Z" />
        </svg>
      );
    case "x":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.9 4H21l-4.59 5.24L21.8 20h-4.78l-3.74-4.89L9 20H6.88l4.91-5.61L6.6 4h4.9l3.38 4.47L18.9 4Zm-.75 14.7h1.33L10.79 5.2H9.36l8.79 13.5Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.58 7.19a2.98 2.98 0 0 0-2.1-2.1C17.62 4.6 12 4.6 12 4.6s-5.62 0-7.48.49a2.98 2.98 0 0 0-2.1 2.1A31.3 31.3 0 0 0 2 12a31.3 31.3 0 0 0 .42 4.81 2.98 2.98 0 0 0 2.1 2.1c1.86.49 7.48.49 7.48.49s5.62 0 7.48-.49a2.98 2.98 0 0 0 2.1-2.1A31.3 31.3 0 0 0 22 12a31.3 31.3 0 0 0-.42-4.81ZM10.2 15.02V8.98L15.4 12l-5.2 3.02Z" />
        </svg>
      );
    case "tiktok":
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.72 3c.18 1.51 1.03 2.99 2.37 3.86.87.57 1.88.88 2.91.91v2.84a8.03 8.03 0 0 1-2.98-.57 7.24 7.24 0 0 1-1.99-1.14v6.08c0 3.22-2.61 5.82-5.83 5.82s-5.82-2.6-5.82-5.82 2.6-5.83 5.82-5.83c.28 0 .56.02.83.06v2.88a2.9 2.9 0 0 0-.83-.12 2.99 2.99 0 1 0 2.99 2.99V3h2.53Z" />
        </svg>
      );
    default:
      return null;
  }
}

interface FooterProps {
  brand: BrandAssets;
  company: CompanyInfo;
  footer: SiteSettingFooterValue;
}

export function Footer({ brand, company, footer }: FooterProps) {
  const socialLinks = footerSocialPlatforms
    .map((platform) =>
      (footer.social_links ?? []).find(
        (link) => link.platform === platform && link.isActive && link.url.trim()
      )
    )
    .filter((link): link is SiteSettingSocialLinkValue => Boolean(link));

  return (
    <footer
      id="site-footer"
      className="relative mt-auto border-t border-border-soft bg-page dark:bg-page-dark dark:border-border-dark-soft"
    >
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 mb-8 pb-8 border-b border-border-soft dark:border-border-dark-soft">
          {/* Brand Panel */}
          <section className="grid gap-4 content-start">
            <a
              href={routes.home}
              aria-label={`${brand.name} home`}
              className="inline-flex items-center"
            >
              <img
                src={brand.lightLogoSrc}
                alt={brand.name}
                loading="lazy"
                className="block max-w-[9.25rem] h-auto dark:hidden"
              />
              <img
                src={brand.darkLogoSrc}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="hidden max-w-[9.25rem] h-auto dark:block"
              />
            </a>

            <p className="text-text-muted text-sm leading-relaxed max-w-[26ch] dark:text-text-dark-muted">
              {footer.tagline}
            </p>

            <a
              href={footer.primary_cta.href}
              className="inline-flex items-center justify-center w-fit min-h-[2.75rem] px-5 py-2.5 rounded-full bg-accent text-white font-extrabold text-sm shadow-button hover:bg-accent-hover transition-all hover:-translate-y-0.5"
            >
              {footer.primary_cta.label}
            </a>
          </section>

          {/* Quick Links */}
          <section>
            <h4 className="text-xs font-extrabold tracking-[0.14em] uppercase text-accent mb-4 dark:text-accent-dark">
              Quick Links
            </h4>
            <nav aria-label="Footer navigation">
              <ul className="grid gap-2">
                {footer.quick_links.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a
                      href={link.href}
                      className="text-text-muted text-sm hover:text-accent transition-colors dark:text-text-dark-muted dark:hover:text-accent-dark"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>

          {/* Other Resources */}
          <section>
            <h4 className="text-xs font-extrabold tracking-[0.14em] uppercase text-accent mb-4 dark:text-accent-dark">
              Other Resources
            </h4>
            <ul className="grid gap-2">
              {footer.other_resources.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <a
                    href={link.href}
                    className="text-text-muted text-sm hover:text-accent transition-colors dark:text-text-dark-muted dark:hover:text-accent-dark"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Contact Us */}
          <section>
            <h4 className="text-xs font-extrabold tracking-[0.14em] uppercase text-accent mb-4 dark:text-accent-dark">
              Contact Us
            </h4>
            <ul className="grid gap-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 dark:text-accent-dark" aria-hidden="true" />
                <span className="text-text-muted text-sm dark:text-text-dark-muted">
                  {company.address || 'Use the contact page for location details.'}
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 dark:text-accent-dark" aria-hidden="true" />
                <div className="grid gap-1">
                  {company.emails.length ? (
                    company.emails.map((email) => (
                      <a
                        key={email}
                        href={`mailto:${email}`}
                        className="text-text-muted text-sm hover:text-accent transition-colors dark:text-text-dark-muted dark:hover:text-accent-dark"
                      >
                        {email}
                      </a>
                    ))
                  ) : (
                    <a
                      href={routes.contact}
                      className="text-text-muted text-sm hover:text-accent transition-colors dark:text-text-dark-muted dark:hover:text-accent-dark"
                    >
                      Use the Exxonim contact page
                    </a>
                  )}
                </div>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5 dark:text-accent-dark" aria-hidden="true" />
                <div className="grid gap-1">
                  {company.phones.length ? (
                    company.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\s+/g, '')}`}
                        className="text-text-muted text-sm hover:text-accent transition-colors dark:text-text-dark-muted dark:hover:text-accent-dark"
                      >
                        {phone}
                      </a>
                    ))
                  ) : (
                    <a
                      href={routes.contact}
                      className="text-text-muted text-sm hover:text-accent transition-colors dark:text-text-dark-muted dark:hover:text-accent-dark"
                    >
                      Use the Exxonim contact page
                    </a>
                  )}
                </div>
              </li>
            </ul>
          </section>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-soft text-sm dark:text-text-dark-soft">
            {footer.copyright}
          </p>
          <div className="flex items-center gap-3">
            {socialLinks.length ? (
              <div className="flex items-center gap-2" aria-label="Social media links">
                {socialLinks.map((link, index) => (
                  <a
                    key={`${link.platform}-${link.url}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={socialLabel(link)}
                    title={socialLabel(link)}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-soft text-text-muted hover:text-accent hover:bg-accent-soft transition-all dark:bg-surface-dark-soft dark:text-text-dark-muted dark:hover:text-accent-dark dark:hover:bg-accent-dark-soft"
                  >
                    <span className="w-5 h-5 flex items-center justify-center">{renderSocialIcon(link.platform)}</span>
                  </a>
                ))}
              </div>
            ) : null}
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Back to top"
              title="Back to top"
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-surface-soft text-text-muted text-sm font-medium hover:bg-accent-soft hover:text-accent transition-all dark:bg-surface-dark-soft dark:text-text-dark-muted dark:hover:bg-accent-dark-soft dark:hover:text-accent-dark"
            >
              Top
            </button>
          </div>
        </div>
      </Container>
    </footer>
  )
}
