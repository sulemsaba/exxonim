import type { RefObject } from "react";
import {
  getBlogAuthorById,
  getBlogCategoryById,
} from "../content";
import { resourcePost, routes } from "../routes";
import type { BlogPost } from "../types";

const homeInsightsStyles = `
  .home-insights {
    position: relative;
    padding: clamp(88px, 10vw, 124px) 0;
    overflow: clip;
  }

  .home-insights__shell {
    display: grid;
    gap: 28px;
  }

  .home-insights__heading {
    display: grid;
    gap: 14px;
  }

  .home-insights__topline {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .home-insights__topline h2 {
    margin: 0;
    color: var(--color-text);
    font-family: var(--font-display);
    font-size: clamp(1.9rem, 4vw, 3rem);
    font-weight: 500;
    line-height: 1;
    letter-spacing: -0.05em;
  }

  .home-insights__intro {
    margin: 0;
    max-width: 34rem;
    color: var(--color-text-muted);
    font-size: 0.98rem;
    line-height: 1.6;
  }

  .home-insights__footer-actions {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  .home-insights__rail-control {
    min-width: 48px;
    padding-inline: 0;
    justify-content: center;
    font-size: 1.15rem;
    line-height: 1;
  }

  .home-insights__bleed {
    width: 100vw;
    margin-left: calc(50% - 50vw);
  }

  .home-insights__rail {
    display: flex;
    gap: 24px;
    padding: 8px clamp(20px, 4vw, 44px) 12px;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
  }

  .home-insights__rail::-webkit-scrollbar {
    display: none;
  }

  .home-insights__card {
    position: relative;
    display: flex;
    flex: 0 0 clamp(312px, 31vw, 392px);
    flex-direction: column;
    min-width: 0;
    border: 1px solid var(--color-border-soft);
    border-radius: 30px;
    background: var(--color-surface);
    box-shadow: var(--shadow-panel);
    overflow: hidden;
    scroll-snap-align: start;
    transition:
      transform 220ms ease,
      border-color 220ms ease,
      box-shadow 220ms ease;
  }

  .home-insights__card:hover {
    transform: translateY(-4px);
    border-color: var(--color-border-strong);
    box-shadow: var(--shadow-panel-strong);
  }

  .home-insights__media {
    position: relative;
    aspect-ratio: 16 / 10;
    background:
      radial-gradient(circle at top right, rgba(127, 188, 193, 0.34), transparent 48%),
      linear-gradient(160deg, rgba(8, 31, 35, 0.96), rgba(15, 92, 99, 0.82));
    overflow: hidden;
    isolation: isolate;
  }

  .home-insights__media::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 30%, rgba(7, 21, 24, 0.28) 100%);
    pointer-events: none;
  }

  .home-insights__tag {
    position: absolute;
    top: 18px;
    left: 18px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    min-height: 32px;
    padding: 0 14px;
    border: 1px solid rgba(237, 244, 242, 0.2);
    border-radius: 999px;
    background: rgba(7, 21, 24, 0.22);
    color: #f3fbfa;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    backdrop-filter: blur(10px);
  }

  .home-insights__media-overlay {
    position: absolute;
    inset: auto 18px 18px;
    z-index: 2;
    display: grid;
    gap: 8px;
    color: #f3fbfa;
  }

  .home-insights__media-overlay span,
  .home-insights__placeholder-copy span {
    color: rgba(243, 251, 250, 0.76);
    font-size: 0.76rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .home-insights__media-overlay strong,
  .home-insights__placeholder-copy strong {
    font-size: 1rem;
    font-weight: 700;
    line-height: 1.3;
  }

  .home-insights__cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 220ms ease;
  }

  .home-insights__card:hover .home-insights__cover {
    transform: scale(1.03);
  }

  .home-insights__placeholder {
    position: relative;
    display: flex;
    width: 100%;
    height: 100%;
    align-items: flex-end;
    padding: 24px;
    background:
      radial-gradient(circle at 15% 18%, rgba(127, 188, 193, 0.4), transparent 28%),
      radial-gradient(circle at 88% 82%, rgba(247, 251, 251, 0.18), transparent 24%),
      linear-gradient(150deg, rgba(15, 92, 99, 0.14), rgba(7, 21, 24, 0.2));
  }

  .home-insights__placeholder-mark {
    position: absolute;
    top: 22px;
    right: 22px;
    display: inline-flex;
    width: 58px;
    height: 58px;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(237, 244, 242, 0.18);
    border-radius: 18px;
    background: rgba(7, 21, 24, 0.18);
    color: rgba(243, 251, 250, 0.92);
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.06em;
    backdrop-filter: blur(10px);
  }

  .home-insights__placeholder-shape {
    position: absolute;
    border-radius: 999px;
    background: rgba(247, 251, 251, 0.14);
  }

  .home-insights__placeholder-shape--one {
    top: 72px;
    left: 24px;
    width: 132px;
    height: 18px;
  }

  .home-insights__placeholder-shape--two {
    top: 104px;
    left: 24px;
    width: 86px;
    height: 18px;
  }

  .home-insights__placeholder-copy {
    position: relative;
    z-index: 1;
    display: grid;
    gap: 10px;
    max-width: 70%;
    color: #f3fbfa;
  }

  .home-insights__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 24px 24px 22px;
    background: var(--color-surface);
  }

  .home-insights__meta {
    margin: 0 0 14px;
    color: var(--color-text-soft);
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
  }

  .home-insights__content h3 {
    margin: 0 0 12px;
    color: var(--color-text);
    font-family: var(--font-display);
    font-size: clamp(1.25rem, 2vw, 1.55rem);
    font-weight: 500;
    line-height: 1.14;
    letter-spacing: -0.04em;
  }

  .home-insights__content p {
    margin: 0;
    color: var(--color-text-muted);
    font-size: 0.98rem;
    line-height: 1.6;
  }

  .home-insights__bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    margin-top: auto;
    padding-top: 26px;
  }

  .home-insights__author {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  .home-insights__author-avatar {
    display: inline-flex;
    width: 38px;
    height: 38px;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: linear-gradient(180deg, rgba(15, 92, 99, 0.16), rgba(15, 92, 99, 0.3));
    color: var(--color-text);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    flex-shrink: 0;
  }

  .home-insights__author-copy {
    display: grid;
    gap: 3px;
    min-width: 0;
  }

  .home-insights__author-name {
    color: var(--color-text);
    font-size: 0.9rem;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .home-insights__author-role {
    color: var(--color-text-soft);
    font-size: 0.78rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .home-insights__link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--color-accent);
    font-size: 0.9rem;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    transition: color 180ms ease;
  }

  .home-insights__link span {
    display: inline-block;
    transition: transform 180ms ease;
  }

  .home-insights__card:hover .home-insights__link {
    color: var(--color-accent-hover);
  }

  .home-insights__card:hover .home-insights__link span {
    transform: translateX(3px);
  }

  .home-insights__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .home-insights__footer-copy {
    margin: 0;
    color: var(--color-text-soft);
    font-size: 0.95rem;
    line-height: 1.6;
  }

  html[data-theme="dark"] .home-insights__author-avatar {
    background: linear-gradient(180deg, rgba(127, 188, 193, 0.24), rgba(127, 188, 193, 0.38));
    color: var(--color-accent-contrast);
  }

  @media (max-width: 900px) {
    .home-insights__topline,
    .home-insights__footer,
    .home-insights__bottom {
      align-items: flex-start;
      flex-direction: column;
    }

    .home-insights__bottom {
      gap: 16px;
    }
  }

  @media (max-width: 767px) {
    .home-insights {
      padding: 80px 0;
    }

    .home-insights__rail {
      gap: 18px;
      padding-inline: 18px;
    }

    .home-insights__card {
      flex-basis: min(84vw, 340px);
      border-radius: 24px;
    }

    .home-insights__content {
      padding: 20px 20px 18px;
    }
  }
`;

