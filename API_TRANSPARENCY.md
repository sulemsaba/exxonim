# API Transparency Reference

This file is a design-facing source of truth for the current codebase state in `nim/` and `nim_backend/`.

It is intentionally transparent:
- It lists the implemented backend APIs.
- It shows the request and response shapes the backend actually accepts.
- It calls out frontend assumptions that are not backed by the current backend.
- It notes the places where a route exists in code but is not actually mounted.

Current codebase date context: `2026-03-25`

## Scope

Sources used to build this file:
- `nim_backend/app/main.py`
- `nim_backend/app/routers/*.py`
- `nim_backend/app/schemas/*.py`
- `nim_backend/app/models/*.py`
- `nim_backend/app/services/blog_service.py`
- `nim/packages/shared/src/api/routes.ts`
- `nim/packages/shared/src/contracts/*.ts`
- `nim/apps/admin/src/services/*.ts`
- `nim/apps/public/src/services/*.ts`

## Runtime Facts

- Default API base URL: `http://localhost:8000/api/v1`
- FastAPI mounts all API routes under `/api/v1`
- Uploaded files are served from `/uploads/<filename>` outside `/api/v1`
- Root health-like check outside the API prefix:
  - `GET /`
  - Response:
    ```json
    { "message": "API is running" }
    ```
- API health endpoint:
  - `GET /api/v1/health`
  - Response:
    ```json
    { "status": "ok" }
    ```

## Authentication

Admin endpoints require bearer auth except login and refresh.

- Header:
  - `Authorization: Bearer <access_token>`
- Protected route family:
  - `/api/v1/admin/*`
- Public route family:
  - `/api/v1/blog/*`
  - `/api/v1/pages/*`
  - `/api/v1/navigation/*`
  - `/api/v1/pricing/*`
  - `/api/v1/testimonials/*`
  - `/api/v1/site-settings/*`
  - `/api/v1/media/*`

Known auth behavior:
- Missing token: `401`
- Invalid token: `401`
- Wrong token type: `401`
- Inactive admin account: `401`

## Implemented Backend API Surface

### Root and Health

- `GET /`
  - Auth: no
  - Response:
    ```json
    { "message": "API is running" }
    ```

- `GET /api/v1/health`
  - Auth: no
  - Response:
    ```json
    { "status": "ok" }
    ```

### Admin Auth

- `POST /api/v1/admin/auth/login`
  - Auth: no
  - Request:
    ```json
    {
      "email": "admin@example.com",
      "password": "password123"
    }
    ```
  - Response:
    ```json
    {
      "access_token": "jwt",
      "refresh_token": "jwt",
      "token_type": "bearer",
      "admin": {
        "id": 1,
        "email": "admin@example.com",
        "is_active": true,
        "created_at": "2026-03-25T10:30:00Z",
        "updated_at": "2026-03-25T10:30:00Z"
      }
    }
    ```
  - Notes:
    - Backend requires `password` minimum length `8`
    - The backend admin user object does not currently include `full_name`, `role`, or `last_login_at`

- `POST /api/v1/admin/auth/refresh`
  - Auth: no
  - Request:
    ```json
    { "refresh_token": "jwt" }
    ```
  - Response:
    ```json
    {
      "access_token": "jwt",
      "token_type": "bearer"
    }
    ```

- `GET /api/v1/admin/auth/me`
  - Auth: yes
  - Response:
    ```json
    {
      "id": 1,
      "email": "admin@example.com",
      "is_active": true,
      "created_at": "2026-03-25T10:30:00Z",
      "updated_at": "2026-03-25T10:30:00Z"
    }
    ```

### Admin Blog

#### Posts

- `GET /api/v1/admin/blog/posts`
  - Auth: yes
  - Response: `BlogPostOut[]`
  - Notes:
    - Returns an array, not a paginated object
    - No server-side search, filter, or pagination parameters are implemented

- `GET /api/v1/admin/blog/posts/{post_id}`
  - Auth: yes
  - Response: `BlogPostOut`

