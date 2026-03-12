import { useState } from "react";
import {
  blogCategories,
  blogPosts,
  getBlogAuthorById,
  getBlogCategoryById,
  getFeaturedBlogPosts,
  getVisibleBlogPosts,
} from "../content";
import type { BlogCategoryId, BlogFeaturedSlot, BlogPost } from "../types";

const resourcesPageStyles = String.raw`
  .cx-blog-page {
    --cx-page-bg: #f5f4f1;
    --cx-page-text: #111111;
    --cx-muted: #444444;
    --cx-meta: #6c6c6c;
    --cx-media-surface: #ffffff;
    --cx-content-surface: #ebebeb;
    --cx-card-border: rgba(17, 17, 17, 0.08);
    --cx-card-shadow: 0 14px 28px rgba(17, 17, 17, 0.06);
    --cx-card-shadow-hover: 0 24px 48px rgba(17, 17, 17, 0.12); /* New: Hover shadow */
    --cx-badge-border: #111111;
    --cx-badge-text: #111111;
    --cx-link: #111111;
    --cx-filter-border: rgba(17, 17, 17, 0.18);
    --cx-filter-text: #5d5d5d;
    --cx-filter-active-bg: #111111;
    --cx-filter-active-text: #ffffff;
    --cx-filter-active-border: #111111;
    --cx-empty-bg: #ebebeb;
    --cx-empty-border: rgba(17, 17, 17, 0.08);
    --cx-more-bg: #111111;
    --cx-more-text: #ffffff;
    --cx-more-border: #111111;
    --cx-placeholder-copy: #111111;
    --cx-placeholder-meta: rgba(17, 17, 17, 0.52);
    --cx-placeholder-accent: rgba(17, 17, 17, 0.08);
    --cx-placeholder-border: rgba(17, 17, 17, 0.12);
    background: var(--cx-page-bg);
    color: var(--cx-page-text);
    font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    padding: 32px 20px 64px;
  }

  html[data-theme="dark"] .cx-blog-page {
    --cx-page-bg: #0a0b0d;
    --cx-page-text: #f4f4ef;
    --cx-muted: #c9c9c3;
    --cx-meta: #9c9c96;
    --cx-media-surface: #101113;
    --cx-content-surface: #1d1f22;
    --cx-card-border: rgba(255, 255, 255, 0.08);
    --cx-card-shadow: 0 16px 32px rgba(0, 0, 0, 0.24);
    --cx-card-shadow-hover: 0 24px 48px rgba(0, 0, 0, 0.4); /* New: Dark hover shadow */
    --cx-badge-border: rgba(255, 255, 255, 0.92);
    --cx-badge-text: #f4f4ef;
    --cx-link: #f4f4ef;
    --cx-filter-border: rgba(255, 255, 255, 0.16);
    --cx-filter-text: rgba(255, 255, 255, 0.72);
    --cx-filter-active-bg: #f4f4ef;
    --cx-filter-active-text: #111111;
    --cx-filter-active-border: #f4f4ef;
    --cx-empty-bg: #1d1f22;
    --cx-empty-border: rgba(255, 255, 255, 0.08);
    --cx-more-bg: #f4f4ef;
    --cx-more-text: #111111;
    --cx-more-border: rgba(255, 255, 255, 0.16);
    --cx-placeholder-copy: #f4f4ef;
    --cx-placeholder-meta: rgba(255, 255, 255, 0.54);
    --cx-placeholder-accent: rgba(255, 255, 255, 0.08);
    --cx-placeholder-border: rgba(255, 255, 255, 0.14);
  }

  .cx-blog-page *,
  .cx-blog-page *::before,
  .cx-blog-page *::after {
    box-sizing: border-box;
  }

  .cx-container {
    max-width: 1280px;
    margin: 0 auto;
  }

  .cx-page-title {
    margin: 0 0 24px;
    color: var(--cx-page-text);
    font-size: clamp(2.2rem, 5vw, 3.5rem);
    font-weight: 400;
    line-height: 0.96;
    letter-spacing: -0.05em;
  }

  /* --- Interactive Card Wrappers --- */
  .cx-featured-wrapper,
  .cx-sub-card,
  .cx-post-card {
    position: relative;
    border-radius: 4px;
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .cx-featured-wrapper:hover,
  .cx-sub-card:hover,
  .cx-post-card:hover {
    transform: translateY(-4px);
  }

  /* Apply shadow specifically to elements that have borders to avoid double shadows */
  .cx-featured-wrapper:hover .cx-featured-image,
  .cx-featured-wrapper:hover .cx-featured-content,
  .cx-sub-card:hover,
  .cx-post-card:hover {
    box-shadow: var(--cx-card-shadow-hover);
  }

  /* Full card clickable overlay */
  .cx-click-overlay::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 10;
  }

  /* Image zoom effect on hover */
  .cx-cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .cx-featured-wrapper:hover .cx-cover-image,
  .cx-sub-card:hover .cx-cover-image,
  .cx-post-card:hover .cx-cover-image {
    transform: scale(1.05);
  }

  .cx-featured-section {
    display: grid;
    grid-template-columns: minmax(0, 45%) minmax(0, 55%);
    gap: 24px;
    margin-bottom: 24px;
    align-items: stretch;
  }

  .cx-featured-image,
  .cx-featured-content,
  .cx-sub-card,
  .cx-post-card,
  .cx-empty-state {
    border: 1px solid var(--cx-card-border);
    box-shadow: var(--cx-card-shadow);
    transition: box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .cx-featured-image,
  .cx-featured-content {
    border-radius: 4px;
    overflow: hidden;
  }

  .cx-featured-image,
  .cx-sub-image,
  .cx-post-media {
    position: relative;
    display: flex;
    background: var(--cx-media-surface);
    overflow: hidden; /* Contains the image zoom */
  }

  .cx-placeholder {
    flex: 1 1 auto;
  }

  .cx-tag {
    position: absolute;
    top: 24px;
    left: 24px;
    z-index: 3;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 34px;
    padding: 0 16px;
    border: 1px solid var(--cx-badge-border);
    border-radius: 999px;
    background: transparent;
    color: var(--cx-badge-text);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .cx-date {
    display: block;
    margin: 0 0 16px;
    color: var(--cx-meta);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .cx-featured-content,
  .cx-sub-content,
  .cx-post-content {
    background: var(--cx-content-surface);
  }

  .cx-featured-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 56px;
  }

  .cx-featured-content h2 {
    margin: 0 0 20px;
    color: var(--cx-page-text);
    font-size: clamp(2rem, 2.8vw, 2.25rem);
    font-weight: 700;
    line-height: 1.14;
    letter-spacing: -0.04em;
  }

  .cx-featured-content p {
    margin: 0 0 24px;
    color: var(--cx-muted);
    font-size: 16px;
    line-height: 1.6;
  }

  .cx-author {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    position: relative;
    z-index: 11; /* Keep above click overlay if user wants to click author specifically later */
  }

  .cx-featured-content .cx-author {
    margin-bottom: 22px;
  }

  .cx-author-img,
  .cx-author-fallback {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .cx-author-img {
    object-fit: cover;
    background: #d9d9d9;
  }

  .cx-author-fallback {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #cfd9df 0%, #e2ebf0 100%);
    color: #111111;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
  }

  .cx-author-name {
    min-width: 0;
    overflow: hidden;
    color: var(--cx-page-text);
    font-size: 14px;
    font-weight: 700;
    text-decoration: underline;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Improved Link */
  .cx-learn-more {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--cx-link);
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
  }

  .cx-learn-more span {
    display: inline-block;
    transition: transform 0.2s ease;
  }

  .cx-featured-wrapper:hover .cx-learn-more span,
  .cx-sub-card:hover .cx-learn-more span,
  .cx-post-card:hover .cx-learn-more span {
    transform: translateX(4px);
  }

  .cx-learn-more--push {
    margin-top: auto;
  }

  .cx-sub-articles {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
  }

  .cx-sub-card {
    display: grid;
    grid-template-columns: minmax(0, 40%) minmax(0, 60%);
    border-radius: 4px;
    overflow: hidden;
    background: var(--cx-content-surface);
  }

  .cx-sub-image {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
  }

  .cx-sub-content {
    display: flex;
    flex-direction: column;
    padding: 32px;
  }

  .cx-sub-content h3 {
    margin: 0 0 12px;
    color: var(--cx-page-text);
    font-size: 22px;
    font-weight: 700;
    line-height: 1.22;
    letter-spacing: -0.03em;
  }

  .cx-sub-content p {
    margin: 0;
    color: var(--cx-muted);
    font-size: 14px;
    line-height: 1.6;
  }

  .cx-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    margin-top: 56px;
  }

  .cx-filter-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 42px;
    padding: 0 18px;
    border: 1px solid var(--cx-filter-border);
    border-radius: 999px;
    background: transparent;
    color: var(--cx-filter-text);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition:
      border-color 180ms ease,
      color 180ms ease,
      background-color 180ms ease,
      transform 100ms ease;
  }

  .cx-filter-btn:hover,
  .cx-filter-btn:focus-visible {
    border-color: var(--cx-page-text);
    color: var(--cx-page-text);
    outline: none;
  }

  .cx-filter-btn:active {
    transform: scale(0.96);
  }

  .cx-filter-btn.active {
    border-color: var(--cx-filter-active-border);
    background: var(--cx-filter-active-bg);
    color: var(--cx-filter-active-text);
  }

  .cx-post-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 24px;
    margin-top: 40px;
  }

  .cx-post-card {
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    overflow: hidden;
    background: var(--cx-content-surface);
  }

  .cx-post-media {
    aspect-ratio: 4 / 3;
  }

  .cx-post-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 24px;
  }

  .cx-post-content .cx-date {
    margin-bottom: 12px;
  }

  .cx-post-content h3 {
    margin: 0 0 12px;
    color: var(--cx-page-text);
    font-size: 21px;
    font-weight: 700;
    line-height: 1.24;
    letter-spacing: -0.03em;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .cx-post-content p {
    margin: 0;
    color: var(--cx-muted);
    font-size: 15px;
    line-height: 1.6;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
  }

  .cx-post-bottom {
    display: grid;
    gap: 16px;
    margin-top: auto;
    padding-top: 20px;
  }

  .cx-empty-state {
    margin-top: 40px;
    padding: 32px;
    border-radius: 4px;
    background: var(--cx-empty-bg);
    color: var(--cx-muted);
  }

  .cx-empty-state h2 {
    margin: 0 0 12px;
    color: var(--cx-page-text);
    font-size: 28px;
    line-height: 1.12;
    letter-spacing: -0.03em;
  }

  .cx-empty-state p:last-child {
    margin: 0;
  }

  .cx-grid-actions {
    display: flex;
    justify-content: center;
    margin-top: 32px;
  }

  .cx-more-btn {
    min-height: 46px;
    padding: 0 24px;
    border: 1px solid var(--cx-more-border);
    border-radius: 999px;
    background: var(--cx-more-bg);
    color: var(--cx-more-text);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition:
      transform 100ms ease,
      opacity 180ms ease;
  }

  .cx-more-btn:hover,
  .cx-more-btn:focus-visible {
    opacity: 0.92;
    outline: none;
  }

  .cx-more-btn:active {
    transform: scale(0.97);
  }

  .cx-cover-overlay {
    position: absolute;
    left: 18px;
    right: 18px;
    bottom: 18px;
    z-index: 2;
    display: grid;
    gap: 4px;
    width: fit-content;
    max-width: calc(100% - 36px);
    padding: 12px 14px;
    border: 1px solid var(--cx-card-border);
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.88);
    color: #111111;
  }

  html[data-theme="dark"] .cx-cover-overlay {
    background: rgba(16, 17, 19, 0.82);
    color: #f4f4ef;
  }

  .cx-cover-overlay span {
    color: inherit;
    opacity: 0.62;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .cx-cover-overlay strong {
    color: inherit;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.1;
  }

  .cx-placeholder {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    padding: 28px;
    color: var(--cx-placeholder-copy);
    overflow: hidden;
  }

  .cx-placeholder::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, transparent 0%, var(--cx-placeholder-accent) 100%);
    opacity: 0.65;
    pointer-events: none;
  }

  .cx-placeholder[data-slot="popular"]::before {
    background:
      linear-gradient(180deg, transparent 46%, rgba(71, 88, 255, 0.18) 100%);
  }

  .cx-placeholder[data-slot="editors-pick"]::before {
    background:
      radial-gradient(circle at 50% 90%, rgba(44, 139, 145, 0.24), transparent 28%),
      linear-gradient(180deg, transparent 0%, rgba(17, 17, 17, 0.04) 100%);
  }

  html[data-theme="dark"] .cx-placeholder[data-slot="popular"]::before {
    background:
      linear-gradient(180deg, transparent 46%, rgba(71, 88, 255, 0.14) 100%);
  }

  .cx-placeholder__mark {
    position: absolute;
    top: 56px;
    left: 42px;
    z-index: 2;
    font-size: 17px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .cx-placeholder__shape {
    position: absolute;
    display: block;
    z-index: 1;
    border: 1px solid var(--cx-placeholder-border);
    background: var(--cx-placeholder-accent);
  }

  .cx-placeholder__shape--primary {
    top: 34px;
    right: 34px;
    width: clamp(88px, 28%, 180px);
    aspect-ratio: 1 / 0.8;
    border-radius: 4px;
  }

  .cx-placeholder__shape--secondary {
    top: 52px;
    right: clamp(108px, 20%, 160px);
    width: 38px;
    height: 38px;
    border-radius: 4px;
    transform: rotate(38deg);
  }

  .cx-placeholder__copy {
    position: relative;
    z-index: 2;
    align-self: flex-end;
    display: grid;
    gap: 6px;
    max-width: min(78%, 360px);
  }

  .cx-placeholder__copy span {
    color: var(--cx-placeholder-meta);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .cx-placeholder__copy strong {
    color: var(--cx-placeholder-copy);
    font-weight: 600;
    line-height: 1.08;
    letter-spacing: -0.03em;
  }

  .cx-placeholder--hero {
    padding: 40px;
    align-items: flex-end;
  }

  .cx-placeholder--hero .cx-placeholder__copy strong {
    font-size: clamp(2rem, 3vw, 2.6rem);
  }

  .cx-placeholder--supporting {
    align-items: stretch;
    justify-content: flex-start;
  }

  .cx-placeholder--supporting .cx-placeholder__copy strong {
    font-size: clamp(1.8rem, 2vw, 2.1rem);
  }

  .cx-placeholder--grid {
    padding: 18px;
    align-items: flex-end;
  }

  .cx-placeholder--grid .cx-placeholder__mark {
    top: 18px;
    left: 18px;
    font-size: 14px;
  }

  .cx-placeholder--grid .cx-placeholder__shape--primary {
    top: 18px;
    right: 18px;
    width: 64px;
  }

  .cx-placeholder--grid .cx-placeholder__shape--secondary {
    top: 18px;
    right: 72px;
    width: 24px;
    height: 24px;
  }

  .cx-placeholder--grid .cx-placeholder__copy strong {
    font-size: 18px;
  }

  .cx-placeholder[data-slot="editors-pick"] .cx-placeholder__copy {
    align-self: center;
    justify-self: center;
    max-width: min(80%, 280px);
    text-align: center;
  }

  .cx-placeholder[data-slot="editors-pick"] .cx-placeholder__mark,
  .cx-placeholder--grid .cx-placeholder__mark {
    opacity: 0;
  }

  .cx-placeholder[data-slot="editors-pick"] .cx-placeholder__shape--primary {
    top: auto;
    right: auto;
    left: 50%;
    bottom: -34px;
    width: 72%;
    max-width: 260px;
    transform: translateX(-50%);
  }

  .cx-placeholder[data-slot="editors-pick"] .cx-placeholder__shape--secondary {
    display: none;
  }

  .cx-placeholder[data-slot="popular"] .cx-placeholder__shape--primary {
    top: auto;
    bottom: -12px;
    right: 28px;
    width: clamp(110px, 32%, 180px);
    aspect-ratio: 0.76 / 1;
    border-radius: 6px 6px 0 0;
  }

  .cx-placeholder[data-slot="popular"] .cx-placeholder__shape--secondary {
    top: 52px;
    right: 124px;
    width: 32px;
    height: 32px;
    transform: rotate(45deg);
  }

  .cx-placeholder--supporting .cx-placeholder__copy,
  .cx-placeholder--grid .cx-placeholder__copy {
    max-width: 80%;
  }

  @media (max-width: 1099px) {
    .cx-post-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 900px) {
    .cx-blog-page {
      padding-top: 28px;
    }

    .cx-featured-section {
      grid-template-columns: 1fr;
    }

    .cx-featured-content {
      padding: 40px;
    }

    .cx-sub-articles {
      grid-template-columns: 1fr;
    }

    .cx-sub-card {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 767px) {
    .cx-blog-page {
      padding: 24px 16px 52px;
    }

    .cx-page-title {
      margin-bottom: 20px;
    }

    .cx-featured-content {
      padding: 32px 24px;
    }

    .cx-sub-content,
    .cx-post-content {
      padding: 24px 20px;
    }

    .cx-featured-content h2 {
      font-size: 30px;
    }

    .cx-sub-content h3,
    .cx-post-content h3 {
      font-size: 20px;
    }

    .cx-filters {
      margin-top: 42px;
      justify-content: flex-start;
    }

    .cx-post-grid {
      grid-template-columns: 1fr;
      margin-top: 32px;
    }

    .cx-grid-actions {
      justify-content: stretch;
    }

    .cx-more-btn {
      width: 100%;
    }

    .cx-placeholder--hero {
      padding: 30px 24px;
    }

    .cx-placeholder__mark {
      left: 28px;
      top: 52px;
    }

    .cx-placeholder__shape--primary {
      top: 30px;
      right: 24px;
    }

    .cx-placeholder__shape--secondary {
      right: 92px;
    }
  }
`;