interface InsightsSectionProps {
  posts: BlogPost[];
  railRef: RefObject<HTMLDivElement>;
  onPrev: () => void;
  onNext: () => void;
}

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

function renderMedia(post: BlogPost, categoryLabel: string) {
  if (post.coverImageSrc) {
    return (
      <>
        <span className="home-insights__tag">{categoryLabel}</span>
        <img
          className="home-insights__cover"
          src={post.coverImageSrc}
          alt={post.coverAlt ?? post.title}
          loading="lazy"
        />
        <div className="home-insights__media-overlay">
          <span>{categoryLabel}</span>
          <strong>{post.mediaLabel || post.title}</strong>
        </div>
      </>
    );
  }

  return (
    <>
      <span className="home-insights__tag">{categoryLabel}</span>
      <div className="home-insights__placeholder">
        <span className="home-insights__placeholder-mark" aria-hidden="true">
          E
        </span>
        <span
          className="home-insights__placeholder-shape home-insights__placeholder-shape--one"
          aria-hidden="true"
        ></span>
        <span
          className="home-insights__placeholder-shape home-insights__placeholder-shape--two"
          aria-hidden="true"
        ></span>
        <div className="home-insights__placeholder-copy">
          <span>{categoryLabel}</span>
          <strong>{post.mediaLabel || post.title}</strong>
        </div>
      </div>
    </>
  );
}

