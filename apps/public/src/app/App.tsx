import { lazy, Suspense, useEffect, useState } from "react";
import { Footer, Navigation } from "../features/site-shell";
import { PageLoader } from "../components/PageLoader";
import { PrivacyConsentBanner } from "../components/PrivacyConsentBanner";
import { ShellStatusNotice } from "../components/ShellStatusNotice";
import { usePublicRouter } from "./usePublicRouter";
import { usePublicShell } from "../hooks/usePublicShell";
import { useRevealOnScroll } from "../hooks/useRevealOnScroll";
import { useStackCardDepth } from "../hooks/useStackCardDepth";
import { useTheme } from "../hooks/useTheme";
import { getResourcePostSlug } from "./routes";

/* ═══════════════════════════════════════════════════════════
 * LAZY-LOADED PAGE COMPONENTS
 * ═══════════════════════════════════════════════════════════
 *
 * WHY LAZY LOADING?
 * -----------------
 * Previously ALL page components were eagerly imported at the
 * top of this file. Vite bundled EVERY page into the initial
 * chunk, even though only ONE page is visible at a time.
 * This caused:
 *
 *   1. LARGE INITIAL BUNDLE -> slow first paint and laggy
 *      scrolling on the home page (unused page CSS/JS bloated
 *      the render tree and style calculations)
 *
 *   2. SLOW FILE-TO-FILE NAVIGATION -> every route change
 *      forced React to reconcile ALL component trees, even
 *      those not visible, because they were in the same module
 *      graph
 *
 *   3. NO CODE SPLITTING -> no parallel chunk loading, no
 *      caching of individual pages across navigations
 *
 * SOLUTION
 * --------
 * Each page is wrapped in React.lazy() which tells Vite to
 * code-split them into separate chunks. A page chunk is only
 * fetched when the user navigates to that route.
 *
 * To hide the chunk-load delay, we also preload pages during
 * browser idle time (see requestIdleCallback below).
 *
 * RULE FOR FUTURE DEVELOPERS:
 *   NEVER revert to static imports for page components.
 *   If you add a new page, add its lazy() import here.
 */

// ── Lazy loader functions ──────────────────────────────
// Defined as standalone functions (not inline arrows) so we
// can reuse them for BOTH lazy() creation AND idle-time
// preloading without duplicating import path strings.
const loadHomePage = () =>
  import("../features/home").then((m) => ({ default: m.HomePage }));
const loadAboutPage = () =>
  import("../features/pages").then((m) => ({ default: m.AboutPage }));
const loadCareerPage = () =>
  import("../features/pages").then((m) => ({ default: m.CareerPage }));
const loadContactPage = () =>
  import("../features/pages").then((m) => ({ default: m.ContactPage }));
const loadFaqPage = () =>
  import("../features/pages").then((m) => ({ default: m.FaqPage }));
const loadNotFoundPage = () =>
  import("../features/pages").then((m) => ({ default: m.NotFoundPage }));
const loadResourceArticlePage = () =>
  import("../features/resources").then((m) => ({
    default: m.ResourceArticlePage,
  }));
const loadResourcesPage = () =>
  import("../features/resources").then((m) => ({ default: m.ResourcesPage }));
const loadServicesPage = () =>
  import("../features/services").then((m) => ({ default: m.ServicesPage }));
const loadSupportPage = () =>
  import("../features/pages").then((m) => ({ default: m.SupportPage }));
const loadTermsPage = () =>
  import("../features/pages").then((m) => ({ default: m.TermsPage }));
const loadPrivacyPage = () =>
  import("../features/pages").then((m) => ({ default: m.PrivacyPage }));
const loadCookiePage = () =>
  import("../features/pages").then((m) => ({ default: m.CookiePage }));
const loadDataRightsPage = () =>
  import("../features/pages").then((m) => ({ default: m.DataRightsPage }));

// ── Lazy components ────────────────────────────────────
const HomePage = lazy(loadHomePage);
const AboutPage = lazy(loadAboutPage);
const CareerPage = lazy(loadCareerPage);
const ContactPage = lazy(loadContactPage);
const FaqPage = lazy(loadFaqPage);
const NotFoundPage = lazy(loadNotFoundPage);
const ResourceArticlePage = lazy(loadResourceArticlePage);
const ResourcesPage = lazy(loadResourcesPage);
const ServicesPage = lazy(loadServicesPage);
const SupportPage = lazy(loadSupportPage);
const TermsPage = lazy(loadTermsPage);
const PrivacyPage = lazy(loadPrivacyPage);
const CookiePage = lazy(loadCookiePage);
const DataRightsPage = lazy(loadDataRightsPage);

