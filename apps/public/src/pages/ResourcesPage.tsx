import { useState } from "react";
import { LoadBoundary } from "../components/LoadBoundary";
import { useBlogCategories } from "../hooks/useBlogCategories";
import { useBlogPosts } from "../hooks/useBlogPosts";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import { resourceArticlePath, routes } from "../routes";
import type {
  BlogCategoryId,
  BlogFeaturedSlot,
  BlogPost,
  ResourcesPageContent,
} from "../types";
import { buildResourcesBlogLayout, getVisibleBlogPosts } from "../utils/blog";


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
  if (!post.author) {
    return null;
  }

  return (
    <div className="cx-author">
      {post.author?.avatarSrc ? (
        <img
          className="cx-author-img"
          src={post.author.avatarSrc}
          alt={post.author.name}
          loading="lazy"
        />
      ) : (
        <span className="cx-author-fallback" aria-hidden="true">
          {getAuthorInitials(post.author.name)}
        </span>
      )}

      <span className="cx-author-name">{post.author.name}</span>
    </div>
  );
}

function renderPlaceholder(
  post: BlogPost,
  categoryLabel: string | undefined,
  slot: VisualSlot,
  variant: MediaVariant
) {
  const metaLabel = categoryLabel ?? "Article";
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

function renderMedia(
  post: BlogPost,
  categoryLabel: string | undefined,
  slot: VisualSlot,
  variant: MediaVariant
) {
  if (post.coverImageSrc) {
    return (
      <>
        <img
          className="cx-cover-image"
          src={post.coverImageSrc}
          alt={post.coverAlt ?? post.title}
        />
        {variant !== "grid" ? (
          <div className="cx-cover-overlay">
            {categoryLabel ? <span>{categoryLabel}</span> : null}
            <strong>{post.mediaLabel || post.title}</strong>
          </div>
        ) : null}
      </>
    );
  }

  return renderPlaceholder(post, categoryLabel, slot, variant);
}

function renderTopHeroByline(post: BlogPost) {
  const metaParts = [formatBlogDate(post.publishedAt)];

  if (post.readTimeMinutes) {
    metaParts.push(`${post.readTimeMinutes} min`);
  }

  return (
    <div className="cx-top-hero-byline">
      {post.author ? (
        <div className="cx-author">
          {post.author.avatarSrc ? (
            <img
              className="cx-author-img"
              src={post.author.avatarSrc}
              alt={post.author.name}
              loading="lazy"
            />
          ) : (
            <span className="cx-author-fallback" aria-hidden="true">
              {getAuthorInitials(post.author.name)}
            </span>
          )}

          <span className="cx-author-name">{post.author.name}</span>
        </div>
      ) : null}

      {post.author?.role ? (
        <span className="cx-top-hero-role">{post.author.role}</span>
      ) : null}
      <span className="cx-top-hero-metaText">{metaParts.join(" | ")}</span>
    </div>
  );
}

function renderTopListItem(
  post: BlogPost,
  index: number,
  trendingMedia: string[]
) {
  const categoryLabel = post.category?.label;
  const articleLink = resourceArticlePath(post.slug);
  const metaParts = [formatBlogDate(post.publishedAt)];
  const thumbnailSrc =
    post.coverImageSrc ??
    trendingMedia[index] ??
    trendingMedia[trendingMedia.length - 1];

  if (post.readTimeMinutes) {
    metaParts.push(`${post.readTimeMinutes} min`);
  }

  return (
    <a href={articleLink} className="cx-trending-item">
      <div className="cx-trending-thumb">
        <img src={thumbnailSrc} alt={post.coverAlt ?? post.title} loading="lazy" />
      </div>

      <div className="cx-trending-content">
        <h3>{post.title}</h3>
        <div className="cx-trending-meta">
          <span className="cx-trending-metaText">{metaParts.join(" | ")}</span>
          {categoryLabel ? (
            <span className="cx-trending-pill">{categoryLabel}</span>
          ) : null}
        </div>
      </div>
    </a>
  );
}

function renderGridCard(post: BlogPost) {
  const categoryLabel = post.category?.label;
  const slot = getVisualSlot(post);
  const articleLink = resourceArticlePath(post.slug);
  const metaParts = [formatBlogDate(post.publishedAt)];

  if (categoryLabel) {
    metaParts.push(categoryLabel);
  }

  return (
    <article className="cx-post-card">
      <div className="cx-post-media">
        {renderMedia(post, categoryLabel, slot, "grid")}
      </div>

      <div className="cx-post-content">
        <span className="cx-date">{metaParts.join(" | ")}</span>
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
  const {
    data: posts = [],
    isPending: postsPending,
    error: postsError,
  } = useBlogPosts();
  const {
    data: categories = [],
    isPending: categoriesPending,
    error: categoriesError,
  } = useBlogCategories();
  const {
    data: page,
    isPending: pagePending,
    error: pageError,
  } = usePage<ResourcesPageContent>("resources");
  useResolvedPageSeo(page, routes.resources);

  const topMedia = page?.content.top_media;
  const { heroPost, topRailPosts, topSectionSlugs: defaultTopSectionSlugs } =
    buildResourcesBlogLayout(posts);
  const topSectionSlugs =
    selectedCategory === "all" ? defaultTopSectionSlugs : [];
  const filteredPosts = getVisibleBlogPosts({
    posts,
    categoryId: selectedCategory,
    excludeSlugs: selectedCategory === "all" ? topSectionSlugs : [],
  });
  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMorePosts = filteredPosts.length > visiblePosts.length;
  const activeCategory =
    selectedCategory === "all"
      ? null
      : categories.find((category) => category.id === selectedCategory);
  const heroMediaSrc = heroPost?.coverImageSrc ?? topMedia?.hero;
  const heroMediaAlt = heroPost?.coverAlt ?? heroPost?.title ?? page?.content.hero_title;

  const handleSelectCategory = (categoryId: ActiveCategory) => {
    setSelectedCategory(categoryId);
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  };

  return (
    <LoadBoundary
      error={postsError || categoriesError || pageError}
      errorDetail="The resources content could not be loaded right now."
      errorTitle="Unable to load resources."
      isPending={postsPending || categoriesPending || pagePending}
      isReady={Boolean(page)}
      loadingLabel="Loading resources..."
    >
      {() => (
        <>
<div className="cx-blog-page">
          <div className="cx-container">
            <span className="section-anchor" id="resources" aria-hidden="true"></span>
            <span className="section-anchor" id="blogs" aria-hidden="true"></span>

            <div className="cx-top-shell">
              <h1 className="cx-sr-only">{page!.content.hero_title}</h1>
              {heroPost ? (
                <div className="cx-top-layout">
                  <a href={resourceArticlePath(heroPost.slug)} className="cx-top-hero-card">
                    <div className="cx-top-hero-media">
                      <img src={heroMediaSrc} alt={heroMediaAlt} />
                    </div>

                    <div className="cx-top-hero-copy">
                      <h2>{heroPost.title}</h2>
                      <p>{heroPost.excerpt}</p>
                      {renderTopHeroByline(heroPost)}
                    </div>
                  </a>

                  <aside
                    className="cx-top-aside"
                    aria-label={page!.content.trending_label ?? "Trending articles"}
                  >
                    <div className="cx-trending-banner">
                      <img
                        className="cx-trending-bannerImage"
                        src={topMedia!.banner}
                        alt=""
                        aria-hidden="true"
                      />
                      <div className="cx-trending-bannerContent">
                        {page!.content.trending_label ? (
                          <h2>{page!.content.trending_label}</h2>
                        ) : null}
                      </div>
                    </div>

                    <div className="cx-trending-list">
                      {topRailPosts.map((post, index) => (
                        <div key={post.slug}>
                          {renderTopListItem(post, index, topMedia!.trending)}
                        </div>
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

              {categories.map((category) => (
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
                    : page!.content.empty_state.title}
                </h2>
                <p>
                  {activeCategory?.description ??
                    page!.content.empty_state.description}
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
      )}
    </LoadBoundary>
  );
}
