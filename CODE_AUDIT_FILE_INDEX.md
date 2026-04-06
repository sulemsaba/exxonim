# Exxonim Code Audit File Index

This file is not another architecture summary.

It is a guided index to the real implementation files that should be reviewed next against the architecture and roadmap in `PROJECT_ARCHITECTURE_DIAGRAM.md`.

Review order follows the exact order requested:

1. `apps/public`
2. `packages/shared`
3. `apps/admin-next`
4. backend
5. security-related files
6. performance and build files

The backend lives in the sibling repo `../exxonim_backend`.

## 1. apps/public

### App shell and entry

- [`apps/public/src/app/App.tsx`](apps/public/src/app/App.tsx)
- [`apps/public/src/app/main.tsx`](apps/public/src/app/main.tsx)
- [`apps/public/src/app/entry-server.tsx`](apps/public/src/app/entry-server.tsx)
- [`apps/public/src/app/usePublicRouter.ts`](apps/public/src/app/usePublicRouter.ts)

### Route files

- [`apps/public/src/routes.ts`](apps/public/src/routes.ts)
- [`apps/public/src/app/routes.ts`](apps/public/src/app/routes.ts)

### Navigation, footer, loading, and error surfaces

- [`apps/public/src/components/Navigation.tsx`](apps/public/src/components/Navigation.tsx)
- [`apps/public/src/components/Footer.tsx`](apps/public/src/components/Footer.tsx)
- [`apps/public/src/components/PageLoader.tsx`](apps/public/src/components/PageLoader.tsx)
- [`apps/public/src/components/LoadBoundary.tsx`](apps/public/src/components/LoadBoundary.tsx)
- [`apps/public/src/components/LoadingSpinner.tsx`](apps/public/src/components/LoadingSpinner.tsx)
- [`apps/public/src/components/ErrorMessage.tsx`](apps/public/src/components/ErrorMessage.tsx)
- [`apps/public/src/components/ShellStatusNotice.tsx`](apps/public/src/components/ShellStatusNotice.tsx)

### Homepage and one inner page

- [`apps/public/src/pages/HomePage.tsx`](apps/public/src/pages/HomePage.tsx)
- [`apps/public/src/pages/AboutPage.tsx`](apps/public/src/pages/AboutPage.tsx)

### Other route pages worth reviewing after that

- [`apps/public/src/pages/ServicesPage.tsx`](apps/public/src/pages/ServicesPage.tsx)
- [`apps/public/src/pages/ResourcesPage.tsx`](apps/public/src/pages/ResourcesPage.tsx)
- [`apps/public/src/pages/ResourceArticlePage.tsx`](apps/public/src/pages/ResourceArticlePage.tsx)
- [`apps/public/src/pages/CareerPage.tsx`](apps/public/src/pages/CareerPage.tsx)
- [`apps/public/src/pages/InfoPages.tsx`](apps/public/src/pages/InfoPages.tsx)
- [`apps/public/src/pages/NotFoundPage.tsx`](apps/public/src/pages/NotFoundPage.tsx)

### Public data layer and fallback behavior

- [`apps/public/src/app/queryClient.ts`](apps/public/src/app/queryClient.ts)
- [`apps/public/src/app/apiClient.ts`](apps/public/src/app/apiClient.ts)
- [`apps/public/src/api/axios.ts`](apps/public/src/api/axios.ts)
- [`apps/public/src/hooks/usePage.ts`](apps/public/src/hooks/usePage.ts)
- [`apps/public/src/hooks/useBlogPosts.ts`](apps/public/src/hooks/useBlogPosts.ts)
- [`apps/public/src/hooks/useNavigation.ts`](apps/public/src/hooks/useNavigation.ts)
- [`apps/public/src/hooks/usePublicShell.ts`](apps/public/src/hooks/usePublicShell.ts)
- [`apps/public/src/services/pageService.ts`](apps/public/src/services/pageService.ts)
- [`apps/public/src/services/blogService.ts`](apps/public/src/services/blogService.ts)
- [`apps/public/src/services/navigationService.ts`](apps/public/src/services/navigationService.ts)
- [`apps/public/src/services/siteSettingsService.ts`](apps/public/src/services/siteSettingsService.ts)
- [`apps/public/src/content/fallbackPublicContent.ts`](apps/public/src/content/fallbackPublicContent.ts)
- [`apps/public/src/content/fallbackShell.ts`](apps/public/src/content/fallbackShell.ts)

## 2. packages/shared

### Shared API client and base URL logic

- [`packages/shared/src/api/http.ts`](packages/shared/src/api/http.ts)
- [`packages/shared/src/api/baseUrl.ts`](packages/shared/src/api/baseUrl.ts)
- [`packages/shared/src/api/routes.ts`](packages/shared/src/api/routes.ts)

### Shared auth and session helpers

- [`packages/shared/src/auth/session.ts`](packages/shared/src/auth/session.ts)

### Shared public cache helper

- [`packages/shared/src/publicContentCache.ts`](packages/shared/src/publicContentCache.ts)

### Shared contracts

- [`packages/shared/src/contracts/auth.ts`](packages/shared/src/contracts/auth.ts)
- [`packages/shared/src/contracts/access.ts`](packages/shared/src/contracts/access.ts)
- [`packages/shared/src/contracts/pages.ts`](packages/shared/src/contracts/pages.ts)
- [`packages/shared/src/contracts/blog.ts`](packages/shared/src/contracts/blog.ts)
- [`packages/shared/src/contracts/navigation.ts`](packages/shared/src/contracts/navigation.ts)
- [`packages/shared/src/contracts/site-settings.ts`](packages/shared/src/contracts/site-settings.ts)
- [`packages/shared/src/contracts/testimonials.ts`](packages/shared/src/contracts/testimonials.ts)
- [`packages/shared/src/contracts/media.ts`](packages/shared/src/contracts/media.ts)

### Important note

There is no shared React Query config package at the moment.

The live query-client definitions are app-specific:

- [`apps/public/src/app/queryClient.ts`](apps/public/src/app/queryClient.ts)
- [`apps/admin-next/src/lib/query-client.ts`](apps/admin-next/src/lib/query-client.ts)

## 3. apps/admin-next

### App entry and route shell

- [`apps/admin-next/src/main.tsx`](apps/admin-next/src/main.tsx)
- [`apps/admin-next/src/app.tsx`](apps/admin-next/src/app.tsx)
- [`apps/admin-next/src/routes/sections.tsx`](apps/admin-next/src/routes/sections.tsx)
- [`apps/admin-next/src/pages/admin.tsx`](apps/admin-next/src/pages/admin.tsx)
- [`apps/admin-next/src/pages/sign-in.tsx`](apps/admin-next/src/pages/sign-in.tsx)

### Auth flow

- [`apps/admin-next/src/sections/auth/sign-in-view.tsx`](apps/admin-next/src/sections/auth/sign-in-view.tsx)
- [`packages/admin-core/src/services/adminAuthService.ts`](packages/admin-core/src/services/adminAuthService.ts)
- [`packages/admin-core/src/contexts/AuthContext.tsx`](packages/admin-core/src/contexts/AuthContext.tsx)
- [`packages/admin-core/src/api/axios.ts`](packages/admin-core/src/api/axios.ts)
- [`packages/admin-core/src/lib/authSession.ts`](packages/admin-core/src/lib/authSession.ts)

### Route guards and permission-aware UI

- [`apps/admin-next/src/routes/sections.tsx`](apps/admin-next/src/routes/sections.tsx)
- [`packages/admin-core/src/components/Can.tsx`](packages/admin-core/src/components/Can.tsx)
- [`packages/admin-core/src/lib/adminRoutes.ts`](packages/admin-core/src/lib/adminRoutes.ts)

### Main admin workspace switch

- [`apps/admin-next/src/sections/admin/view/admin-workspace-view.tsx`](apps/admin-next/src/sections/admin/view/admin-workspace-view.tsx)

### One real content editor page

The richest editor surface to audit first is:

- [`apps/admin-next/src/sections/admin/view/admin-blog-panels.tsx`](apps/admin-next/src/sections/admin/view/admin-blog-panels.tsx)

Then review these related editors:

- [`apps/admin-next/src/sections/admin/view/admin-careers-panels.tsx`](apps/admin-next/src/sections/admin/view/admin-careers-panels.tsx)
- [`apps/admin-next/src/sections/admin/view/admin-settings-panels.tsx`](apps/admin-next/src/sections/admin/view/admin-settings-panels.tsx)
- [`apps/admin-next/src/sections/admin/view/admin-consultation-panels.tsx`](apps/admin-next/src/sections/admin/view/admin-consultation-panels.tsx)

## 4. Backend

### App entry, middleware, and CORS

- [`../exxonim_backend/app/main.py`](../exxonim_backend/app/main.py)
- [`../exxonim_backend/app/core/config.py`](../exxonim_backend/app/core/config.py)
- [`../exxonim_backend/app/core/database.py`](../exxonim_backend/app/core/database.py)

### Auth dependencies, JWT, and permission enforcement

- [`../exxonim_backend/app/core/dependencies.py`](../exxonim_backend/app/core/dependencies.py)
- [`../exxonim_backend/app/core/security.py`](../exxonim_backend/app/core/security.py)
- [`../exxonim_backend/app/core/rbac.py`](../exxonim_backend/app/core/rbac.py)
- [`../exxonim_backend/app/routers/auth.py`](../exxonim_backend/app/routers/auth.py)
- [`../exxonim_backend/app/routers/health.py`](../exxonim_backend/app/routers/health.py)
- [`../exxonim_backend/app/audit.py`](../exxonim_backend/app/audit.py)
- [`../exxonim_backend/app/workflow.py`](../exxonim_backend/app/workflow.py)

### One full CRUD chain to audit end to end: pages

Backend here uses a `crud` layer rather than a separate service class for pages.

Start with these in order:

- router, admin write path: [`../exxonim_backend/app/routers/admin.py`](../exxonim_backend/app/routers/admin.py)
- router, public read path: [`../exxonim_backend/app/routers/pages.py`](../exxonim_backend/app/routers/pages.py)
- schema: [`../exxonim_backend/app/schemas/page.py`](../exxonim_backend/app/schemas/page.py)
- model: [`../exxonim_backend/app/models/page.py`](../exxonim_backend/app/models/page.py)
- CRUD layer: [`../exxonim_backend/app/crud/page.py`](../exxonim_backend/app/crud/page.py)
- workflow helper: [`../exxonim_backend/app/workflow.py`](../exxonim_backend/app/workflow.py)

### Other domain modules worth comparing after pages

- blog: [`../exxonim_backend/app/routers/blog.py`](../exxonim_backend/app/routers/blog.py), [`../exxonim_backend/app/models/blog.py`](../exxonim_backend/app/models/blog.py), [`../exxonim_backend/app/crud/blog.py`](../exxonim_backend/app/crud/blog.py)
- testimonials: [`../exxonim_backend/app/routers/testimonials.py`](../exxonim_backend/app/routers/testimonials.py), [`../exxonim_backend/app/models/testimonial.py`](../exxonim_backend/app/models/testimonial.py), [`../exxonim_backend/app/crud/testimonial.py`](../exxonim_backend/app/crud/testimonial.py)
- navigation: [`../exxonim_backend/app/routers/navigation.py`](../exxonim_backend/app/routers/navigation.py), [`../exxonim_backend/app/models/navigation.py`](../exxonim_backend/app/models/navigation.py), [`../exxonim_backend/app/crud/navigation.py`](../exxonim_backend/app/crud/navigation.py)

## 5. Security-Related Files

### Env examples only

- [`.env.example`](.env.example)
- [`apps/admin-next/.env.example`](apps/admin-next/.env.example)
- [`../exxonim_backend/.env.example`](../exxonim_backend/.env.example)

### Upload and media handling

- [`../exxonim_backend/app/routers/admin.py`](../exxonim_backend/app/routers/admin.py)
- [`../exxonim_backend/app/models/media.py`](../exxonim_backend/app/models/media.py)
- [`../exxonim_backend/app/crud/media.py`](../exxonim_backend/app/crud/media.py)
- [`../exxonim_backend/app/routers/media.py`](../exxonim_backend/app/routers/media.py)

### JWT and session configuration

- [`../exxonim_backend/app/core/security.py`](../exxonim_backend/app/core/security.py)
- [`../exxonim_backend/app/core/config.py`](../exxonim_backend/app/core/config.py)
- [`packages/shared/src/auth/session.ts`](packages/shared/src/auth/session.ts)
- [`packages/admin-core/src/api/axios.ts`](packages/admin-core/src/api/axios.ts)
- [`packages/admin-core/src/contexts/AuthContext.tsx`](packages/admin-core/src/contexts/AuthContext.tsx)

### Permission enforcement

- [`../exxonim_backend/app/core/dependencies.py`](../exxonim_backend/app/core/dependencies.py)
- [`../exxonim_backend/app/core/rbac.py`](../exxonim_backend/app/core/rbac.py)
- [`../exxonim_backend/app/models/access.py`](../exxonim_backend/app/models/access.py)
- [`../exxonim_backend/app/models/admin_user.py`](../exxonim_backend/app/models/admin_user.py)
- [`packages/admin-core/src/components/Can.tsx`](packages/admin-core/src/components/Can.tsx)
- [`packages/admin-core/src/lib/adminRoutes.ts`](packages/admin-core/src/lib/adminRoutes.ts)

## 6. Performance and Build Files

### Package manifests

- [`package.json`](package.json)
- [`apps/public/package.json`](apps/public/package.json)
- [`apps/admin-next/package.json`](apps/admin-next/package.json)
- [`packages/shared/package.json`](packages/shared/package.json)
- [`packages/admin-core/package.json`](packages/admin-core/package.json)

### Vite configs

- [`apps/public/vite.config.ts`](apps/public/vite.config.ts)
- [`apps/admin-next/vite.config.ts`](apps/admin-next/vite.config.ts)

### Build, deploy, and prerender scripts

- [`scripts/build-deploy.mjs`](scripts/build-deploy.mjs)
- [`scripts/preview-deploy.mjs`](scripts/preview-deploy.mjs)
- [`apps/public/scripts/prerender.mjs`](apps/public/scripts/prerender.mjs)

## Recommended First Audit Pass

If the audit needs to move fast, start in this exact narrow sequence:

1. [`apps/public/src/app/App.tsx`](apps/public/src/app/App.tsx)
2. [`apps/public/src/components/Navigation.tsx`](apps/public/src/components/Navigation.tsx)
3. [`apps/public/src/components/Footer.tsx`](apps/public/src/components/Footer.tsx)
4. [`apps/public/src/hooks/usePublicShell.ts`](apps/public/src/hooks/usePublicShell.ts)
5. [`packages/shared/src/publicContentCache.ts`](packages/shared/src/publicContentCache.ts)
6. [`packages/admin-core/src/contexts/AuthContext.tsx`](packages/admin-core/src/contexts/AuthContext.tsx)
7. [`apps/admin-next/src/routes/sections.tsx`](apps/admin-next/src/routes/sections.tsx)
8. [`apps/admin-next/src/sections/admin/view/admin-blog-panels.tsx`](apps/admin-next/src/sections/admin/view/admin-blog-panels.tsx)
9. [`../exxonim_backend/app/core/dependencies.py`](../exxonim_backend/app/core/dependencies.py)
10. [`../exxonim_backend/app/routers/admin.py`](../exxonim_backend/app/routers/admin.py)
11. [`../exxonim_backend/app/schemas/page.py`](../exxonim_backend/app/schemas/page.py)
12. [`../exxonim_backend/app/models/page.py`](../exxonim_backend/app/models/page.py)
13. [`../exxonim_backend/app/crud/page.py`](../exxonim_backend/app/crud/page.py)

## Requested Source Bundle

The sections below contain the actual current file contents for the first audit-pass files requested.

### `apps/public/src/app/App.tsx`

```tsx
import { useEffect, useState } from "react";
import { HomePage } from "../features/home";
import {
  AboutPage,
  CareerPage,
  ContactPage,
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

  useEffect(() => {
    const root = document.documentElement;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let rafPending = false;
    let frameId = 0;
    const lerpFactor = 0.08;
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const writeGlowPosition = (x: number, y: number) => {
      root.style.setProperty("--mouse-x", `${x}px`);
      root.style.setProperty("--mouse-y", `${y}px`);
    };

    const stopGlowAnimation = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
        frameId = 0;
      }
      rafPending = false;
    };

    const handlePointerMove = (event: MouseEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      queueGlowUpdate();
    };

    const updateScroll = () => {
      root.style.setProperty("--scroll-y", `${window.scrollY}px`);
    };

    const animateGlow = () => {
      rafPending = false;
      currentX += (targetX - currentX) * lerpFactor;
      currentY += (targetY - currentY) * lerpFactor;
      writeGlowPosition(currentX, currentY);

      const delta =
        Math.abs(targetX - currentX) + Math.abs(targetY - currentY);

      if (!reducedMotionQuery.matches && delta > 0.5) {
        queueGlowUpdate();
      }
    };

    const queueGlowUpdate = () => {
      if (reducedMotionQuery.matches || rafPending) {
        return;
      }

      rafPending = true;
      frameId = window.requestAnimationFrame(animateGlow);
    };

    const handleReducedMotionChange = () => {
      stopGlowAnimation();

      if (reducedMotionQuery.matches) {
        currentX = window.innerWidth / 2;
        currentY = window.innerHeight / 2;
        targetX = currentX;
        targetY = currentY;
        writeGlowPosition(currentX, currentY);
        return;
      }

      queueGlowUpdate();
    };

    writeGlowPosition(currentX, currentY);
    updateScroll();
    queueGlowUpdate();

    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", updateScroll, { passive: true });
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("scroll", updateScroll);
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
      stopGlowAnimation();
    };
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
        <div className="cinematic-bg__glow"></div>
      </div>

      <Navigation
        brand={shell.brand}
        company={shell.company}
        navigationItems={shell.navigationItems}
        onToggleTheme={toggleTheme}
        pathname={pathname}
        theme={theme}
      />

      <ShellStatusNotice isVisible={shell.isDegraded && shell.isUsingFallback} />

      <main id="top" className="site-main">
        {page}
      </main>

      <Footer
        brand={shell.brand}
        company={shell.company}
        footer={shell.footer}
        theme={theme}
      />

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
```

### `apps/public/src/components/Navigation.tsx`

```tsx
import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
} from "react";
import { normalizePathname, routes } from "../routes";
import type { BrandAssets, CompanyInfo, NavigationItem, Theme } from "../types";
import {
  findNavigationLinksByTitle,
  getNavigationColumns,
  getNavigationRoot,
  getPrimaryLinks,
} from "../utils/navigation";

interface NavigationProps {
  brand: BrandAssets;
  company: CompanyInfo;
  navigationItems: NavigationItem[];
  pathname: string;
  theme: Theme;
  onToggleTheme: () => void;
}

type MenuKey = "services" | "resources";

interface MenuItem {
  label: string;
  href: string;
}

interface MenuColumn {
  title: string;
  items: MenuItem[];
  borderLeft?: boolean;
}

function getFocusableElements(node: HTMLElement) {
  return Array.from(
    node.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute("disabled"));
}

const navigationStyles = String.raw`
.nav-shell,
.nav-shell__mobile{
  --nav-mono:ui-monospace,"SFMono-Regular","Menlo","Monaco","Consolas","Liberation Mono","Courier New",monospace;
  --nav-sans:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  --nav-ease:cubic-bezier(.25,1,.25,1);
  --nav-shell-surface:rgba(247,247,244,.9);
  --nav-shell-border:rgba(15,92,99,.12);
  --nav-shell-shadow:0 20px 48px rgba(8,24,27,.14);
  --nav-pill-bg:var(--color-accent-soft);
  --nav-pill-border:var(--color-border-soft);
  --nav-pill-text:var(--color-text-muted);
  --nav-pill-active-bg:rgba(15,92,99,.14);
  --nav-pill-active-text:var(--color-text);
  --nav-glass-bg:rgba(247,247,244,.98);
  --nav-glass-border:rgba(15,92,99,.16);
  --nav-glass-shadow:0 26px 60px rgba(8,24,27,.18);
  --nav-muted-text:var(--color-text-soft);
  --nav-primary-text:var(--color-text);
  --nav-divider:var(--color-border-soft);
  --nav-hover-surface:rgba(15,92,99,.06);
  --nav-secondary-border:var(--color-border-soft);
  --nav-secondary-text:var(--color-text);
  --nav-secondary-hover:rgba(15,92,99,.08);
  --nav-primary-cta-bg:var(--color-accent);
  --nav-primary-cta-text:var(--color-accent-contrast);
  --nav-primary-cta-hover:var(--color-accent-hover);
  --nav-utility-bg:rgba(247,247,244,.92);
  --nav-utility-bg-hover:rgba(247,247,244,.98);
  --nav-utility-border:var(--color-border-soft);
  --nav-utility-text:var(--color-text);
  --nav-mobile-card-bg:rgba(247,247,244,.9);
  --nav-mobile-card-border:var(--color-border-soft);
  --nav-mobile-overlay:var(--color-overlay);
}