// Show 6 total cards before "See more": 3 featured cards + 3 grid cards.
const INITIAL_VISIBLE_COUNT = 3;

type ActiveCategory = BlogCategoryId | "all";
type VisualSlot = BlogFeaturedSlot | "default";
type MediaVariant = "hero" | "supporting" | "grid";

const blogDateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

function formatBlogDate(date: string) {
  return blogDateFormatter.format(new Date(`${date}T00:00:00Z`));
}

function getAuthorInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getFeaturedSlotLabel(slot?: BlogFeaturedSlot) {
  switch (slot) {
    case "hero":
      return "Featured";
    case "popular":
      return "Most Popular";
    case "editors-pick":
      return "Editor's Pick";
    default:
      return null;
  }
}

function getVisualSlot(post: BlogPost): VisualSlot {
  return post.featuredSlot ?? "default";
}

function renderAuthor(post: BlogPost) {
  const author = getBlogAuthorById(post.authorId);
  const authorName = author?.name ?? "Exxonim Team";

  return (
    <div className="cx-author">
      {author?.avatarSrc ? (
        <img
          className="cx-author-img"
          src={author.avatarSrc}
          alt={author.name}
          loading="lazy"
        />
      ) : (
        <span className="cx-author-fallback" aria-hidden="true">
          {getAuthorInitials(authorName)}
        </span>
      )}

      <span className="cx-author-name">{authorName}</span>
    </div>
  );
}