- `POST /api/v1/admin/blog/posts`
  - Auth: yes
  - Request body:
    ```json
    {
      "title": "NGO Compliance 101",
      "slug": "ngo-compliance-101",
      "excerpt": "What NGOs need to prepare before filing.",
      "content": {
        "introduction": "The landscape is changing quickly.",
        "highlights": [],
        "sections": [
          {
            "heading": "Main Section",
            "paragraphs": [
              "First paragraph.",
              "Second paragraph."
            ]
          }
        ]
      },
      "category_id": 1,
      "author_id": 2,
      "featured_image": "http://localhost:8000/uploads/abc123.webp",
      "cover_alt": "NGO compliance cover",
      "media_label": "Hero cover",
      "featured_slot": "primary",
      "featured_on_home": true,
      "read_time_minutes": 5,
      "related_slugs": ["business-registration-guide"],
      "meta_title": "NGO Compliance 101 | Exxonim",
      "meta_description": "A practical NGO compliance checklist.",
      "published_at": "2026-03-25T10:30:00Z",
      "is_published": false
    }
    ```
  - Response: `BlogPostOut`

- `PUT /api/v1/admin/blog/posts/{post_id}`
  - Auth: yes
  - Request body:
    - Partial `BlogPostUpdate`
    - Same shape as create, all fields optional
  - Response: `BlogPostOut`

- `DELETE /api/v1/admin/blog/posts/{post_id}`
  - Auth: yes
  - Response: `204 No Content`

#### Categories

- `GET /api/v1/admin/blog/categories`
  - Auth: yes
  - Response: `BlogCategoryOut[]`

- `POST /api/v1/admin/blog/categories`
  - Auth: yes
  - Request:
    ```json
    {
      "name": "Guides",
      "slug": "guides",
      "description": "Long-form guidance posts."
    }
    ```
  - Response: `BlogCategoryOut`

- `PUT /api/v1/admin/blog/categories/{category_id}`
  - Auth: yes
  - Request:
    ```json
    {
      "name": "Guides",
      "slug": "guides",
      "description": "Updated description"
    }
    ```
  - Response: `BlogCategoryOut`

- `DELETE /api/v1/admin/blog/categories/{category_id}`
  - Auth: yes
  - Response: `204 No Content`

#### Authors

- `GET /api/v1/admin/blog/authors`
  - Auth: yes
  - Response: `BlogAuthorOut[]`

- `POST /api/v1/admin/blog/authors`
  - Auth: yes
  - Request:
    ```json
    {
      "slug": "asha-j",
      "name": "Asha J.",
      "role": "Legal Writer",
      "avatar_src": "https://example.com/avatar.webp"
    }
    ```
  - Response: `BlogAuthorOut`

- `PUT /api/v1/admin/blog/authors/{author_id}`
  - Auth: yes
  - Request:
    ```json
    {
      "name": "Asha James",
      "role": "Senior Legal Writer"
    }
    ```
  - Response: `BlogAuthorOut`

- `DELETE /api/v1/admin/blog/authors/{author_id}`
  - Auth: yes
  - Response: `204 No Content`

### Admin Pages

- `GET /api/v1/admin/pages`
  - Auth: yes
  - Response: `PageOut[]`

- `POST /api/v1/admin/pages`
  - Auth: yes
  - Request:
    ```json
    {
      "title": "About Exxonim",
      "slug": "about",
      "content": {
        "hero": {
          "eyebrow": "Who we are",
          "headline": "About Exxonim"
        }
      },
      "meta_title": "About Exxonim",
      "meta_description": "Learn about Exxonim.",
      "is_published": true
    }
    ```
  - Response: `PageOut`

- `GET /api/v1/admin/pages/{page_id}`
  - Auth: yes
  - Response: `PageOut`

- `PUT /api/v1/admin/pages/{page_id}`
  - Auth: yes
  - Request:
    - Partial page payload
  - Response: `PageOut`

- `DELETE /api/v1/admin/pages/{page_id}`
  - Auth: yes
  - Response: `204 No Content`

### Admin Navigation

- `GET /api/v1/admin/navigation`
  - Auth: yes
  - Response: `NavigationItemOut[]`
  - Notes:
    - Returns a nested tree
    - Includes inactive items as well

- `POST /api/v1/admin/navigation`
  - Auth: yes
  - Request:
    ```json
    {
      "title": "Resources",
      "url": "/resources",
      "description": "Resource hub",
      "kind": "link",
      "parent_id": null,
      "order": 0,
      "is_active": true
    }
    ```
  - Response: `NavigationItemOut`

- `GET /api/v1/admin/navigation/{item_id}`
  - Auth: yes
  - Response: `NavigationItemOut`