html[data-theme="dark"] .nav-shell,
html[data-theme="dark"] .nav-shell__mobile,
.nav-shell[data-theme="dark"],
.nav-shell__mobile[data-theme="dark"]{
  --nav-shell-surface:rgba(7,21,24,.88);
  --nav-shell-border:rgba(127,188,193,.16);
  --nav-shell-shadow:0 20px 48px rgba(0,0,0,.36);
  --nav-pill-bg:var(--color-accent-soft);
  --nav-pill-border:var(--color-border-soft);
  --nav-pill-text:var(--color-text-muted);
  --nav-pill-active-bg:var(--color-accent);
  --nav-pill-active-text:var(--color-accent-contrast);
  --nav-glass-bg:rgba(7,21,24,.97);
  --nav-glass-border:rgba(127,188,193,.2);
  --nav-glass-shadow:0 28px 64px rgba(0,0,0,.42);
  --nav-muted-text:var(--color-text-soft);
  --nav-primary-text:var(--color-text);
  --nav-divider:var(--color-border-soft);
  --nav-hover-surface:rgba(127,188,193,.1);
  --nav-secondary-border:var(--color-border-soft);
  --nav-secondary-text:var(--color-text);
  --nav-secondary-hover:rgba(127,188,193,.12);
  --nav-primary-cta-bg:var(--color-accent);
  --nav-primary-cta-text:var(--color-accent-contrast);
  --nav-primary-cta-hover:var(--color-accent-hover);
  --nav-utility-bg:rgba(11,31,35,.92);
  --nav-utility-bg-hover:rgba(17,43,48,.96);
  --nav-utility-border:var(--color-border-soft);
  --nav-utility-text:var(--color-text);
  --nav-mobile-card-bg:rgba(11,31,35,.9);
  --nav-mobile-card-border:var(--color-border-soft);
  --nav-mobile-overlay:var(--color-overlay);
}

.nav-shell{
  position:fixed;
  inset:0 0 auto 0;
  z-index:50;
  padding:0;
  font-family:var(--nav-sans);
}

.nav-shell__mobile{
  font-family:var(--nav-sans);
}

.nav-shell *,
.nav-shell__mobile *{
  box-sizing:border-box;
}

.nav-shell button,
.nav-shell__mobile button{
  font:inherit;
  border:0;
  padding:0;
  background:none;
}

.nav-shell__bar{
  position:relative;
  width:100%;
  margin:0;
  display:grid;
  grid-template-columns:auto minmax(0,1fr) auto;
  align-items:center;
  gap:12px;
  padding:12px 16px;
}

.nav-shell__bar::before{
  content:"";
  position:absolute;
  inset:0;
  border-radius:0;
  border:1px solid var(--nav-shell-border);
  background:var(--nav-shell-surface);
  box-shadow:var(--nav-shell-shadow);
  backdrop-filter:blur(18px) saturate(150%);
  -webkit-backdrop-filter:blur(18px) saturate(150%);
  pointer-events:none;
}

.nav-shell__bar > *{
  position:relative;
  z-index:1;
}

.nav-shell__brand{
  display:inline-flex;
  align-items:center;
  flex-shrink:0;
  padding:0 8px;
  text-decoration:none;
}

.nav-shell__logo{
  display:block;
  height:36px;
  width:auto;
  filter:drop-shadow(0 6px 18px rgba(8,24,27,.14));
}

.nav-shell__logo--dark{
  display:none;
}

html[data-theme="dark"] .nav-shell__logo--light{
  display:none;
}

html[data-theme="dark"] .nav-shell__logo--dark{
  display:block;
}

.nav-shell__desktop{
  display:none;
  min-width:0;
  justify-content:center;
  justify-self:center;
  padding-inline:12px;
}

.nav-shell__pill{
  display:inline-flex;
  align-items:center;
  height:44px;
  padding:3.2px;
  border-radius:11.2px;
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  background:var(--nav-pill-bg);
  border:1px solid var(--nav-pill-border);
}

.nav-shell__pill,
.nav-shell__tab,
.nav-shell__link,
.nav-shell__trigger,
.nav-shell__chevron,
.nav-shell__menu,
.nav-shell__menu-card,
.nav-shell__menu-column,
.nav-shell__menu-link,
.nav-shell__menu-footer,
.nav-shell__cta-primary,
.nav-shell__cta-secondary,
.tutorial-toggle,
.tutorial-toggle__orb,
.tutorial-toggle__icon,
.nav-shell__call-button,
.nav-shell__call-label,
.nav-shell__call-number,
.nav-shell__toggle,
.nav-shell__mobile,
.nav-shell__mobile-backdrop,
.nav-shell__mobile-panel,
.nav-shell__mobile-quick-link,
.nav-shell__mobile-card,
.nav-shell__mobile-card-title,
.nav-shell__mobile-card-link,
.nav-shell__mobile-card-primary,
.nav-shell__mobile-card-secondary,
.nav-shell__mobile-bottom-link,
.nav-shell__mobile-bottom-label,
.nav-shell__mobile-bottom-number{
  transition:
    background-color .3s ease,
    border-color .3s ease,
    color .3s ease,
    box-shadow .3s ease,
  opacity .3s ease,
  transform .3s var(--nav-ease);
}

.nav-shell__tab,
a.nav-shell__tab.nav-shell__link,
.nav-shell__tab.nav-shell__trigger{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  flex:0 0 auto;
  gap:6px;
  height:36px;
  padding:0 14.4px;
  border-radius:7.2px;
  background:transparent;
  font-family:var(--nav-mono);
  font-size:11.52px;
  font-weight:700;
  letter-spacing:.045em;
  text-transform:uppercase;
  text-decoration:none;
  white-space:nowrap;
  line-height:1;
  color:var(--nav-pill-text);
  cursor:pointer;
  appearance:none;
  -webkit-appearance:none;
}

.nav-shell__trigger{
  border:0;
  background:transparent;
}

.nav-shell__tab:hover,
.nav-shell__tab:focus-visible,
.nav-shell__tab[data-active="true"]{
  background:var(--nav-pill-active-bg);
  color:var(--nav-pill-active-text);
  box-shadow:0 1px 3px rgba(0,0,0,.1);
  outline:none;
}

.nav-shell__dropdown{
  position:relative;
  display:flex;
  align-items:center;
  flex:0 0 auto;
  height:100%;
}

.nav-shell__chevron{
  width:12px;
  height:12px;
  opacity:.6;
}

.nav-shell__tab:hover .nav-shell__chevron,
.nav-shell__tab:focus-visible .nav-shell__chevron,
.nav-shell__tab[data-active="true"] .nav-shell__chevron{
  opacity:1;
}

.nav-shell__trigger[aria-expanded="true"] .nav-shell__chevron,
.nav-shell__trigger[data-open="true"] .nav-shell__chevron{
  transform:rotate(-180deg);
}

.nav-shell__menu{
  position:absolute;
  top:100%;
  left:50%;
  transform:translateX(-50%) translateY(8px);
  width:520px;
  padding-top:13.6px;
  visibility:hidden;
  opacity:0;
  pointer-events:none;
  z-index:100;
}

.nav-shell__menu[data-open="true"]{
  visibility:visible;
  opacity:1;
  pointer-events:auto;
  transform:translateX(-50%) translateY(0);
}

.nav-shell__menu--services{
  width:780px;
}

.nav-shell__menu-card,
.nav-shell__mobile-panel{
  font-family:var(--nav-sans);
  text-transform:none;
  letter-spacing:normal;
  backdrop-filter:blur(30px) saturate(155%);
  -webkit-backdrop-filter:blur(30px) saturate(155%);
  background:var(--nav-glass-bg);
  border:1px solid var(--nav-glass-border);
  box-shadow:var(--nav-glass-shadow);
}

.nav-shell__menu-card{
  padding:20px;
  border-radius:22px;
}

.nav-shell__menu-grid{
  display:grid;
  gap:24px;
}

.nav-shell__menu-grid--services{
  grid-template-columns:repeat(3,minmax(0,1fr));
}

.nav-shell__menu-grid--resources{
  grid-template-columns:repeat(2,minmax(0,1fr));
}

.nav-shell__menu-column{
  display:flex;
  flex-direction:column;
  gap:10px;
}

.nav-shell__menu-column[data-border="true"]{
  padding-left:24px;
  border-left:1px solid var(--nav-divider);
}

.nav-shell__menu-title{
  margin:0;
  font-family:var(--nav-sans);
  font-size:12px;
  font-weight:700;
  letter-spacing:.05em;
  text-transform:uppercase;
  color:var(--nav-muted-text);
}

.nav-shell__menu-list{
  display:flex;
  flex-direction:column;
  gap:4px;
  margin:0;
  padding:0;
  list-style:none;
}

.nav-shell__menu-link{
  display:block;
  margin:0 -12px;
  padding:6px 12px;
  border-radius:12px;
  font-family:var(--nav-sans);
  font-size:14px;
  font-weight:600;
  line-height:1.45;
  text-decoration:none;
  color:var(--nav-primary-text);
}

.nav-shell__menu-link:hover,
.nav-shell__menu-link:focus-visible{
  background:var(--nav-hover-surface);
  outline:none;
}

.nav-shell__menu-footer{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  justify-content:space-between;
  gap:12px;
  margin-top:20px;
  padding-top:16px;
  border-top:1px solid var(--nav-divider);
}

.nav-shell__cta-primary,
.nav-shell__cta-secondary{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:8px 16px;
  border-radius:12px;
  font-family:var(--nav-sans);
  font-size:12px;
  font-weight:700;
  letter-spacing:.12em;
  text-transform:uppercase;
  text-decoration:none;
}

.nav-shell__cta-primary{
  background:var(--nav-primary-cta-bg);
  color:var(--nav-primary-cta-text);
}

.nav-shell__cta-primary:hover,
.nav-shell__cta-primary:focus-visible{
  background:var(--nav-primary-cta-hover);
  outline:none;
}

.nav-shell__cta-secondary{
  border:1px solid var(--nav-secondary-border);
  color:var(--nav-secondary-text);
}

.nav-shell__cta-secondary:hover,
.nav-shell__cta-secondary:focus-visible{
  background:var(--nav-secondary-hover);
  outline:none;
}

.nav-shell__actions{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  flex-wrap:nowrap;
  gap:8px;
  flex-shrink:0;
  min-width:max-content;
  padding-right:8px;
}

.tutorial-toggle.nav-shell__theme-desktop{
  display:none;
}

.tutorial-toggle.nav-shell__theme-mobile{
  display:flex;
}

.tutorial-toggle{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  width:48px;
  height:48px;
  border-radius:14px;
  background:rgba(246,239,225,.72);
  border:1px solid rgba(0,0,0,.08);
  box-shadow:0 10px 24px rgba(9,68,73,.08), inset 0 1px 0 rgba(248,242,232,.72);
  cursor:pointer;
  font-family:var(--nav-sans);
  color:#0c6069;
  backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px);
}

.tutorial-toggle--mobile{
  width:44px;
  height:44px;
  border-radius:12px;
}

html[data-theme="dark"] .tutorial-toggle,
.tutorial-toggle[data-theme="dark"]{
  background:linear-gradient(180deg, rgba(5,25,28,.96), rgba(1,14,17,.98));
  border-color:rgba(87,184,196,.18);
  box-shadow:0 12px 30px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.04);
  color:#e9feff;
}

.tutorial-toggle:hover,
.tutorial-toggle:focus-visible{
  transform:translateY(-1px);
  border-color:rgba(9,68,73,.18);
  outline:none;
}

html[data-theme="dark"] .tutorial-toggle:hover,
html[data-theme="dark"] .tutorial-toggle:focus-visible,
.tutorial-toggle[data-theme="dark"]:hover,
.tutorial-toggle[data-theme="dark"]:focus-visible{
  border-color:rgba(111,232,245,.28);
}

.tutorial-toggle__orb{
  display:flex;
  align-items:center;
  justify-content:center;
  width:34px;
  height:34px;
  border-radius:12px;
  background:rgba(9,68,73,.08);
  box-shadow:inset 0 1px 0 rgba(248,242,232,.6);
}

.tutorial-toggle--mobile .tutorial-toggle__orb{
  width:30px;
  height:30px;
  border-radius:10px;
}

html[data-theme="dark"] .tutorial-toggle__orb,
.tutorial-toggle[data-theme="dark"] .tutorial-toggle__orb{
  background:rgba(71,185,197,.1);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.06);
}

.tutorial-toggle__icon{
  position:absolute;
  width:18px;
  height:18px;
  transition:opacity .24s ease, transform .24s var(--nav-ease);
}

.tutorial-toggle__icon--sun{
  opacity:1;
  transform:scale(1) rotate(0deg);
}

.tutorial-toggle__icon--moon{
  opacity:0;
  transform:scale(.72) rotate(-18deg);
}

html[data-theme="dark"] .tutorial-toggle__icon--sun,
.tutorial-toggle[data-theme="dark"] .tutorial-toggle__icon--sun{
  opacity:0;
  transform:scale(.72) rotate(18deg);
}

html[data-theme="dark"] .tutorial-toggle__icon--moon,
.tutorial-toggle[data-theme="dark"] .tutorial-toggle__icon--moon{
  opacity:1;
  transform:scale(1) rotate(0deg);
}

.nav-shell__call-button{
  display:none;
  align-items:center;
  flex:0 0 auto;
  gap:12px;
  height:44px;
  padding:4px 18px 4px 8px;
  border-radius:16px;
  position:relative;
  overflow:hidden;
  backdrop-filter:blur(12px);
  -webkit-backdrop-filter:blur(12px);
  background:rgba(246,239,225,.82);
  border:1px solid rgba(0,0,0,.08);
  box-shadow:0 14px 30px rgba(9,68,73,.12), inset 0 1px 0 rgba(248,242,232,.74);
  text-decoration:none;
  white-space:nowrap;
}

.nav-shell__call-button::after{
  content:"";
  position:absolute;
  top:-40%;
  bottom:-40%;
  left:-58%;
  width:42%;
  background:linear-gradient(90deg, transparent, rgba(111,232,245,.18), transparent);
  transform:skewX(-22deg);
  animation:call-shimmer 4.5s linear infinite;
}

.nav-shell__call-button:hover,
.nav-shell__call-button:focus-visible{
  transform:translateY(-1px);
  border-color:rgba(12,96,105,.16);
  box-shadow:0 18px 36px rgba(9,68,73,.16), inset 0 1px 0 rgba(248,242,232,.8);
  outline:none;
}

.nav-shell__call-icon{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  width:36px;
  height:36px;
  border-radius:999px;
  background:linear-gradient(180deg, var(--color-accent-secondary), var(--color-accent));
  color:var(--color-accent-contrast);
  box-shadow:0 10px 18px rgba(15,92,99,.24);
  z-index:1;
}

.nav-shell__call-icon::after{
  content:"";
  position:absolute;
  inset:-5px;
  border-radius:inherit;
  border:1px solid rgba(127,188,193,.4);
  opacity:0;
  animation:call-ping 1.85s ease-out infinite;
}

.nav-shell__call-icon svg{
  width:14px;
  height:14px;
}

.nav-shell__call-copy{
  display:flex;
  flex-direction:column;
  min-width:max-content;
  text-align:left;
  white-space:nowrap;
  position:relative;
  z-index:1;
}

.nav-shell__call-label{
  margin-bottom:2px;
  font-family:var(--nav-mono);
  font-size:8.8px;
  font-weight:700;
  line-height:1;
  letter-spacing:.05em;
  text-transform:uppercase;
  color:var(--nav-muted-text);
}

.nav-shell__call-number{
  display:block;
  font-family:var(--nav-sans);
  font-size:12.8px;
  font-weight:800;
  line-height:1.05;
  letter-spacing:.01em;
  white-space:nowrap;
  color:var(--nav-primary-text);
}

html[data-theme="dark"] .nav-shell__call-button,
.nav-shell[data-theme="dark"] .nav-shell__call-button{
  background:rgba(15,34,38,.78);
  border-color:var(--nav-secondary-border);
  box-shadow:0 14px 30px rgba(0,0,0,.18), inset 0 1px 0 rgba(237,244,242,.08);
}

html[data-theme="dark"] .nav-shell__call-button:hover,
html[data-theme="dark"] .nav-shell__call-button:focus-visible,
.nav-shell[data-theme="dark"] .nav-shell__call-button:hover,
.nav-shell[data-theme="dark"] .nav-shell__call-button:focus-visible{
  border-color:rgba(12,96,105,.16);
  box-shadow:0 18px 36px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.64);
}

html[data-theme="dark"] .nav-shell__call-label,
.nav-shell[data-theme="dark"] .nav-shell__call-label{
  color:var(--nav-muted-text);
}

html[data-theme="dark"] .nav-shell__call-number,
.nav-shell[data-theme="dark"] .nav-shell__call-number{
  color:var(--nav-primary-text);
}

.nav-shell__toggle{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:44px;
  height:44px;
  border-radius:12px;
  border:1px solid var(--nav-utility-border);
  backdrop-filter:blur(2px);
  -webkit-backdrop-filter:blur(2px);
  background:var(--nav-utility-bg);
  color:var(--nav-utility-text);
  box-shadow:0 1px 2px rgba(8,24,27,.08);
  cursor:pointer;
}

.nav-shell__toggle:hover,
.nav-shell__toggle:focus-visible{
  background:var(--nav-utility-bg-hover);
  outline:none;
}

.nav-shell__toggle.is-open{
  background:var(--nav-primary-cta-bg);
  color:var(--nav-primary-cta-text);
  border-color:transparent;
  box-shadow:0 10px 25px rgba(8,24,27,.2);
}

html[data-theme="dark"] .nav-shell__toggle{
  border-color:var(--nav-utility-border);
  background:var(--nav-utility-bg);
  color:var(--nav-utility-text);
}

html[data-theme="dark"] .nav-shell__toggle:hover,
html[data-theme="dark"] .nav-shell__toggle:focus-visible{
  background:var(--nav-utility-bg-hover);
}

.nav-shell__toggle svg{
  width:24px;
  height:24px;
}

.nav-shell__toggle-icon--close{
  display:none;
}

.nav-shell__toggle.is-open .nav-shell__toggle-icon--menu{
  display:none;
}

.nav-shell__toggle.is-open .nav-shell__toggle-icon--close{
  display:block;
}

.nav-shell__mobile{
  position:fixed;
  inset:0;
  z-index:60;
  visibility:hidden;
  opacity:0;
  pointer-events:none;
}

.nav-shell__mobile[data-open="true"]{
  visibility:visible;
  opacity:1;
  pointer-events:auto;
}

.nav-shell__mobile-backdrop{
  position:absolute;
  inset:0;
  background:var(--nav-mobile-overlay);
  backdrop-filter:blur(2px);
  -webkit-backdrop-filter:blur(2px);
  opacity:0;
}

.nav-shell__mobile[data-open="true"] .nav-shell__mobile-backdrop{
  opacity:1;
}

.nav-shell__mobile-wrap{
  position:relative;
  display:flex;
  min-height:100%;
  align-items:flex-start;
  justify-content:flex-end;
  padding:84px 16px 16px;
  pointer-events:none;
}

.nav-shell__mobile-panel{
  position:relative;
  width:100%;
  max-width:24rem;
  max-height:calc(100dvh - 6.25rem);
  overflow-y:auto;
  border-radius:24px;
  padding:16px;
  pointer-events:auto;
  box-shadow:var(--nav-glass-shadow);
  transform:translateX(28px) scale(.985);
  opacity:0;
}

.nav-shell__mobile[data-open="true"] .nav-shell__mobile-panel{
  transform:translateX(0) scale(1);
  opacity:1;
}

.nav-shell__mobile-grid{
  display:grid;
  gap:20px;
}

.nav-shell__mobile-quick-links{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr));
  gap:8px;
}

.nav-shell__mobile-quick-link{
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:12px;
  padding:12px 8px;
  font-family:var(--nav-sans);
  font-size:12.48px;
  font-weight:700;
  text-decoration:none;
  color:var(--nav-primary-text);
}

.nav-shell__mobile-quick-link:hover,
.nav-shell__mobile-quick-link:focus-visible{
  background:var(--nav-hover-surface);
  outline:none;
}

.nav-shell__mobile-card{
  border-radius:16px;
  border:1px solid var(--nav-mobile-card-border);
  background:var(--nav-mobile-card-bg);
  padding:16px;
}

.nav-shell__mobile-card-title{
  margin:0;
  font-family:var(--nav-sans);
  font-size:11.2px;
  font-weight:700;
  letter-spacing:.16em;
  text-transform:uppercase;
  color:var(--nav-muted-text);
}