// ── Preloader registry ─────────────────────────────────
// All lazy-loader functions collected for idle-time preload.
// WHEN ADDING A NEW PAGE: add its loader here too.
const publicPagePreloaders = [
  loadHomePage,
  loadAboutPage,
  loadCareerPage,
  loadContactPage,
  loadFaqPage,
  loadNotFoundPage,
  loadResourceArticlePage,
  loadResourcesPage,
  loadServicesPage,
  loadSupportPage,
  loadTermsPage,
  loadPrivacyPage,
  loadCookiePage,
  loadDataRightsPage,
];

// ── Type helper for requestIdleCallback ────────────────
type IdleWindow = typeof window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/* ── Page-level Suspense fallback ───────────────────────
 * Rendered inside <main> so the shell (nav + footer) stays
 * visible while a lazy page chunk loads.
 *
 * NOTE: We do NOT reuse <PageLoader /> here because that
 * component is a full-screen overlay (position: fixed). During
 * lazy navigation we want the nav+footer to REMAIN VISIBLE so
 * the user doesn't think the app crashed. This inline fallback
 * just fills the content area with a matching spinner style.
 */
function PageSuspenseFallback() {
  return (
    <div
      className="flex items-center justify-center py-24"
      aria-label="Loading page"
    >
      <div className="page-loader__content">
        <div className="page-loader__spinner">
          <div className="page-loader__ring" />
          <div className="page-loader__ring" />
          <div className="page-loader__ring" />
        </div>
        <p className="page-loader__text">Loading</p>
      </div>
    </div>
  );
}

/* ── ScrollToTop on route change ────────────────────────
 * The custom SPA router (usePublicRouter) updates pathname
 * via pushState but does NOT scroll to top. Without this,
 * navigating from a long page leaves you scrolled halfway
 * down on the new page — which feels broken.
 */
function ScrollToTop({ pathname }: { pathname: string }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

/* ── COLD START NOTE ────────────────────────────────────
 * On a fresh Vite dev server start (or after clearing cache),
 * the FIRST navigation to ANY lazy page shows the Suspense
 * fallback briefly while Vite compiles that chunk.
 *
 * This is EXPECTED and ONLY happens once per page per session.
 * Subsequent navigations are instant (Vite caches in memory).
 * In production (vite build), all chunks are pre-compiled so
 * the fallback is never seen.
 *
 * Do NOT remove lazy loading thinking it's "slower" during
 * dev. The alternative (eager loading) makes EVERY page slow.
 */

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

  /* ── Initial load & idle preloading ────────────────────
   *
   * WHY requestIdleCallback?
   * We preload ALL page chunks after first render, but only
   * during browser idle periods. This means:
   *   - First page is FAST (only one chunk loaded)
   *   - Subsequent pages are INSTANT (chunk already cached)
   *   - No network waterfalls during navigation
   *   - No competition with initial paint or user interactions
   *
   * Fallback to setTimeout(1200ms) for older browsers.
   */
  useEffect(() => {
    setIsPageLoading(false);
    document.documentElement.classList.add("js");

    const preloadPages = () => {
      void Promise.allSettled(
        publicPagePreloaders.map((preloadPage) => preloadPage())
      );
    };

    const idleWindow = window as IdleWindow;
    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(preloadPages, {
        timeout: 2500,
      });
      return () => idleWindow.cancelIdleCallback?.(handle);
    }
    const handle = window.setTimeout(preloadPages, 1200);
    return () => window.clearTimeout(handle);
  }, []);

  const articleSlug = getResourcePostSlug(pathname);
  const whatsappUrl = shell.company.whatsapp;

  // Route matching: map pathname -> lazy component
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
      {/* Full-screen loader on very first load only */}
      <PageLoader isLoading={isPageLoading} delay={300} />

      {/* Scroll to top on every route change */}
      <ScrollToTop pathname={pathname} />

      <div className="cinematic-bg" aria-hidden="true">
        <div className="cinematic-bg__orb cinematic-bg__orb--one" />
        <div className="cinematic-bg__orb cinematic-bg__orb--two" />
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

      {/*
        Page content wrapped in Suspense so shell stays
        mounted during lazy chunk loading.
      */}
      <main id="top" className="site-main">
        <Suspense fallback={<PageSuspenseFallback />}>
          {page}
        </Suspense>
      </main>

      <Footer
        brand={shell.brand}
        company={shell.company}
        footer={shell.footer}
      />

      <PrivacyConsentBanner pathname={pathname} />

      {!whatsappUrl ? null : (
        <a
          className="fixed right-6 bottom-6 z-[30] inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#25d366] text-white shadow-[0_18px_40px_rgba(37,211,102,0.28)] transition-transform duration-150 ease-out hover:scale-110"
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat on WhatsApp"
        >
          <span
            className="absolute inset-0 rounded-full bg-[#25d366]/50 animate-whatsapp-pulse"
            aria-hidden="true"
          />
          <svg
            className="relative z-10 w-[1.9rem] h-[1.9rem]"
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
