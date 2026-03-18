# Extraordinary Admin Panel + Frontend Blueprint

This document is the implementation blueprint for the admin panel and the public frontend.

This is not only a content editor.

This system is:

- a headless CMS
- an operations dashboard
- a marketing site
- a consultation request and tracking system

The admin must control all business-facing content from one place, including:

- pages
- blog content
- pricing
- testimonials
- careers
- phone numbers
- emails
- office address
- map
- footer links
- social links
- WhatsApp/contact buttons
- SEO metadata

The goal is simple:

- no hardcoded business data in the frontend
- simple HTML first
- clean API second
- polished app UI after the structure is proven

## Build Order

Build in this order:

1. Static HTML admin screens.
2. Vanilla JS interactions with mock JSON.
3. Backend schema and `/api/v1/` endpoints.
4. Wire the HTML screens to the API.
5. Move the approved screens into the real app shell.

Rule:

- business content must be editable from admin before it is considered final

## Non-Negotiable System Rules

### 1. Content status model

Use the same publication model everywhere possible:

- `draft`
- `published`
- `archived`

Apply this to:

- blog posts
- pages
- pricing plans
- testimonials
- navigation items
- career jobs

Why:

- prevents accidental publishing
- makes review flow predictable
- gives the admin one consistent mental model

### 2. Operational status model

Do not mix publication status with consultation workflow status.

Consultations should keep operational statuses:

- `pending`
- `contacted`
- `completed`
- `cancelled`

### 3. Slug uniqueness

Slugs are route keys and must be unique where they drive routing.

Rules:

- auto-generate slugs from titles or names
- allow manual override
- validate uniqueness before save
- block collisions at database level

Critical routes:

- `/resources/:slug/`
- page slugs such as `about`, `services`, `faq`, `career`, `contact`
- career job slugs if job detail pages are added later

### 4. Site data must be centralized

If a phone number changes, it should be changed once in admin and update everywhere.

The following must never be hardcoded in public HTML after integration:

- phone numbers
- email addresses
- WhatsApp number or URL
- office address
- map URL or embed
- social links
- footer links
- company name
- logos

### 5. Pagination by default

Never return huge full lists for heavy resources.

Use:

- `?page=1&limit=10`

Apply immediately to:

- blog posts
- consultations
- career jobs

### 6. API versioning

Use:

- `/api/v1/`

Examples:

- `/api/v1/admin/blog-posts`
- `/api/v1/admin/consultations`
- `/api/v1/public/pages/about`

### 7. Media decision for MVP

Do not build a dedicated media page in the MVP if the business does not need file management.

MVP rule:

- use direct image URLs in page, blog, and brand forms
- keep logos and static assets simple
- do not introduce upload workflows unless there is a real business need

Optional future rule:

- if uploads are added later, store files under `/media/uploads/`
- then add a dedicated media library module

### 8. Basic roles

Minimum roles:

- `admin`
- `editor`

Rules:

- `admin` has full access
- `editor` can create and edit content
- `editor` should not delete critical data
- `editor` should not change sensitive global settings unless explicitly allowed

### 9. SEO is part of content

For blog posts and public pages, include:

- `meta_title`
- `meta_description`
- `slug`
- structured content
- optional `og_image`

## Product Definition

The final system should feel like a serious business platform:

- one admin for content and operations
- one public frontend powered by admin content
- one data source for contact details, career info, navigation, and site content

This is conceptually:

- storefront + admin separation
- content platform + business workflow

## Admin Modules Overview

| Module | Purpose | Must be editable |
| --- | --- | --- |
| Auth and Roles | Secure admin access | login, role restrictions |
| Dashboard | Operations summary | stats, quick actions, alerts |
| Brand and Company | Visual identity and business info | logo, company name, phone, email, address |
| Contact and Map | Public contact details | office locations, map, office hours, support contacts |
| Home Page | Main landing page content | hero, highlights, provider logos, insights |
| About Page | Company story and positioning | profile, service scope, operating model |
| Services Page | Service presentation | overview, service groups, process, pricing CTA |
| Blog / Resources | Content marketing | posts, categories, authors |
| FAQ Page | Customer self-service | questions and answers |
| Career Page | Hiring communication | page content, job listings, apply info |
| Contact Page | Public contact experience | cards, map, CTA, office details |
| Navigation | Menus and dropdowns | links, groups, order, visibility |
| Pricing | Service plans | plans, features, status |
| Testimonials | Social proof | quote, author, rating, status |
| Consultations | Client operations | requests, assignment, status, notes, notifications |
| Footer and SEO | Global site settings | footer links, copyright, meta defaults |