.nav-shell__mobile-card-links{
  display:grid;
  gap:8px;
  margin-top:12px;
}

.nav-shell__mobile-card-link{
  display:block;
  padding:8px 12px;
  border-radius:12px;
  font-family:var(--nav-sans);
  font-size:14px;
  font-weight:600;
  text-decoration:none;
  color:var(--nav-primary-text);
}

.nav-shell__mobile-card-link:hover,
.nav-shell__mobile-card-link:focus-visible{
  background:var(--nav-hover-surface);
  outline:none;
}

.nav-shell__mobile-card-actions{
  display:grid;
  gap:8px;
  margin-top:16px;
}

.nav-shell__mobile-card-primary,
.nav-shell__mobile-card-secondary,
.nav-shell__mobile-bottom-link{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  text-decoration:none;
}

.nav-shell__mobile-card-primary{
  padding:8px 16px;
  border-radius:12px;
  background:var(--nav-primary-cta-bg);
  color:var(--nav-primary-cta-text);
  font-family:var(--nav-sans);
  font-size:11.2px;
  font-weight:700;
  letter-spacing:.12em;
  text-transform:uppercase;
}

.nav-shell__mobile-card-primary:hover,
.nav-shell__mobile-card-primary:focus-visible{
  background:var(--nav-primary-cta-hover);
  outline:none;
}

.nav-shell__mobile-card-secondary{
  padding:8px 16px;
  border-radius:12px;
  border:1px solid var(--nav-secondary-border);
  color:var(--nav-secondary-text);
  font-family:var(--nav-sans);
  font-size:11.2px;
  font-weight:700;
  letter-spacing:.12em;
  text-transform:uppercase;
}

.nav-shell__mobile-card-secondary:hover,
.nav-shell__mobile-card-secondary:focus-visible{
  background:var(--nav-secondary-hover);
  outline:none;
}

.nav-shell__mobile-bottom{
  display:grid;
  gap:12px;
}

.nav-shell__mobile-bottom-link{
  flex-direction:column;
  padding:12px 16px;
  border-radius:12px;
  border:1px solid var(--nav-secondary-border);
  color:var(--nav-secondary-text);
}

.nav-shell__mobile-bottom-link:hover,
.nav-shell__mobile-bottom-link:focus-visible{
  background:var(--nav-secondary-hover);
  outline:none;
}

.nav-shell__mobile-bottom-label{
  font-family:var(--nav-mono);
  font-size:10.88px;
  font-weight:700;
  letter-spacing:.14em;
  text-transform:uppercase;
  color:var(--nav-muted-text);
}

.nav-shell__mobile-bottom-number{
  margin-top:4px;
  font-family:var(--nav-sans);
  font-size:16px;
  font-weight:800;
  color:var(--nav-secondary-text);
}

.nav-shell__sr-only{
  position:absolute;
  width:1px;
  height:1px;
  padding:0;
  margin:-1px;
  overflow:hidden;
  clip:rect(0,0,0,0);
  white-space:nowrap;
  border:0;
}

@keyframes phone-ring{
  0%,100%{transform:rotate(0)}
  10%{transform:rotate(15deg)}
  20%{transform:rotate(-10deg)}
  30%{transform:rotate(15deg)}
  40%{transform:rotate(-10deg)}
  50%{transform:rotate(0)}
}

@keyframes call-ping{
  0%{transform:scale(.92);opacity:0}
  30%{opacity:.7}
  100%{transform:scale(1.42);opacity:0}
}

@keyframes call-shimmer{
  0%{transform:translateX(0) skewX(-22deg)}
  100%{transform:translateX(420%) skewX(-22deg)}
}

.animate-ring{
  animation:phone-ring 2s ease-in-out infinite;
  transform-origin:center;
}

@media (min-width:640px){
  .nav-shell__actions{gap:12px}
  .nav-shell__mobile-wrap{padding:88px 20px 16px}
  .nav-shell__mobile-card-actions{grid-template-columns:repeat(2,minmax(0,1fr))}
  .nav-shell__mobile-panel{max-width:25rem;padding:20px}
}

@media (min-width:768px){
  .tutorial-toggle.nav-shell__theme-desktop{display:flex}
  .tutorial-toggle.nav-shell__theme-mobile{display:none}
  .nav-shell__mobile-panel{max-width:27rem;max-height:calc(100dvh - 6.75rem)}
}

@media (min-width:1280px){
  .nav-shell{padding:0}
  .nav-shell__desktop{display:flex}
  .nav-shell__toggle{display:none}
  .nav-shell__mobile{display:none!important}
}

@media (min-width:1280px) and (max-width:1399px){
  .nav-shell__bar{grid-template-columns:auto minmax(0,1fr) auto;gap:8px}
  .nav-shell__desktop{justify-self:stretch;padding-inline:8px}
  .nav-shell__pill{max-width:100%}
  .nav-shell__tab{padding:0 12px}
  .nav-shell__actions{justify-self:end;gap:8px;padding-right:0}
  .nav-shell__call-button{display:none}
}

@media (min-width:1400px){
  .nav-shell__bar{grid-template-columns:minmax(0,1fr) auto minmax(0,1fr)}
  .nav-shell__brand{justify-self:start}
  .nav-shell__desktop{justify-self:center;padding-inline:0}
  .nav-shell__actions{justify-self:end}
  .nav-shell__call-button{display:flex}
}
`;

function renderThemeToggle(className: string, theme: Theme, onToggleTheme: () => void) {
  return (
    <button
      className={className}
      type="button"
      data-theme={theme}
      aria-pressed={theme === "dark"}
      onClick={onToggleTheme}
      aria-label={`Toggle theme. Current theme is ${theme}.`}
    >
      <span className="tutorial-toggle__orb" aria-hidden="true">
        <svg className="tutorial-toggle__icon tutorial-toggle__icon--sun" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M10 2a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1Zm4.22 3.22a1 1 0 0 1 1.415 0l.707.707a1 1 0 0 1-1.414 1.414l-.707-.707a1 1 0 0 1 0-1.414ZM18 10a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1Zm-3.78 5.364a1 1 0 0 1 0 1.414l-.707.707a1 1 0 0 1-1.414-1.414l.707-.707a1 1 0 0 1 1.414 0ZM10 18a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm-4.22-3.22a1 1 0 0 1-1.415 0l-.707-.707a1 1 0 0 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414ZM2 10a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H3a1 1 0 0 1-1-1Zm1.78-4.586a1 1 0 0 1 0-1.414l.707-.707A1 1 0 0 1 5.903 4.72l-.707.707a1 1 0 0 1-1.414 0ZM10 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
            clipRule="evenodd"
          />
        </svg>
        <svg className="tutorial-toggle__icon tutorial-toggle__icon--moon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 0 1 6.707 2.707a8 8 0 1 0 10.586 10.586Z" />
        </svg>
      </span>
    </button>
  );
}

function renderMenuColumns(columns: MenuColumn[], onNavigate: () => void) {
  return columns.map((column) => (
    <div
      key={column.title}
      className="nav-shell__menu-column"
      data-border={column.borderLeft ? "true" : undefined}
    >
      <h3 className="nav-shell__menu-title">{column.title}</h3>
      <ul className="nav-shell__menu-list">
        {column.items.map((item) => (
          <li key={item.href}>
            <a className="nav-shell__menu-link" href={item.href} onClick={onNavigate}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  ));
}

function getHrefPath(href: string) {
  return normalizePathname(href.split("#")[0]);
}

export function Navigation({
  brand,
  company,
  navigationItems,
  pathname,
  theme,
  onToggleTheme,
}: NavigationProps) {
  const headerRef = useRef<HTMLElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const servicesMenuId = useId();
  const resourcesMenuId = useId();
  const mobileMenuId = useId();

  const currentPath = normalizePathname(pathname);
  const [desktopMenu, setDesktopMenu] = useState<MenuKey | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const servicesRoot = getNavigationRoot(navigationItems, "Services");
  const resourcesRoot = getNavigationRoot(navigationItems, "Resources");
  const desktopLinks = getPrimaryLinks(navigationItems);
  const servicesColumns = getNavigationColumns(servicesRoot) as MenuColumn[];
  const resourcesColumns = getNavigationColumns(resourcesRoot) as MenuColumn[];
  const mobileServices = findNavigationLinksByTitle(
    servicesRoot ? [servicesRoot] : navigationItems,
    [
      "Company Registration",
      "TIN Application",
      "Business License Applications",
    ]
  );
  const mobileResources = findNavigationLinksByTitle(navigationItems, [
    "Blog",
    "FAQ",
  ]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty("--header-height", `${header.offsetHeight}px`);
    };

    syncHeaderHeight();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(syncHeaderHeight);
      observer.observe(header);

      return () => {
        observer.disconnect();
        document.documentElement.style.setProperty("--header-height", "0px");
      };
    }

    window.addEventListener("resize", syncHeaderHeight);

    return () => {
      window.removeEventListener("resize", syncHeaderHeight);
      document.documentElement.style.setProperty("--header-height", "0px");
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const panel = mobilePanelRef.current;
    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    if (!panel) {
      return;
    }

    const focusableElements = getFocusableElements(panel);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (firstElement) {
      firstElement.focus();
    } else {
      panel.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return;
      }

      if (!focusableElements.length) {
        event.preventDefault();
        panel.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      if (
        previousActiveElement &&
        typeof previousActiveElement.focus === "function"
      ) {
        previousActiveElement.focus();
      } else {
        mobileToggleRef.current?.focus();
      }
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleViewportChange = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
      setDesktopMenu(null);
    };

    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDesktopMenu(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setDesktopMenu(null);
    setMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => getHrefPath(href) === currentPath;
  const servicesActive = currentPath === normalizePathname(routes.services);
  const resourcesActive = currentPath === normalizePathname(routes.resources);
  const primaryPhone = company.phones[0];
  const callHref = primaryPhone
    ? `tel:${primaryPhone.replace(/\s+/g, "")}`
    : routes.contact;

  const closeAllMenus = () => {
    setDesktopMenu(null);
    setMobileMenuOpen(false);
  };

  const handleDropdownBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }
    setDesktopMenu(null);
  };

  return (
    <>
      <style>{navigationStyles}</style>

      <header ref={headerRef} className="nav-shell" data-theme={theme}>
        <div className="nav-shell__bar">
          <a className="nav-shell__brand" href={routes.home} onClick={closeAllMenus}>
            <img
              className="nav-shell__logo nav-shell__logo--light"
              src={brand.lightLogoSrc}
              alt={brand.name}
            />
            <img
              className="nav-shell__logo nav-shell__logo--dark"
              src={brand.darkLogoSrc}
              alt=""
              aria-hidden="true"
            />
          </a>

          <div className="nav-shell__desktop">
            <nav className="nav-shell__pill" aria-label="Primary navigation">
              {desktopLinks.slice(0, 2).map((link) => (
                <a
                  key={link.href}
                  className="nav-shell__tab nav-shell__link"
                  href={link.href}
                  data-active={isActive(link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={closeAllMenus}
                >
                  {link.label}
                </a>
              ))}

              <div
                className="nav-shell__dropdown"
                onMouseEnter={() => setDesktopMenu("services")}
                onMouseLeave={() => setDesktopMenu(null)}
                onFocusCapture={() => setDesktopMenu("services")}
                onBlur={handleDropdownBlur}
              >
                <a
                  className="nav-shell__tab nav-shell__trigger"
                  href={routes.services}
                  data-active={servicesActive}
                  data-open={desktopMenu === "services" ? "true" : undefined}
                  aria-expanded={desktopMenu === "services"}
                  aria-controls={servicesMenuId}
                  aria-current={servicesActive ? "page" : undefined}
                  onClick={closeAllMenus}
                >
                  Services
                  <svg className="nav-shell__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>

                <div
                  id={servicesMenuId}
                  className="nav-shell__menu nav-shell__menu--services"
                  data-open={desktopMenu === "services"}
                  aria-hidden={desktopMenu !== "services"}
                >
                  <div className="nav-shell__menu-card">
                    <div className="nav-shell__menu-grid nav-shell__menu-grid--services">
                      {renderMenuColumns(servicesColumns, closeAllMenus)}
                    </div>
                    <div className="nav-shell__menu-footer">
                      <a className="nav-shell__cta-primary" href={routes.services} onClick={closeAllMenus}>
                        See More Services
                      </a>
                      <a className="nav-shell__cta-secondary" href={routes.contact} onClick={closeAllMenus}>
                        Contact Exxonim
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="nav-shell__dropdown"
                onMouseEnter={() => setDesktopMenu("resources")}
                onMouseLeave={() => setDesktopMenu(null)}
                onFocusCapture={() => setDesktopMenu("resources")}
                onBlur={handleDropdownBlur}
              >
                <a
                  className="nav-shell__tab nav-shell__trigger"
                  href={routes.resources}
                  data-active={resourcesActive}
                  data-open={desktopMenu === "resources" ? "true" : undefined}
                  aria-expanded={desktopMenu === "resources"}
                  aria-controls={resourcesMenuId}
                  aria-current={resourcesActive ? "page" : undefined}
                  onClick={closeAllMenus}
                >
                  Resources
                  <svg className="nav-shell__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </a>

                <div
                  id={resourcesMenuId}
                  className="nav-shell__menu"
                  data-open={desktopMenu === "resources"}
                  aria-hidden={desktopMenu !== "resources"}
                >
                  <div className="nav-shell__menu-card">
                    <div className="nav-shell__menu-grid nav-shell__menu-grid--resources">
                      {renderMenuColumns(resourcesColumns, closeAllMenus)}
                    </div>
                    <div className="nav-shell__menu-footer">
                      <a className="nav-shell__cta-primary" href={routes.resources} onClick={closeAllMenus}>
                        See More
                      </a>
                      <a className="nav-shell__cta-secondary" href={routes.contact} onClick={closeAllMenus}>
                        Ask a Question
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {desktopLinks.slice(2).map((link) => (
                <a
                  key={link.href}
                  className="nav-shell__tab nav-shell__link"
                  href={link.href}
                  data-active={isActive(link.href)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  onClick={closeAllMenus}
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="nav-shell__actions">
            {renderThemeToggle("tutorial-toggle nav-shell__theme-desktop", theme, onToggleTheme)}
            {renderThemeToggle("tutorial-toggle tutorial-toggle--mobile nav-shell__theme-mobile", theme, onToggleTheme)}

            <a className="nav-shell__call-button" href={callHref}>
              <div className="nav-shell__call-icon">
                <svg className="animate-ring" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 0 1 2-2h3.28a1 1 0 0 1 .948.684l1.498 4.493a1 1 0 0 1-.502 1.21l-2.257 1.13a11.042 11.042 0 0 0 5.516 5.516l1.13-2.257a1 1 0 0 1 1.21-.502l4.493 1.498a1 1 0 0 1 .684.949V19a2 2 0 0 1-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div className="nav-shell__call-copy">
                <span className="nav-shell__call-label">
                  {primaryPhone ? "Call Now" : "Contact Exxonim"}
                </span>
                <span className="nav-shell__call-number">
                  {primaryPhone || "Open the contact page"}
                </span>
              </div>
            </a>

            <button
              ref={mobileToggleRef}
              className={`nav-shell__toggle${mobileMenuOpen ? " is-open" : ""}`}
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls={mobileMenuId}
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              onClick={() => {
                setDesktopMenu(null);
                setMobileMenuOpen((open) => !open);
              }}
            >
              <span className="nav-shell__sr-only">Toggle navigation</span>

              <svg
                className="nav-shell__toggle-icon--menu"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M 7 10 h 18 M 7 16 h 18 M 7 22 h 18" />
              </svg>

              <svg
                className="nav-shell__toggle-icon--close"
                viewBox="0 0 32 32"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.25"
                aria-hidden="true"
              >
                <path strokeLinecap="round" d="M 10 10 L 22 22 M 22 10 L 10 22" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div
        className="nav-shell__mobile"
        data-theme={theme}
        data-open={mobileMenuOpen}
        id={mobileMenuId}
        aria-hidden={!mobileMenuOpen}
      >
        <button
          className="nav-shell__mobile-backdrop"
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="nav-shell__mobile-wrap">
          <div
            ref={mobilePanelRef}
            className="nav-shell__mobile-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            tabIndex={-1}
          >
            <div className="nav-shell__mobile-grid">
              <div className="nav-shell__mobile-quick-links">
                {desktopLinks.map((link) => (
                  <a
                    key={link.href}
                    className="nav-shell__mobile-quick-link"
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="nav-shell__mobile-card">
                <p className="nav-shell__mobile-card-title">Services</p>
                <div className="nav-shell__mobile-card-links">
                  {mobileServices.map((item) => (
                    <a
                      key={item.href}
                      className="nav-shell__mobile-card-link"
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
                <div className="nav-shell__mobile-card-actions">
                  <a
                    className="nav-shell__mobile-card-primary"
                    href={routes.services}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    See More Services
                  </a>
                  <a
                    className="nav-shell__mobile-card-secondary"
                    href={routes.contact}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact Exxonim
                  </a>
                </div>
              </div>

              <div className="nav-shell__mobile-card">
                <p className="nav-shell__mobile-card-title">Resources</p>
                <div className="nav-shell__mobile-card-links">
                  {mobileResources.map((item) => (
                    <a
                      key={item.href}
                      className="nav-shell__mobile-card-link"
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="nav-shell__mobile-bottom">
                <a
                  className="nav-shell__mobile-bottom-link"
                  href={callHref}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="nav-shell__mobile-bottom-label">
                    {primaryPhone ? "Call Now" : "Contact Exxonim"}
                  </span>
                  <span className="nav-shell__mobile-bottom-number">
                    {primaryPhone || "Open the contact page"}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
```

### `apps/public/src/components/Footer.tsx`

```tsx
import { useEffect, useRef } from "react";
import { routes } from "../routes";
import type { BrandAssets, CompanyInfo, Theme } from "../types";
import type { SiteSettingFooterValue, SiteSettingSocialLinkValue } from "../types/api";

const footerStyles = String.raw`
.footer-shell{
  --footer-border:var(--color-border-soft);
  --footer-surface:var(--color-page-strong);
  --footer-text:var(--color-text);
  --footer-muted:var(--color-text-muted);
  --footer-subtle:var(--color-text-soft);
  --footer-eyebrow:rgba(16,37,41,.56);
  --footer-link-hover:var(--color-accent);
  --footer-cta-bg:var(--color-accent);
  --footer-cta-text:var(--color-accent-contrast);
  --footer-cta-shadow:0 12px 32px rgba(15,92,99,.18);
  --footer-cta-shadow-hover:0 16px 38px rgba(15,92,99,.24);
  --footer-veil:rgba(238,240,236,.18);
  --footer-logo-shadow:drop-shadow(0 10px 22px rgba(8,24,27,.08));
  --footer-tagline-accent:rgba(15,92,99,.52);
  --footer-grid-opacity:.9;
  --footer-grid-line:rgba(16,37,41,.07);
  --footer-grid-glow:rgba(15,92,99,.14);
  --footer-pointer-x:50%;
  --footer-pointer-y:50%;
  --footer-spotlight-opacity:0;
  position:relative;
  isolation:isolate;
  overflow:hidden;
  z-index:10;
  margin-top:4.5rem;
  border-top:1px solid var(--footer-border);
  background:var(--footer-surface);
  color:var(--footer-text);
}

.footer-shell[data-theme="dark"]{
  --footer-border:var(--color-border-soft);
  --footer-surface:var(--color-page-strong);
  --footer-text:var(--color-text);
  --footer-muted:var(--color-text-muted);
  --footer-subtle:var(--color-text-soft);
  --footer-eyebrow:rgba(237,244,242,.54);
  --footer-link-hover:var(--color-accent-secondary);
  --footer-cta-bg:var(--color-accent);
  --footer-cta-text:var(--color-accent-contrast);
  --footer-cta-shadow:0 12px 32px rgba(127,188,193,.16);
  --footer-cta-shadow-hover:0 16px 38px rgba(127,188,193,.2);
  --footer-veil:rgba(7,21,24,.18);
  --footer-logo-shadow:drop-shadow(0 10px 22px rgba(0,0,0,.24));
  --footer-tagline-accent:rgba(127,188,193,.52);
  --footer-grid-opacity:.88;
  --footer-grid-line:rgba(237,244,242,.06);
  --footer-grid-glow:rgba(127,188,193,.14);
}

.footer-shell,
.footer-shell *{
  box-sizing:border-box;
}

.footer-shell__anchor{
  display:block;
  height:0;
}

.footer-shell__canvas,
.footer-shell__spotlight,
.footer-shell__veil{
  position:absolute;
  inset:0;
}

.footer-shell__canvas{
  z-index:0;
  width:100%;
  height:100%;
  pointer-events:none;
  opacity:var(--footer-grid-opacity);
  filter:blur(.2px) saturate(1.08) contrast(1.08);
}