- `PUT /api/v1/admin/navigation/{item_id}`
  - Auth: yes
  - Request:
    - Partial navigation payload
  - Response: `NavigationItemOut`
  - Notes:
    - `parent_id` cannot be the item itself

- `DELETE /api/v1/admin/navigation/{item_id}`
  - Auth: yes
  - Response: `204 No Content`

### Admin Pricing

- `GET /api/v1/admin/pricing/plans`
  - Auth: yes
  - Response: `PricingPlanOut[]`

- `POST /api/v1/admin/pricing/plans`
  - Auth: yes
  - Request:
    ```json
    {
      "name": "Growth",
      "badge": "Popular",
      "description": "For growing teams.",
      "notes": "Annual billing available.",
      "price": 2500,
      "features": [
        { "label": "Company setup", "included": true },
        { "label": "Tax support", "included": true }
      ],
      "recommended": true,
      "sort_order": 1,
      "is_active": true
    }
    ```
  - Response: `PricingPlanOut`

- `GET /api/v1/admin/pricing/plans/{plan_id}`
  - Auth: yes
  - Response: `PricingPlanOut`

- `PUT /api/v1/admin/pricing/plans/{plan_id}`
  - Auth: yes
  - Request:
    - Partial pricing payload
  - Response: `PricingPlanOut`

- `DELETE /api/v1/admin/pricing/plans/{plan_id}`
  - Auth: yes
  - Response: `204 No Content`

### Admin Testimonials

- `GET /api/v1/admin/testimonials`
  - Auth: yes
  - Response: `TestimonialOut[]`

- `POST /api/v1/admin/testimonials`
  - Auth: yes
  - Request:
    ```json
    {
      "eyebrow": "Client story",
      "headline": "Made expansion easier",
      "support": "Support text",
      "author": "Jane Doe",
      "author_role": "Founder",
      "initials": "JD",
      "content": "They helped us move quickly.",
      "rating": 5,
      "sort_order": 0,
      "is_active": true
    }
    ```
  - Response: `TestimonialOut`

- `GET /api/v1/admin/testimonials/{testimonial_id}`
  - Auth: yes
  - Response: `TestimonialOut`

- `PUT /api/v1/admin/testimonials/{testimonial_id}`
  - Auth: yes
  - Request:
    - Partial testimonial payload
  - Response: `TestimonialOut`

- `DELETE /api/v1/admin/testimonials/{testimonial_id}`
  - Auth: yes
  - Response: `204 No Content`

### Admin Site Settings

- `GET /api/v1/admin/site-settings`
  - Auth: yes
  - Response: `SiteSettingOut[]`

- `POST /api/v1/admin/site-settings`
  - Auth: yes
  - Request:
    ```json
    {
      "key": "brand",
      "value": {
        "name": "Exxonim",
        "companyShortName": "Exxonim",
        "tagline": "Build with confidence",
        "lightLogoSrc": "/assets/logo-light.webp",
        "darkLogoSrc": "/assets/logo-dark.webp",
        "faviconUrl": "/favicon.ico",
        "brandColors": {
          "primary": "#0f5c63",
          "secondary": "#73c7bb"
        }
      }
    }
    ```
  - Response: `SiteSettingOut`

- `GET /api/v1/admin/site-settings/{setting_key}`
  - Auth: yes
  - Response: `SiteSettingOut`

- `PUT /api/v1/admin/site-settings/{setting_key}`
  - Auth: yes
  - Request:
    ```json
    {
      "key": "brand",
      "value": {
        "name": "Exxonim"
      }
    }
    ```
  - Response: `SiteSettingOut`

- `DELETE /api/v1/admin/site-settings/{setting_key}`
  - Auth: yes
  - Response: `204 No Content`

### Admin Media

- `GET /api/v1/admin/media`
  - Auth: yes
  - Response: `MediaOut[]`

- `POST /api/v1/admin/media/upload`
  - Auth: yes
  - Content type: `multipart/form-data`
  - Form fields:
    - `file`: required, must be an image
    - `alt_text`: optional
  - Response:
    ```json
    {
      "id": 9,
      "url": "http://localhost:8000/uploads/abc123.webp",
      "alt_text": "Cover image",
      "file_size": 12345,
      "mime_type": "image/webp",
      "uploaded_at": "2026-03-25T10:30:00Z"
    }
    ```
  - Notes:
    - Files are stored locally under the backend uploads directory
    - Uploaded file URLs are public at `/uploads/<generated-name>`
    - Only image uploads are accepted

