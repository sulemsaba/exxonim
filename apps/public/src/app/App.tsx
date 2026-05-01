import { useEffect, useState } from "react";
import { HomePage } from "../features/home";
import {
  AboutPage,
  CareerPage,
  CookiePage,
  ContactPage,
  DataRightsPage,
  FaqPage,
  NotFoundPage,
  PrivacyPage,
  SupportPage,
  TermsPage,
} from "../features/pages";
import { ResourceArticlePage, ResourcesPage } from "../features/resources";
import { ServicesPage } from "../features/services";
import { Footer, Navigation } from "../features/site-shell";
import { PageLoader } from "../components/PageLoader";
import { PrivacyConsentBanner } from "../components/PrivacyConsentBanner";
import { ShellStatusNotice } from "../components/ShellStatusNotice";
import { usePublicRouter } from "./usePublicRouter";
import { usePublicShell } from "../hooks/usePublicShell";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useStackCardDepth } from "../hooks/useStackCardDepth";
import { useTheme } from "../hooks/useTheme";
import { getResourcePostSlug, routes } from "./routes";

interface AppProps {
  initialPathname?: string;
}

export default function App({ initialPathname }: AppProps) {
  const { theme, toggleTheme } = useTheme();
  const { pathname } = usePublicRouter({ initialPathname });
  const shell = usePublicShell();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useRevealOnScroll();
  useStackCardDepth(pathname);

  useEffect(() => {
    setIsPageLoading(false);
    document.documentElement.classList.add("js");
  }, []);

  const articleSlug = getResourcePostSlug(pathname);
  const whatsappUrl = shell.company.whatsapp;

  const page = pathname === "/" ? (
    <HomePage />
  ) : pathname === "/about" ? (
    <AboutPage />
  ) : pathname === "/faq" ? (
    <FaqPage />
  ) : pathname === "/services" ? (
    <ServicesPage />
  ) : pathname === "/resources" ? (
    <ResourcesPage />
  ) : pathname === "/career" ? (
    <CareerPage />
  ) : pathname === "/contact" ? (
    <ContactPage />
  ) : pathname === "/support" ? (
    <SupportPage />
  ) : pathname === "/terms" ? (
    <TermsPage />
  ) : pathname === "/privacy" ? (
    <PrivacyPage />
  ) : pathname === "/cookies" ? (
    <CookiePage />
  ) : pathname === "/data-rights" ? (
    <DataRightsPage />
  ) : articleSlug ? (
    <ResourceArticlePage slug={articleSlug} />
  ) : (
    <NotFoundPage pathname={pathname} />
  );

  return (
    <div className="site-shell">
      <PageLoader isLoading={isPageLoading} delay={300} />

      <div className="cinematic-bg" aria-hidden="true">
        <div className="cinematic-bg__orb cinematic-bg__orb--one"></div>
        <div className="cinematic-bg__orb cinematic-bg__orb--two"></div>
      </div>

      <Navigation
        brand={shell.brand}
        company={shell.company}
        navigationItems={shell.navigationItems}
        onToggleTheme={toggleTheme}
        pathname={pathname}
        theme={theme}
      />

      <ShellStatusNotice />

      <main id="top" className="site-main">
        {page}
      </main>

      <Footer
        brand={shell.brand}
        company={shell.company}
        footer={shell.footer}
        theme={theme}
      />

      <PrivacyConsentBanner pathname={pathname} />

      {!whatsappUrl ? null : (
        <a
          className="whatsapp-float"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <span className="whatsapp-float__pulse" aria-hidden="true"></span>
          <svg
            className="whatsapp-float__icon"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12.01 2.014a9.96 9.96 0 0 0-8.52 15.11L2 22l4.985-1.465a9.961 9.961 0 1 0 5.025-18.52Zm0 18.067a8.093 8.093 0 0 1-4.14-1.134l-.297-.176-3.082.906.924-2.977-.193-.306A8.098 8.098 0 1 1 12.01 20.08Zm4.437-6.042c-.244-.122-1.439-.711-1.662-.793-.223-.081-.385-.122-.547.122-.162.244-.628.793-.77.955-.142.162-.284.183-.528.061-1.18-.56-2.072-1.1-2.884-2.522-.083-.146-.01-.223.111-.345.11-.11.244-.284.366-.427.122-.142.162-.244.244-.407.081-.162.041-.305-.02-.427-.061-.122-.547-1.32-.75-1.808-.198-.475-.399-.411-.547-.419-.142-.008-.305-.008-.468-.008-.162 0-.427.061-.65.305-.223.244-.852.833-.852 2.032s.873 2.358.995 2.522c.122.162 1.714 2.628 4.153 3.67.58.24 1.033.383 1.385.49.582.185 1.112.158 1.531.096.47-.07 1.439-.588 1.642-1.157.203-.569.203-1.056.142-1.157-.061-.101-.223-.162-.468-.284Z" />
          </svg>
        </a>
      )}
    </div>
  );
}