## Field-Level Specification

## 1. Auth and Roles

Admin screens:

- login
- current user profile summary
- roles and permissions management

Required data:

- `id`
- `full_name`
- `email`
- `password_hash`
- `role`
- `is_active`
- `last_login_at`
- `created_at`
- `updated_at`

Permissions:

- `admin`: full CRUD on everything
- `editor`: create and update content, limited delete, no sensitive settings deletion

## 2. Dashboard

Dashboard should show:

- total blog posts
- published blog posts
- total pages
- published pages
- total consultations
- pending consultations
- total pricing plans
- total testimonials
- total career jobs
- total office locations

Dashboard widgets:

- recent consultations
- recent content changes
- drafts waiting for publication
- quick links
- system warnings

Quick actions:

- create blog post
- create page
- add career job
- update contact info
- review consultations

## 3. Brand, Company, Contact, Phone Numbers, Map

This is the most important global settings area because it controls the public identity of the business.

If a phone number changes, the admin should update it here once and the change should affect:

- top navigation call button
- footer contact section
- contact page
- WhatsApp CTA
- support page
- any call-now buttons

### 3.1 Brand settings

Fields:

- `company_name`
- `company_short_name`
- `tagline`
- `logo_light`
- `logo_dark`
- `favicon`
- `primary_brand_color`
- `secondary_brand_color`

### 3.2 Contact settings

Fields:

- `primary_phone`
- `secondary_phones[]`
- `sales_phone`
- `support_phone`
- `whatsapp_number`
- `primary_email`
- `secondary_emails[]`
- `support_email`
- `careers_email`
- `billing_email`

### 3.3 Address and map

Fields:

- `country`
- `region`
- `city`
- `street_address`
- `postal_code`
- `address_note`
- `google_map_embed_url`
- `google_map_link`
- `latitude`
- `longitude`
- `map_marker_title`

### 3.4 Office hours

Fields:

- `monday_friday_hours`
- `saturday_hours`
- `sunday_hours`
- `holiday_note`

### 3.5 Social links

Fields:

- `facebook_url`
- `instagram_url`
- `x_url`
- `linkedin_url`
- `youtube_url`
- `tiktok_url`
- `telegram_url`

### 3.6 Office locations

If the business may later have more than one office, use a separate `office_locations` resource.

Fields:

- `name`
- `slug`
- `phone`
- `email`
- `address`
- `city`
- `google_map_embed_url`
- `google_map_link`
- `latitude`
- `longitude`
- `is_primary`
- `status`

Public usage:

- contact page
- footer location links
- map block
- office cards

## 4. Home Page

The current frontend already supports structured homepage content. The admin should expose friendly fields instead of raw JSON where possible.

### Home hero

Fields:

- `eyebrow`
- `title`
- `description`
- `primary_cta_label`
- `primary_cta_href`

### Home highlights

Repeatable items:

- `title`
- `detail`

### Provider section

Fields:

- `kicker`
- `title`

Logos:

- `alt`
- `src`

### Stack / capability section

Each item:

- `title`
- `subtitle`
- `description`
- `cta_label`
- `cta_href`
- `window_title`
- `window_tag`
- `video_src`

Feature rows:

- `title`
- `description`
- `visual_key`

Feature visual content:

- `workstream_value`
- `counterpart_label`
- `counterpart_value`
- `focus_value`
- `summary_title`
- `summary_body`

### Insights section

Fields:

- `title`
- `intro`
- `footer_copy`

Blog posts shown on home should come from blog metadata:

- `featured_on_home`
- `featured_slot`

## 5. About Page

### Hero

- `eyebrow`
- `title`
- `description`

### Company profile

- `eyebrow`
- `title`
- `paragraphs[]`
- `working_style`

### Support profiles

Repeatable:

- `title`
- `description`

### Service scope

Repeatable:

- `title`
- `description`

### Operating model

Repeatable:

- `step`
- `title`
- `description`

### Client expectations

- `items[]`

### CTA

- `title`
- `description`
- `primary_label`
- `primary_href`
- `secondary_label`
- `secondary_href`

## 6. Services Page

### Overview section

- `eyebrow`
- `title`
- `description`
- `panel_title`
- `panel_body`

### Service signals

Repeatable:

- `value`
- `label`
- `detail`

### Service navigation groups

Repeatable:

- `title`
- `summary`
- `href`
- `items[]`

### Service flow

Repeatable:

- `step`
- `title`
- `detail`

### Service promises

- `items[]`

### Service catalog

Groups:

- `title`
- `description`

Services in each group:

- `id`
- `label`
- `detail`

## 7. Blog / Resources

This is the core content marketing area.

### 7.1 Blog posts

Fields:

- `title`
- `slug`
- `excerpt`
- `content_json`
- `category_id`
- `author_id`
- `featured_image`
- `cover_alt`
- `media_label`
- `featured_slot`
- `featured_on_home`
- `read_time_minutes`
- `related_slugs[]`
- `meta_title`
- `meta_description`
- `og_image`
- `published_at`
- `status`

Actions:

- create
- save draft
- publish
- archive
- preview
- delete

### 7.2 Blog categories

Fields:

- `name`
- `slug`
- `description`

### 7.3 Blog authors

Fields:

- `name`
- `slug`
- `role`
- `avatar_src`
- `bio`

## 8. FAQ Page

### Hero

- `eyebrow`
- `title`
- `description`

### FAQ items

Repeatable:

- `question`
- `answer`
- `sort_order`
- `status`

## 9. Career Page and Jobs

This needs its own serious module. Careers should not be treated like a tiny static block.

### 9.1 Career page content

Fields:

- `eyebrow`
- `title`
- `description`
- `intro_text`
- `status_label`
- `status_description`
- `primary_cta_label`
- `primary_cta_href`
- `secondary_cta_label`
- `secondary_cta_href`
- `focus_areas[]`

### 9.2 Career jobs

This should be a dedicated resource, not only page JSON.

Fields:

- `title`
- `slug`
- `department`
- `location`
- `remote_mode`
- `employment_type`
- `experience_level`
- `salary_text`
- `summary`
- `description`
- `responsibilities[]`
- `requirements[]`
- `benefits[]`
- `application_url`
- `application_email`
- `deadline`
- `featured`
- `status`
- `is_open`

Public usage:

- list jobs on `/career/`
- show open vs closed positions
- allow future `/career/:slug/` detail pages if needed

## 10. Contact Page

The contact page should not be hardcoded. It should be assembled from global contact settings and office location data.

### Contact page hero

- `eyebrow`
- `title`
- `description`

### Contact cards

Repeatable cards:

- `label`
- `value`
- `description`
- `action_label`
- `action_href`

Typical cards:

- Call us
- Email us
- Visit office
- WhatsApp
- Careers contact

### Map block

Fields:

- `map_title`
- `map_description`
- `google_map_embed_url`
- `google_map_link`
- `office_location_id`

### Contact page rule

Any phone number or address shown here should come from:

- brand/company settings
- office locations

Not from hardcoded markup.

## 11. Navigation

Navigation powers desktop menu, dropdowns, and mobile menu.

Fields:

- `title`
- `url`
- `description`
- `kind`
- `parent_id`
- `order`
- `status`

Kinds:

- `link`
- `group`

Important rule:

- only `published` navigation items should appear publicly

## 12. Pricing

Fields:

- `name`
- `badge`
- `description`
- `notes`
- `price`
- `features_json`
- `recommended`
- `sort_order`
- `status`

Feature item:

- `label`
- `included`

## 13. Testimonials

Fields:

- `eyebrow`
- `headline`
- `support`
- `author`
- `author_role`
- `initials`
- `content`
- `rating`
- `sort_order`
- `status`

## 14. Optional Media Library Later

This is not required for MVP.

If uploads are needed later, then add:

- `id`
- `url`
- `alt_text`
- `mime_type`
- `size`
- `original_name`
- `width`
- `height`
- `created_at`
- `updated_at`

Later-only actions:

- upload image
- register external URL
- edit alt text
- copy file URL
- preview
- delete

Until then:

- store image URLs directly in content forms
- keep logos and covers as URL fields
- avoid building a separate asset manager

## 15. Consultations

This is the operations workspace.

MVP rule:

- consultations do not need a general media page
- do not build file uploads or attachments for consultations unless there is a real business requirement later

If attachments are needed in the future:

- add a separate `consultation_attachments` feature
- do not mix it with a global site media library

### Public consultation request form

Fields:

- `full_name`
- `email`
- `phone`
- `company`
- `message`

System-generated:

- `tracking_id`
- `magic_link`
- `created_at`

### Admin consultation detail

Fields:

- `tracking_id`
- `full_name`
- `email`
- `phone`
- `company`
- `message`
- `status`
- `assigned_to`
- `notes`
- `public_notes`
- `created_at`
- `updated_at`

### Consultation status history

Fields:

- `old_status`
- `new_status`
- `changed_at`
- `comment`
- `changed_by`

### Consultation notifications

Fields:

- `type`
- `recipient`
- `subject`
- `body`
- `status`
- `error_message`
- `created_at`

## 16. Footer and SEO Defaults

### Footer

Fields:

- `quick_links[]`
- `other_resources[]`
- `tagline`
- `primary_cta_label`
- `primary_cta_href`
- `copyright`

### SEO defaults

Fields:

- `site_title_suffix`
- `default_meta_description`
- `default_og_image`
- `robots_default`
- `canonical_base_url`

## Recommended Site Setting Keys

If you keep site settings in a generic JSON table, use clear keys.

Recommended keys:

- `brand`
- `company_info`
- `contact_settings`
- `social_links`
- `footer`
- `seo_defaults`

Keep page body content in the `pages` table, not all inside generic settings.

## Recommended Database Tables

Core tables:

- `users`
- `roles`
- `user_roles`
- `blog_posts`
- `blog_categories`
- `blog_authors`
- `pages`
- `navigation_items`
- `pricing_plans`
- `testimonials`
- `consultations`
- `consultation_status_history`
- `consultation_notifications`
- `site_settings`
- `office_locations`
- `career_jobs`

Optional later table:

- `media`

Suggested common columns for most content tables:

- `id`
- `created_at`
- `updated_at`
- `created_by`
- `updated_by`
- `status`

Slugged resources should also have:

- `slug`

## Recommended Admin API Endpoints

### Auth

- `POST /api/v1/admin/auth/login`
- `POST /api/v1/admin/auth/logout`
- `GET /api/v1/admin/auth/me`

### Dashboard

- `GET /api/v1/admin/dashboard`

### Brand and settings

- `GET /api/v1/admin/site-settings/brand`
- `PUT /api/v1/admin/site-settings/brand`
- `GET /api/v1/admin/site-settings/company-info`
- `PUT /api/v1/admin/site-settings/company-info`
- `GET /api/v1/admin/site-settings/contact-settings`
- `PUT /api/v1/admin/site-settings/contact-settings`
- `GET /api/v1/admin/site-settings/footer`
- `PUT /api/v1/admin/site-settings/footer`
- `GET /api/v1/admin/site-settings/seo-defaults`
- `PUT /api/v1/admin/site-settings/seo-defaults`

### Office locations

- `GET /api/v1/admin/office-locations?page=1&limit=10`
- `POST /api/v1/admin/office-locations`
- `GET /api/v1/admin/office-locations/:id`
- `PUT /api/v1/admin/office-locations/:id`
- `DELETE /api/v1/admin/office-locations/:id`

### Blog

- `GET /api/v1/admin/blog-posts?page=1&limit=10`
- `POST /api/v1/admin/blog-posts`
- `GET /api/v1/admin/blog-posts/:id`
- `PUT /api/v1/admin/blog-posts/:id`
- `DELETE /api/v1/admin/blog-posts/:id`
- `GET /api/v1/admin/blog-categories`
- `POST /api/v1/admin/blog-categories`
- `PUT /api/v1/admin/blog-categories/:id`
- `DELETE /api/v1/admin/blog-categories/:id`
- `GET /api/v1/admin/blog-authors`
- `POST /api/v1/admin/blog-authors`
- `PUT /api/v1/admin/blog-authors/:id`
- `DELETE /api/v1/admin/blog-authors/:id`

### Pages

- `GET /api/v1/admin/pages?page=1&limit=10`
- `POST /api/v1/admin/pages`
- `GET /api/v1/admin/pages/:id`
- `PUT /api/v1/admin/pages/:id`
- `DELETE /api/v1/admin/pages/:id`

### Careers

- `GET /api/v1/admin/career-jobs?page=1&limit=10`
- `POST /api/v1/admin/career-jobs`
- `GET /api/v1/admin/career-jobs/:id`
- `PUT /api/v1/admin/career-jobs/:id`
- `DELETE /api/v1/admin/career-jobs/:id`

### Navigation

- `GET /api/v1/admin/navigation-items`
- `POST /api/v1/admin/navigation-items`
- `PUT /api/v1/admin/navigation-items/:id`
- `DELETE /api/v1/admin/navigation-items/:id`

### Pricing

- `GET /api/v1/admin/pricing-plans`
- `POST /api/v1/admin/pricing-plans`
- `PUT /api/v1/admin/pricing-plans/:id`
- `DELETE /api/v1/admin/pricing-plans/:id`

### Testimonials

- `GET /api/v1/admin/testimonials`
- `POST /api/v1/admin/testimonials`
- `PUT /api/v1/admin/testimonials/:id`
- `DELETE /api/v1/admin/testimonials/:id`

### Consultations