- `POST /api/v1/admin/media`
  - Auth: yes
  - Request:
    ```json
    {
      "url": "https://example.com/cover.webp",
      "alt_text": "Cover image",
      "file_size": 12345,
      "mime_type": "image/webp"
    }
    ```
  - Response: `MediaOut`

- `GET /api/v1/admin/media/{media_id}`
  - Auth: yes
  - Response: `MediaOut`

- `PUT /api/v1/admin/media/{media_id}`
  - Auth: yes
  - Request:
    - Partial media payload
  - Response: `MediaOut`

- `DELETE /api/v1/admin/media/{media_id}`
  - Auth: yes
  - Response: `204 No Content`

### Public Blog

- `GET /api/v1/blog/posts`
  - Auth: no
  - Query params:
    - `skip`: integer, default `0`
    - `limit`: integer, default `10`, max `50`
    - `featured`: boolean, default `false`
    - `featured_on_home`: boolean, default `false`
  - Response: `BlogPostOut[]`
  - Behavior:
    - Only published posts are returned
    - If `featured=true` or `featured_on_home=true`, the service returns featured posts
    - If the primary query fails, fallback featured posts may be returned and the response can include header `X-Used-Fallback: 1`

- `GET /api/v1/blog/posts/{slug}`
  - Auth: no
  - Response: `BlogPostOut`
  - Notes:
    - Only published posts can be fetched by slug

- `GET /api/v1/blog/categories`
  - Auth: no
  - Response: `BlogCategoryOut[]`

- `GET /api/v1/blog/authors`
  - Auth: no
  - Response: `BlogAuthorOut[]`

- `GET /api/v1/blog/authors/{author_slug}`
  - Auth: no
  - Response: `BlogAuthorOut`

### Public Pages

- `GET /api/v1/pages/`
  - Auth: no
  - Response: `PageOut[]`
  - Notes:
    - Only published pages are returned

- `GET /api/v1/pages/{slug}`
  - Auth: no
  - Response: `PageOut`
  - Notes:
    - Only published pages are returned

### Public Navigation

- `GET /api/v1/navigation/`
  - Auth: no
  - Response: `NavigationItemOut[]`
  - Notes:
    - Only active navigation items are returned
    - Response is nested

### Public Pricing

- `GET /api/v1/pricing/plans`
  - Auth: no
  - Response: `PricingPlanOut[]`
  - Notes:
    - Only active plans are returned

### Public Testimonials

- `GET /api/v1/testimonials/`
  - Auth: no
  - Response: `TestimonialOut[]`
  - Notes:
    - Only active testimonials are returned

### Public Site Settings

- `GET /api/v1/site-settings/`
  - Auth: no
  - Response: `SiteSettingOut[]`

- `GET /api/v1/site-settings/{key}`
  - Auth: no
  - Response: `SiteSettingOut`

### Public Media

- `GET /api/v1/media/`
  - Auth: no
  - Response: `MediaOut[]`

## Data Models

These are the actual backend payload families.

### AdminUserOut

```json
{
  "id": 1,
  "email": "admin@example.com",
  "is_active": true,
  "created_at": "2026-03-25T10:30:00Z",
  "updated_at": "2026-03-25T10:30:00Z"
}
```

### BlogAuthor

Create:
```json
{
  "slug": "asha-j",
  "name": "Asha J.",
  "role": "Legal Writer",
  "avatar_src": "https://example.com/avatar.webp"
}
```

Out:
```json
{
  "id": 2,
  "slug": "asha-j",
  "name": "Asha J.",
  "role": "Legal Writer",
  "avatar_src": "https://example.com/avatar.webp"
}
```

### BlogCategory

Create:
```json
{
  "name": "Guides",
  "slug": "guides",
  "description": "Long-form guidance posts."
}
```

Out adds:
- `id`
- `created_at`

### BlogPost