export function InsightsSection({
  posts,
  railRef,
  onPrev,
  onNext,
}: InsightsSectionProps) {
  return (
    <section className="home-insights light-section" id="resources">
      <style>{homeInsightsStyles}</style>
      <span className="section-anchor" id="blogs" aria-hidden="true"></span>
      <div className="container home-insights__shell">
        <div className="home-insights__heading" data-reveal>
          <div className="home-insights__topline">
            <h2>Insights and News</h2>
          </div>
          <p className="home-insights__intro">
            Sharp guidance for filings, approvals, and growth readiness.
          </p>
        </div>

        <div className="home-insights__bleed" data-reveal>
          <div className="home-insights__rail" ref={railRef}>
            {posts.map((post) => {
              const categoryLabel =
                getBlogCategoryById(post.categoryId)?.label ?? "Insight";
              const author = getBlogAuthorById(post.authorId);
              const authorName = author?.name ?? "Exxonim Team";

              return (
                <article key={post.slug} className="home-insights__card">
                  <div className="home-insights__media">
                    {renderMedia(post, categoryLabel)}
                  </div>

                  <div className="home-insights__content">
                    <span className="home-insights__meta">
                      {formatBlogDate(post.publishedAt)}
                      {" · "}
                      {categoryLabel}
                    </span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>

                    <div className="home-insights__bottom">
                      <div className="home-insights__author">
                        <span
                          className="home-insights__author-avatar"
                          aria-hidden="true"
                        >
                          {getAuthorInitials(authorName)}
                        </span>
                        <span className="home-insights__author-copy">
                          <span className="home-insights__author-name">
                            {authorName}
                          </span>
                          <span className="home-insights__author-role">
                            {author?.role ?? "Exxonim Team"}
                          </span>
                        </span>
                      </div>

                      <a className="home-insights__link" href={resourcePost(post.slug)}>
                        Learn more <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="home-insights__footer" data-reveal>
          <p className="home-insights__footer-copy">
            Explore more practical articles from the Exxonim resource library.
          </p>
          <div className="home-insights__footer-actions">
            <button
              className="rail-button home-insights__rail-control"
              type="button"
              onClick={onPrev}
              aria-label="Previous insight"
            >
              &#8592;
            </button>
            <button
              className="rail-button home-insights__rail-control"
              type="button"
              onClick={onNext}
              aria-label="Next insight"
            >
              &#8594;
            </button>
            <a
              className="landing-cta landing-cta--primary"
              href={routes.resources}
            >
              See more
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
