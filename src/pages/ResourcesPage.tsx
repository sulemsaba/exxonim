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
    --cx-page-text: #0e1f22;
    --cx-muted: #43575a;
    --cx-meta: #567074;
    --cx-page-veil: rgba(245, 249, 249, 0.72);
    --cx-page-veil-strong: rgba(235, 244, 244, 0.84);
    --cx-page-glow: rgba(44, 139, 145, 0.16);
    --cx-page-glow-soft: rgba(134, 207, 211, 0.08);
    --cx-media-surface: rgba(255, 255, 255, 0.9);
    --cx-content-surface: rgba(235, 242, 242, 0.92);
    --cx-content-surface-hover: rgba(223, 238, 239, 0.96);
    --cx-hover-border: rgba(44, 139, 145, 0.34);
    --cx-radius: 8px;
    --cx-inner-radius: 6px;
    --cx-card-border: rgba(44, 139, 145, 0.16);
    --cx-card-shadow: 0 10px 20px rgba(8, 61, 66, 0.05);
    --cx-card-shadow-hover: 0 14px 28px rgba(8, 61, 66, 0.1);
    --cx-badge-border: #083d42;
    --cx-badge-text: #083d42;
    --cx-link: #083d42;
    --cx-link-hover: #0d666a;
    --cx-filter-border: rgba(44, 139, 145, 0.18);
    --cx-filter-bg: rgba(44, 139, 145, 0.04);
    --cx-filter-text: #43575a;
    --cx-filter-active-bg: #083d42;
    --cx-filter-active-text: #f7fbfb;
    --cx-filter-active-border: #083d42;
    --cx-empty-bg: rgba(235, 242, 242, 0.92);
    --cx-empty-border: rgba(44, 139, 145, 0.16);
    --cx-more-bg: #083d42;
    --cx-more-text: #f7fbfb;
    --cx-more-border: #083d42;
    --cx-placeholder-copy: #0e1f22;
    --cx-placeholder-meta: rgba(13, 102, 106, 0.62);
    --cx-placeholder-accent: rgba(44, 139, 145, 0.08);
    --cx-placeholder-border: rgba(44, 139, 145, 0.14);
    --cx-hover-accent-glow: rgba(44, 139, 145, 0.12);
    position: relative;
    isolation: isolate;
    background: transparent;
    color: var(--cx-page-text);
    font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.5;
    padding: 28px 20px 56px;
    overflow: hidden;
  }

  html[data-theme="dark"] .cx-blog-page {
    --cx-page-text: #edf7f7;
    --cx-muted: #a6c0c2;
    --cx-meta: #86a7aa;
    --cx-page-veil: rgba(6, 18, 20, 0.72);
    --cx-page-veil-strong: rgba(10, 22, 24, 0.84);
    --cx-page-glow: rgba(44, 139, 145, 0.18);
    --cx-page-glow-soft: rgba(134, 207, 211, 0.08);
    --cx-media-surface: rgba(8, 16, 18, 0.92);
    --cx-content-surface: rgba(14, 28, 31, 0.92);
    --cx-content-surface-hover: rgba(17, 49, 54, 0.94);
    --cx-hover-border: rgba(134, 207, 211, 0.28);
    --cx-card-border: rgba(134, 207, 211, 0.14);
    --cx-card-shadow: 0 12px 24px rgba(0, 0, 0, 0.24);
    --cx-card-shadow-hover: 0 18px 32px rgba(0, 0, 0, 0.3);
    --cx-badge-border: #86cfd3;
    --cx-badge-text: #86cfd3;
    --cx-link: #86cfd3;
    --cx-link-hover: #baf1f4;
    --cx-filter-border: rgba(134, 207, 211, 0.2);
    --cx-filter-bg: rgba(134, 207, 211, 0.06);
    --cx-filter-text: #a6c0c2;
    --cx-filter-active-bg: #86cfd3;
    --cx-filter-active-text: #082a2f;
    --cx-filter-active-border: #86cfd3;
    --cx-empty-bg: rgba(14, 28, 31, 0.92);
    --cx-empty-border: rgba(134, 207, 211, 0.14);
    --cx-more-bg: #86cfd3;
    --cx-more-text: #082a2f;
    --cx-more-border: #86cfd3;
    --cx-placeholder-copy: #edf7f7;
    --cx-placeholder-meta: rgba(134, 207, 211, 0.74);
    --cx-placeholder-accent: rgba(44, 139, 145, 0.12);
    --cx-placeholder-border: rgba(134, 207, 211, 0.16);
    --cx-hover-accent-glow: rgba(134, 207, 211, 0.1);
  }

  .cx-blog-page *,
  .cx-blog-page *::before,
  .cx-blog-page *::after {
    box-sizing: border-box;
  }

  .cx-blog-page::before,
  .cx-blog-page::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .cx-blog-page::before {
    z-index: 0;
    background: linear-gradient(180deg, var(--cx-page-veil) 0%, var(--cx-page-veil-strong) 100%);
  }

  .cx-blog-page::after {
    z-index: 0;
    background:
      radial-gradient(
        420px circle at var(--mouse-x, 50vw) var(--mouse-y, 30vh),
        var(--cx-page-glow) 0%,
        var(--cx-page-glow-soft) 28%,
        transparent 68%
      );
    opacity: 0.95;
  }

  .cx-container {
    position: relative;
    z-index: 1;
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
    border-radius: var(--cx-radius);
    transition: transform 240ms ease;
  }

  .cx-featured-wrapper:hover,
  .cx-sub-card:hover,
  .cx-post-card:hover {
    transform: translateY(-2px);
  }

  .cx-featured-image,
  .cx-featured-content,
  .cx-sub-card,
  .cx-post-card,
  .cx-empty-state {
    transition:
      border-color 240ms ease,
      box-shadow 240ms ease,
      background-color 240ms ease;
  }

  .cx-featured-wrapper:hover .cx-featured-image,
  .cx-featured-wrapper:hover .cx-featured-content,
  .cx-sub-card:hover,
  .cx-post-card:hover {
    border-color: var(--cx-hover-border);
    box-shadow: var(--cx-card-shadow-hover);
  }

  .cx-featured-wrapper:hover .cx-featured-content,
  .cx-sub-card:hover .cx-sub-content,
  .cx-post-card:hover .cx-post-content {
    background-color: var(--cx-content-surface-hover);
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
    transition: transform 240ms ease;
    z-index: 0;
  }

  .cx-featured-wrapper:hover .cx-cover-image,
  .cx-sub-card:hover .cx-cover-image,
  .cx-post-card:hover .cx-cover-image {
    transform: scale(1.02);
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
    border-radius: var(--cx-radius);
    transition: box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .cx-featured-image,
  .cx-featured-content {
    overflow: hidden;
  }

  .cx-featured-image,
  .cx-sub-image,
  .cx-post-media {
    position: relative;
    display: flex;
    background: var(--cx-media-surface);
    overflow: hidden;
    isolation: isolate;
  }

  .cx-featured-image::after,
  .cx-sub-image::after,
  .cx-post-media::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background: linear-gradient(180deg, transparent 24%, var(--cx-hover-accent-glow) 100%);
    opacity: 0;
    transition: opacity 240ms ease;
    pointer-events: none;
  }

  .cx-featured-wrapper:hover .cx-featured-image::after,
  .cx-sub-card:hover .cx-sub-image::after,
  .cx-post-card:hover .cx-post-media::after {
    opacity: 1;
  }

  .cx-placeholder {
    flex: 1 1 auto;
  }

  .cx-tag {
    position: absolute;
    top: 20px;
    left: 20px;
    z-index: 4;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 32px;
    padding: 0 14px;
    border: 1px solid var(--cx-badge-border);
    border-radius: 999px;
    background: transparent;
    color: var(--cx-badge-text);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .cx-date {
    display: block;
    margin: 0 0 14px;
    color: var(--cx-meta);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .cx-featured-content,
  .cx-sub-content,
  .cx-post-content {
    background-color: var(--cx-content-surface);
    transition: background-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .cx-featured-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px;
  }

  .cx-featured-content h2 {
    margin: 0 0 20px;
    color: var(--cx-page-text);
    font-size: clamp(2rem, 3.1vw, 3rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.04em;
  }

  .cx-featured-content p {
    margin: 0 0 20px;
    color: var(--cx-muted);
    font-size: 1rem;
    line-height: 1.56;
  }

  .cx-author {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    position: relative;
    z-index: 11;
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

  .cx-learn-more {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--cx-link);
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: color 180ms ease;
  }

  .cx-learn-more span {
    display: inline-block;
    transition: transform 180ms ease;
  }

  .cx-featured-wrapper:hover .cx-learn-more,
  .cx-sub-card:hover .cx-learn-more,
  .cx-post-card:hover .cx-learn-more {
    color: var(--cx-link-hover);
  }

  .cx-featured-wrapper:hover .cx-learn-more span,
  .cx-sub-card:hover .cx-learn-more span,
  .cx-post-card:hover .cx-learn-more span {
    transform: translateX(3px);
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
    overflow: hidden;
  }

  .cx-sub-image {
    display: flex;
    align-items: stretch;
    justify-content: stretch;
  }

  .cx-sub-content {
    display: flex;
    flex-direction: column;
    padding: 24px;
  }

  .cx-sub-content h3 {
    margin: 0 0 12px;
    color: var(--cx-page-text);
    font-size: clamp(1.25rem, 2vw, 1.55rem);
    font-weight: 700;
    line-height: 1.18;
    letter-spacing: -0.03em;
  }

  .cx-sub-content p {
    margin: 0;
    color: var(--cx-muted);
    font-size: 0.95rem;
    line-height: 1.56;
  }

  .cx-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
    margin-top: 48px;
  }

  .cx-filter-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 38px;
    padding: 0 16px;
    border: 1px solid var(--cx-filter-border);
    border-radius: 999px;
    background: var(--cx-filter-bg);
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
    border-color: var(--cx-hover-border);
    color: var(--cx-link-hover);
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
    margin-top: 36px;
  }

  .cx-post-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .cx-post-media {
    aspect-ratio: 16 / 10;
  }

  .cx-post-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 20px;
  }

  .cx-post-content .cx-date {
    margin-bottom: 12px;
  }

  .cx-post-content h3 {
    margin: 0 0 12px;
    color: var(--cx-page-text);
    font-size: clamp(1.15rem, 1.8vw, 1.3rem);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.03em;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .cx-post-content p {
    margin: 0;
    color: var(--cx-muted);
    font-size: 0.95rem;
    line-height: 1.56;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }

  .cx-post-bottom {
    display: grid;
    gap: 12px;
    margin-top: auto;
    padding-top: 16px;
  }

  .cx-empty-state {
    margin-top: 40px;
    padding: 32px;
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
    left: 14px;
    right: 14px;
    bottom: 14px;
    z-index: 3;
    display: grid;
    gap: 4px;
    width: fit-content;
    max-width: calc(100% - 36px);
    padding: 10px 12px;
    border: 1px solid rgba(44, 139, 145, 0.12);
    border-radius: var(--cx-inner-radius);
    background: rgba(255, 255, 255, 0.92);
    color: #0e1f22;
  }

  html[data-theme="dark"] .cx-cover-overlay {
    border-color: rgba(134, 207, 211, 0.16);
    background: rgba(8, 16, 18, 0.9);
    color: #edf7f7;
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
    padding: 22px;
    color: var(--cx-placeholder-copy);
    overflow: hidden;
  }

  .cx-placeholder::before {
    content: "";
    position: absolute;
    inset: 0;
    background:
      linear-gradient(180deg, transparent 0%, var(--cx-placeholder-accent) 100%);
    opacity: 0.45;
    pointer-events: none;
  }

  .cx-placeholder[data-slot="popular"]::before {
    background:
      linear-gradient(180deg, transparent 42%, rgba(44, 139, 145, 0.16) 100%);
  }

  .cx-placeholder[data-slot="editors-pick"]::before {
    background:
      radial-gradient(circle at 50% 88%, rgba(44, 139, 145, 0.2), transparent 26%),
      linear-gradient(180deg, transparent 0%, rgba(44, 139, 145, 0.06) 100%);
  }

  html[data-theme="dark"] .cx-placeholder[data-slot="popular"]::before {
    background:
      linear-gradient(180deg, transparent 42%, rgba(44, 139, 145, 0.14) 100%);
  }

  .cx-placeholder__mark {
    position: absolute;
    top: 48px;
    left: 34px;
    z-index: 2;
    font-size: 15px;
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
    top: 28px;
    right: 28px;
    width: clamp(76px, 24%, 150px);
    aspect-ratio: 1 / 0.8;
    border-radius: var(--cx-inner-radius);
  }

  .cx-placeholder__shape--secondary {
    top: 42px;
    right: clamp(94px, 18%, 144px);
    width: 28px;
    height: 28px;
    border-radius: 8px;
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
    font-size: 10px;
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
    padding: 34px;
    align-items: flex-end;
  }

  .cx-placeholder--hero .cx-placeholder__copy strong {
    font-size: clamp(1.7rem, 2.5vw, 2.2rem);
  }

  .cx-placeholder--supporting {
    align-items: stretch;
    justify-content: flex-start;
  }

  .cx-placeholder--supporting .cx-placeholder__copy strong {
    font-size: clamp(1.3rem, 1.9vw, 1.6rem);
  }

  .cx-placeholder--grid {
    padding: 16px;
    align-items: flex-end;
  }

  .cx-placeholder--grid .cx-placeholder__mark {
    top: 18px;
    left: 18px;
    font-size: 14px;
  }

  .cx-placeholder--grid .cx-placeholder__shape--primary {
    top: 16px;
    right: 16px;
    width: 56px;
  }

  .cx-placeholder--grid .cx-placeholder__shape--secondary {
    top: 18px;
    right: 64px;
    width: 18px;
    height: 18px;
  }

  .cx-placeholder--grid .cx-placeholder__copy strong {
    font-size: 16px;
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
    bottom: -8px;
    right: 22px;
    width: clamp(90px, 28%, 150px);
    aspect-ratio: 0.76 / 1;
    border-radius: var(--cx-inner-radius) var(--cx-inner-radius) 0 0;
  }

  .cx-placeholder[data-slot="popular"] .cx-placeholder__shape--secondary {
    top: 44px;
    right: 98px;
    width: 22px;
    height: 22px;
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
      padding: 32px;
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
      padding: 24px 16px 48px;
    }

    .cx-page-title {
      margin-bottom: 20px;
    }

    .cx-featured-content {
      padding: 28px 22px;
    }

    .cx-sub-content,
    .cx-post-content {
      padding: 20px 18px;
    }

    .cx-featured-content h2 {
      font-size: 28px;
    }

    .cx-sub-content h3,
    .cx-post-content h3 {
      font-size: 18px;
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
      padding: 24px 20px;
    }

    .cx-placeholder__mark {
      left: 24px;
      top: 44px;
    }

    .cx-placeholder__shape--primary {
      top: 22px;
      right: 18px;
    }

    .cx-placeholder__shape--secondary {
      right: 74px;
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