Create:
```json
{
  "title": "NGO Compliance 101",
  "slug": "ngo-compliance-101",
  "excerpt": "Summary",
  "content": {
    "introduction": "Intro text",
    "highlights": [],
    "sections": [
      {
        "heading": "Main Section",
        "paragraphs": ["Paragraph 1", "Paragraph 2"]
      }
    ]
  },
  "category_id": 1,
  "author_id": 2,
  "featured_image": "http://localhost:8000/uploads/abc123.webp",
  "cover_alt": "Cover alt",
  "media_label": "Hero cover",
  "featured_slot": "primary",
  "featured_on_home": false,
  "read_time_minutes": 5,
  "related_slugs": [],
  "meta_title": "Meta title",
  "meta_description": "Meta description",
  "published_at": null,
  "is_published": false
}
```

Out adds:
- `id`
- `created_at`
- `updated_at`
- `category`
- `author`

### Page

Create:
```json
{
  "title": "About",
  "slug": "about",
  "content": {
    "hero": {
      "headline": "About Exxonim"
    }
  },
  "meta_title": "About Exxonim",
  "meta_description": "About page meta",
  "is_published": true
}
```

Out adds:
- `id`
- `created_at`
- `updated_at`

### NavigationItem

Create:
```json
{
  "title": "About",
  "url": "/about",
  "description": "About page",
  "kind": "link",
  "parent_id": null,
  "order": 0,
  "is_active": true
}
```

Out adds:
- `id`
- `created_at`
- `updated_at`
- `children`

### PricingPlan

Create:
```json
{
  "name": "Growth",
  "badge": "Popular",
  "description": "For growing teams",
  "notes": "Annual billing available",
  "price": 2500,
  "features": [
    {
      "label": "Company setup",
      "included": true
    }
  ],
  "recommended": true,
  "sort_order": 1,
  "is_active": true
}
```

Out adds:
- `id`
- `created_at`
- `updated_at`

### Testimonial

Create:
```json
{
  "eyebrow": "Client story",
  "headline": "Made expansion easier",
  "support": "Support text",
  "author": "Jane Doe",
  "author_role": "Founder",
  "initials": "JD",
  "content": "They helped us move quickly.",
  "rating": 5,
  "sort_order": 0,
  "is_active": true
}
```

Out adds:
- `id`
- `created_at`
- `updated_at`

### SiteSetting

Create:
```json
{
  "key": "brand",
  "value": {
    "name": "Exxonim"
  }
}
```

Out:
```json
{
  "id": 1,
  "key": "brand",
  "value": {
    "name": "Exxonim"
  },
  "created_at": "2026-03-25T10:30:00Z",
  "updated_at": "2026-03-25T10:30:00Z"
}
```

### Media

Create:
```json
{
  "url": "https://example.com/image.webp",
  "alt_text": "Alt text",
  "file_size": 12345,
  "mime_type": "image/webp"
}
```

Out:
```json
{
  "id": 9,
  "url": "https://example.com/image.webp",
  "alt_text": "Alt text",
  "file_size": 12345,
  "mime_type": "image/webp",
  "uploaded_at": "2026-03-25T10:30:00Z"
}
```

## Site Setting Keys Used by the Frontend

The backend stores generic `key` and `value`. The frontend currently expects these structured keys:

### `brand`

```json
{
  "name": "Exxonim",
  "companyShortName": "Exxonim",
  "tagline": "Build with confidence",
  "lightLogoSrc": "/assets/logo-light.webp",
  "darkLogoSrc": "/assets/logo-dark.webp",
  "faviconUrl": "/favicon.ico",
  "brandColors": {
    "primary": "#0f5c63",
    "secondary": "#73c7bb"
  }
}
```

### `company_info`

```json
{
  "name": "Exxonim",
  "legalCompanyName": "Exxonim Ltd",
  "companyShortName": "Exxonim",
  "phones": ["+255700000000"],
  "emails": ["hello@example.com"],
  "address": "Dar es Salaam",
  "whatsapp": "+255700000000"
}
```

### `contact_map`

```json
{
  "officeHours": [
    {
      "day": "monday",
      "open": "08:00",
      "close": "17:00",
      "closed": false
    }
  ],
  "socialLinks": [
    {
      "platform": "linkedin",
      "label": "LinkedIn",
      "url": "https://linkedin.com/company/example",
      "isActive": true
    }
  ],
  "offices": [
    {
      "id": "hq",
      "name": "Head Office",
      "addressLine1": "Street 1",
      "addressLine2": null,
      "city": "Dar es Salaam",
      "country": "Tanzania",
      "mapLabel": "HQ",
      "googleMapsUrl": "https://maps.google.com/...",
      "embedUrl": null,
      "latitude": null,
      "longitude": null,
      "isPrimary": true
    }
  ]
}
```

