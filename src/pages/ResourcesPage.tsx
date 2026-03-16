import { useState } from "react";
import {
  blogCategories,
  blogPosts,
  getBlogAuthorById,
  getBlogCategoryById,
  getFeaturedBlogPosts,
  getVisibleBlogPosts,
} from "../content";
import { resourcePost } from "../routes";
import type { BlogCategoryId, BlogFeaturedSlot, BlogPost } from "../types";

const BLOG_TOP_MEDIA = {
  hero:
    "https://cdn.prod.website-files.com/685be7dcd32275d383065239/685be7ddd32275d38306a12e_large-Webinar%20Campaign_2024_12_Blog%20Cover_Step-by-Step.webp",
  banner:
    "https://cdn.prod.website-files.com/685be7dcd32275d3830651d3/685be7dcd32275d383066655_banner-editor-picks.webp",
  trending: [
    "https://cdn.prod.website-files.com/685be7dcd32275d383065239/685be7dcd32275d383065aef_Blog%20Cover_2022_08_%20How%20to%20Effectively%20Improve%20Zoom%20Recording%20Quality%20-%20Riverside.fm.webp",
    "https://cdn.prod.website-files.com/685be7dcd32275d383065239/690b7e6235396f06d7b216ba_Frame%201851040321%20%285%29.webp",
    "https://cdn.prod.website-files.com/685be7dcd32275d383065239/685be7dcd32275d383067e01_Blog-Cover_2022_05_The-15-Best-Podcast-Recording-Software-in-2022-%28Mac-_-PC%29-%281%29.webp",
  ],
} as const;