- `GET /api/v1/admin/consultations?page=1&limit=10&status=&search=`
- `GET /api/v1/admin/consultations/:id`
- `PUT /api/v1/admin/consultations/:id`
- `POST /api/v1/admin/consultations/:id/notify`
- `GET /api/v1/admin/staff`

## Recommended Public API Endpoints

- `GET /api/v1/public/pages/:slug`
- `GET /api/v1/public/navigation`
- `GET /api/v1/public/blog-posts`
- `GET /api/v1/public/blog-posts/:slug`
- `GET /api/v1/public/blog-categories`
- `GET /api/v1/public/pricing-plans`
- `GET /api/v1/public/testimonials`
- `GET /api/v1/public/site-settings/:key`
- `POST /api/v1/public/consultations`
- `POST /api/v1/public/consultations/magic-link`
- `GET /api/v1/public/consultations/:tracking_id?token=...`

## HTML-First Prototype Pages

Build these pages first as static HTML.

Recommended prototype folder:

- `prototype/admin/login.html`
- `prototype/admin/dashboard.html`
- `prototype/admin/company-settings.html`
- `prototype/admin/contact-settings.html`
- `prototype/admin/office-locations.html`
- `prototype/admin/pages.html`
- `prototype/admin/page-form.html`
- `prototype/admin/blog-posts.html`
- `prototype/admin/blog-post-form.html`
- `prototype/admin/blog-categories.html`
- `prototype/admin/blog-authors.html`
- `prototype/admin/careers.html`
- `prototype/admin/career-job-form.html`
- `prototype/admin/navigation.html`
- `prototype/admin/pricing.html`
- `prototype/admin/testimonials.html`
- `prototype/admin/consultations.html`
- `prototype/admin/consultation-detail.html`

Use mock data files:

- `prototype/data/dashboard.json`
- `prototype/data/company-info.json`
- `prototype/data/contact-settings.json`
- `prototype/data/office-locations.json`
- `prototype/data/pages.json`
- `prototype/data/blog-posts.json`
- `prototype/data/career-jobs.json`
- `prototype/data/navigation.json`
- `prototype/data/pricing.json`
- `prototype/data/testimonials.json`
- `prototype/data/consultations.json`

## Simple HTML Layout Pattern

Use one consistent HTML pattern for every admin screen first:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Admin Prototype</title>
    <link rel="stylesheet" href="./admin.css" />
  </head>
  <body>
    <div class="admin-shell">
      <aside class="sidebar">
        <h1>Admin</h1>
        <nav>
          <a href="./dashboard.html">Dashboard</a>
          <a href="./company-settings.html">Company</a>
          <a href="./blog-posts.html">Blog</a>
          <a href="./careers.html">Careers</a>
          <a href="./consultations.html">Consultations</a>
        </nav>
      </aside>

      <main class="content">
        <header class="page-header">
          <h2>Company Settings</h2>
          <button>Save</button>
        </header>

        <section class="card">
          <h3>Phone Numbers</h3>
          <form>
            <label>Primary phone</label>
            <input type="text" name="primary_phone" />

            <label>Support phone</label>
            <input type="text" name="support_phone" />

            <label>WhatsApp number</label>
            <input type="text" name="whatsapp_number" />
          </form>
        </section>
      </main>
    </div>
  </body>
</html>
```

This is enough to validate:

- layout
- navigation
- forms
- card spacing
- mobile responsiveness
- editing flow

Before wiring any framework logic.

## What Makes The Admin Extraordinary

Do not settle for a plain CRUD table with ugly forms.

The admin should have:

- clear sidebar structure
- sticky save bar on edit screens
- draft/published/archived badges
- quick preview buttons
- map preview block
- phone/email validation
- repeatable field editors for arrays
- confirmation dialogs for destructive actions
- unsaved changes warning
- search and filters on large lists
- pagination controls
- status chips
- clean empty states
- success and error toasts
- keyboard-friendly forms
- responsive mobile layout

## Final Build Principle

The admin panel is the source of truth for the whole business frontend.

That means:

- changing phone numbers must be easy
- changing address or map must be easy
- adding a new job must be easy
- publishing a new article must be easy
- archiving outdated content must be safe
- following up consultations must be fast

If the admin can do those things cleanly, the frontend becomes reliable and scalable.

## Immediate Next Step

Start Phase 1 with:

1. HTML prototype screens
2. database schema
3. `/api/v1/` endpoint list
4. mock JSON contracts for each admin screen

If this document is followed closely, the result will be:

- a serious admin panel
- a clean public website
- a system that can grow without rewriting everything later