function renderPlaceholder(
  post: BlogPost,
  categoryLabel: string,
  slot: VisualSlot,
  variant: MediaVariant
) {
  const metaLabel =
    slot === "editors-pick" && variant !== "hero" ? "Operational brief" : categoryLabel;
  const mediaLabel = post.mediaLabel || post.title;

  return (
    <div className={`cx-placeholder cx-placeholder--${variant}`} data-slot={slot}>
      <span className="cx-placeholder__mark" aria-hidden="true">
        E
      </span>
      <span className="cx-placeholder__shape cx-placeholder__shape--primary" aria-hidden="true"></span>
      <span className="cx-placeholder__shape cx-placeholder__shape--secondary" aria-hidden="true"></span>
      <div className="cx-placeholder__copy">
        <span>{metaLabel}</span>
        <strong>{mediaLabel}</strong>
      </div>
    </div>
  );
}

function renderMedia(post: BlogPost, categoryLabel: string, slot: VisualSlot, variant: MediaVariant) {
  if (post.coverImageSrc) {
    return (
      <>
        <img
          className="cx-cover-image"
          src={post.coverImageSrc}
          alt={post.coverAlt ?? post.title}
        />
        <div className="cx-cover-overlay">
          <span>{categoryLabel}</span>
          <strong>{post.mediaLabel || post.title}</strong>
        </div>
      </>
    );
  }

  return renderPlaceholder(post, categoryLabel, slot, variant);
}

