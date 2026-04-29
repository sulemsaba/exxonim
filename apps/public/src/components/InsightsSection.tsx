import type { RefObject } from "react";
import { resourceArticlePath, routes } from "../routes";
import type { BlogPost, HomeInsightsContent } from "../types";


interface InsightsSectionProps {
  content: HomeInsightsContent;
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

function renderMedia(post: BlogPost, categoryLabel?: string) {
  if (post.coverImageSrc) {
    return (
      <>
        {categoryLabel ? (
          <span className="home-insights__tag">{categoryLabel}</span>
        ) : null}
        <img
          className="home-insights__cover"
          src={post.coverImageSrc}
          alt={post.coverAlt ?? post.title}
          loading="lazy"
        />
        <div className="home-insights__media-overlay">
          {categoryLabel ? <span>{categoryLabel}</span> : null}
          <strong>{post.mediaLabel || post.title}</strong>
        </div>
      </>
    );
  }

  return (
    <>
      {categoryLabel ? (
        <span className="home-insights__tag">{categoryLabel}</span>
      ) : null}
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
          {categoryLabel ? <span>{categoryLabel}</span> : null}
          <strong>{post.mediaLabel || post.title}</strong>
        </div>
      </div>
    </>
  );
}

export function InsightsSection({
  content,
  posts,
  railRef,
  onPrev,
  onNext,
}: InsightsSectionProps) {
  return (
    <section className="home-insights light-section" id="resources">
<span className="section-anchor" id="blogs" aria-hidden="true"></span>
      <div className="container home-insights__shell">
        <div className="home-insights__heading" data-reveal>
          <div className="home-insights__topline">
            <h2>{content.title}</h2>
          </div>
          <p className="home-insights__intro">{content.intro}</p>
        </div>

        <div className="home-insights__bleed" data-reveal>
          <div className="home-insights__rail" ref={railRef}>
            {posts.map((post) => {
              const categoryLabel = post.category?.label;
              const metaParts = [formatBlogDate(post.publishedAt)];

              if (categoryLabel) {
                metaParts.push(categoryLabel);
              }

              return (
                <article key={post.slug} className="home-insights__card">
                  <div className="home-insights__media">
                    {renderMedia(post, categoryLabel)}
                  </div>

                  <div className="home-insights__content">
                    <span className="home-insights__meta">{metaParts.join(" | ")}</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>

                    <div className="home-insights__bottom">
                      {post.author ? (
                        <div className="home-insights__author">
                          <span
                            className="home-insights__author-avatar"
                            aria-hidden="true"
                          >
                            {getAuthorInitials(post.author.name)}
                          </span>
                          <span className="home-insights__author-copy">
                            <span className="home-insights__author-name">
                              {post.author.name}
                            </span>
                            {post.author.role ? (
                              <span className="home-insights__author-role">
                                {post.author.role}
                              </span>
                            ) : null}
                          </span>
                        </div>
                      ) : null}

                      <a className="home-insights__link" href={resourceArticlePath(post.slug)}>
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
          <p className="home-insights__footer-copy">{content.footer_copy}</p>
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