### `footer`

```json
{
  "quick_links": [
    { "label": "About", "href": "/about" }
  ],
  "other_resources": [
    { "label": "Blog", "href": "/resources" }
  ],
  "tagline": "Build with confidence",
  "primary_cta": {
    "label": "Book a consultation",
    "href": "/contact"
  },
  "social_links": [
    {
      "platform": "linkedin",
      "label": "LinkedIn",
      "url": "https://linkedin.com/company/example",
      "isActive": true
    }
  ],
  "copyright": "Copyright 2026 Exxonim"
}
```

### `seo_defaults`

```json
{
  "siteName": "Exxonim",
  "canonicalBaseUrl": "https://example.com",
  "defaultMetaTitle": "Exxonim",
  "defaultMetaDescription": "Default SEO description",
  "defaultShareImageUrl": "https://example.com/share.webp",
  "robotsIndex": true,
  "robotsFollow": true
}
```

## Theme, Brand Color, and Sidebar UI Contract

This section is not a backend API, but it is part of the real product contract for the current admin and public UI.

## Theme System

Theme is currently client-side state, not backend state.

- Supported themes:
  - `light`
  - `dark`
- Shared storage key used by both admin and public apps:
  - `exxonim-theme`
- Legacy storage key still read for backward compatibility:
  - `koro-theme`
- Theme is applied by writing:
  - `document.documentElement.dataset.theme = "light" | "dark"`
- Default theme behavior:
  - If local storage contains a valid theme, that value is used
  - Else if `html[data-theme="light"]` already exists, light is used
  - Else the app defaults to `dark`

Important transparency:
- Theme preference is not stored in the backend
- There is no API endpoint for theme
- Theme persistence is browser-local only

### Shared Theme Behavior Across Apps

Both apps use the same pattern:
- Admin app reads and writes `exxonim-theme`
- Public app reads and writes `exxonim-theme`
- This means a user toggling theme in admin can affect the theme seen later in the public app on the same browser

## Brand Identity Source of Truth

Branding is composed from site settings, mainly:
- `brand`
- `company_info`

Current brand identity mapping used by the admin layout:
- Display name:
  - `brand.value.name`
  - fallback `company_info.value.name`
  - fallback `"Exxonim"`
- Short name:
  - `brand.value.companyShortName`
  - fallback `company_info.value.companyShortName`
  - fallback `"Exxonim"`
- Logos:
  - `brand.value.lightLogoSrc`
  - `brand.value.darkLogoSrc`

Public navigation and footer also rely on the brand setting for logo assets.

## Brand Color Source of Truth

Brand color values come from:

```json
{
  "key": "brand",
  "value": {
    "brandColors": {
      "primary": "#0f5c63",
      "secondary": "#73c7bb"
    }
  }
}
```

Admin brand settings page defaults:
- Primary: `#0f5c63`
- Secondary: `#73c7bb`

### Admin Brand Color Resolution Order

The effective admin accent colors resolve in this order:

1. `brand.value.brandColors.primary` and `brand.value.brandColors.secondary`
2. Admin layout fallback colors:
   - primary fallback: `#0f5c63`
   - secondary fallback: `#73c7bb`
3. Raw CSS defaults in `admin-system.css` if the admin layout override is not applied:
   - light accent default: `#1f4b99`
   - dark accent default: `#8ab4ff`

Important transparency:
- The brand settings page and admin layout use `#0f5c63` and `#73c7bb` as the practical fallback brand colors
- The lower-level CSS file still defines a more generic default accent palette
- In the real rendered admin app, the admin layout override is what normally wins

## Admin CSS Tokens Driven by Brand Colors

The admin layout maps brand values into these CSS variables:

- `--adminx-accent = brandPrimary`
- `--adminx-accent-strong = brandPrimary`
- `--adminx-accent-contrast = readable foreground derived from brandPrimary`
- `--adminx-teal = brandSecondary`
- `--adminx-blue = brandPrimary`

This means:
- Buttons and accent states use the primary brand color
- Sidebar brand mark uses the primary brand color
- Sidebar user avatar gradients and some badges use the primary and secondary colors

### Default Admin Theme Tokens

