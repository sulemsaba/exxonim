# Changes to Make

This document lists only actionable planned modifications for the Exxonim workspace. Rows that were already correct, stale after the Tailwind migration, or only informational have been removed.

---

## Table of Contents

1. [Navigation / Header](#1-navigation--header)
2. [Footer](#2-footer)
3. [Home Page - Hero Section](#3-home-page---hero-section)
4. [Home Page - Stack Section](#4-home-page---stack-section)
5. [Home Page - Provider / Marquee Section](#5-home-page---provider--marquee-section)
6. [Home Page - Insights / Blog Rail Section](#6-home-page---insights--blog-rail-section)
7. [Home Page - Service Packages & Testimonials Section](#7-home-page---service-packages--testimonials-section)
8. [Services Page - Overview Section](#8-services-page---overview-section)
9. [Services Page - Catalog / Engine Section](#9-services-page---catalog--engine-section)
10. [Resources / Blog Page](#10-resources--blog-page)
11. [Resource Article Page](#11-resource-article-page)
12. [Other Standard Pages](#12-other-standard-pages)
13. [Global Styles & Theme](#13-global-styles--theme)
14. [Admin Dashboard](#14-admin-dashboard)
15. [Backend API](#15-backend-api)
16. [Build & Configuration](#16-build--configuration)

---

## 1. Navigation / Header

### File: `exxonim/apps/public/src/components/Navigation.tsx`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 1.1 | **Close dropdown from internal interactions** | Dropdown links close the menu, but clicking non-link padding inside an open dropdown leaves it open. | Close the active dropdown when a user activates an item, clicks outside the menu, or clicks a safe non-interactive area that should dismiss the menu. |
| 1.2 | **Mobile menu scroll lock cleanup** | On mobile close, `document.body.style.overflow` is reset to an empty string. | Store the previous body overflow value before locking scroll, then restore that exact value on cleanup. |
| 1.3 | **Improve desktop dropdown keyboard behavior** | Desktop dropdown state can remain open when focus moves away, and keyboard close behavior is limited. | Add standard keyboard handling: `Escape` closes the dropdown, `aria-expanded` stays accurate, focus can move through items naturally, and the dropdown closes on blur/outside interaction. |
| 1.4 | **Phone button shimmer keyframes mismatch** | The `call-shimmer` animation ends at `translateX(420%)`, which may not fully clear wider button widths. | Increase the travel distance or make the shimmer movement relative to the button width so it exits cleanly on all viewport sizes. |
| 1.5 | **Close dropdown when tabbing away from nav** | `handleDropdownBlur` only handles focus leaving the dropdown container. | Add a blur check on the broader navigation/pill container so any open dropdown closes when focus leaves the nav entirely. |

---

## 2. Footer

### File: `exxonim/apps/public/src/components/Footer.tsx`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 2.1 | **Canvas render loop memory optimization** | Tile color styles are recalculated and assigned inside the block loop every frame. | Cache tile color values by threshold and reuse them during rendering. |
| 2.2 | **Reduce animation frame requests when pointer is idle** | The animation loop can continue while block energy fades, even after the pointer has been idle for a while. | Stop the loop when there has been no pointer movement for 2 seconds and all block values are below `0.01`; restart on the next pointer event. |
| 2.3 | **Canvas initialization on hidden footer** | Canvas setup can run before the footer has a useful layout box. | Defer setup with `requestAnimationFrame` or initialize through an `IntersectionObserver` when the footer is near the viewport. |
| 2.4 | **Debounce touch pointer release** | Touch end/cancel clears pointer state immediately, which can cause flicker. | Delay touch pointer reset by about 150ms before clearing the active pointer position. |
| 2.5 | **Social media link accessibility** | Social links rely on generated labels. | Ensure `socialLabel()` produces meaningful labels such as `Visit Exxonim on LinkedIn`. |
| 2.6 | **Responsive grid breakpoint smoothing** | The footer jumps from 4 columns to 2 columns at 1023px, then 1 column at 767px. | Add a smoother responsive grid progression, such as 4 -> 3 -> 2 -> 1 columns or `minmax`-based wrapping. |

---

## 3. Home Page - Hero Section

### Files

- `exxonim/apps/public/src/components/ReferenceHero.tsx`
- `exxonim/apps/public/src/pages/HomePage.tsx`
- `exxonim/apps/public/src/tailwind.css`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 3.1 | **Resolve hero implementation mismatch** | `HomePage` renders `ReferenceHero`, while `tailwind.css` still contains additional hero/device-mockup styles that may be unused. | Choose the intended hero implementation. Either align `ReferenceHero` with the richer site hero treatment or remove unused hero styles after confirming they are not referenced. |
| 3.2 | **Improve highlights grid on small screens** | `.hero-section__highlights` uses `minmax(150px, 1fr)`, which can feel oversized on narrow mobile widths. | Use a smaller minimum such as `minmax(120px, 1fr)` and reduce mobile gaps. |
| 3.3 | **Move CTA styles out of JSX** | The hero CTA still has presentation styles tied directly to the component. | Keep CTA presentation in `tailwind.css` or Tailwind utilities so component markup stays clean. |
| 3.4 | **Add dark theme support for the hero** | Hero gradient and supporting colors are hardcoded for light mode. | Add `html[data-theme="dark"]` hero overrides with dark-appropriate colors and contrast. |

---

## 4. Home Page - Stack Section

### Files

- `exxonim/apps/public/src/components/StackSection.tsx`
- `exxonim/apps/public/src/tailwind.css`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 4.1 | **Scroll-driven scale animation drops frames** | The sticky scroll effect recalculates card transforms during scroll. | Add scroll backpressure or move more of the effect to `IntersectionObserver` so the section remains smooth on long pages. |
| 4.2 | **Unused feature visual keyframes** | `@keyframes feature-visual-fade` exists in `tailwind.css` but is not applied. | Remove the unused keyframes or wire them to an intentional transition. |
| 4.3 | **Accordion transitions feel abrupt** | Accordion panels switch open/closed state without a smooth height transition. | Add a controlled height/max-height transition that works with the existing selected feature state. |
| 4.4 | **Reference visual content is hardcoded** | `renderReferenceVisual(index)` switches between hardcoded JSX variants. | Drive visual content from CMS/page data with a `visualKey` or similar mapping. |
| 4.5 | **Compose visual copy is hardcoded** | Visual helpers such as `renderTaxApprovalsVisual()` and `renderInstitutionalSupportVisual()` contain fixed copy. | Move visual labels and support copy into mapped content data. |
| 4.6 | **Mobile layout hides feature visuals** | `.feature-visual-stage` is hidden at tablet/mobile widths. | Provide a simplified mobile visual or stack the visual above the accordion. |

---

## 5. Home Page - Provider / Marquee Section

### Files

- `exxonim/apps/public/src/components/ProviderSection.tsx`
- `exxonim/apps/public/src/tailwind.css`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 5.1 | **Pause marquee on keyboard focus** | The marquee pauses on hover, but not when focused through keyboard navigation. | Add `.provider-marquee:focus-within .provider-track` so keyboard users get the same pause behavior. |
| 5.2 | **Avoid duplicate logo announcements** | Logos are duplicated for the seamless loop, so assistive tech can encounter repeated logos. | Mark the duplicated logo set as `aria-hidden="true"` while keeping the visible loop intact. |

---

## 6. Home Page - Insights / Blog Rail Section

### Files

- `exxonim/apps/public/src/components/InsightsSection.tsx`
- `exxonim/apps/public/src/pages/HomePage.tsx`
- `exxonim/apps/public/src/tailwind.css`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 6.1 | **Disable rail buttons when scrolling is unavailable** | Previous/next callbacks call `scrollBy()`, but buttons can still appear active when there are no posts or no scrollable overflow. | Track rail scroll position and disable buttons when empty, at the start, or at the end. |
| 6.2 | **Author avatar fallback color** | The author avatar uses a hardcoded gradient with theme-specific overrides. | Add a stable fallback background color so the avatar remains readable if a CSS variable is unavailable. |

---

## 7. Home Page - Service Packages & Testimonials Section

### Files

- `exxonim/apps/public/src/components/ServicePlansSection.tsx`
- `exxonim/apps/public/src/tailwind.css`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 7.1 | **Shorten testimonial manual pause** | Manual testimonial interaction pauses auto-rotation for 12 seconds. | Reduce the manual pause to 8 seconds. |
| 7.2 | **Improve excluded-feature accessibility** | Excluded features use a multiplication sign as a visual marker. | Mark the symbol `aria-hidden="true"` and expose clear assistive text such as `Not included`. |

---

## 8. Services Page - Overview Section

### Files

- `exxonim/apps/public/src/components/ServicesOverviewSection.tsx`
- `exxonim/apps/public/src/tailwind.css`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 8.1 | **Animate service group arrow on hover** | Service group cards have hover movement, but the arrow indicator does not respond. | Add a small arrow translate animation on hover/focus. |
| 8.2 | **Wire or remove mouse-tracking CSS variables** | `.services-overview::after` uses `--mouse-x` and `--mouse-y`, but the component does not set them. | Add pointer tracking on the section or remove the unused variable-dependent effect. |
| 8.3 | **Make signal value badge responsive** | `.services-overview__signal-value` can overflow on very narrow screens. | Add responsive font sizing such as `font-size: clamp(0.8rem, 2vw, 1rem)`. |

---

## 9. Services Page - Catalog / Engine Section

### Files

- `exxonim/apps/public/src/components/EngineSection.tsx`
- `exxonim/apps/public/src/tailwind.css`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 9.1 | **Add service card scroll margin** | Individual `.service-catalog__service` cards do not reserve space for the fixed header when linked by anchor. | Add `scroll-margin-top: calc(var(--header-height) + 1rem)`. |

---

## 10. Resources / Blog Page

### Files

- `exxonim/apps/public/src/pages/ResourcesPage.tsx`
- `exxonim/apps/public/src/tailwind.css`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 10.1 | **Support aria-pressed active filter styling** | Category filter CSS targets `.cx-filter-btn.active`. | Also support `.cx-filter-btn[aria-pressed="true"]` so visual state follows accessible state. |
| 10.2 | **Trending thumbnail fallback** | If `trendingMedia` is empty, a trending item can render an image with an undefined source. | Fall back to the post cover image or a non-image placeholder. |
| 10.3 | **Show remaining post count** | The "See more" button loads more posts but does not show how many remain. | Update the label to include the remaining count when useful. |
| 10.4 | **Reduce repeated page-level CSS variables** | `resourcesPageStyles` repeats many `--cx-*` custom properties for light and dark themes. | Keep the light defaults once and define only dark overrides in the dark theme block. |

---

## 11. Resource Article Page

### Files

- `exxonim/apps/public/src/pages/ResourceArticlePage.tsx`
- `exxonim/apps/public/src/tailwind.css`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 11.1 | **Article body fallback when HTML is missing** | Article body content can be empty when `content.html` is absent. | Render `content.sections` as structured fallback paragraphs/sections when HTML is unavailable. |
| 11.2 | **Add section navigation for long articles** | Long articles do not provide quick section navigation. | Add a sticky desktop table of contents and a compact mobile sections control. |

---

## 12. Other Standard Pages

### File: `exxonim/apps/public/src/pages/AboutPage.tsx`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 12.1 | **Constrain long paragraph width** | Company profile paragraphs can become too wide on large screens. | Add a readable max width such as `72ch` or `48rem`. |

### File: `exxonim/apps/public/src/pages/FaqPage.tsx`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 12.2 | **Add FAQ accordion behavior** | FAQ cards render all answers open by default. | Make FAQ items expandable so long FAQ lists are easier to scan. |

### File: `exxonim/apps/public/src/pages/InfoPages.tsx`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 12.3 | **Reduce mobile info grid gap** | `.info-page__grid` uses the same gap on mobile and desktop. | Reduce mobile gap below 767px to about `0.85rem`. |

### File: `exxonim/apps/public/src/pages/CareerPage.tsx`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 12.4 | **Render focus areas as chips** | Career focus areas are displayed as a plain text list. | Render them as compact chip/badge elements consistent with the public-site design system. |

---

## 13. Global Styles & Theme

### File: `exxonim/apps/public/src/tailwind.css`

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 13.1 | **Merge duplicate `.section-anchor` rules** | `.section-anchor` is defined once with scroll margin and later again with `height: 0`. | Merge into one rule that preserves both intended behaviors without accidental override. |
| 13.2 | **Broaden reduced-motion support** | Only some animations have `prefers-reduced-motion` handling. | Add a global reduced-motion rule covering marquee, shimmer, drift, code-pan, hero, and similar animations. |
| 13.3 | **Audit potentially unused hero/blog CSS** | Classes such as `.blog-controls`, `.hero-figure`, `.hero-motion`, `.hero-motion__trail`, and `.hero-motion__orb` may be unused. | Verify references and remove unused CSS after the hero decision is complete. |
| 13.4 | **Review font loading strategy** | `EB Garamond` is imported from Google Fonts in the CSS entrypoint. | Keep `display=swap` and consider preloading or self-hosting if CLS/font loading becomes visible in production. |
| 13.5 | **Normalize component CSS variable naming** | Some component-scoped variables overlap conceptually with global `--color-*` tokens. | Keep global theme tokens under `--color-*` and component-local tokens under component-specific prefixes. |

---

## 14. Admin Dashboard

### File: `exxonim/apps/admin-next/` (multiple files)

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 14.1 | **MUI v7 compatibility audit** | The admin app uses `@mui/material` v7. | Audit admin components for deprecated or changed MUI APIs and update any concrete findings. |
| 14.2 | **Remove checked-in stale React 19 dependencies** | `apps/admin-next/node_modules.stale-react19/` is present in version control. | Remove the stale dependency directory and ensure generated dependency folders stay ignored. |
| 14.3 | **Improve route error fallback** | `routes/components/error-boundary.tsx` renders route errors but has no reload action or logging hook. | Add a reload button and a lightweight error logging path. |
| 14.4 | **Remove workspace backup file** | `admin-workspace-view.tsx.backup` exists in the workspace. | Remove the backup file and ensure backup artifacts are not committed. |
| 14.5 | **Tighten TypeScript indexed access checks** | `strict` is enabled through the base config, but `noUncheckedIndexedAccess` is not enabled. | Enable `noUncheckedIndexedAccess` after fixing resulting null/undefined issues. |

---

## 15. Backend API

### File: `exxonim_backend/` (sibling backend project)

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 15.1 | **Add rate limiting** | The FastAPI app does not include rate limiting middleware. | Add rate limiting for auth, consultation, and other public mutation endpoints. |
| 15.2 | **Enhance health check responses** | `/health/live` and `/health/ready` return simple status payloads; readiness checks the database. | Include dependency status and timestamp fields, such as database connectivity and current server time. |

---

## 16. Build & Configuration

| # | Change | Current Behavior | Desired Behavior |
|---|--------|------------------|------------------|
| 16.1 | **Add production Dockerfiles for frontends** | The public and admin apps do not have production-ready Dockerfiles. | Add Dockerfiles for `apps/public` and `apps/admin-next` using Nginx or another static-file server. |
| 16.2 | **Add backend Python formatter config** | The backend has no `pyproject.toml` formatter configuration. | Add Ruff format or Black configuration for consistent Python formatting. |
| 16.3 | **Add pre-commit hooks** | Workspace-level git hooks are not configured. | Add pre-commit hooks for linting, formatting, and type checks. |
| 16.4 | **Add workspace aggregate scripts** | Root scripts exist for individual apps, but there is no simple aggregate `dev` or `build` alias. | Add root scripts such as `dev` and `build` that run the appropriate workspace commands. |

---

## Suggested Implementation Order

1. Public app accessibility and bug fixes: Navigation, Provider, Insights, Resources, Resource Article.
2. Public app performance and layout fixes: Footer, Stack, Services, Global Styles.
3. Public page polish: Hero, About, FAQ, Info, Career.
4. Admin cleanup: stale dependency artifacts, backup file, error fallback, TypeScript tightening.
5. Backend and build hardening: rate limits, health payloads, frontend Dockerfiles, formatter config, pre-commit hooks, aggregate scripts.