.footer-shell__spotlight{
  display:none;
}

.footer-shell__veil{
  z-index:1;
  background:var(--footer-veil);
  backdrop-filter:blur(4px) saturate(1.02);
  -webkit-backdrop-filter:blur(4px) saturate(1.02);
  pointer-events:none;
}

.footer-shell__content{
  position:relative;
  z-index:2;
  width:min(1440px, calc(100% - 3rem));
  margin:0 auto;
  padding:5rem 0 3rem;
  pointer-events:none;
}

.footer-shell__grid{
  display:grid;
  grid-template-columns:minmax(0,1.25fr) repeat(3, minmax(0,1fr));
  gap:3rem 2rem;
  pointer-events:auto;
}

.footer-shell__brand-panel{
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  gap:1rem;
  max-width:20rem;
}

.footer-shell__brand-link{
  display:inline-flex;
  align-items:center;
  color:var(--footer-text);
  text-decoration:none;
}

  .footer-shell__brand-logo{
    display:block;
    width:min(14rem, 100%);
    height:auto;
    object-fit:contain;
    filter:var(--footer-logo-shadow);
  }

.footer-shell__tagline{
  margin:0;
  max-width:15rem;
  position:relative;
  display:inline-block;
  font-family:var(--font-display);
  font-size:.95rem;
  font-weight:500;
  font-style:italic;
  line-height:1.7;
  color:var(--footer-subtle);
  animation:footer-tagline-float 5.8s ease-in-out infinite;
}

.footer-shell__tagline::after{
  content:"";
  position:absolute;
  left:0;
  bottom:-.18rem;
  width:100%;
  height:1px;
  background:linear-gradient(90deg, transparent 0%, var(--footer-tagline-accent) 20%, transparent 100%);
  transform-origin:left center;
  animation:footer-tagline-line 4.8s ease-in-out infinite;
  opacity:.35;
  pointer-events:none;
}

@keyframes footer-tagline-float{
  0%,100%{
    transform:translateY(0);
    opacity:1;
  }

  50%{
    transform:translateY(-2px);
    opacity:.92;
  }
}

@keyframes footer-tagline-line{
  0%,100%{
    transform:scaleX(.45);
    opacity:.14;
  }

  50%{
    transform:scaleX(1);
    opacity:.5;
  }
}

@media (prefers-reduced-motion: reduce){
  .footer-shell__tagline,
  .footer-shell__tagline::after{
    animation:none;
  }
}

.footer-shell__cta{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  min-height:2.9rem;
  padding:.85rem 1.35rem;
  border-radius:.85rem;
  background:var(--footer-cta-bg);
  color:var(--footer-cta-text);
  text-decoration:none;
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  font-size:.95rem;
  font-weight:800;
  transition:transform 220ms ease, box-shadow 220ms ease;
  box-shadow:var(--footer-cta-shadow);
}

.footer-shell__cta:hover,
.footer-shell__cta:focus-visible{
  transform:translateY(-2px);
  box-shadow:var(--footer-cta-shadow-hover);
  outline:none;
}

.footer-shell__social{
  display:grid;
  gap:.85rem;
  margin-top:.45rem;
  width:100%;
}

  .footer-shell__social-row{
    display:flex;
    flex-wrap:wrap;
    gap:.6rem;
    align-items:center;
  }

  .footer-shell__social-link{
    display:flex;
    align-items:center;
    justify-content:center;
    width:2rem;
    height:2rem;
    color:var(--footer-text);
    text-decoration:none;
    transition:color 180ms ease;
  }

  .footer-shell__social-link svg{
    width:1.25rem;
    height:1.25rem;
    flex-shrink:0;
    fill:currentColor;
  }

.footer-shell__column{
  display:grid;
  align-content:start;
  gap:1rem;
}

.footer-shell__eyebrow{
  margin:0;
  font-family:ui-monospace,"SFMono-Regular","Menlo","Monaco","Consolas","Liberation Mono","Courier New",monospace;
  font-size:.76rem;
  font-weight:800;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:var(--footer-eyebrow);
}

.footer-shell__list{
  margin:0;
  padding:0;
  list-style:none;
  display:grid;
  gap:.8rem;
}

.footer-shell__list a,
.footer-shell__list span{
  display:block;
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  font-size:.95rem;
  font-weight:500;
  line-height:1.65;
  color:var(--footer-muted);
  text-decoration:none;
  transition:color 180ms ease;
}

.footer-shell__list a:hover,
.footer-shell__list a:focus-visible{
  color:var(--footer-link-hover);
  outline:none;
}

.footer-shell__list--contact{
  gap:1rem;
}

.footer-shell__contact-item{
  display:grid;
  grid-template-columns:1.1rem minmax(0,1fr);
  gap:.8rem;
  align-items:start;
}

.footer-shell__contact-icon{
  width:1.1rem;
  height:1.1rem;
  margin-top:.2rem;
  color:var(--footer-link-hover);
}

.footer-shell__contact-copy--stacked{
  display:grid;
  gap:.2rem;
}

.footer-shell__bottom{
  margin-top:4rem;
  padding-top:1.5rem;
  border-top:1px solid var(--footer-border);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:1rem;
  pointer-events:auto;
}

.footer-shell__bottom p{
  margin:0;
  font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
  font-size:.88rem;
  font-weight:500;
  letter-spacing:.04em;
  color:var(--footer-muted);
}

.footer-shell__bottom-tools{
  display:flex;
  align-items:center;
  justify-content:flex-end;
  gap:1rem;
  margin-left:auto;
}

.footer-shell__bottom-social{
  display:flex;
  align-items:center;
  gap:.75rem;
}

.footer-shell__top-button{
  width:2.9rem;
  height:2.9rem;
  border-radius:999px;
  border:none;
  background:rgba(255,255,255,0.6);
  color:var(--footer-text);
  font-size:0.7rem;
  letter-spacing:0.25em;
  text-transform:uppercase;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 12px 28px rgba(0,0,0,.15);
  cursor:pointer;
  transition:transform 180ms ease, background 180ms ease;
}

.footer-shell__top-button:hover,
.footer-shell__top-button:focus-visible{
  transform:translateY(-2px);
  background:var(--footer-border);
  color:var(--footer-cta-text);
  outline:none;
}
@media (max-width: 1023px){
  .footer-shell__grid{
    grid-template-columns:repeat(2, minmax(0,1fr));
  }

  .footer-shell__brand-panel{
    max-width:none;
  }
}

@media (max-width: 767px){
  .footer-shell{
    margin-top:4rem;
  }

  .footer-shell__content{
    width:min(1440px, calc(100% - 1.5rem));
    padding:4rem 0 2.5rem;
  }

  .footer-shell__grid{
    grid-template-columns:1fr;
    gap:2.5rem;
  }

  .footer-shell__cta{
    width:100%;
    max-width:20rem;
  }

  .footer-shell__bottom{
    margin-top:3rem;
    flex-direction:column;
    align-items:flex-start;
  }

  .footer-shell__bottom-tools{
    width:100%;
    justify-content:space-between;
  }
}
`;

function roundRectPath(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  let safeRadius = radius;

  if (width < safeRadius * 2) {
    safeRadius = width / 2;
  }

  if (height < safeRadius * 2) {
    safeRadius = height / 2;
  }

  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

type FooterBlock = {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: number;
  value: number;
  thresholdOffset: number;
};

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
  return value - Math.floor(value);
}

function getTileColor(value: number, theme: Theme) {
  if (theme === "dark") {
    if (value < 0.05) {
      return "#09181c";
    }

    if (value < 0.22) {
      return "#0e252a";
    }

    if (value < 0.5) {
      return "#17363d";
    }

    if (value < 0.82) {
      return "#2d6169";
    }

    return "#9dd7db";
  }

  if (value < 0.05) {
    return "#eef1ec";
  }

  if (value < 0.22) {
    return "#dfe7e3";
  }

  if (value < 0.5) {
    return "#cfddda";
  }

  if (value < 0.82) {
    return "#a7c8cb";
  }

  return "#5f9fa8";
}

function getBlockTarget(dx: number, dy: number, block: FooterBlock, cell: number) {
  const blockDistance = Math.max(
    Math.abs(dx) / (block.width * 0.58 + cell * 0.34),
    Math.abs(dy) / (block.height * 0.58 + cell * 0.34)
  );
  const adjustedDistance = blockDistance + block.thresholdOffset * 0.22;

  if (adjustedDistance <= 0.48) {
    return 1;
  }

  if (adjustedDistance <= 0.9) {
    return 0.74;
  }

  if (adjustedDistance <= 1.3) {
    return 0.44;
  }

  if (adjustedDistance <= 1.82) {
    return 0.18;
  }

  return 0;
}

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
  theme: Theme;
}

export function Footer({ brand, company, footer, theme }: FooterProps) {
  const footerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef({ x: -1000, y: -1000, active: false });
  const blocksRef = useRef<FooterBlock[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const canvas = canvasRef.current;

    if (!footer || !canvas) {
      return;
    }

    const context =
      canvas.getContext("2d", { alpha: false }) ??
      canvas.getContext("2d");

    if (!context) {
      return;
    }

    const cell = 54;

    const syncPointerVisuals = (x: string, y: string, active: boolean) => {
      footer.style.setProperty("--footer-pointer-x", x);
      footer.style.setProperty("--footer-pointer-y", y);
      footer.style.setProperty("--footer-spotlight-opacity", active ? "1" : "0");
    };

    const resetPointer = () => {
      pointerRef.current = { x: -1000, y: -1000, active: false };
      syncPointerVisuals("-20%", "-20%", false);
    };

    const initializeCanvas = () => {
      const bounds = footer.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const dpr = window.devicePixelRatio || 1;

      context.setTransform(1, 0, 0, 1, 0, 0);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.scale(dpr, dpr);

      sizeRef.current = { width, height };
      const columns = Math.ceil(width / cell) + 2;
      const rows = Math.ceil(height / cell) + 2;
      const blocks: FooterBlock[] = [];

      for (let row = 0; row < rows; row += 1) {
        for (let column = 0; column < columns; column += 1) {
          const seed = row * 1009 + column * 917;

          const centerX = column * cell + cell / 2;
          const centerY = row * cell + cell / 2;
          const blockSize = cell * 0.78;
          const radius = 5;

          blocks.push({
            x: centerX - blockSize / 2,
            y: centerY - blockSize / 2,
            width: blockSize,
            height: blockSize,
            radius,
            value: 0,
            thresholdOffset: pseudoRandom(seed + 9) - 0.5,
          });
        }
      }

      blocksRef.current = blocks;
    };

    const renderFrame = () => {
      animationFrameRef.current = null;

      const { width, height } = sizeRef.current;
      const blocks = blocksRef.current;
      const pointer = pointerRef.current;
      const computedFooterStyles = getComputedStyle(footer);
      const gridLineColor = computedFooterStyles.getPropertyValue("--footer-grid-line").trim();
      const gridGlowColor = computedFooterStyles.getPropertyValue("--footer-grid-glow").trim();
      let hasEnergy = false;

      context.fillStyle = theme === "dark" ? "#071518" : "#eef0ec";
      context.fillRect(0, 0, width, height);

      for (const block of blocks) {
        let target = 0;

        if (pointer.active) {
          const dx = pointer.x - (block.x + block.width / 2);
          const dy = pointer.y - (block.y + block.height / 2);
          target = getBlockTarget(dx, dy, block, cell);
        }

        const easing = target > block.value ? 0.3 : 0.1;
        block.value += (target - block.value) * easing;

        if (block.value < 0.01) {
          block.value = 0;
        }

        hasEnergy = hasEnergy || block.value > 0;

        context.fillStyle = getTileColor(block.value, theme);
        roundRectPath(context, block.x, block.y, block.width, block.height, block.radius);
        context.fill();

        context.strokeStyle = gridLineColor;
        context.lineWidth = 1;
        roundRectPath(context, block.x, block.y, block.width, block.height, block.radius);
        context.stroke();

        if (block.value > 0.16) {
          context.save();
          context.globalAlpha = Math.min(0.28, block.value * 0.22);
          context.fillStyle = gridGlowColor;
          roundRectPath(
            context,
            block.x - 1.5,
            block.y - 1.5,
            block.width + 3,
            block.height + 3,
            block.radius + 1.5
          );
          context.fill();
          context.restore();
        }
      }

      if (pointer.active || hasEnergy) {
        startLoop();
      }
    };

    const startLoop = () => {
      if (animationFrameRef.current !== null) {
        return;
      }

      animationFrameRef.current = window.requestAnimationFrame(renderFrame);
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const bounds = footer.getBoundingClientRect();
      const x = clientX - bounds.left;
      const y = clientY - bounds.top;

      pointerRef.current = {
        x,
        y,
        active: true,
      };
      syncPointerVisuals(
        `${(x / Math.max(bounds.width, 1)) * 100}%`,
        `${(y / Math.max(bounds.height, 1)) * 100}%`,
        true
      );

      startLoop();
    };

    const handlePointerMove = (event: PointerEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleMouseMove = (event: MouseEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) {
        return;
      }

      updatePointer(event.touches[0].clientX, event.touches[0].clientY);
    };

    const handlePointerLeave = () => {
      resetPointer();
      renderFrame();
    };

    initializeCanvas();
    renderFrame();

    footer.addEventListener("pointermove", handlePointerMove, { passive: true });
    footer.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    footer.addEventListener("mousemove", handleMouseMove, { passive: true });
    footer.addEventListener("mouseleave", handlePointerLeave, { passive: true });
    footer.addEventListener("touchmove", handleTouchMove, { passive: true });
    footer.addEventListener("touchend", handlePointerLeave, { passive: true });
    footer.addEventListener("touchcancel", handlePointerLeave, { passive: true });

    const handleResize = () => {
      initializeCanvas();
      renderFrame();
    };

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            handleResize();
          })
        : null;

    if (resizeObserver) {
      resizeObserver.observe(footer);
    } else {
      window.addEventListener("resize", handleResize, { passive: true });
    }

    return () => {
      footer.removeEventListener("pointermove", handlePointerMove);
      footer.removeEventListener("pointerleave", handlePointerLeave);
      footer.removeEventListener("mousemove", handleMouseMove);
      footer.removeEventListener("mouseleave", handlePointerLeave);
      footer.removeEventListener("touchmove", handleTouchMove);
      footer.removeEventListener("touchend", handlePointerLeave);
      footer.removeEventListener("touchcancel", handlePointerLeave);

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener("resize", handleResize);
      }

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      resetPointer();
    };
  }, [theme]);

  const socialLinks = footerSocialPlatforms
    .map((platform) =>
      (footer.social_links ?? []).find(
        (link) => link.platform === platform && link.isActive && link.url.trim()
      )
    )
    .filter((link): link is SiteSettingSocialLinkValue => Boolean(link));

  return (
    <>
      <style>{footerStyles}</style>

      <footer
        ref={footerRef}
        className="footer-shell"
        data-theme={theme}
        id="site-footer"
      >
        <div className="footer-shell__content">
          <div className="footer-shell__grid">
            <section className="footer-shell__brand-panel">
              <a
                className="footer-shell__brand-link"
                href={routes.home}
                aria-label={`${brand.name} home`}
              >
                <img
                  className="footer-shell__brand-logo"
                  src={theme === "dark" ? brand.darkLogoSrc : brand.lightLogoSrc}
                  alt={brand.name}
                  loading="lazy"
                />
              </a>

              <p className="footer-shell__tagline">
                {footer.tagline}
              </p>

              <a className="footer-shell__cta" href={footer.primary_cta.href}>
                {footer.primary_cta.label}
              </a>

            </section>

            <section className="footer-shell__column">
              <h4 className="footer-shell__eyebrow">Quick Links</h4>
              <nav aria-label="Footer navigation">
                <ul className="footer-shell__list">
                  {footer.quick_links.map((link) => (
                    <li key={`${link.label}-${link.href}`}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </section>

            <section className="footer-shell__column">
              <h4 className="footer-shell__eyebrow">Other Resources</h4>
              <ul className="footer-shell__list">
                {footer.other_resources.map((link) => (
                  <li key={`${link.label}-${link.href}`}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </section>

            <section className="footer-shell__column">
              <h4 className="footer-shell__eyebrow">Contact Us</h4>
              <ul className="footer-shell__list footer-shell__list--contact">
                <li className="footer-shell__contact-item">
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

                  <span>{company.address || "Use the contact page for location details."}</span>
                </li>

                <li className="footer-shell__contact-item">
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

                  <div className="footer-shell__contact-copy--stacked">
                    {company.emails.length ? (
                      company.emails.map((email) => (
                        <a key={email} href={`mailto:${email}`}>
                          {email}
                        </a>
                      ))
                    ) : (
                      <a href={routes.contact}>Use the Exxonim contact page</a>
                    )}
                  </div>
                </li>

                <li className="footer-shell__contact-item">
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

                  <div className="footer-shell__contact-copy--stacked">
                    {company.phones.length ? (
                      company.phones.map((phone) => (
                        <a key={phone} href={`tel:${phone.replace(/\s+/g, "")}`}>
                          {phone}
                        </a>
                      ))
                    ) : (
                      <a href={routes.contact}>Live phone details are reconnecting</a>
                    )}
                  </div>
                </li>
              </ul>
            </section>
          </div>

          <div className="footer-shell__bottom">
            <p>{footer.copyright}</p>
            <div className="footer-shell__bottom-tools">
              {socialLinks.length ? (
                <div className="footer-shell__bottom-social" aria-label="Social media links">
                  {socialLinks.map((link, index) => (
                    <a
                      key={`${link.platform}-${link.url}-${index}`}
                      className="footer-shell__social-link"
                      href={link.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={socialLabel(link)}
                      title={socialLabel(link)}
                    >
                      {renderSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              ) : null}
              <button
                className="footer-shell__top-button"
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                aria-label="Back to top"
                title="Back to top"
              >
                Top
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
```

### `apps/public/src/hooks/usePublicShell.ts`

```ts
import { useQuery } from "@tanstack/react-query";
import {
  getCachedSiteSetting,
  getSiteSetting,
} from "../services/siteSettingsService";
import { getCachedNavigation, getNavigation } from "../services/navigationService";
import type { SiteSettingFooterValue } from "../types/api";
import type { BrandAssets, CompanyInfo, NavigationItem, SiteSetting } from "../types";
import {
  fallbackBrand,
  fallbackCompanyInfo,
  fallbackFooter,
  fallbackNavigationItems,
} from "../content/fallbackShell";

interface PublicShellData {
  brand: BrandAssets;
  company: CompanyInfo;
  footer: SiteSettingFooterValue;
  navigationItems: NavigationItem[];
  isDegraded: boolean;
  isUsingFallback: boolean;
}

function hasSiteSettingValue<TValue>(
  setting: SiteSetting<TValue> | undefined
): setting is SiteSetting<TValue> {
  return Boolean(setting?.value);
}

export function usePublicShell(): PublicShellData {
  const navigationQuery = useQuery({
    queryKey: ["navigation"],
    queryFn: getNavigation,
    initialData: getCachedNavigation,
    retry: false,
  });
  const brandQuery = useQuery({
    queryKey: ["site-settings", "brand"],
    queryFn: () => getSiteSetting<BrandAssets>("brand"),
    initialData: () => getCachedSiteSetting<BrandAssets>("brand"),
    retry: false,
  });
  const footerQuery = useQuery({
    queryKey: ["site-settings", "footer"],
    queryFn: () => getSiteSetting<SiteSettingFooterValue>("footer"),
    initialData: () => getCachedSiteSetting<SiteSettingFooterValue>("footer"),
    retry: false,
  });
  const companyQuery = useQuery({
    queryKey: ["site-settings", "company_info"],
    queryFn: () => getSiteSetting<CompanyInfo>("company_info"),
    initialData: () => getCachedSiteSetting<CompanyInfo>("company_info"),
    retry: false,
  });

  const brand = hasSiteSettingValue(brandQuery.data)
    ? brandQuery.data.value
    : fallbackBrand;
  const footer = hasSiteSettingValue(footerQuery.data)
    ? footerQuery.data.value
    : fallbackFooter;
  const company = hasSiteSettingValue(companyQuery.data)
    ? companyQuery.data.value
    : fallbackCompanyInfo;
  const navigationItems =
    navigationQuery.data && navigationQuery.data.length > 0
      ? navigationQuery.data
      : fallbackNavigationItems;

  const hasMissingShellData =
    (!brandQuery.isPending && !hasSiteSettingValue(brandQuery.data)) ||
    (!footerQuery.isPending && !hasSiteSettingValue(footerQuery.data)) ||
    (!companyQuery.isPending && !hasSiteSettingValue(companyQuery.data)) ||
    (!navigationQuery.isPending &&
      (!navigationQuery.data || navigationQuery.data.length === 0));

  const hasShellError = Boolean(
    navigationQuery.error ||
      brandQuery.error ||
      footerQuery.error ||
      companyQuery.error
  );

  const isUsingFallback =
    brand === fallbackBrand ||
    footer === fallbackFooter ||
    company === fallbackCompanyInfo ||
    navigationItems === fallbackNavigationItems;

  return {
    brand,
    footer,
    company,
    navigationItems,
    isDegraded: isUsingFallback || hasShellError || hasMissingShellData,
    isUsingFallback,
  };
}
```

