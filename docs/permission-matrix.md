# Exxonim Permission Matrix

This file is the standalone RBAC reference for Exxonim.

The backend remains the source of enforcement, but this matrix is the documentation reference for:

- endpoint protection
- UI visibility
- role expectations
- workflow boundaries

Legend:

- `✓` allowed
- `✗` not allowed

## Role Principles

- `superuser` has full platform access, including role and permission administration.
- `administrator` manages operations, settings, publishing, and standard admin governance.
- `editor` creates and updates draft content, then submits it for review.
- `reviewer` approves or rejects submitted public content.
- `viewer` has read-only back-office access where read access is granted.

## Permission Matrix

| Permission Code | Module | Action | Superuser | Administrator | Editor | Reviewer | Viewer |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `dashboard.read` | Dashboard | View the admin dashboard | ✓ | ✓ | ✓ | ✓ | ✓ |
| `page.read` | Pages | View page records in admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| `page.create` | Pages | Create a page draft | ✓ | ✓ | ✓ | ✗ | ✗ |
| `page.edit_own_draft` | Pages | Edit a draft page you created | ✓ | ✓ | ✓ | ✗ | ✗ |
| `page.edit_any_draft` | Pages | Edit any draft page | ✓ | ✓ | ✗ | ✗ | ✗ |
| `page.submit_review` | Pages | Submit a page for review | ✓ | ✓ | ✓ | ✗ | ✗ |
| `page.approve` | Pages | Approve a page in review | ✓ | ✓ | ✗ | ✓ | ✗ |
| `page.reject` | Pages | Reject a page in review | ✓ | ✓ | ✗ | ✓ | ✗ |
| `page.publish` | Pages | Publish or unpublish a page | ✓ | ✓ | ✗ | ✗ | ✗ |
| `page.archive` | Pages | Archive a page | ✓ | ✓ | ✗ | ✗ | ✗ |
| `page.delete` | Pages | Delete a page | ✓ | ✓ | ✗ | ✗ | ✗ |
| `blog_post.read` | Blog posts | View blog post records in admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| `blog_post.create` | Blog posts | Create a blog post draft | ✓ | ✓ | ✓ | ✗ | ✗ |
| `blog_post.edit_own_draft` | Blog posts | Edit a draft blog post you created | ✓ | ✓ | ✓ | ✗ | ✗ |
| `blog_post.edit_any_draft` | Blog posts | Edit any draft blog post | ✓ | ✓ | ✗ | ✗ | ✗ |
| `blog_post.submit_review` | Blog posts | Submit a blog post for review | ✓ | ✓ | ✓ | ✗ | ✗ |
| `blog_post.approve` | Blog posts | Approve a blog post in review | ✓ | ✓ | ✗ | ✓ | ✗ |
| `blog_post.reject` | Blog posts | Reject a blog post in review | ✓ | ✓ | ✗ | ✓ | ✗ |
| `blog_post.publish` | Blog posts | Publish or unpublish a blog post | ✓ | ✓ | ✗ | ✗ | ✗ |
| `blog_post.archive` | Blog posts | Archive a blog post | ✓ | ✓ | ✗ | ✗ | ✗ |
| `blog_post.delete` | Blog posts | Delete a blog post | ✓ | ✓ | ✗ | ✗ | ✗ |
| `blog_category.read` | Blog categories | View blog categories | ✓ | ✓ | ✓ | ✓ | ✓ |
| `blog_category.manage` | Blog categories | Create, update, or delete categories | ✓ | ✓ | ✗ | ✗ | ✗ |
| `blog_author.read` | Blog authors | View blog authors | ✓ | ✓ | ✓ | ✓ | ✓ |
| `blog_author.manage` | Blog authors | Create, update, or delete authors | ✓ | ✓ | ✗ | ✗ | ✗ |
| `testimonial.read` | Testimonials | View testimonial records in admin | ✓ | ✓ | ✓ | ✓ | ✓ |
| `testimonial.create` | Testimonials | Create a testimonial draft | ✓ | ✓ | ✓ | ✗ | ✗ |
| `testimonial.edit_own_draft` | Testimonials | Edit a draft testimonial you created | ✓ | ✓ | ✓ | ✗ | ✗ |
| `testimonial.edit_any_draft` | Testimonials | Edit any draft testimonial | ✓ | ✓ | ✗ | ✗ | ✗ |
| `testimonial.submit_review` | Testimonials | Submit a testimonial for review | ✓ | ✓ | ✓ | ✗ | ✗ |
| `testimonial.approve` | Testimonials | Approve a testimonial in review | ✓ | ✓ | ✗ | ✓ | ✗ |
| `testimonial.reject` | Testimonials | Reject a testimonial in review | ✓ | ✓ | ✗ | ✓ | ✗ |
| `testimonial.publish` | Testimonials | Publish or unpublish a testimonial | ✓ | ✓ | ✗ | ✗ | ✗ |
| `testimonial.archive` | Testimonials | Archive a testimonial | ✓ | ✓ | ✗ | ✗ | ✗ |
| `testimonial.delete` | Testimonials | Delete a testimonial | ✓ | ✓ | ✗ | ✗ | ✗ |
| `media.read` | Media | View the media library | ✓ | ✓ | ✓ | ✓ | ✓ |
| `media.create` | Media | Upload or create media | ✓ | ✓ | ✓ | ✓ | ✗ |
| `media.update` | Media | Update media metadata | ✓ | ✓ | ✓ | ✓ | ✗ |
| `media.delete` | Media | Delete media | ✓ | ✓ | ✗ | ✗ | ✗ |
| `navigation.read` | Navigation | View navigation items | ✓ | ✓ | ✓ | ✓ | ✓ |
| `navigation.create` | Navigation | Create a navigation item | ✓ | ✓ | ✗ | ✗ | ✗ |
| `navigation.update` | Navigation | Update a navigation item | ✓ | ✓ | ✗ | ✗ | ✗ |
| `navigation.delete` | Navigation | Delete a navigation item | ✓ | ✓ | ✗ | ✗ | ✗ |
| `pricing.read` | Pricing | View pricing plans | ✓ | ✓ | ✓ | ✓ | ✓ |
| `pricing.create` | Pricing | Create a pricing plan | ✓ | ✓ | ✗ | ✗ | ✗ |
| `pricing.update` | Pricing | Update a pricing plan | ✓ | ✓ | ✗ | ✗ | ✗ |
| `pricing.delete` | Pricing | Delete a pricing plan | ✓ | ✓ | ✗ | ✗ | ✗ |
| `job.read` | Careers | View job openings | ✓ | ✓ | ✓ | ✓ | ✓ |
| `job.create` | Careers | Create a job opening | ✓ | ✓ | ✗ | ✗ | ✗ |
| `job.update` | Careers | Update a job opening | ✓ | ✓ | ✗ | ✗ | ✗ |
| `job.delete` | Careers | Delete a job opening | ✓ | ✓ | ✗ | ✗ | ✗ |
| `site_setting.read` | Site settings | View site settings | ✓ | ✓ | ✗ | ✗ | ✗ |
| `site_setting.create` | Site settings | Create a site setting | ✓ | ✓ | ✗ | ✗ | ✗ |
| `site_setting.update` | Site settings | Update a site setting | ✓ | ✓ | ✗ | ✗ | ✗ |
| `site_setting.delete` | Site settings | Delete a site setting | ✓ | ✓ | ✗ | ✗ | ✗ |
| `consultation.read` | Consultations | View consultation records | ✓ | ✓ | ✗ | ✗ | ✗ |
| `consultation.update` | Consultations | Update consultation status or assignee | ✓ | ✓ | ✗ | ✗ | ✗ |
| `notification.read` | Notifications | View in-app admin notifications | ✓ | ✓ | ✓ | ✓ | ✓ |
| `notification.update` | Notifications | Mark notifications as read | ✓ | ✓ | ✓ | ✓ | ✓ |
| `notification.preference.read` | Notifications | View personal notification preferences | ✓ | ✓ | ✓ | ✓ | ✓ |
| `notification.preference.update` | Notifications | Manage personal notification preferences | ✓ | ✓ | ✓ | ✓ | ✓ |
| `report.read` | Reports | View read-only operational and activity reports | ✓ | ✓ | ✓ | ✓ | ✓ |
| `privacy_request.read` | Privacy requests | View privacy-request workflow records | ✓ | ✓ | ✗ | ✗ | ✗ |
| `privacy_request.manage` | Privacy requests | Create and update privacy-request workflow records | ✓ | ✓ | ✗ | ✗ | ✗ |
| `user.read` | Users | View admin users | ✓ | ✓ | ✗ | ✗ | ✗ |
| `user.manage` | Users | Create, update, activate, or deactivate users | ✓ | ✓ | ✗ | ✗ | ✗ |
| `role.read` | Roles | View roles and role-permission mappings | ✓ | ✓ | ✗ | ✗ | ✗ |
| `role.manage` | Roles | Create roles and change role-permission mappings | ✓ | ✗ | ✗ | ✗ | ✗ |
| `audit_log.read` | Audit log | View append-only audit history | ✓ | ✓ | ✗ | ✗ | ✗ |

## Workflow Notes

- Publishing workflow applies to `page`, `blog_post`, and `testimonial`.
- Public API routes should expose only `published` records.
- `edit_own_draft` applies only when the current user created the record and the record remains in an editable workflow state.
- `role.manage` stays restricted to `superuser` so the permission model remains tightly controlled.
