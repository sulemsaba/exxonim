# Blog System Audit

## Summary

The current blog stack is functional, but the public blog experience is still stronger than the backend contract behind it. Admin publishing, public `Resources` composition, and backend blog APIs now work together, but the system still depends on a few frontend-side editorial rules and a loose `content` payload.

This audit records the live state after the current cleanup pass and the main risks that remain.

## Current Live Shape

- Backend identity is now `Exxonim Website Platform API`.
- Public blog API:
  - `GET /api/v1/blog/posts`
  - `GET /api/v1/blog/posts/:slug`
  - `GET /api/v1/blog/categories`
  - `GET /api/v1/blog/authors`
  - `GET /api/v1/blog/authors/:slug`
- Admin blog API:
  - `GET /api/v1/admin/blog/posts`
  - `POST /api/v1/admin/blog/posts`
  - `GET /api/v1/admin/blog/posts/:id`
  - `PUT /api/v1/admin/blog/posts/:id`
  - `DELETE /api/v1/admin/blog/posts/:id`
  - matching category and author resources under `/api/v1/admin/blog/...`
- Public blog layout is still frontend-driven:
  - hero post
  - top rail posts
  - remaining grid
- Editorial fields used for placement:
  - `featured_slot`
  - `featured_on_home`

## What Was Fixed In This Pass

- Renamed the backend API identity away from the narrow `Marketing Site API` label.
- Replaced stale route documentation that still described old `blog-posts`, `/public/...`, and `/api/home` paths.
- Added direct backend author lookup by slug instead of loading all authors and filtering in Python.
- Made the public blog service honor `featured` requests instead of silently ignoring them.
- Centralized public blog logic into shared helpers for:
  - usable article body detection
  - HTML sanitization
  - fallback article-section rendering
  - hero/top-rail/grid composition

## Main Findings

### 1. Backend contract is still thinner than the public experience

The public `Resources` page expects editorial placement and resilient fallback behavior. That works now, but the backend still exposes mostly raw blog resources without first-class layout semantics.

This is acceptable for now because the fallback logic is explicit and stable in frontend helpers, but it is still a frontend-owned composition layer.

### 2. Blog content is still stored as a loose `content` record

`content` remains a generic object that may contain:

- `introduction`
- `highlights`
- `sections`
- `html`

That allows flexibility, but it also means validation and rendering must stay disciplined. The system now uses a shared body-availability rule on the public side and a matching backend publish rule, but the shape itself is still permissive.

### 3. Real revision support does not exist in the backend

The live backend does not expose a true revision resource or approval workflow. Any editor UX that implies a real server-side revision model should be treated carefully until backend revision support is deliberately implemented.

### 4. Public blog rendering is still page-heavy

The public `ResourcesPage.tsx` and `ResourceArticlePage.tsx` still contain large style/layout blocks. The core blog composition logic is cleaner now, but visual/rendering ownership is still concentrated in page files instead of smaller reusable presentation units.

### 5. Documentation drift was part of the problem

The repo contained stale references to:

- `/api/home`
- `/api/v1/public/...`
- `/api/v1/admin/blog-posts`

That made the live system harder to reason about than it needed to be. The major active references were cleaned, but older historical docs may still exist outside the main paths.

## Remaining Recommended Work

### High priority

- Introduce a dedicated backend helper/service for blog placement queries if hero/top-rail composition needs to become API-driven.
- Replace the generic `content: dict[str, Any]` model with a stricter typed blog content schema once the authoring model is stable.
- Add backend pagination and richer filtering for public blog listing if the post library grows materially.

### Medium priority

- Break the public blog pages into smaller presentational components so styling and layout are easier to maintain.
- Add explicit public author pages if author bios are expected to be a first-class part of the content strategy.
- Add backend-side related-post selection rules if editorial control over related content becomes important.

### Deferred

- Real revision-resource workflow with draft/review/approve states.
- Server-side blog layout API for hero/top-rail placement previews.
- Search and tag-based public blog discovery beyond category filtering.

## Operational Rules To Keep

- Admin can still decide the hero and top-rail posts through editorial fields.
- Public blog must never hide valid published posts because featured placement is partially unset.
- A post is publishable only when it has:
  - title
  - slug
  - excerpt
  - category
  - author
  - cover image
  - usable article body

## Acceptance Snapshot

The blog system is currently acceptable for production content publishing if:

- published posts reliably appear on `Resources`
- hero and top-rail fallback rules remain intact
- article pages render both HTML-body and structured-content posts
- admin only saves real category/author selections
- active docs continue to match the live API shape