### `packages/shared/src/publicContentCache.ts`

```ts
const PUBLIC_CONTENT_CACHE_PREFIX = "exxonim-public-content";

type CachedPublicContentEnvelope<T> = {
  cachedAt: string;
  value: T;
};

function hasLocalStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function toStorageKey(cacheKey: string) {
  return `${PUBLIC_CONTENT_CACHE_PREFIX}:${cacheKey}`;
}

export function getCachedPublicContent<T>(
  cacheKey: string,
  fallbackValue?: T
): T | undefined {
  if (!hasLocalStorage()) {
    return fallbackValue;
  }

  try {
    const rawValue = window.localStorage.getItem(toStorageKey(cacheKey));
    if (!rawValue) {
      return fallbackValue;
    }

    const parsed = JSON.parse(rawValue) as CachedPublicContentEnvelope<T>;
    return parsed.value;
  } catch {
    return fallbackValue;
  }
}

export function cachePublicContent<T>(cacheKey: string, value: T) {
  if (!hasLocalStorage()) {
    return value;
  }

  try {
    const payload: CachedPublicContentEnvelope<T> = {
      cachedAt: new Date().toISOString(),
      value,
    };

    window.localStorage.setItem(toStorageKey(cacheKey), JSON.stringify(payload));
  } catch {
    // Ignore cache write failures so public rendering never hard-fails on storage.
  }

  return value;
}

export async function fetchWithFallback<T>(options: {
  cacheKey: string;
  fetcher: () => Promise<T>;
  fallbackValue?: T;
  warningLabel?: string;
}): Promise<T> {
  const { cacheKey, fetcher, fallbackValue, warningLabel } = options;

  try {
    const value = await fetcher();
    return cachePublicContent(cacheKey, value);
  } catch (error) {
    const fallback = getCachedPublicContent<T>(cacheKey, fallbackValue);

    if (typeof fallback !== "undefined") {
      if (
        typeof window !== "undefined" &&
        typeof console !== "undefined" &&
        typeof console.warn === "function"
      ) {
        console.warn(
          warningLabel ?? `Using cached or default public content for ${cacheKey}.`,
          error
        );
      }

      return fallback;
    }

    throw error;
  }
}
```

### `packages/admin-core/src/contexts/AuthContext.tsx`

```tsx
import type { PropsWithChildren } from "react";
import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { clearAuthSession, setAuthSession, subscribeAuthSession } from "../lib/authSession";
import { getAuthSession } from "../lib/authSession";
import { getAdminMe, loginAdmin } from "../services/adminAuthService";
import type { ApiAdminUser } from "../types/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextValue {
  admin: ApiAdminUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string[];
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshAdminProfile: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (...permissions: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getServerSnapshot() {
  return {
    admin: null,
    accessToken: null,
    refreshToken: null,
  };
}

export function AuthProvider({ children }: PropsWithChildren) {
  const session = useSyncExternalStore(
    subscribeAuthSession,
    getAuthSession,
    getServerSnapshot
  );

  const permissions = session.admin?.permissions ?? [];

  async function refreshAdminProfile() {
    const { accessToken } = getAuthSession();

    if (!accessToken) {
      return;
    }

    const admin = await getAdminMe();
    setAuthSession({
      ...getAuthSession(),
      admin,
    });
  }

  async function login(credentials: LoginCredentials) {
    const response = await loginAdmin(credentials);

    setAuthSession({
      admin: response.admin,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
    });

    try {
      await refreshAdminProfile();
    } catch {
      // Keep the login usable even if the profile refresh fails.
    }
  }

  function logout() {
    clearAuthSession();
  }

  function hasPermission(permission: string) {
    return permissions.includes(permission);
  }

  function hasAnyPermission(...permissionValues: string[]) {
    return permissionValues.some((permission) => hasPermission(permission));
  }

  useEffect(() => {
    if (!session.accessToken) {
      return;
    }

    if ((session.admin?.permissions?.length ?? 0) > 0) {
      return;
    }

    void refreshAdminProfile().catch(() => {
      // Ignore initial profile refresh failures; route guards still rely on token presence.
    });
  }, [session.accessToken, session.admin?.id, session.admin?.permissions?.length]);

  return (
    <AuthContext.Provider
      value={{
        admin: session.admin,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
        permissions,
        isAuthenticated: Boolean(session.admin && session.accessToken),
        login,
        logout,
        refreshAdminProfile,
        hasPermission,
        hasAnyPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
```

### `apps/admin-next/src/routes/sections.tsx`

```tsx
import type { ReactNode } from 'react';
import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { routes } from '@exxonim/admin-core/routes';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '@exxonim/admin-core/contexts/AuthContext';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

const AdminPage = lazy(() => import('src/pages/admin'));
const SignInPage = lazy(() => import('src/pages/sign-in'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

const fallback = (
  <Box
    sx={{
      minHeight: '40vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <CircularProgress color="inherit" />
  </Box>
);

function RequireAdminAuth({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    const next = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate replace to={`${routes.adminLogin}?next=${next}`} />;
  }

  return <>{children}</>;
}

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: <Navigate replace to={routes.admin} />,
  },
  {
    path: '/admin/login',
    element: (
      <AuthLayout>
        <Suspense fallback={fallback}>
          <SignInPage />
        </Suspense>
      </AuthLayout>
    ),
  },
  {
    path: '/admin/*',
    element: (
      <RequireAdminAuth>
        <DashboardLayout>
          <Suspense fallback={fallback}>
            <AdminPage />
          </Suspense>
        </DashboardLayout>
      </RequireAdminAuth>
    ),
  },
  {
    path: '*',
    element: (
      <Suspense fallback={fallback}>
        <Page404 />
      </Suspense>
    ),
  },
];
```

### `../exxonim_backend/app/core/dependencies.py`

```python
from __future__ import annotations

import secrets

from jose import JWTError
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.crud import admin as admin_crud
from app.core.config import settings
from app.core.database import get_db
from app.core.security import decode_token
from app.models import AdminUser

bearer_scheme = HTTPBearer(auto_error=False)


def _unauthorized(detail: str = "Not authenticated") -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def _admin_write_key_error(detail: str, status_code: int) -> HTTPException:
    return HTTPException(status_code=status_code, detail=detail)


def _forbidden(detail: str = "You do not have permission to perform this action.") -> HTTPException:
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


async def require_admin_api_key(
    x_api_key: str | None = Header(default=None, alias="X-API-Key"),
) -> None:
    configured_key = settings.ADMIN_API_KEY.strip()

    if not configured_key:
        raise _admin_write_key_error(
            "Admin write protection is not configured.",
            status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    if x_api_key is None or not secrets.compare_digest(x_api_key, configured_key):
        raise _admin_write_key_error(
            "Invalid or missing admin write API key.",
            status.HTTP_401_UNAUTHORIZED,
        )


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: AsyncSession = Depends(get_db),
) -> AdminUser:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise _unauthorized()

    try:
        payload = decode_token(credentials.credentials)
    except JWTError as exc:
        raise _unauthorized("Invalid token") from exc

    if payload.get("token_type") != "access":
        raise _unauthorized("Invalid access token")

    subject = payload.get("sub")
    if not isinstance(subject, str) or not subject.isdigit():
        raise _unauthorized("Invalid token subject")

    admin = await admin_crud.get_admin_by_id(db, int(subject), include_access=True)
    if admin is None or not admin.is_active:
        raise _unauthorized("Admin account is inactive")

    return admin


def has_permission(admin: AdminUser, permission_code: str) -> bool:
    return permission_code in admin.permissions


def has_any_permission(admin: AdminUser, *permission_codes: str) -> bool:
    return any(has_permission(admin, permission_code) for permission_code in permission_codes)


def require_permission(permission_code: str):
    async def dependency(current_admin: AdminUser = Depends(get_current_admin)) -> AdminUser:
        if not has_permission(current_admin, permission_code):
            raise _forbidden()
        return current_admin

    return dependency
```

### `../exxonim_backend/app/routers/admin.py`