Base light theme tokens:
- `--adminx-bg: #f4f6f8`
- `--adminx-bg-strong: #eef2f6`
- `--adminx-surface-solid: #ffffff`
- `--adminx-text: #1f2937`
- `--adminx-text-muted: rgba(31, 41, 55, 0.72)`
- `--adminx-text-soft: rgba(31, 41, 55, 0.52)`
- `--adminx-accent: #1f4b99`
- `--adminx-teal: #2563eb`
- `--adminx-amber: #b7791f`
- `--adminx-red: #c2414b`

Base dark theme tokens:
- `--adminx-bg: #0f172a`
- `--adminx-bg-strong: #111827`
- `--adminx-surface-solid: #111827`
- `--adminx-text: #e5e7eb`
- `--adminx-text-muted: rgba(229, 231, 235, 0.72)`
- `--adminx-text-soft: rgba(229, 231, 235, 0.5)`
- `--adminx-accent: #8ab4ff`
- `--adminx-teal: #60a5fa`
- `--adminx-amber: #f2b45c`
- `--adminx-red: #f38b93`

## Admin Sidebar Structure

The admin sidebar is not API-driven. Its structure is frontend-configured in the route map and then filtered by role.

Rendered sidebar groups:

### Operations

- Dashboard

### Content

- Blog Posts
- Blog Analytics
- Blog Categories
- Blog Authors
- Job Listings

### Pages

- All Pages
- Home Page
- Services Page
- About Page
- FAQ Page
- Contact Page
- Career Page

Notes:
- `All Pages` acts as the parent row for the pages group
- The pages children are shown in an expandable section
- The `Career Page` child shows a small `+jobs` hint in the current sidebar UI

### Configuration

- Brand & Company
- Contact & Map
- Navigation
- Pricing Plans
- Testimonials
- Footer Content
- SEO Defaults
- Access Roles

## Sidebar Role Filtering

Sidebar visibility depends on frontend role checks.

For `editor`, these sections are hidden:
- Brand & Company
- Contact & Map
- Home Page
- Services Page
- About Page
- FAQ Page
- Contact Page
- Career Page
- All Pages
- Job Listings
- Navigation
- Pricing Plans
- Testimonials
- Footer Content
- SEO Defaults
- Access Roles

For `author`, everything hidden from `editor` is also hidden, plus:
- Blog Categories

Important transparency:
- The backend `AdminUserOut` does not currently send a `role`
- The admin sidebar therefore falls back to `"admin"` in the frontend when role is missing
- In the current backend state, this means the UI will effectively behave like admin access unless the frontend gets a role from somewhere else

## Sidebar State and Persistence

These sidebar behaviors are client-side only:

- Collapsed state is stored in local storage key:
  - `adminx-sidebar-collapsed`
- Pages group open state is stored in local storage key:
  - `adminx-pages-open`
- Profile popover open state is in memory only

Mobile behavior:
- At `max-width: 960px`, the sidebar becomes an off-canvas drawer
- The mobile drawer uses an overlay and does not use the collapsed desktop width

Desktop behavior:
- Expanded width: `240px`
- Collapsed width: `62px`

## Sidebar Badges and Meaning

Sidebar badges are frontend-derived, not API-defined.

- Blog Posts badge:
  - source: current draft post count
  - color variant: `teal`
- Job Listings badge:
  - source: current open job count
  - color variant: `blue`
- Access Roles badge:
  - label: `Admin`
  - color variant: `red`
  - shown only when the current role is treated as admin

Important transparency:
- Blog draft counts are real only because blog posts are implemented
- Job count badges depend on job APIs that are not implemented on the backend yet

## Common Response and Error Behavior

- Successful create:
  - Usually `201 Created`
- Successful delete:
  - `204 No Content`
- Missing entity:
  - `404`
- Auth failure:
  - `401`
- Generic unique conflict:
  - `409`
- Validation failure:
  - `422`

Known concrete validations:
- Blog publish validation requires:
  - `title`
  - `slug`
  - `excerpt`
  - `category_id`
  - `author_id`
  - `featured_image`
  - body content in `content`
- If missing, backend returns:
  ```json
  {
    "detail": {
      "message": "This post is not ready to publish.",
      "issues": [
        "Title is required before publishing."
      ]
    }
  }
  ```

- Media upload only accepts image MIME types
- Navigation update rejects self-parenting with `400`

## Frontend-Declared But Missing or Incomplete on the Backend