function renderSupportingCard(post: BlogPost) {
  const categoryLabel = getBlogCategoryById(post.categoryId)?.label ?? "Insight";
  const slot = getVisualSlot(post);
  const badgeLabel = getFeaturedSlotLabel(post.featuredSlot);
  const articleLink = `/blog/${post.slug}`;

  return (
    <article className="cx-sub-card">
      <div className="cx-sub-image">
        {badgeLabel ? <div className="cx-tag">{badgeLabel}</div> : null}
        {renderMedia(post, categoryLabel, slot, "supporting")}
      </div>

      <div className="cx-sub-content">
        <span className="cx-date">{formatBlogDate(post.publishedAt)}</span>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>
        <a href={articleLink} className="cx-learn-more cx-learn-more--push cx-click-overlay">
          Learn more <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </article>
  );
}

function renderGridCard(post: BlogPost) {
  const categoryLabel = getBlogCategoryById(post.categoryId)?.label ?? "Insight";
  const slot = getVisualSlot(post);
  const articleLink = `/blog/${post.slug}`;

  return (
    <article className="cx-post-card">
      <div className="cx-post-media">
        {renderMedia(post, categoryLabel, slot, "grid")}
      </div>

      <div className="cx-post-content">
        <span className="cx-date">
          {formatBlogDate(post.publishedAt)}
          {" · "}
          {categoryLabel}
        </span>
        <h3>{post.title}</h3>
        <p>{post.excerpt}</p>

        <div className="cx-post-bottom">
          {renderAuthor(post)}
          <a href={articleLink} className="cx-learn-more cx-click-overlay">
            Learn more <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </article>
  );
}