```python
from __future__ import annotations

from datetime import UTC, datetime, timezone
from pathlib import Path
from uuid import uuid4
from typing import Any, Awaitable, Callable

from jose import JWTError
from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, Response, UploadFile, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.audit import get_request_meta, log_audit, serialize_for_audit
from app.crud import admin as admin_crud
from app.crud import blog as blog_crud
from app.crud import consultation as consultation_crud
from app.crud import job as job_crud
from app.crud import media as media_crud
from app.crud import navigation as navigation_crud
from app.crud import page as page_crud
from app.crud import pricing as pricing_crud
from app.crud import site_settings as site_settings_crud
from app.crud import testimonial as testimonial_crud
from app.core.database import get_db
from app.core.dependencies import (
    get_current_admin,
    has_any_permission,
    has_permission,
    require_admin_api_key,
    require_permission,
)
from app.core.security import create_access_token, create_refresh_token, decode_token
from app.models import AdminUser, BlogPost, Page, Role, SiteSetting, Testimonial
from app.schemas import (
    AdminAccessTokenResponse,
    AdminDashboardSummary,
    AdminLoginRequest,
    AdminRefreshRequest,
    AdminRoleOut,
    AdminTokenResponse,
    AdminUserRoleUpdate,
    AdminUserStatusUpdate,
    AdminUserOut,
    BlogAuthorCreate,
    BlogAuthorOut,
    BlogAuthorUpdate,
    BlogCategoryCreate,
    BlogCategoryOut,
    BlogCategoryUpdate,
    BlogPostCreate,
    BlogPostOut,
    BlogPostUpdate,
    ConsultationListResponse,
    ConsultationOut,
    ConsultationUpdate,
    JobCreate,
    JobOut,
    JobUpdate,
    MediaCreate,
    MediaOut,
    MediaUpdate,
    NavigationItemCreate,
    NavigationItemOut,
    NavigationItemUpdate,
    PageCreate,
    PageOut,
    PageUpdate,
    PricingPlanCreate,
    PricingPlanOut,
    PricingPlanUpdate,
    SiteSettingCreate,
    SiteSettingOut,
    SiteSettingUpdate,
    ContentWorkflowActionRequest,
    TestimonialCreate,
    TestimonialOut,
    TestimonialUpdate,
)
from app.workflow import (
    ContentWorkflowStatus,
    apply_content_status,
    assert_legal_status_transition,
    is_owned_draft,
    normalize_content_status,
    set_creator,
)

router = APIRouter(prefix="/admin", tags=["admin"])
uploads_dir = Path(__file__).resolve().parents[2] / "uploads"
uploads_dir.mkdir(parents=True, exist_ok=True)


def _conflict(detail: str = "Resource conflict") -> HTTPException:
    return HTTPException(status_code=status.HTTP_409_CONFLICT, detail=detail)


def _not_found(detail: str) -> HTTPException:
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=detail)


def _forbidden(detail: str = "You do not have permission to perform this action.") -> HTTPException:
    return HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=detail)


def _clean_text(value: Any) -> str:
    return value.strip() if isinstance(value, str) else ""


def _has_article_body(content: Any) -> bool:
    if not isinstance(content, dict):
        return False

    if _clean_text(content.get("html")):
        return True

    if _clean_text(content.get("introduction")):
        return True

    sections = content.get("sections")
    if not isinstance(sections, list):
        return False

    for section in sections:
        if not isinstance(section, dict):
            continue
        if _clean_text(section.get("heading")):
            return True
        paragraphs = section.get("paragraphs")
        if isinstance(paragraphs, list) and any(_clean_text(item) for item in paragraphs):
            return True

    return False


def _is_publish_request(*, is_published: bool, published_at: datetime | None) -> bool:
    if is_published:
        return True
    if published_at is None:
        return False
    comparison_now = datetime.now(published_at.tzinfo or timezone.utc)
    return published_at <= comparison_now


def _validate_blog_publish_fields(
    *,
    title: str,
    slug: str,
    excerpt: str | None,
    content: Any,
    category_id: int | None,
    author_id: int | None,
    featured_image: str | None,
) -> None:
    issues: list[str] = []

    if not _clean_text(title):
        issues.append("Title is required before publishing.")
    if not _clean_text(slug):
        issues.append("Slug is required before publishing.")
    if not _clean_text(excerpt):
        issues.append("Excerpt is required before publishing.")
    if category_id is None:
        issues.append("Category is required before publishing.")
    if author_id is None:
        issues.append("Author is required before publishing.")
    if not _clean_text(featured_image):
        issues.append("Cover image is required before publishing.")
    if not _has_article_body(content):
        issues.append("Add article body content before publishing.")

    if issues:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "message": "This post is not ready to publish.",
                "issues": issues,
            },
        )


async def _commit_with_conflict(
    db: AsyncSession,
    *,
    detail: str = "Resource conflict",
) -> None:
    try:
        await db.commit()
    except IntegrityError as exc:
        await db.rollback()
        raise _conflict(detail) from exc


async def _delete_and_commit(db: AsyncSession, instance: Any) -> Response:
    if hasattr(instance, "url") and isinstance(instance.url, str):
        filename = instance.url.rsplit("/", 1)[-1]
        local_file = uploads_dir / filename
        if "/uploads/" in instance.url and local_file.exists():
            local_file.unlink()
    await db.delete(instance)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def _log_route_audit(
    db: AsyncSession,
    *,
    request: Request | None,
    current_admin: AdminUser | None,
    action: str,
    target_type: str,
    target_id: int | str | None,
    old_value: Any = None,
    new_value: Any = None,
) -> None:
    ip, user_agent = get_request_meta(request)
    await log_audit(
        db,
        actor_id=current_admin.id if current_admin else None,
        actor_email=current_admin.email if current_admin else None,
        action=action,
        target_type=target_type,
        target_id=target_id,
        old_value=old_value,
        new_value=new_value,
        ip=ip,
        user_agent=user_agent,
    )


async def _refresh_load_and_audit(
    db: AsyncSession,
    instance: Any,
    loader: Callable[[AsyncSession, int], Awaitable[Any]],
    *,
    request: Request | None,
    current_admin: AdminUser,
    action: str,
    target_type: str,
    old_value: Any = None,
) -> Any:
    refreshed = await _refresh_and_load(db, instance, loader)
    await _log_route_audit(
        db,
        request=request,
        current_admin=current_admin,
        action=action,
        target_type=target_type,
        target_id=getattr(refreshed, "id", None),
        old_value=old_value,
        new_value=refreshed,
    )
    return refreshed


async def _delete_and_audit(
    db: AsyncSession,
    instance: Any,
    *,
    request: Request | None,
    current_admin: AdminUser,
    action: str,
    target_type: str,
) -> Response:
    old_value = instance
    target_id = getattr(instance, "id", None)
    response = await _delete_and_commit(db, instance)
    await _log_route_audit(
        db,
        request=request,
        current_admin=current_admin,
        action=action,
        target_type=target_type,
        target_id=target_id,
        old_value=old_value,
        new_value=None,
    )
    return response


async def _refresh_and_load(
    db: AsyncSession,
    instance: Any,
    loader: Callable[[AsyncSession, int], Awaitable[Any]],
) -> Any:
    await db.flush()
    identifier = instance.id
    await _commit_with_conflict(db)
    return await loader(db, identifier)


def _build_token_response(admin: AdminUser) -> AdminTokenResponse:
    access_token = create_access_token(
        subject=str(admin.id),
        extra_claims={"token_type": "access", "email": admin.email, "role": admin.role},
    )
    refresh_token = create_refresh_token(
        subject=str(admin.id),
        extra_claims={"token_type": "refresh", "email": admin.email, "role": admin.role},
    )
    return AdminTokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        admin=admin,
    )


def _admin_blog_edit_href(post_id: int) -> str:
    return f"/admin/blog/posts/{post_id}/edit/"


def _admin_page_edit_href(page_id: int) -> str:
    return f"/admin/pages/{page_id}/edit/"


def _admin_setting_href(setting_key: str) -> str:
    mapping = {
        "brand": "/admin/settings/brand/",
        "company_info": "/admin/settings/brand/",
        "contact_map": "/admin/settings/contact/",
        "footer": "/admin/settings/footer/",
        "seo_defaults": "/admin/settings/seo/",
    }
    return mapping.get(setting_key, "/admin/settings/brand/")


def _admin_consultation_href(consultation_id: int) -> str:
    return f"/admin/consultations/{consultation_id}/"


def _admin_job_edit_href(job_slug: str) -> str:
    return f"/admin/jobs/{job_slug}/"


def _dashboard_status_for_post(post: BlogPost) -> str:
    return _current_content_status(post)


def _dashboard_status_for_page(page: Page) -> str:
    return _current_content_status(page)


def _assert_permission(current_admin: AdminUser, permission_code: str, detail: str | None = None) -> None:
    if not has_permission(current_admin, permission_code):
        raise _forbidden(detail or "You do not have permission to perform this action.")


def _assert_any_permission(
    current_admin: AdminUser,
    permission_codes: list[str],
    detail: str | None = None,
) -> None:
    if not has_any_permission(current_admin, *permission_codes):
        raise _forbidden(detail or "You do not have permission to perform this action.")


def _enforce_content_edit_access(
    current_admin: AdminUser,
    instance: Any,
    permission_prefix: str,
) -> None:
    if has_permission(current_admin, f"{permission_prefix}.edit_any_draft"):
        return
    if has_permission(current_admin, f"{permission_prefix}.edit_own_draft") and is_owned_draft(
        instance, current_admin.id
    ):
        return
    raise _forbidden("You can only edit your own draft content.")


def _enforce_content_transition(
    current_admin: AdminUser,
    *,
    current_status: str,
    next_status: str,
    permission_prefix: str,
) -> None:
    if next_status == current_status:
        return

    assert_legal_status_transition(current_status, next_status)

    if next_status == ContentWorkflowStatus.PENDING_REVIEW.value:
        _assert_any_permission(
            current_admin,
            [
                f"{permission_prefix}.submit_review",
                f"{permission_prefix}.approve",
                f"{permission_prefix}.publish",
            ],
        )
        return

    if next_status == ContentWorkflowStatus.PUBLISHED.value:
        if current_status == ContentWorkflowStatus.PENDING_REVIEW.value:
            _assert_any_permission(
                current_admin,
                [f"{permission_prefix}.approve", f"{permission_prefix}.publish"],
            )
        else:
            _assert_permission(current_admin, f"{permission_prefix}.publish")
        return

    if next_status == ContentWorkflowStatus.REJECTED.value:
        _assert_permission(current_admin, f"{permission_prefix}.reject")
        return

    if next_status == ContentWorkflowStatus.ARCHIVED.value:
        _assert_permission(current_admin, f"{permission_prefix}.archive")
        return

    if next_status == ContentWorkflowStatus.DRAFT.value:
        if current_status in {
            ContentWorkflowStatus.PUBLISHED.value,
            ContentWorkflowStatus.ARCHIVED.value,
        }:
            _assert_permission(current_admin, f"{permission_prefix}.publish")
            return

        _assert_any_permission(
            current_admin,
            [
                f"{permission_prefix}.edit_any_draft",
                f"{permission_prefix}.edit_own_draft",
                f"{permission_prefix}.reject",
                f"{permission_prefix}.publish",
            ],
        )
        return

    raise _forbidden()


def _validate_page_publish_fields(page: Page) -> None:
    issues: list[str] = []

    if not _clean_text(page.title):
        issues.append("Title is required before publishing.")
    if not _clean_text(page.slug):
        issues.append("Slug is required before publishing.")
    if not isinstance(page.content, dict) or not page.content:
        issues.append("Page content is required before publishing.")

    if issues:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"message": "This page is not ready to publish.", "issues": issues},
        )


def _validate_testimonial_publish_fields(testimonial: Testimonial) -> None:
    issues: list[str] = []

    if not _clean_text(testimonial.author):
        issues.append("Author is required before publishing.")
    if not _clean_text(testimonial.content):
        issues.append("Quote content is required before publishing.")

    if issues:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"message": "This testimonial is not ready to publish.", "issues": issues},
        )


def _current_content_status(instance: Any) -> str:
    status_value = getattr(instance, "status", None)
    if isinstance(status_value, str) and status_value:
        if status_value == "in_review":
            return ContentWorkflowStatus.PENDING_REVIEW.value
        if status_value == "scheduled":
            return ContentWorkflowStatus.DRAFT.value
        return status_value

    if getattr(instance, "is_published", False) or getattr(instance, "is_active", False):
        return ContentWorkflowStatus.PUBLISHED.value

    return ContentWorkflowStatus.DRAFT.value


async def _transition_content_status(
    db: AsyncSession,
    *,
    request: Request,
    current_admin: AdminUser,
    instance: Any,
    loader: Callable[[AsyncSession, int], Awaitable[Any]],
    permission_prefix: str,
    next_status: str,
    action: str,
    target_type: str,
    validator: Callable[[Any], None] | None = None,
    required_permission: str | None = None,
    allowed_current_statuses: set[str] | None = None,
    audit_context: dict[str, Any] | None = None,
) -> Any:
    current_status = _current_content_status(instance)
    if allowed_current_statuses is not None and current_status not in allowed_current_statuses:
        allowed_labels = ", ".join(sorted(allowed_current_statuses))
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"This action is only allowed when content is in: {allowed_labels}.",
        )
    if required_permission is not None:
        _assert_permission(current_admin, required_permission)
    _enforce_content_transition(
        current_admin,
        current_status=current_status,
        next_status=next_status,
        permission_prefix=permission_prefix,
    )

    if next_status == ContentWorkflowStatus.PUBLISHED.value and validator is not None:
        validator(instance)

    old_value = serialize_for_audit(instance)
    apply_content_status(instance, next_status=next_status, actor_id=current_admin.id)
    db.add(instance)
    refreshed = await _refresh_and_load(db, instance, loader)
    new_value: Any = refreshed
    if audit_context:
        new_value = {
            "record": serialize_for_audit(refreshed),
            "workflow": audit_context,
        }
    await _log_route_audit(
        db,
        request=request,
        current_admin=current_admin,
        action=action,
        target_type=target_type,
        target_id=getattr(refreshed, "id", None),
        old_value=old_value,
        new_value=new_value,
    )
    return refreshed


def _dashboard_seo_health(
    *,
    meta_title: str | None,
    meta_description: str | None,
    share_image: str | None = None,
    require_share_image: bool = False,
) -> str:
    has_title = bool(_clean_text(meta_title))
    has_description = bool(_clean_text(meta_description))
    has_share_image = bool(_clean_text(share_image))

    if has_title and has_description and (has_share_image or not require_share_image):
        return "clean"

    if has_title or has_description or has_share_image:
        return "warning"

    return "error"


def _completion_percent(parts: list[bool]) -> int:
    if not parts:
        return 0
    complete = sum(1 for part in parts if part)
    return round((complete / len(parts)) * 100)


def _blog_completion_percent(post: BlogPost) -> int:
    return _completion_percent(
        [
            bool(_clean_text(post.title)),
            bool(_clean_text(post.slug)),
            bool(_clean_text(post.excerpt)),
            post.category_id is not None,
            post.author_id is not None,
            bool(_clean_text(post.featured_image)),
            _has_article_body(post.content),
        ]
    )


def _page_completion_percent(page: Page) -> int:
    return _completion_percent(
        [
            bool(_clean_text(page.title)),
            bool(_clean_text(page.slug)),
            _has_article_body(page.content),
            bool(_clean_text(page.meta_title)),
            bool(_clean_text(page.meta_description)),
        ]
    )


def _pipeline_priority(status: str) -> int:
    if status == ContentWorkflowStatus.PENDING_REVIEW.value:
        return 0
    if status in {
        ContentWorkflowStatus.DRAFT.value,
        ContentWorkflowStatus.REJECTED.value,
    }:
        return 1
    if status == ContentWorkflowStatus.PUBLISHED.value:
        return 2
    return 3


def _consultation_priority(status: str) -> int:
    if status == "pending":
        return 0
    if status == "contacted":
        return 1
    if status == "completed":
        return 2
    return 3


def _setting_activity_meta(setting_key: str) -> tuple[str, str]:
    mapping = {
        "brand": ("Brand settings", "/admin/settings/brand/"),
        "company_info": ("Company profile", "/admin/settings/brand/"),
        "contact_map": ("Contact & map", "/admin/settings/contact/"),
        "footer": ("Footer content", "/admin/settings/footer/"),
        "seo_defaults": ("SEO defaults", "/admin/settings/seo/"),
    }
    return mapping.get(setting_key, ("Site setting", _admin_setting_href(setting_key)))


def _consultation_assignee_label(assigned_admin: AdminUser | None) -> str | None:
    return assigned_admin.email if assigned_admin else None


def _build_dashboard_alerts(
    *,
    posts: list[BlogPost],
    pages: list[Page],
    consultations: list[Any],
    settings_by_key: dict[str, SiteSetting],
) -> list[dict[str, Any]]:
    alerts: list[dict[str, Any]] = []

    seo_defaults = settings_by_key.get("seo_defaults")
    seo_value = seo_defaults.value if seo_defaults else {}
    default_meta_title = seo_value.get("defaultMetaTitle") if isinstance(seo_value, dict) else None
    default_meta_description = (
        seo_value.get("defaultMetaDescription") if isinstance(seo_value, dict) else None
    )

    if not _clean_text(default_meta_title) or not _clean_text(default_meta_description):
        alerts.append(
            {
                "id": "seo-defaults-missing",
                "severity": "warning",
                "title": "SEO defaults incomplete",
                "message": "Default meta title or description is missing.",
                "href": "/admin/settings/seo/",
            }
        )

    posts_missing_cover = [post for post in posts if not _clean_text(post.featured_image)]
    if posts_missing_cover:
        alerts.append(
            {
                "id": "posts-missing-cover",
                "severity": "info",
                "title": "Cover images need attention",
                "message": f"{len(posts_missing_cover)} posts are still missing a cover image.",
                "href": "/admin/blog/posts/",
            }
        )

    unpublished_pages = [page for page in pages if not page.is_published]
    if unpublished_pages:
        alerts.append(
            {
                "id": "pages-not-live",
                "severity": "info",
                "title": "Pages still in draft",
                "message": f"{len(unpublished_pages)} pages are not published yet.",
                "href": "/admin/pages/",
            }
        )

    pending_consultations = [item for item in consultations if item.status == "pending"]
    if pending_consultations:
        alerts.append(
            {
                "id": "consultations-pending",
                "severity": "warning",
                "title": "Consultations waiting for follow-up",
                "message": f"{len(pending_consultations)} consultation requests are still pending review.",
                "href": "/admin/consultations/",
            }
        )

    return alerts[:4]


def _build_dashboard_recent_activity(
    *,
    current_admin: AdminUser,
    posts: list[BlogPost],
    pages: list[Page],
    consultation_history: list[Any],
    settings: list[SiteSetting],
) -> list[dict[str, Any]]:
    activity: list[tuple[datetime, dict[str, Any]]] = []

    for post in posts[:6]:
        status = _dashboard_status_for_post(post)
        actor_name = post.author.name if post.author else current_admin.email
        actor_role = post.author.role if post.author and _clean_text(post.author.role) else "Administrator"
        actor_type = "editor" if post.author else "admin"
        action_type = "published" if status == "published" else "draft_created" if post.created_at == post.updated_at else "updated"

        activity.append(
            (
                post.updated_at,
                {
                    "id": f"post-{post.id}",
                    "actor_name": actor_name,
                    "actor_role": actor_role,
                    "actor_type": actor_type,
                    "action_type": action_type,
                    "resource_type": "blog_post",
                    "target_label": post.title,
                    "target_url": _admin_blog_edit_href(post.id),
                    "detail": f"Blog post {status}.",
                    "created_at": post.updated_at,
                },
            )
        )

    for page in pages[:4]:
        activity.append(
            (
                page.updated_at,
                {
                    "id": f"page-{page.id}",
                    "actor_name": current_admin.email,
                    "actor_role": "Administrator",
                    "actor_type": "admin",
                    "action_type": "published" if page.is_published else "updated",
                    "resource_type": "page",
                    "target_label": page.title,
                    "target_url": _admin_page_edit_href(page.id),
                    "detail": "Page content updated.",
                    "created_at": page.updated_at,
                },
            )
        )

    for setting in settings[:4]:
        label, href = _setting_activity_meta(setting.key)
        activity.append(
            (
                setting.updated_at,
                {
                    "id": f"setting-{setting.key}",
                    "actor_name": current_admin.email,
                    "actor_role": "Administrator",
                    "actor_type": "admin",
                    "action_type": "settings_updated",
                    "resource_type": "seo" if setting.key == "seo_defaults" else "setting",
                    "target_label": label,
                    "target_url": href,
                    "detail": f"{label} updated.",
                    "created_at": setting.updated_at,
                },
            )
        )

    for entry in consultation_history:
        consultation = entry.consultation
        if consultation is None:
            continue

        actor_name = (
            entry.changed_by_admin.email
            if entry.changed_by_admin
            else consultation.email
        )
        actor_role = "Administrator" if entry.changed_by_admin else "Client"
        action_type = "consultation_received" if entry.old_status is None else "updated"
        detail = entry.comment or f"Consultation moved to {entry.new_status}."

        activity.append(
            (
                entry.created_at,
                {
                    "id": f"consultation-{entry.id}",
                    "actor_name": actor_name,
                    "actor_role": actor_role,
                    "actor_type": "admin" if entry.changed_by_admin else "system",
                    "action_type": action_type,
                    "resource_type": "consultation",
                    "target_label": consultation.full_name,
                    "target_url": _admin_consultation_href(consultation.id),
                    "detail": detail,
                    "created_at": entry.created_at,
                },
            )
        )

    activity.sort(key=lambda item: item[0], reverse=True)
    return [payload for _, payload in activity[:8]]


def _build_dashboard_pipeline(posts: list[BlogPost], pages: list[Page]) -> list[dict[str, Any]]:
    queue: list[tuple[tuple[int, int, int, float], dict[str, Any]]] = []

    for post in posts:
        status = _dashboard_status_for_post(post)
        seo_health = _dashboard_seo_health(
            meta_title=post.meta_title,
            meta_description=post.meta_description,
            share_image=post.featured_image,
            require_share_image=True,
        )
        completion_percent = _blog_completion_percent(post)
        queue.append(
            (
                (
                    _pipeline_priority(status),
                    completion_percent,
                    0 if seo_health == "error" else 1 if seo_health == "warning" else 2,
                    -post.updated_at.timestamp(),
                ),
                {
                    "id": f"post-{post.id}",
                    "title": post.title,
                    "slug": post.slug,
                    "kind": "blog_post",
                    "status": status,
                    "seo_health": seo_health,
                    "completion_percent": completion_percent,
                    "href": _admin_blog_edit_href(post.id),
                },
            )
        )

    for page in pages:
        status = _dashboard_status_for_page(page)
        seo_health = _dashboard_seo_health(
            meta_title=page.meta_title,
            meta_description=page.meta_description,
            require_share_image=False,
        )
        completion_percent = _page_completion_percent(page)
        queue.append(
            (
                (
                    _pipeline_priority(status),
                    completion_percent,
                    0 if seo_health == "error" else 1 if seo_health == "warning" else 2,
                    -page.updated_at.timestamp(),
                ),
                {
                    "id": f"page-{page.id}",
                    "title": page.title,
                    "slug": page.slug,
                    "kind": "page",
                    "status": status,
                    "seo_health": seo_health,
                    "completion_percent": completion_percent,
                    "href": _admin_page_edit_href(page.id),
                },
            )
        )

    queue.sort(key=lambda item: item[0])
    return [payload for _, payload in queue[:6]]


def _build_dashboard_consultations(consultations: list[Any]) -> list[dict[str, Any]]:
    queue = sorted(
        consultations,
        key=lambda item: (
            _consultation_priority(item.status),
            -item.updated_at.timestamp(),
            -item.id,
        ),
    )

    return [
        {
            "id": consultation.id,
            "tracking_id": consultation.tracking_id,
            "full_name": consultation.full_name,
            "company": consultation.company,
            "status": consultation.status,
            "assigned_admin_label": _consultation_assignee_label(consultation.assigned_admin),
            "created_at": consultation.created_at,
            "updated_at": consultation.updated_at,
            "href": _admin_consultation_href(consultation.id),
        }
        for consultation in queue[:4]
    ]


@router.post("/auth/login", response_model=AdminTokenResponse)
async def login_admin(
    payload: AdminLoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> AdminTokenResponse:
    admin = await admin_crud.authenticate_admin(
        db,
        email=payload.email,
        password=payload.password,
    )
    ip, user_agent = get_request_meta(request)
    if admin is None:
        await log_audit(
            db,
            actor_id=None,
            actor_email=payload.email,
            action="auth.login_failed",
            target_type="auth",
            target_id=payload.email,
            old_value=None,
            new_value={"success": False},
            ip=ip,
            user_agent=user_agent,
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    admin.last_login_at = datetime.now(UTC)
    db.add(admin)
    await db.commit()
    refreshed = await admin_crud.get_admin_by_id(db, admin.id, include_access=True)
    if refreshed is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account is inactive",
        )
    await log_audit(
        db,
        actor_id=refreshed.id,
        actor_email=refreshed.email,
        action="auth.login_succeeded",
        target_type="auth",
        target_id=str(refreshed.id),
        old_value=None,
        new_value={"success": True},
        ip=ip,
        user_agent=user_agent,
    )
    return _build_token_response(refreshed)


@router.post("/auth/refresh", response_model=AdminAccessTokenResponse)
async def refresh_admin_access_token(
    payload: AdminRefreshRequest,
    db: AsyncSession = Depends(get_db),
) -> AdminAccessTokenResponse:
    try:
        token_payload = decode_token(payload.refresh_token)
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        ) from exc

    if token_payload.get("token_type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    subject = token_payload.get("sub")
    if not isinstance(subject, str) or not subject.isdigit():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token",
        )

    admin = await admin_crud.get_admin_by_id(db, int(subject), include_access=True)
    if admin is None or not admin.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin account is inactive",
        )

    access_token = create_access_token(
        subject=str(admin.id),
        extra_claims={"token_type": "access", "email": admin.email},
    )
    return AdminAccessTokenResponse(access_token=access_token)


@router.get("/auth/me", response_model=AdminUserOut)
async def get_admin_me(
    current_admin: AdminUser = Depends(get_current_admin),
) -> AdminUserOut:
    return current_admin


@router.get("/staff", response_model=list[AdminUserOut])
async def list_admin_staff(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("user.read")),
) -> list[AdminUserOut]:
    return await admin_crud.get_all_admins(db, include_access=True)


@router.get("/users", response_model=list[AdminUserOut])
async def list_admin_users(
    search: str | None = Query(default=None),
    role: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("user.read")),
) -> list[AdminUserOut]:
    return await admin_crud.get_all_admins(
        db,
        include_access=True,
        search=search,
        role_code=role,
    )


@router.put("/users/{admin_id}/role", response_model=AdminUserOut)
async def update_admin_user_role(
    admin_id: int,
    payload: AdminUserRoleUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("user.manage")),
    _write_guard: None = Depends(require_admin_api_key),
) -> AdminUserOut:
    target_admin = await admin_crud.get_admin_by_id(db, admin_id, include_access=True)
    if target_admin is None:
        raise _not_found("Admin user not found")

    role = await admin_crud.get_role_by_code(db, payload.role)
    if role is None:
        raise _not_found("Role not found")

    old_value = serialize_for_audit(target_admin)
    await admin_crud.set_admin_roles(db, admin=target_admin, roles=[role])
    await db.commit()
    refreshed = await admin_crud.get_admin_by_id(db, admin_id, include_access=True)
    if refreshed is None:
        raise _not_found("Admin user not found")

    await _log_route_audit(
        db,
        request=request,
        current_admin=current_admin,
        action="user.role_update",
        target_type="admin_user",
        target_id=admin_id,
        old_value=old_value,
        new_value=refreshed,
    )
    return refreshed


@router.put("/users/{admin_id}/status", response_model=AdminUserOut)
async def update_admin_user_status(
    admin_id: int,
    payload: AdminUserStatusUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("user.manage")),
    _write_guard: None = Depends(require_admin_api_key),
) -> AdminUserOut:
    target_admin = await admin_crud.get_admin_by_id(db, admin_id, include_access=True)
    if target_admin is None:
        raise _not_found("Admin user not found")

    old_value = serialize_for_audit(target_admin)
    target_admin.is_active = payload.is_active
    db.add(target_admin)
    await db.commit()
    refreshed = await admin_crud.get_admin_by_id(db, admin_id, include_access=True)
    if refreshed is None:
        raise _not_found("Admin user not found")

    await _log_route_audit(
        db,
        request=request,
        current_admin=current_admin,
        action="user.status_update",
        target_type="admin_user",
        target_id=admin_id,
        old_value=old_value,
        new_value=refreshed,
    )
    return refreshed


@router.get("/roles", response_model=list[AdminRoleOut])
async def list_admin_roles(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("role.read")),
) -> list[Role]:
    return await admin_crud.get_all_roles(db)


@router.get("/dashboard/summary", response_model=AdminDashboardSummary)
async def get_admin_dashboard_summary(
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("dashboard.read")),
) -> AdminDashboardSummary:
    posts = await blog_crud.get_all_posts(db)
    jobs = await job_crud.get_published_jobs(db)
    pages = await page_crud.get_all_pages(db)
    consultations = await consultation_crud.get_recent_consultations(db, limit=12)
    consultation_counts = await consultation_crud.get_consultation_status_counts(db)
    consultation_history = await consultation_crud.get_recent_consultation_history(db, limit=8)
    settings = await site_settings_crud.get_site_settings(db)
    settings_by_key = {setting.key: setting for setting in settings}
    draft_posts = [post for post in posts if _dashboard_status_for_post(post) == "draft"]
    published_posts = [post for post in posts if _dashboard_status_for_post(post) == "published"]
    published_pages = [page for page in pages if page.is_published]

    return AdminDashboardSummary(
        metrics=[
            {
                "key": "published_pages",
                "label": "Published Pages",
                "value": len(published_pages),
                "helper": "Live public pages",
                "href": "/admin/pages/",
            },
            {
                "key": "draft_posts",
                "label": "Draft Posts",
                "value": len(draft_posts),
                "helper": "Articles still being prepared",
                "href": "/admin/blog/posts/",
            },
            {
                "key": "pending_consultations",
                "label": "Pending Consultations",
                "value": consultation_counts.get("pending", 0),
                "helper": f"{consultation_counts.get('contacted', 0)} already contacted",
                "href": "/admin/consultations/",
            },
            {
                "key": "published_posts",
                "label": "Published Posts",
                "value": len(published_posts),
                "helper": f"{len(draft_posts)} drafts waiting",
                "href": "/admin/blog/posts/",
            },
        ],
        alerts=_build_dashboard_alerts(
            posts=posts,
            pages=pages,
            consultations=consultations,
            settings_by_key=settings_by_key,
        ),
        recent_activity=_build_dashboard_recent_activity(
            current_admin=current_admin,
            posts=posts,
            pages=pages,
            consultation_history=consultation_history,
            settings=settings,
        ),
        content_pipeline=_build_dashboard_pipeline(posts, pages),
        consultations=_build_dashboard_consultations(consultations),
        open_jobs=[
            {
                "id": job.id,
                "title": job.title,
                "slug": job.slug,
                "department": job.department,
                "employment_type": job.employment_type,
                "location": ", ".join(part for part in [job.city, job.country] if part) or job.location_mode,
                "status": "published" if job.is_published else "draft",
                "posted_at": job.published_at,
                "href": _admin_job_edit_href(job.slug),
            }
            for job in jobs[:4]
        ],
    )


@router.get("/jobs", response_model=list[JobOut])
async def list_admin_jobs(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("job.read")),
) -> list[JobOut]:
    return await job_crud.get_all_jobs(db)


@router.post("/jobs", response_model=JobOut, status_code=status.HTTP_201_CREATED)
async def create_job(
    payload: JobCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("job.create")),
    _write_guard: None = Depends(require_admin_api_key),
) -> JobOut:
    job = job_crud.build_job(payload)
    db.add(job)
    return await _refresh_load_and_audit(
        db,
        job,
        job_crud.get_job_by_id,
        request=request,
        current_admin=current_admin,
        action="job.create",
        target_type="job",
    )


@router.get("/jobs/{slug}", response_model=JobOut)
async def get_admin_job(
    slug: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("job.read")),
) -> JobOut:
    job = await job_crud.get_job_by_slug(db, slug)
    if job is None:
        raise _not_found("Job not found")
    return job


@router.put("/jobs/{slug}", response_model=JobOut)
async def update_job(
    slug: str,
    payload: JobUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("job.update")),
    _write_guard: None = Depends(require_admin_api_key),
) -> JobOut:
    job = await job_crud.get_job_by_slug(db, slug)
    if job is None:
        raise _not_found("Job not found")
    old_value = serialize_for_audit(job)
    job_crud.apply_job_update(job, payload)
    db.add(job)
    return await _refresh_load_and_audit(
        db,
        job,
        job_crud.get_job_by_id,
        request=request,
        current_admin=current_admin,
        action="job.update",
        target_type="job",
        old_value=old_value,
    )


@router.delete("/jobs/{slug}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_job(
    slug: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("job.delete")),
    _write_guard: None = Depends(require_admin_api_key),
) -> Response:
    job = await job_crud.get_job_by_slug(db, slug)
    if job is None:
        raise _not_found("Job not found")
    return await _delete_and_audit(
        db,
        job,
        request=request,
        current_admin=current_admin,
        action="job.delete",
        target_type="job",
    )


@router.get("/consultations", response_model=ConsultationListResponse)
async def list_admin_consultations(
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=20, ge=1, le=100),
    status_value: str | None = Query(default=None, alias="status"),
    search: str | None = Query(default=None),
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("consultation.read")),
) -> ConsultationListResponse:
    items, total = await consultation_crud.get_consultations(
        db,
        page=page,
        limit=limit,
        status=status_value,
        search=search,
        include_history=True,
    )
    return ConsultationListResponse.build(
        items=[ConsultationOut.model_validate(item) for item in items],
        page=page,
        limit=limit,
        total=total,
    )


@router.get("/consultations/{consultation_id}", response_model=ConsultationOut)
async def get_admin_consultation(
    consultation_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("consultation.read")),
) -> ConsultationOut:
    consultation = await consultation_crud.get_consultation_by_id(
        db,
        consultation_id,
        include_history=True,
    )
    if consultation is None:
        raise _not_found("Consultation not found")
    return consultation


@router.put("/consultations/{consultation_id}", response_model=ConsultationOut)
async def update_admin_consultation(
    consultation_id: int,
    payload: ConsultationUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("consultation.update")),
    _write_guard: None = Depends(require_admin_api_key),
) -> ConsultationOut:
    consultation = await consultation_crud.get_consultation_by_id(
        db,
        consultation_id,
        include_history=True,
    )
    if consultation is None:
        raise _not_found("Consultation not found")

    if payload.assigned_to is not None and await admin_crud.get_admin_by_id(db, payload.assigned_to) is None:
        raise _not_found("Assigned admin not found")

    old_value = serialize_for_audit(consultation)
    old_status = consultation.status
    consultation_crud.apply_consultation_update(consultation, payload)
    db.add(consultation)
    await db.flush()

    next_status = payload.status or old_status
    if next_status != old_status:
        db.add(
            consultation_crud.build_status_history(
                consultation_id=consultation.id,
                old_status=old_status,
                new_status=next_status,
                changed_by=current_admin.id,
                comment=payload.comment,
            )
        )

    await _commit_with_conflict(db)
    refreshed = await consultation_crud.get_consultation_by_id(
        db,
        consultation_id,
        include_history=True,
    )
    if refreshed is None:
        raise _not_found("Consultation not found")
    await _log_route_audit(
        db,
        request=request,
        current_admin=current_admin,
        action="consultation.update",
        target_type="consultation",
        target_id=consultation_id,
        old_value=old_value,
        new_value=refreshed,
    )
    return refreshed


@router.get("/blog/posts", response_model=list[BlogPostOut])
async def list_admin_blog_posts(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("blog_post.read")),
) -> list[BlogPostOut]:
    return await blog_crud.get_all_posts(db)


@router.post("/blog/posts", response_model=BlogPostOut, status_code=status.HTTP_201_CREATED)
async def create_blog_post(
    payload: BlogPostCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> BlogPostOut:
    _assert_permission(current_admin, "blog_post.create")
    if payload.category_id is not None and await blog_crud.get_category_by_id(
        db, payload.category_id
    ) is None:
        raise _not_found("Category not found")
    if payload.author_id is not None and await blog_crud.get_author_by_id(
        db, payload.author_id
    ) is None:
        raise _not_found("Author not found")

    payload_data = payload.model_dump(exclude_unset=True)
    next_status = normalize_content_status(
        current_status="draft",
        requested_status=payload_data.get("status"),
        requested_is_published=payload_data.get("is_published"),
    )
    _enforce_content_transition(
        current_admin,
        current_status="draft",
        next_status=next_status,
        permission_prefix="blog_post",
    )

    post = blog_crud.build_post(payload)
    set_creator(post, current_admin.id)
    apply_content_status(post, next_status=next_status, actor_id=current_admin.id)
    if next_status == "published":
        _validate_blog_publish_fields(
            title=post.title,
            slug=post.slug,
            excerpt=post.excerpt,
            content=post.content,
            category_id=post.category_id,
            author_id=post.author_id,
            featured_image=post.featured_image,
        )
    db.add(post)
    return await _refresh_load_and_audit(
        db,
        post,
        blog_crud.get_post_by_id,
        request=request,
        current_admin=current_admin,
        action="blog_post.create",
        target_type="blog_post",
    )


@router.get("/blog/posts/{post_id}", response_model=BlogPostOut)
async def get_admin_blog_post(
    post_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("blog_post.read")),
) -> BlogPostOut:
    post = await blog_crud.get_post_by_id(db, post_id)
    if post is None:
        raise _not_found("Post not found")
    return post


@router.put("/blog/posts/{post_id}", response_model=BlogPostOut)
async def update_blog_post(
    post_id: int,
    payload: BlogPostUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> BlogPostOut:
    post = await blog_crud.get_post_by_id(db, post_id)
    if post is None:
        raise _not_found("Post not found")
    _enforce_content_edit_access(current_admin, post, "blog_post")

    update_data = payload.model_dump(exclude_unset=True)
    if "category_id" in update_data and update_data["category_id"] is not None:
        if await blog_crud.get_category_by_id(db, update_data["category_id"]) is None:
            raise _not_found("Category not found")
    if "author_id" in update_data and update_data["author_id"] is not None:
        if await blog_crud.get_author_by_id(db, update_data["author_id"]) is None:
            raise _not_found("Author not found")

    next_status = normalize_content_status(
        current_status=_current_content_status(post),
        requested_status=update_data.get("status"),
        requested_is_published=update_data.get("is_published"),
    )
    _enforce_content_transition(
        current_admin,
        current_status=_current_content_status(post),
        next_status=next_status,
        permission_prefix="blog_post",
    )

    old_value = serialize_for_audit(post)
    blog_crud.apply_post_update(post, payload)
    apply_content_status(post, next_status=next_status, actor_id=current_admin.id)
    if next_status == "published":
        _validate_blog_publish_fields(
            title=post.title,
            slug=post.slug,
            excerpt=post.excerpt,
            content=post.content,
            category_id=post.category_id,
            author_id=post.author_id,
            featured_image=post.featured_image,
        )
    db.add(post)
    return await _refresh_load_and_audit(
        db,
        post,
        blog_crud.get_post_by_id,
        request=request,
        current_admin=current_admin,
        action="blog_post.update",
        target_type="blog_post",
        old_value=old_value,
    )


@router.post("/blog/posts/{post_id}/submit", response_model=BlogPostOut)
async def submit_blog_post_for_review(
    post_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> BlogPostOut:
    post = await blog_crud.get_post_by_id(db, post_id)
    if post is None:
        raise _not_found("Post not found")
    _enforce_content_edit_access(current_admin, post, "blog_post")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=post,
        loader=blog_crud.get_post_by_id,
        permission_prefix="blog_post",
        next_status=ContentWorkflowStatus.PENDING_REVIEW.value,
        action="blog_post.submit_review",
        target_type="blog_post",
        required_permission="blog_post.submit_review",
        allowed_current_statuses={
            ContentWorkflowStatus.DRAFT.value,
            ContentWorkflowStatus.REJECTED.value,
        },
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.post("/blog/posts/{post_id}/approve", response_model=BlogPostOut)
async def approve_blog_post(
    post_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> BlogPostOut:
    post = await blog_crud.get_post_by_id(db, post_id)
    if post is None:
        raise _not_found("Post not found")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=post,
        loader=blog_crud.get_post_by_id,
        permission_prefix="blog_post",
        next_status=ContentWorkflowStatus.PUBLISHED.value,
        action="blog_post.approve",
        target_type="blog_post",
        validator=lambda item: _validate_blog_publish_fields(
            title=item.title,
            slug=item.slug,
            excerpt=item.excerpt,
            content=item.content,
            category_id=item.category_id,
            author_id=item.author_id,
            featured_image=item.featured_image,
        ),
        required_permission="blog_post.approve",
        allowed_current_statuses={ContentWorkflowStatus.PENDING_REVIEW.value},
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.post("/blog/posts/{post_id}/reject", response_model=BlogPostOut)
async def reject_blog_post(
    post_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> BlogPostOut:
    post = await blog_crud.get_post_by_id(db, post_id)
    if post is None:
        raise _not_found("Post not found")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=post,
        loader=blog_crud.get_post_by_id,
        permission_prefix="blog_post",
        next_status=ContentWorkflowStatus.REJECTED.value,
        action="blog_post.reject",
        target_type="blog_post",
        required_permission="blog_post.reject",
        allowed_current_statuses={ContentWorkflowStatus.PENDING_REVIEW.value},
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.post("/blog/posts/{post_id}/publish", response_model=BlogPostOut)
async def publish_blog_post(
    post_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> BlogPostOut:
    post = await blog_crud.get_post_by_id(db, post_id)
    if post is None:
        raise _not_found("Post not found")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=post,
        loader=blog_crud.get_post_by_id,
        permission_prefix="blog_post",
        next_status=ContentWorkflowStatus.PUBLISHED.value,
        action="blog_post.publish",
        target_type="blog_post",
        validator=lambda item: _validate_blog_publish_fields(
            title=item.title,
            slug=item.slug,
            excerpt=item.excerpt,
            content=item.content,
            category_id=item.category_id,
            author_id=item.author_id,
            featured_image=item.featured_image,
        ),
        required_permission="blog_post.publish",
        allowed_current_statuses={
            ContentWorkflowStatus.DRAFT.value,
            ContentWorkflowStatus.PENDING_REVIEW.value,
            ContentWorkflowStatus.REJECTED.value,
        },
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.post("/blog/posts/{post_id}/archive", response_model=BlogPostOut)
async def archive_blog_post(
    post_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> BlogPostOut:
    post = await blog_crud.get_post_by_id(db, post_id)
    if post is None:
        raise _not_found("Post not found")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=post,
        loader=blog_crud.get_post_by_id,
        permission_prefix="blog_post",
        next_status=ContentWorkflowStatus.ARCHIVED.value,
        action="blog_post.archive",
        target_type="blog_post",
        required_permission="blog_post.archive",
        allowed_current_statuses={
            ContentWorkflowStatus.DRAFT.value,
            ContentWorkflowStatus.PENDING_REVIEW.value,
            ContentWorkflowStatus.PUBLISHED.value,
            ContentWorkflowStatus.REJECTED.value,
        },
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.delete("/blog/posts/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog_post(
    post_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("blog_post.delete")),
    _write_guard: None = Depends(require_admin_api_key),
) -> Response:
    post = await blog_crud.get_post_by_id(db, post_id)
    if post is None:
        raise _not_found("Post not found")
    return await _delete_and_audit(
        db,
        post,
        request=request,
        current_admin=current_admin,
        action="blog_post.delete",
        target_type="blog_post",
    )


@router.get("/blog/categories", response_model=list[BlogCategoryOut])
async def list_admin_blog_categories(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("blog_category.read")),
) -> list[BlogCategoryOut]:
    return await blog_crud.get_all_categories(db)


@router.post(
    "/blog/categories",
    response_model=BlogCategoryOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_blog_category(
    payload: BlogCategoryCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("blog_category.manage")),
    _write_guard: None = Depends(require_admin_api_key),
) -> BlogCategoryOut:
    category = blog_crud.build_category(payload)
    db.add(category)
    return await _refresh_load_and_audit(
        db,
        category,
        blog_crud.get_category_by_id,
        request=request,
        current_admin=current_admin,
        action="blog_category.create",
        target_type="blog_category",
    )


@router.put("/blog/categories/{category_id}", response_model=BlogCategoryOut)
async def update_blog_category(
    category_id: int,
    payload: BlogCategoryUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("blog_category.manage")),
    _write_guard: None = Depends(require_admin_api_key),
) -> BlogCategoryOut:
    category = await blog_crud.get_category_by_id(db, category_id)
    if category is None:
        raise _not_found("Category not found")
    old_value = serialize_for_audit(category)
    blog_crud.apply_category_update(category, payload)
    db.add(category)
    return await _refresh_load_and_audit(
        db,
        category,
        blog_crud.get_category_by_id,
        request=request,
        current_admin=current_admin,
        action="blog_category.update",
        target_type="blog_category",
        old_value=old_value,
    )


@router.delete("/blog/categories/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog_category(
    category_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("blog_category.manage")),
    _write_guard: None = Depends(require_admin_api_key),
) -> Response:
    category = await blog_crud.get_category_by_id(db, category_id)
    if category is None:
        raise _not_found("Category not found")
    return await _delete_and_audit(
        db,
        category,
        request=request,
        current_admin=current_admin,
        action="blog_category.delete",
        target_type="blog_category",
    )


@router.get("/blog/authors", response_model=list[BlogAuthorOut])
async def list_admin_blog_authors(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("blog_author.read")),
) -> list[BlogAuthorOut]:
    return await blog_crud.get_all_authors(db)


@router.post(
    "/blog/authors",
    response_model=BlogAuthorOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_blog_author(
    payload: BlogAuthorCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("blog_author.manage")),
    _write_guard: None = Depends(require_admin_api_key),
) -> BlogAuthorOut:
    author = blog_crud.build_author(payload)
    db.add(author)
    return await _refresh_load_and_audit(
        db,
        author,
        blog_crud.get_author_by_id,
        request=request,
        current_admin=current_admin,
        action="blog_author.create",
        target_type="blog_author",
    )


@router.put("/blog/authors/{author_id}", response_model=BlogAuthorOut)
async def update_blog_author(
    author_id: int,
    payload: BlogAuthorUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("blog_author.manage")),
    _write_guard: None = Depends(require_admin_api_key),
) -> BlogAuthorOut:
    author = await blog_crud.get_author_by_id(db, author_id)
    if author is None:
        raise _not_found("Author not found")
    old_value = serialize_for_audit(author)
    blog_crud.apply_author_update(author, payload)
    db.add(author)
    return await _refresh_load_and_audit(
        db,
        author,
        blog_crud.get_author_by_id,
        request=request,
        current_admin=current_admin,
        action="blog_author.update",
        target_type="blog_author",
        old_value=old_value,
    )


@router.delete("/blog/authors/{author_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_blog_author(
    author_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("blog_author.manage")),
    _write_guard: None = Depends(require_admin_api_key),
) -> Response:
    author = await blog_crud.get_author_by_id(db, author_id)
    if author is None:
        raise _not_found("Author not found")
    return await _delete_and_audit(
        db,
        author,
        request=request,
        current_admin=current_admin,
        action="blog_author.delete",
        target_type="blog_author",
    )


@router.get("/pages", response_model=list[PageOut])
async def list_admin_pages(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("page.read")),
) -> list[PageOut]:
    return await page_crud.get_all_pages(db)


@router.post("/pages", response_model=PageOut, status_code=status.HTTP_201_CREATED)
async def create_page(
    payload: PageCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> PageOut:
    _assert_permission(current_admin, "page.create")
    page = page_crud.build_page(payload)
    payload_data = payload.model_dump(exclude_unset=True)
    next_status = normalize_content_status(
        current_status="draft",
        requested_status=payload_data.get("status"),
        requested_is_published=payload_data.get("is_published"),
    )
    _enforce_content_transition(
        current_admin,
        current_status="draft",
        next_status=next_status,
        permission_prefix="page",
    )
    set_creator(page, current_admin.id)
    apply_content_status(page, next_status=next_status, actor_id=current_admin.id)
    if next_status == "published":
        _validate_page_publish_fields(page)
    db.add(page)
    return await _refresh_load_and_audit(
        db,
        page,
        page_crud.get_page_by_id,
        request=request,
        current_admin=current_admin,
        action="page.create",
        target_type="page",
    )


@router.get("/pages/{page_id}", response_model=PageOut)
async def get_admin_page(
    page_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("page.read")),
) -> PageOut:
    page = await page_crud.get_page_by_id(db, page_id)
    if page is None:
        raise _not_found("Page not found")
    return page


@router.put("/pages/{page_id}", response_model=PageOut)
async def update_page(
    page_id: int,
    payload: PageUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> PageOut:
    page = await page_crud.get_page_by_id(db, page_id)
    if page is None:
        raise _not_found("Page not found")
    _enforce_content_edit_access(current_admin, page, "page")
    old_value = serialize_for_audit(page)
    update_data = payload.model_dump(exclude_unset=True)
    next_status = normalize_content_status(
        current_status=_current_content_status(page),
        requested_status=update_data.get("status"),
        requested_is_published=update_data.get("is_published"),
    )
    _enforce_content_transition(
        current_admin,
        current_status=_current_content_status(page),
        next_status=next_status,
        permission_prefix="page",
    )
    page_crud.apply_page_update(page, payload)
    apply_content_status(page, next_status=next_status, actor_id=current_admin.id)
    if next_status == "published":
        _validate_page_publish_fields(page)
    db.add(page)
    return await _refresh_load_and_audit(
        db,
        page,
        page_crud.get_page_by_id,
        request=request,
        current_admin=current_admin,
        action="page.update",
        target_type="page",
        old_value=old_value,
    )


@router.post("/pages/{page_id}/submit", response_model=PageOut)
async def submit_page_for_review(
    page_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> PageOut:
    page = await page_crud.get_page_by_id(db, page_id)
    if page is None:
        raise _not_found("Page not found")
    _enforce_content_edit_access(current_admin, page, "page")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=page,
        loader=page_crud.get_page_by_id,
        permission_prefix="page",
        next_status=ContentWorkflowStatus.PENDING_REVIEW.value,
        action="page.submit_review",
        target_type="page",
        required_permission="page.submit_review",
        allowed_current_statuses={
            ContentWorkflowStatus.DRAFT.value,
            ContentWorkflowStatus.REJECTED.value,
        },
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.post("/pages/{page_id}/approve", response_model=PageOut)
async def approve_page(
    page_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> PageOut:
    page = await page_crud.get_page_by_id(db, page_id)
    if page is None:
        raise _not_found("Page not found")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=page,
        loader=page_crud.get_page_by_id,
        permission_prefix="page",
        next_status=ContentWorkflowStatus.PUBLISHED.value,
        action="page.approve",
        target_type="page",
        validator=_validate_page_publish_fields,
        required_permission="page.approve",
        allowed_current_statuses={ContentWorkflowStatus.PENDING_REVIEW.value},
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.post("/pages/{page_id}/reject", response_model=PageOut)
async def reject_page(
    page_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> PageOut:
    page = await page_crud.get_page_by_id(db, page_id)
    if page is None:
        raise _not_found("Page not found")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=page,
        loader=page_crud.get_page_by_id,
        permission_prefix="page",
        next_status=ContentWorkflowStatus.REJECTED.value,
        action="page.reject",
        target_type="page",
        required_permission="page.reject",
        allowed_current_statuses={ContentWorkflowStatus.PENDING_REVIEW.value},
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.post("/pages/{page_id}/publish", response_model=PageOut)
async def publish_page(
    page_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> PageOut:
    page = await page_crud.get_page_by_id(db, page_id)
    if page is None:
        raise _not_found("Page not found")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=page,
        loader=page_crud.get_page_by_id,
        permission_prefix="page",
        next_status=ContentWorkflowStatus.PUBLISHED.value,
        action="page.publish",
        target_type="page",
        validator=_validate_page_publish_fields,
        required_permission="page.publish",
        allowed_current_statuses={
            ContentWorkflowStatus.DRAFT.value,
            ContentWorkflowStatus.PENDING_REVIEW.value,
            ContentWorkflowStatus.REJECTED.value,
        },
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.post("/pages/{page_id}/archive", response_model=PageOut)
async def archive_page(
    page_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> PageOut:
    page = await page_crud.get_page_by_id(db, page_id)
    if page is None:
        raise _not_found("Page not found")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=page,
        loader=page_crud.get_page_by_id,
        permission_prefix="page",
        next_status=ContentWorkflowStatus.ARCHIVED.value,
        action="page.archive",
        target_type="page",
        required_permission="page.archive",
        allowed_current_statuses={
            ContentWorkflowStatus.DRAFT.value,
            ContentWorkflowStatus.PENDING_REVIEW.value,
            ContentWorkflowStatus.PUBLISHED.value,
            ContentWorkflowStatus.REJECTED.value,
        },
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.delete("/pages/{page_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_page(
    page_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("page.delete")),
    _write_guard: None = Depends(require_admin_api_key),
) -> Response:
    page = await page_crud.get_page_by_id(db, page_id)
    if page is None:
        raise _not_found("Page not found")
    return await _delete_and_audit(
        db,
        page,
        request=request,
        current_admin=current_admin,
        action="page.delete",
        target_type="page",
    )


@router.get("/navigation", response_model=list[NavigationItemOut])
async def list_admin_navigation(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("navigation.read")),
) -> list[NavigationItemOut]:
    return await navigation_crud.get_navigation_tree(db, active_only=None)


@router.post(
    "/navigation",
    response_model=NavigationItemOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_navigation_item(
    payload: NavigationItemCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("navigation.create")),
    _write_guard: None = Depends(require_admin_api_key),
) -> NavigationItemOut:
    if payload.parent_id is not None and await navigation_crud.get_navigation_item_by_id(
        db, payload.parent_id
    ) is None:
        raise _not_found("Parent navigation item not found")

    item = navigation_crud.build_navigation_item(payload)
    db.add(item)
    await db.flush()
    await _commit_with_conflict(db)
    await db.refresh(item)
    serialized = navigation_crud.serialize_navigation_item(item, {})
    await _log_route_audit(
        db,
        request=request,
        current_admin=current_admin,
        action="navigation.create",
        target_type="navigation_item",
        target_id=item.id,
        old_value=None,
        new_value=serialized,
    )
    return serialized


@router.get("/navigation/{item_id}", response_model=NavigationItemOut)
async def get_admin_navigation_item(
    item_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("navigation.read")),
) -> NavigationItemOut:
    item = await navigation_crud.get_navigation_item_by_id(db, item_id)
    if item is None:
        raise _not_found("Navigation item not found")
    return navigation_crud.serialize_navigation_item(item, {})


@router.put("/navigation/{item_id}", response_model=NavigationItemOut)
async def update_navigation_item(
    item_id: int,
    payload: NavigationItemUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("navigation.update")),
    _write_guard: None = Depends(require_admin_api_key),
) -> NavigationItemOut:
    item = await navigation_crud.get_navigation_item_by_id(db, item_id)
    if item is None:
        raise _not_found("Navigation item not found")
    old_value = serialize_for_audit(item)

    update_data = payload.model_dump(exclude_unset=True)
    if "parent_id" in update_data:
        parent_id = update_data["parent_id"]
        if parent_id == item_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A navigation item cannot be its own parent",
            )
        if parent_id is not None and await navigation_crud.get_navigation_item_by_id(
            db, parent_id
        ) is None:
            raise _not_found("Parent navigation item not found")

    navigation_crud.apply_navigation_item_update(item, payload)
    db.add(item)
    await _commit_with_conflict(db)
    await db.refresh(item)
    serialized = navigation_crud.serialize_navigation_item(item, {})
    await _log_route_audit(
        db,
        request=request,
        current_admin=current_admin,
        action="navigation.update",
        target_type="navigation_item",
        target_id=item.id,
        old_value=old_value,
        new_value=serialized,
    )
    return serialized


@router.delete("/navigation/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_navigation_item(
    item_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("navigation.delete")),
    _write_guard: None = Depends(require_admin_api_key),
) -> Response:
    item = await navigation_crud.get_navigation_item_by_id(db, item_id)
    if item is None:
        raise _not_found("Navigation item not found")
    return await _delete_and_audit(
        db,
        item,
        request=request,
        current_admin=current_admin,
        action="navigation.delete",
        target_type="navigation_item",
    )


@router.get("/pricing/plans", response_model=list[PricingPlanOut])
async def list_admin_pricing_plans(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("pricing.read")),
) -> list[PricingPlanOut]:
    return await pricing_crud.get_all_pricing_plans(db)


@router.post(
    "/pricing/plans",
    response_model=PricingPlanOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_pricing_plan(
    payload: PricingPlanCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("pricing.create")),
    _write_guard: None = Depends(require_admin_api_key),
) -> PricingPlanOut:
    plan = pricing_crud.build_pricing_plan(payload)
    db.add(plan)
    return await _refresh_load_and_audit(
        db,
        plan,
        pricing_crud.get_pricing_plan_by_id,
        request=request,
        current_admin=current_admin,
        action="pricing.create",
        target_type="pricing_plan",
    )


@router.get("/pricing/plans/{plan_id}", response_model=PricingPlanOut)
async def get_admin_pricing_plan(
    plan_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("pricing.read")),
) -> PricingPlanOut:
    plan = await pricing_crud.get_pricing_plan_by_id(db, plan_id)
    if plan is None:
        raise _not_found("Pricing plan not found")
    return plan


@router.put("/pricing/plans/{plan_id}", response_model=PricingPlanOut)
async def update_pricing_plan(
    plan_id: int,
    payload: PricingPlanUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("pricing.update")),
    _write_guard: None = Depends(require_admin_api_key),
) -> PricingPlanOut:
    plan = await pricing_crud.get_pricing_plan_by_id(db, plan_id)
    if plan is None:
        raise _not_found("Pricing plan not found")
    old_value = serialize_for_audit(plan)
    pricing_crud.apply_pricing_plan_update(plan, payload)
    db.add(plan)
    return await _refresh_load_and_audit(
        db,
        plan,
        pricing_crud.get_pricing_plan_by_id,
        request=request,
        current_admin=current_admin,
        action="pricing.update",
        target_type="pricing_plan",
        old_value=old_value,
    )


@router.delete("/pricing/plans/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pricing_plan(
    plan_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("pricing.delete")),
    _write_guard: None = Depends(require_admin_api_key),
) -> Response:
    plan = await pricing_crud.get_pricing_plan_by_id(db, plan_id)
    if plan is None:
        raise _not_found("Pricing plan not found")
    return await _delete_and_audit(
        db,
        plan,
        request=request,
        current_admin=current_admin,
        action="pricing.delete",
        target_type="pricing_plan",
    )


@router.get("/testimonials", response_model=list[TestimonialOut])
async def list_admin_testimonials(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("testimonial.read")),
) -> list[TestimonialOut]:
    return await testimonial_crud.get_all_testimonials(db)


@router.post(
    "/testimonials",
    response_model=TestimonialOut,
    status_code=status.HTTP_201_CREATED,
)
async def create_testimonial(
    payload: TestimonialCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> TestimonialOut:
    _assert_permission(current_admin, "testimonial.create")
    testimonial = testimonial_crud.build_testimonial(payload)
    payload_data = payload.model_dump(exclude_unset=True)
    next_status = normalize_content_status(
        current_status="draft",
        requested_status=payload_data.get("status"),
        requested_is_published=payload_data.get("is_active"),
    )
    _enforce_content_transition(
        current_admin,
        current_status="draft",
        next_status=next_status,
        permission_prefix="testimonial",
    )
    set_creator(testimonial, current_admin.id)
    apply_content_status(testimonial, next_status=next_status, actor_id=current_admin.id)
    if next_status == "published":
        _validate_testimonial_publish_fields(testimonial)
    db.add(testimonial)
    return await _refresh_load_and_audit(
        db,
        testimonial,
        testimonial_crud.get_testimonial_by_id,
        request=request,
        current_admin=current_admin,
        action="testimonial.create",
        target_type="testimonial",
    )


@router.get("/testimonials/{testimonial_id}", response_model=TestimonialOut)
async def get_admin_testimonial(
    testimonial_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("testimonial.read")),
) -> TestimonialOut:
    testimonial = await testimonial_crud.get_testimonial_by_id(db, testimonial_id)
    if testimonial is None:
        raise _not_found("Testimonial not found")
    return testimonial


@router.put("/testimonials/{testimonial_id}", response_model=TestimonialOut)
async def update_testimonial(
    testimonial_id: int,
    payload: TestimonialUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> TestimonialOut:
    testimonial = await testimonial_crud.get_testimonial_by_id(db, testimonial_id)
    if testimonial is None:
        raise _not_found("Testimonial not found")
    _enforce_content_edit_access(current_admin, testimonial, "testimonial")
    old_value = serialize_for_audit(testimonial)
    update_data = payload.model_dump(exclude_unset=True)
    next_status = normalize_content_status(
        current_status=_current_content_status(testimonial),
        requested_status=update_data.get("status"),
        requested_is_published=update_data.get("is_active"),
    )
    _enforce_content_transition(
        current_admin,
        current_status=_current_content_status(testimonial),
        next_status=next_status,
        permission_prefix="testimonial",
    )
    testimonial_crud.apply_testimonial_update(testimonial, payload)
    apply_content_status(testimonial, next_status=next_status, actor_id=current_admin.id)
    if next_status == "published":
        _validate_testimonial_publish_fields(testimonial)
    db.add(testimonial)
    return await _refresh_load_and_audit(
        db,
        testimonial,
        testimonial_crud.get_testimonial_by_id,
        request=request,
        current_admin=current_admin,
        action="testimonial.update",
        target_type="testimonial",
        old_value=old_value,
    )


@router.post("/testimonials/{testimonial_id}/submit", response_model=TestimonialOut)
async def submit_testimonial_for_review(
    testimonial_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> TestimonialOut:
    testimonial = await testimonial_crud.get_testimonial_by_id(db, testimonial_id)
    if testimonial is None:
        raise _not_found("Testimonial not found")
    _enforce_content_edit_access(current_admin, testimonial, "testimonial")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=testimonial,
        loader=testimonial_crud.get_testimonial_by_id,
        permission_prefix="testimonial",
        next_status=ContentWorkflowStatus.PENDING_REVIEW.value,
        action="testimonial.submit_review",
        target_type="testimonial",
        required_permission="testimonial.submit_review",
        allowed_current_statuses={
            ContentWorkflowStatus.DRAFT.value,
            ContentWorkflowStatus.REJECTED.value,
        },
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.post("/testimonials/{testimonial_id}/approve", response_model=TestimonialOut)
async def approve_testimonial(
    testimonial_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> TestimonialOut:
    testimonial = await testimonial_crud.get_testimonial_by_id(db, testimonial_id)
    if testimonial is None:
        raise _not_found("Testimonial not found")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=testimonial,
        loader=testimonial_crud.get_testimonial_by_id,
        permission_prefix="testimonial",
        next_status=ContentWorkflowStatus.PUBLISHED.value,
        action="testimonial.approve",
        target_type="testimonial",
        validator=_validate_testimonial_publish_fields,
        required_permission="testimonial.approve",
        allowed_current_statuses={ContentWorkflowStatus.PENDING_REVIEW.value},
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.post("/testimonials/{testimonial_id}/reject", response_model=TestimonialOut)
async def reject_testimonial(
    testimonial_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> TestimonialOut:
    testimonial = await testimonial_crud.get_testimonial_by_id(db, testimonial_id)
    if testimonial is None:
        raise _not_found("Testimonial not found")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=testimonial,
        loader=testimonial_crud.get_testimonial_by_id,
        permission_prefix="testimonial",
        next_status=ContentWorkflowStatus.REJECTED.value,
        action="testimonial.reject",
        target_type="testimonial",
        required_permission="testimonial.reject",
        allowed_current_statuses={ContentWorkflowStatus.PENDING_REVIEW.value},
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.post("/testimonials/{testimonial_id}/publish", response_model=TestimonialOut)
async def publish_testimonial(
    testimonial_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> TestimonialOut:
    testimonial = await testimonial_crud.get_testimonial_by_id(db, testimonial_id)
    if testimonial is None:
        raise _not_found("Testimonial not found")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=testimonial,
        loader=testimonial_crud.get_testimonial_by_id,
        permission_prefix="testimonial",
        next_status=ContentWorkflowStatus.PUBLISHED.value,
        action="testimonial.publish",
        target_type="testimonial",
        validator=_validate_testimonial_publish_fields,
        required_permission="testimonial.publish",
        allowed_current_statuses={
            ContentWorkflowStatus.DRAFT.value,
            ContentWorkflowStatus.PENDING_REVIEW.value,
            ContentWorkflowStatus.REJECTED.value,
        },
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.post("/testimonials/{testimonial_id}/archive", response_model=TestimonialOut)
async def archive_testimonial(
    testimonial_id: int,
    request: Request,
    payload: ContentWorkflowActionRequest | None = None,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(get_current_admin),
    _write_guard: None = Depends(require_admin_api_key),
) -> TestimonialOut:
    testimonial = await testimonial_crud.get_testimonial_by_id(db, testimonial_id)
    if testimonial is None:
        raise _not_found("Testimonial not found")
    return await _transition_content_status(
        db,
        request=request,
        current_admin=current_admin,
        instance=testimonial,
        loader=testimonial_crud.get_testimonial_by_id,
        permission_prefix="testimonial",
        next_status=ContentWorkflowStatus.ARCHIVED.value,
        action="testimonial.archive",
        target_type="testimonial",
        required_permission="testimonial.archive",
        allowed_current_statuses={
            ContentWorkflowStatus.DRAFT.value,
            ContentWorkflowStatus.PENDING_REVIEW.value,
            ContentWorkflowStatus.PUBLISHED.value,
            ContentWorkflowStatus.REJECTED.value,
        },
        audit_context={"reason": payload.reason} if payload and payload.reason else None,
    )


@router.delete("/testimonials/{testimonial_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_testimonial(
    testimonial_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("testimonial.delete")),
    _write_guard: None = Depends(require_admin_api_key),
) -> Response:
    testimonial = await testimonial_crud.get_testimonial_by_id(db, testimonial_id)
    if testimonial is None:
        raise _not_found("Testimonial not found")
    return await _delete_and_audit(
        db,
        testimonial,
        request=request,
        current_admin=current_admin,
        action="testimonial.delete",
        target_type="testimonial",
    )


@router.get("/site-settings", response_model=list[SiteSettingOut])
async def list_admin_site_settings(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("site_setting.read")),
) -> list[SiteSettingOut]:
    return await site_settings_crud.get_site_settings(db)


@router.post("/site-settings", response_model=SiteSettingOut, status_code=status.HTTP_201_CREATED)
async def create_site_setting(
    payload: SiteSettingCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("site_setting.create")),
    _write_guard: None = Depends(require_admin_api_key),
) -> SiteSettingOut:
    setting = site_settings_crud.build_site_setting(payload)
    db.add(setting)
    await _commit_with_conflict(db)
    refreshed = await site_settings_crud.get_site_setting_by_key(db, setting.key)
    if refreshed is None:
      raise _not_found("Site setting not found")
    await _log_route_audit(
        db,
        request=request,
        current_admin=current_admin,
        action="site_setting.create",
        target_type="site_setting",
        target_id=refreshed.key,
        old_value=None,
        new_value=refreshed,
    )
    return refreshed


@router.get("/site-settings/{setting_key}", response_model=SiteSettingOut)
async def get_admin_site_setting(
    setting_key: str,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("site_setting.read")),
) -> SiteSettingOut:
    setting = await site_settings_crud.get_site_setting_by_key(db, setting_key)
    if setting is None:
        raise _not_found("Site setting not found")
    return setting


@router.put("/site-settings/{setting_key}", response_model=SiteSettingOut)
async def update_site_setting(
    setting_key: str,
    payload: SiteSettingUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("site_setting.update")),
    _write_guard: None = Depends(require_admin_api_key),
) -> SiteSettingOut:
    setting = await site_settings_crud.get_site_setting_by_key(db, setting_key)
    if setting is None:
        raise _not_found("Site setting not found")
    old_value = serialize_for_audit(setting)
    site_settings_crud.apply_site_setting_update(setting, payload)
    db.add(setting)
    await _commit_with_conflict(db)
    next_key = payload.key if isinstance(payload.key, str) and payload.key.strip() else setting.key
    refreshed = await site_settings_crud.get_site_setting_by_key(db, next_key)
    if refreshed is None:
        raise _not_found("Site setting not found")
    await _log_route_audit(
        db,
        request=request,
        current_admin=current_admin,
        action="site_setting.update",
        target_type="site_setting",
        target_id=refreshed.key,
        old_value=old_value,
        new_value=refreshed,
    )
    return refreshed


@router.delete("/site-settings/{setting_key}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_site_setting(
    setting_key: str,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("site_setting.delete")),
    _write_guard: None = Depends(require_admin_api_key),
) -> Response:
    setting = await site_settings_crud.get_site_setting_by_key(db, setting_key)
    if setting is None:
        raise _not_found("Site setting not found")
    return await _delete_and_audit(
        db,
        setting,
        request=request,
        current_admin=current_admin,
        action="site_setting.delete",
        target_type="site_setting",
    )


@router.get("/media", response_model=list[MediaOut])
async def list_admin_media(
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("media.read")),
) -> list[MediaOut]:
    return await media_crud.get_media_items(db)


@router.post("/media/upload", response_model=MediaOut, status_code=status.HTTP_201_CREATED)
async def upload_media(
    request: Request,
    file: UploadFile = File(...),
    alt_text: str | None = Form(default=None),
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("media.create")),
    _write_guard: None = Depends(require_admin_api_key),
) -> MediaOut:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image uploads are supported",
        )

    suffix = Path(file.filename or "").suffix.lower() or ".bin"
    stored_name = f"{uuid4().hex}{suffix}"
    stored_path = uploads_dir / stored_name
    content = await file.read()
    stored_path.write_bytes(content)

    base_url = str(request.base_url).rstrip("/")
    media = media_crud.build_media_item(
        MediaCreate(
            url=f"{base_url}/uploads/{stored_name}",
            alt_text=alt_text,
            file_size=len(content),
            mime_type=file.content_type,
        )
    )
    db.add(media)
    return await _refresh_load_and_audit(
        db,
        media,
        media_crud.get_media_item_by_id,
        request=request,
        current_admin=current_admin,
        action="media.create",
        target_type="media",
    )


@router.post("/media", response_model=MediaOut, status_code=status.HTTP_201_CREATED)
async def create_media(
    payload: MediaCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("media.create")),
    _write_guard: None = Depends(require_admin_api_key),
) -> MediaOut:
    media = media_crud.build_media_item(payload)
    db.add(media)
    return await _refresh_load_and_audit(
        db,
        media,
        media_crud.get_media_item_by_id,
        request=request,
        current_admin=current_admin,
        action="media.create",
        target_type="media",
    )


@router.get("/media/{media_id}", response_model=MediaOut)
async def get_admin_media(
    media_id: int,
    db: AsyncSession = Depends(get_db),
    _: AdminUser = Depends(require_permission("media.read")),
) -> MediaOut:
    media = await media_crud.get_media_item_by_id(db, media_id)
    if media is None:
        raise _not_found("Media item not found")
    return media


@router.put("/media/{media_id}", response_model=MediaOut)
async def update_media(
    media_id: int,
    payload: MediaUpdate,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("media.update")),
    _write_guard: None = Depends(require_admin_api_key),
) -> MediaOut:
    media = await media_crud.get_media_item_by_id(db, media_id)
    if media is None:
        raise _not_found("Media item not found")
    old_value = serialize_for_audit(media)
    media_crud.apply_media_item_update(media, payload)
    db.add(media)
    return await _refresh_load_and_audit(
        db,
        media,
        media_crud.get_media_item_by_id,
        request=request,
        current_admin=current_admin,
        action="media.update",
        target_type="media",
        old_value=old_value,
    )


@router.delete("/media/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(
    media_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_admin: AdminUser = Depends(require_permission("media.delete")),
    _write_guard: None = Depends(require_admin_api_key),
) -> Response:
    media = await media_crud.get_media_item_by_id(db, media_id)
    if media is None:
        raise _not_found("Media item not found")
    return await _delete_and_audit(
        db,
        media,
        request=request,
        current_admin=current_admin,
        action="media.delete",
        target_type="media",
    )
```