These are important if you are designing screens across the whole app.

### Declared in frontend route map but not implemented in backend routers

- `GET /api/v1/admin/dashboard/summary`
- `GET /api/v1/admin/jobs`
- `GET /api/v1/admin/jobs/{slug}`
- `POST /api/v1/admin/jobs`
- `PUT /api/v1/admin/jobs/{slug}`
- `DELETE /api/v1/admin/jobs/{slug}`
- `GET /api/v1/admin/users`
- `POST /api/v1/admin/users`
- `PUT /api/v1/admin/users/{id}`
- `PUT /api/v1/admin/users/{id}/role`
- `PUT /api/v1/admin/users/{id}/status`
- `GET /api/v1/admin/roles`
- `GET /api/v1/admin/blog/authors/me`
- `PUT /api/v1/admin/blog/authors/me`
- `POST /api/v1/admin/blog/posts/{id}/preview-token`

Design implication:
- Those admin screens can exist in the frontend, but the current backend will return `404` for them.

### Route file exists but is not mounted

- `GET /api/v1/home`

Notes:
- There is a `home.py` router file with `GET /home`
- It is not included in `nim_backend/app/routers/__init__.py`
- That means it is not live in the running API right now

### Shared contracts expect fields the backend does not currently store

These are the main mismatches:

- Blog:
  - Frontend contracts use `status`
  - Backend stores `is_published` and `published_at`
  - Frontend contracts include `og_image_url`
  - Backend blog schema does not define `og_image_url`

- Blog authors:
  - Frontend payload includes `bio`
  - Backend schema does not define `bio`

- Pages:
  - Frontend contracts use `status`
  - Backend stores `is_published`
  - Frontend contracts include `og_image_url`
  - Backend page schema does not define `og_image_url`

- Navigation:
  - Frontend contracts use `status`
  - Backend stores `is_active`

- Pricing:
  - Frontend contracts use `status`
  - Backend stores `is_active`

- Testimonials:
  - Frontend contracts use `status`
  - Backend stores `is_active`

- Admin user:
  - Frontend types expect `full_name`, `role`, `last_login_at`
  - Backend admin user model and response do not provide those fields

Design implication:
- Build the design against the backend fields that actually exist
- Do not depend on frontend-only fields being persisted

## Status and Workflow Truth

This is especially important for the blog workspace.

### Real persisted blog state

The backend persists:
- `is_published`
- `published_at`

The backend does not persist:
- `draft`
- `scheduled`
- `archived`
- `trash`
- revision workflow fields

Design implication:
- `published` is real
- `draft` is effectively represented by `is_published = false`
- `scheduled` is not a fully implemented backend state
- `trash` is not a real backend state

### Analytics truth

There is no real analytics endpoint for blog traffic right now.

Current frontend behavior:
- The analytics screen falls back to derived data
- Blog post view counts are locally mapped to `0`

Design implication:
- You can design the analytics screen
- Do not expect real traffic, views, or trend numbers from the current backend

## Design Recommendations Based on the Current Backend

If you want to design the full admin and public experience against what is real today:

- Use these implemented domains as your design foundation:
  - auth
  - blog
  - pages
  - navigation
  - pricing
  - testimonials
  - site settings
  - media

- Treat these as not yet backed:
  - jobs
  - access roles and user management
  - dashboard summary endpoint
  - blog preview token flow
  - author self endpoint
  - mounted home aggregation endpoint

- For blog design:
  - post list data is real
  - categories and authors are real
  - media upload is real
  - analytics numbers are not real
  - scheduled and trash states are not fully real

- For page design:
  - `content` is flexible JSON
  - the backend does not enforce a strict block schema

- For site settings design:
  - the backend is generic
  - the frontend relies on convention-based keys and value shapes

## Fast Summary

Implemented and safe to design against now:
- `admin/auth`
- `admin/blog`
- `admin/pages`
- `admin/navigation`
- `admin/pricing/plans`
- `admin/testimonials`
- `admin/site-settings`
- `admin/media`
- `blog`
- `pages`
- `navigation`
- `pricing/plans`
- `testimonials`
- `site-settings`
- `media`
- `health`

Not safe to assume is live:
- `admin/dashboard/summary`
- `admin/jobs`
- `admin/users`
- `admin/roles`
- `admin/blog/authors/me`
- `admin/blog/posts/{id}/preview-token`
- `home`