const resourcesPageStyles = String.raw`
  .cx-blog-page {
    --cx-page-text: var(--color-text);
    --cx-muted: var(--color-text-muted);
    --cx-meta: var(--color-text-soft);
    --cx-page-veil: rgba(247, 247, 244, 0.74);
    --cx-page-veil-strong: rgba(226, 230, 225, 0.86);
    --cx-page-glow: var(--glow-accent);
    --cx-page-glow-soft: rgba(127, 188, 193, 0.08);
    --cx-media-surface: rgba(247, 247, 244, 0.92);
    --cx-content-surface: rgba(242, 244, 241, 0.92);
    --cx-content-surface-hover: rgba(226, 230, 225, 0.96);
    --cx-hover-border: rgba(15, 92, 99, 0.28);
    --cx-radius: 8px;
    --cx-inner-radius: 6px;
    --cx-card-border: var(--color-border-soft);
    --cx-card-shadow: 0 10px 20px rgba(8, 31, 35, 0.06);
    --cx-card-shadow-hover: 0 14px 28px rgba(8, 31, 35, 0.1);
    --cx-badge-border: var(--color-accent);
    --cx-badge-text: var(--color-accent);
    --cx-link: var(--color-accent);
    --cx-link-hover: var(--color-accent-hover);
    --cx-filter-border: var(--color-border-soft);
    --cx-filter-bg: rgba(15, 92, 99, 0.05);
    --cx-filter-text: var(--color-text-muted);
    --cx-filter-active-bg: var(--color-accent);
    --cx-filter-active-text: var(--color-accent-contrast);
    --cx-filter-active-border: var(--color-accent);
    --cx-empty-bg: rgba(242, 244, 241, 0.92);
    --cx-empty-border: var(--color-border-soft);
    --cx-more-bg: var(--color-accent);
    --cx-more-text: var(--color-accent-contrast);
    --cx-more-border: var(--color-accent);
    --cx-placeholder-copy: var(--color-text);
    --cx-placeholder-meta: rgba(15, 92, 99, 0.58);
    --cx-placeholder-accent: rgba(15, 92, 99, 0.08);
    --cx-placeholder-border: var(--color-border-soft);
    --cx-hover-accent-glow: rgba(15, 92, 99, 0.12);
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
    --cx-page-text: var(--color-text);
    --cx-muted: var(--color-text-muted);
    --cx-meta: var(--color-text-soft);
    --cx-page-veil: rgba(7, 21, 24, 0.72);
    --cx-page-veil-strong: rgba(11, 31, 35, 0.84);
    --cx-page-glow: var(--glow-accent);
    --cx-page-glow-soft: rgba(127, 188, 193, 0.08);
    --cx-media-surface: rgba(13, 34, 38, 0.92);
    --cx-content-surface: rgba(11, 31, 35, 0.92);
    --cx-content-surface-hover: rgba(17, 43, 48, 0.94);
    --cx-hover-border: rgba(127, 188, 193, 0.26);
    --cx-card-border: var(--color-border-soft);
    --cx-card-shadow: 0 12px 24px rgba(0, 0, 0, 0.24);
    --cx-card-shadow-hover: 0 18px 32px rgba(0, 0, 0, 0.3);
    --cx-badge-border: var(--color-accent);
    --cx-badge-text: var(--color-accent);
    --cx-link: var(--color-accent);
    --cx-link-hover: var(--color-accent-hover);
    --cx-filter-border: var(--color-border-soft);
    --cx-filter-bg: rgba(127, 188, 193, 0.08);
    --cx-filter-text: var(--color-text-muted);
    --cx-filter-active-bg: var(--color-accent);
    --cx-filter-active-text: var(--color-accent-contrast);
    --cx-filter-active-border: var(--color-accent);
    --cx-empty-bg: rgba(11, 31, 35, 0.92);
    --cx-empty-border: var(--color-border-soft);
    --cx-more-bg: var(--color-accent);
    --cx-more-text: var(--color-accent-contrast);
    --cx-more-border: var(--color-accent);
    --cx-placeholder-copy: var(--color-text);
    --cx-placeholder-meta: rgba(127, 188, 193, 0.68);
    --cx-placeholder-accent: rgba(127, 188, 193, 0.12);
    --cx-placeholder-border: var(--color-border-soft);
    --cx-hover-accent-glow: rgba(127, 188, 193, 0.1);
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
    display: none;
  }

  .cx-container {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
  }

  .cx-page-title {
    margin: 0;
    color: var(--cx-page-text);
    font-family: var(--font-display);
    font-size: clamp(2.35rem, 4.6vw, 4.25rem);
    font-weight: 500;
    line-height: 0.94;
    letter-spacing: -0.05em;
  }

  .cx-sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .cx-top-shell {
    margin-bottom: 56px;
  }

  .cx-top-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.54fr) minmax(390px, 0.98fr);
    gap: 20px;
    align-items: start;
  }

  .cx-top-hero-card {
    display: grid;
    gap: 28px;
    color: inherit;
    text-decoration: none;
  }

  .cx-top-hero-media {
    aspect-ratio: 1.53 / 1;
    overflow: hidden;
    border-radius: 4px;
    background: var(--cx-media-surface);
  }

  .cx-top-hero-media img,
  .cx-trending-thumb img,
  .cx-trending-bannerImage {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }

  .cx-top-hero-copy {
    display: grid;
    gap: 18px;
  }

  .cx-top-hero-copy h2 {
    margin: 0;
    max-width: 12.75ch;
    color: var(--cx-page-text);
    font-family: var(--font-display);
    font-size: clamp(2.65rem, 4.05vw, 4rem);
    font-weight: 500;
    line-height: 1.12;
    letter-spacing: -0.06em;
  }

  .cx-top-hero-copy p {
    margin: 0;
    max-width: 46rem;
    color: var(--cx-muted);
    font-size: 0.97rem;
    line-height: 1.52;
  }

  .cx-top-hero-byline {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 16px;
  }

  .cx-top-hero-byline .cx-author {
    gap: 10px;
    flex-shrink: 0;
  }

  .cx-top-hero-byline .cx-author-name {
    color: var(--cx-page-text);
    font-size: 0.96rem;
    font-weight: 700;
    text-decoration: none;
  }

  .cx-top-hero-role,
  .cx-top-hero-metaText {
    color: var(--cx-meta);
    font-size: 0.92rem;
    line-height: 1.4;
    white-space: nowrap;
  }

  .cx-top-aside {
    display: grid;
    gap: 18px;
  }

  .cx-trending-banner {
    position: relative;
    overflow: hidden;
    min-height: 214px;
    border-radius: 4px;
    color: #ffffff;
  }

  .cx-trending-banner::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(17, 19, 32, 0.32) 0%, rgba(17, 19, 32, 0.12) 100%);
    pointer-events: none;
  }

  .cx-trending-banner::after {
    display: none;
  }

  .cx-trending-bannerImage {
    position: absolute;
    inset: 0;
  }

  .cx-trending-bannerContent {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    min-height: 214px;
    padding: 24px 22px;
  }

  .cx-trending-banner h2 {
    margin: 0;
    max-width: 6.8ch;
    color: #ffffff;
    font-family: var(--font-display);
    font-size: clamp(2.35rem, 3vw, 3.52rem);
    font-weight: 500;
    line-height: 0.94;
    letter-spacing: -0.055em;
  }

  .cx-trending-list {
    background: transparent;
  }

  .cx-trending-item {
    display: grid;
    grid-template-columns: 188px minmax(0, 1fr);
    gap: 20px;
    align-items: center;
    padding: 20px 0;
    color: inherit;
    text-decoration: none;
  }

  .cx-trending-item:not(:first-child) {
    border-top: 1px solid rgba(15, 23, 32, 0.12);
  }

  .cx-trending-item:first-child {
    padding-top: 0;
  }

  .cx-trending-thumb {
    aspect-ratio: 188 / 128;
    overflow: hidden;
    border-radius: 4px;
    background: #d8d8d8;
  }

  .cx-trending-content {
    display: grid;
    gap: 12px;
    min-width: 0;
  }

  .cx-trending-content h3 {
    margin: 0;
    color: var(--cx-page-text);
    font-family: var(--font-display);
    font-size: clamp(1.35rem, 1.7vw, 1.95rem);
    font-weight: 500;
    line-height: 1.14;
    letter-spacing: -0.045em;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .cx-trending-meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 14px;
  }

  .cx-trending-metaText {
    color: #7d8389;
    font-size: 0.92rem;
    line-height: 1.4;
  }

  .cx-trending-pill {
    display: inline-flex;
    align-items: center;
    min-height: 30px;
    padding: 0 13px;
    border-radius: 3px;
    background: #e8ddff;
    color: #8e73f2;
    font-size: 0.82rem;
    font-weight: 500;
    line-height: 1;
    white-space: nowrap;
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
    font-family: var(--font-display);
    font-size: clamp(2rem, 3.1vw, 3rem);
    font-weight: 500;
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
    font-family: var(--font-display);
    font-size: clamp(1.25rem, 2vw, 1.55rem);
    font-weight: 500;
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
    font-family: var(--font-display);
    font-size: clamp(1.15rem, 1.8vw, 1.3rem);
    font-weight: 500;
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
    font-family: var(--font-display);
    font-size: 28px;
    font-weight: 500;
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
    background: rgba(249, 243, 234, 0.94);
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

    .cx-top-layout {
      grid-template-columns: 1fr;
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

    .cx-top-shell {
      margin-bottom: 34px;
    }

    .cx-top-hero-card {
      gap: 20px;
    }

    .cx-top-hero-media {
      width: calc(100% + 32px);
      margin-inline: -16px;
      aspect-ratio: 1.08 / 1;
      border-radius: 0;
    }

    .cx-top-hero-copy h2 {
      font-size: 2.2rem;
      max-width: 100%;
    }

    .cx-top-hero-copy p {
      font-size: 0.98rem;
    }

    .cx-trending-banner {
      min-height: 214px;
    }

    .cx-trending-item {
      grid-template-columns: 1fr;
      gap: 14px;
      padding: 18px 0;
    }

    .cx-trending-thumb {
      aspect-ratio: 16 / 10;
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

function renderTopHeroByline(post: BlogPost) {
  const author = getBlogAuthorById(post.authorId);
  const authorName = author?.name ?? "Exxonim Team";
  const metaParts = [formatBlogDate(post.publishedAt)];

  if (post.readTimeMinutes) {
    metaParts.push(`${post.readTimeMinutes} min`);
  }

  return (
    <div className="cx-top-hero-byline">
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

      {author?.role ? <span className="cx-top-hero-role">{author.role}</span> : null}
      <span className="cx-top-hero-metaText">{metaParts.join(" \u00b7 ")}</span>
    </div>
  );
}

function renderTopListItem(post: BlogPost, index: number) {
  const categoryLabel = getBlogCategoryById(post.categoryId)?.label ?? "Insight";
  const articleLink = resourcePost(post.slug);
  const metaParts = [formatBlogDate(post.publishedAt)];
  const thumbnailSrc =
    BLOG_TOP_MEDIA.trending[index] ??
    BLOG_TOP_MEDIA.trending[BLOG_TOP_MEDIA.trending.length - 1];

  if (post.readTimeMinutes) {
    metaParts.push(`${post.readTimeMinutes} min`);
  }

  return (
    <a href={articleLink} className="cx-trending-item">
      <div className="cx-trending-thumb">
        <img src={thumbnailSrc} alt={post.title} loading="lazy" />
      </div>

      <div className="cx-trending-content">
        <h3>{post.title}</h3>
        <div className="cx-trending-meta">
          <span className="cx-trending-metaText">{metaParts.join(" · ")}</span>
          <span className="cx-trending-pill">{categoryLabel}</span>
        </div>
      </div>
    </a>
  );
}

function renderGridCard(post: BlogPost) {
  const categoryLabel = getBlogCategoryById(post.categoryId)?.label ?? "Insight";
  const slot = getVisualSlot(post);
  const articleLink = resourcePost(post.slug);

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
  const topRailPosts = getVisibleBlogPosts({
    posts: blogPosts,
    categoryId: "all",
    limit: 3,
    excludeSlugs: heroPost ? [heroPost.slug] : [],
  });
  const topSectionSlugs = [heroPost?.slug, ...topRailPosts.map((post) => post.slug)].filter(
    Boolean
  ) as string[];
  const filteredPosts = getVisibleBlogPosts({
    posts: blogPosts,
    categoryId: selectedCategory,
    excludeSlugs: selectedCategory === "all" ? topSectionSlugs : [],
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

  return (
    <>
      <style>{resourcesPageStyles}</style>

      <div className="cx-blog-page">
        <div className="cx-container">
          <span className="section-anchor" id="resources" aria-hidden="true"></span>
          <span className="section-anchor" id="blogs" aria-hidden="true"></span>

          <div className="cx-top-shell">
            <h1 className="cx-sr-only">Exxonim Blog</h1>
            {heroPost ? (
              <div className="cx-top-layout">
                <a href={resourcePost(heroPost.slug)} className="cx-top-hero-card">
                  <div className="cx-top-hero-media">
                    <img src={BLOG_TOP_MEDIA.hero} alt={heroPost.title} />
                  </div>

                  <div className="cx-top-hero-copy">
                    <h2>{heroPost.title}</h2>
                    <p>{heroPost.excerpt}</p>
                    {renderTopHeroByline(heroPost)}
                  </div>
                </a>

                <aside className="cx-top-aside" aria-label="Trending articles">
                  <div className="cx-trending-banner">
                    <img
                      className="cx-trending-bannerImage"
                      src={BLOG_TOP_MEDIA.banner}
                      alt=""
                      aria-hidden="true"
                    />
                    <div className="cx-trending-bannerContent">
                      <h2>Trending on Exxonim</h2>
                    </div>
                  </div>

                  <div className="cx-trending-list">
                    {topRailPosts.map((post, index) => (
                      <div key={post.slug}>{renderTopListItem(post, index)}</div>
                    ))}
                  </div>
                </aside>
              </div>
            ) : null}
          </div>

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
                className={`cx-filter-btn ${selectedCategory === category.id ? "active" : ""}`}
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