export function ResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ActiveCategory>("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const featuredPosts = getFeaturedBlogPosts(blogPosts).slice(0, 3);
  const heroPost = featuredPosts[0];
  const supportingPosts = featuredPosts.slice(1, 3);
  const featuredSlugs = featuredPosts.map((post) => post.slug);
  const filteredPosts = getVisibleBlogPosts({
    posts: blogPosts,
    categoryId: selectedCategory,
    excludeSlugs: selectedCategory === "all" ? featuredSlugs : [],
  });
  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMorePosts = filteredPosts.length > visiblePosts.length;
  const activeCategory =
    selectedCategory === "all"
      ? null
      : blogCategories.find((category) => category.id === selectedCategory);

  const handleSelectCategory = (categoryId: ActiveCategory) => {
    setSelectedCategory(categoryId);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  const heroCategoryLabel = heroPost
    ? getBlogCategoryById(heroPost.categoryId)?.label ?? "Insight"
    : "Insight";

  return (
    <>
      <style>{resourcesPageStyles}</style>

      <div className="cx-blog-page">
        <div className="cx-container">
          <span className="section-anchor" id="resources" aria-hidden="true"></span>
          <span className="section-anchor" id="blogs" aria-hidden="true"></span>

          <h1 className="cx-page-title">Exxonim Blog</h1>

          {heroPost ? (
            <div className="cx-featured-wrapper">
              <div className="cx-featured-section">
                <div className="cx-featured-image">
                  {getFeaturedSlotLabel(heroPost.featuredSlot) ? (
                    <div className="cx-tag">{getFeaturedSlotLabel(heroPost.featuredSlot)}</div>
                  ) : null}
                  {renderMedia(heroPost, heroCategoryLabel, getVisualSlot(heroPost), "hero")}
                </div>

                <div className="cx-featured-content">
                  <span className="cx-date">{formatBlogDate(heroPost.publishedAt)}</span>
                  <h2>{heroPost.title}</h2>
                  <p>{heroPost.excerpt}</p>
                  {renderAuthor(heroPost)}
                  <a href={`/blog/${heroPost.slug}`} className="cx-learn-more cx-click-overlay">
                    Learn more <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>
            </div>
          ) : null}

          {supportingPosts.length ? (
            <div className="cx-sub-articles">
              {supportingPosts.map((post) => (
                <div key={post.slug}>{renderSupportingCard(post)}</div>
              ))}
            </div>
          ) : null}

          <div className="cx-filters" aria-label="Blog categories">
            <button
              type="button"
              className={`cx-filter-btn ${selectedCategory === "all" ? "active" : ""}`}
              aria-pressed={selectedCategory === "all"}
              onClick={() => handleSelectCategory("all")}
            >
              {selectedCategory === "all" ? (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
              ) : null}
              Latest
            </button>

            {blogCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`cx-filter-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                aria-pressed={selectedCategory === category.id}
                onClick={() => handleSelectCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          {visiblePosts.length ? (
            <div className="cx-post-grid">
              {visiblePosts.map((post) => (
                <div key={post.slug}>{renderGridCard(post)}</div>
              ))}
            </div>
          ) : (
            <article className="cx-empty-state">
              <span className="cx-date">No posts in view</span>
              <h2>
                {activeCategory
                  ? `${activeCategory.label} posts will appear here.`
                  : "Blog posts will appear here."}
              </h2>
              <p>
                {activeCategory?.description ??
                  "Published posts will populate this grid automatically as the library grows."}
              </p>
            </article>
          )}

          {hasMorePosts ? (
            <div className="cx-grid-actions">
              <button
                type="button"
                className="cx-more-btn"
                onClick={() =>
                  setVisibleCount((currentCount) => currentCount + INITIAL_VISIBLE_COUNT)
                }
              >
                See more
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}