### `../exxonim_backend/app/crud/page.py`

```python
from __future__ import annotations

from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Page
from app.schemas.page import PageCreate, PageUpdate


async def get_published_pages(db: AsyncSession) -> list[Page]:
    result = await db.execute(
        select(Page)
        .where(
            or_(
                Page.status == "published",
                and_(Page.status.is_(None), Page.is_published.is_(True)),
            )
        )
        .order_by(Page.title.asc())
    )
    return list(result.scalars().all())


async def get_page_by_slug(db: AsyncSession, slug: str) -> Page | None:
    result = await db.execute(
        select(Page).where(
            Page.slug == slug,
            or_(
                Page.status == "published",
                and_(Page.status.is_(None), Page.is_published.is_(True)),
            ),
        )
    )
    return result.scalar_one_or_none()


async def get_all_pages(db: AsyncSession) -> list[Page]:
    result = await db.execute(select(Page).order_by(Page.title.asc(), Page.id.asc()))
    return list(result.scalars().all())


async def get_page_by_id(db: AsyncSession, page_id: int) -> Page | None:
    result = await db.execute(select(Page).where(Page.id == page_id))
    return result.scalar_one_or_none()


def build_page(payload: PageCreate) -> Page:
    return Page(**payload.model_dump())


def apply_page_update(page: Page, payload: PageUpdate) -> Page:
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(page, field, value)
    return page
```

