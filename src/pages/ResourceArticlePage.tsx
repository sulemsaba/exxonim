import { getBlogArticleContent } from "../blogArticleContent";
import {
  getBlogAuthorById,
  getBlogCategoryById,
  getRelatedBlogPosts,
} from "../content";
import { resourcePost, routes } from "../routes";
import type { BlogPost } from "../types";

const resourceArticlePageStyles = String.raw`
  .resource-article-page {
    padding: 1.75rem 0 5.5rem;
  }

  .resource-article-shell {
    display: grid;
    gap: 1.5rem;
  }

  .resource-article-back {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    width: fit-content;
    color: var(--color-accent);
    font-weight: 700;
  }

  .resource-article-card,
  .resource-article-related-card,
  .resource-article-sidebar {
    border: 1px solid var(--cinematic-card-border);
    border-radius: 1.7rem;
    background: var(--cinematic-card-bg);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: var(--cinematic-card-shadow);
  }

  .resource-article-card {
    display: grid;
    gap: 1.75rem;
    padding: clamp(1.35rem, 2vw, 2rem);
  }

  .resource-article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    align-items: center;
    color: var(--color-text-soft);
    font-size: 0.92rem;
  }

  .resource-article-pill {
    display: inline-flex;
    align-items: center;
    padding: 0.4rem 0.7rem;
    border-radius: 999px;
    background: rgba(15, 92, 99, 0.1);
    color: var(--color-accent);
    font-weight: 700;
  }

  .resource-article-header {
    display: grid;
    gap: 1rem;
  }

  .resource-article-header h1 {
    margin: 0;
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 5vw, 4.8rem);
    font-weight: 500;
    line-height: 0.96;
    letter-spacing: -0.06em;
  }

  .resource-article-intro {
    margin: 0;
    max-width: 52rem;
    font-size: 1.04rem;
    line-height: 1.78;
    color: rgba(17, 35, 37, 0.78);
  }

  .resource-article-author {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    color: var(--color-text-muted);
  }

  .resource-article-author-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
    border-radius: 999px;
    background: rgba(15, 92, 99, 0.14);
    color: var(--color-accent);
    font-weight: 800;
  }

  .resource-article-cover {
    overflow: hidden;
    border-radius: 1.35rem;
    min-height: 18rem;
    border: 1px solid var(--cinematic-card-border);
    background:
      linear-gradient(rgba(9, 68, 73, 0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(9, 68, 73, 0.05) 1px, transparent 1px),
      radial-gradient(circle at 70% 30%, rgba(44, 139, 145, 0.16), transparent 26%),
      linear-gradient(180deg, #edf8f9 0%, #d7edef 100%);
    background-size: 110px 110px, 110px 110px, auto, auto;
  }

  .resource-article-cover img {
    display: block;
    width: 100%;
    height: 100%;
    min-height: 18rem;
    object-fit: cover;
  }

  .resource-article-cover-fallback {
    display: grid;
    place-items: center;
    min-height: 18rem;
    padding: 1.5rem;
    text-align: center;
    color: rgba(9, 68, 73, 0.72);
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .resource-article-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.8fr) minmax(18rem, 0.9fr);
    gap: 1.35rem;
    align-items: start;
  }

  .resource-article-body {
    display: grid;
    gap: 1.35rem;
  }

  .resource-article-section {
    display: grid;
    gap: 0.85rem;
    padding: 1.35rem;
    border: 1px solid var(--cinematic-card-border);
    border-radius: 1.3rem;
    background: rgba(var(--surface-beige-rgb), 0.74);
  }

  .resource-article-section h2 {
    margin: 0;
    font-size: 1.3rem;
    line-height: 1.28;
  }

  .resource-article-section p {
    margin: 0;
    color: rgba(17, 35, 37, 0.76);
    line-height: 1.78;
  }

  .resource-article-sidebar {
    display: grid;
    gap: 1rem;
    padding: 1.35rem;
    position: sticky;
    top: calc(var(--header-height) + 1.5rem);
  }

  .resource-article-sidebar h2 {
    margin: 0;
    font-size: 1rem;
  }

  .resource-article-highlights {
    display: grid;
    gap: 0.75rem;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .resource-article-highlights li {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.75rem;
    align-items: start;
    color: rgba(17, 35, 37, 0.76);
    line-height: 1.68;
  }

  .resource-article-highlights li::before {
    content: "+";
    color: var(--color-accent);
    font-weight: 800;
  }

  .resource-article-sidebar-copy {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.7;
  }

  .resource-article-related {
    display: grid;
    gap: 1rem;
  }

  .resource-article-related h2 {
    margin: 0;
    font-size: 1.2rem;
  }

  .resource-article-related-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }

  .resource-article-related-card {
    display: grid;
    gap: 0.75rem;
    padding: 1.2rem;
    color: inherit;
    transition: transform 180ms ease, border-color 180ms ease;
  }

  .resource-article-related-card:hover,
  .resource-article-related-card:focus-visible {
    transform: translateY(-2px);
    border-color: var(--color-accent);
  }

  .resource-article-related-card strong {
    font-size: 1rem;
    line-height: 1.35;
  }

  .resource-article-related-card p {
    margin: 0;
    color: var(--color-text-muted);
    line-height: 1.68;
  }

  html[data-theme="dark"] .resource-article-intro,
  html[data-theme="dark"] .resource-article-section p,
  html[data-theme="dark"] .resource-article-highlights li,
  html[data-theme="dark"] .resource-article-related-card p {
    color: rgba(237, 242, 255, 0.76);
  }

  html[data-theme="dark"] .resource-article-cover {
    background:
      linear-gradient(rgba(92, 176, 181, 0.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(92, 176, 181, 0.07) 1px, transparent 1px),
      radial-gradient(circle at 70% 30%, rgba(44, 139, 145, 0.22), transparent 26%),
      linear-gradient(180deg, #0f2a2d 0%, #07191b 100%);
  }

  html[data-theme="dark"] .resource-article-section {
    background: rgba(255, 255, 255, 0.04);
  }

  html[data-theme="dark"] .resource-article-cover-fallback {
    color: rgba(237, 242, 255, 0.74);
  }

  @media (max-width: 1080px) {
    .resource-article-layout,
    .resource-article-related-grid {
      grid-template-columns: 1fr;
    }

    .resource-article-sidebar {
      position: static;
    }
  }
`;

function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

function getAuthorInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

interface ResourceArticlePageProps {
  post: BlogPost;
}

export function ResourceArticlePage({ post }: ResourceArticlePageProps) {
  const article = getBlogArticleContent(post.slug) ?? {
    introduction: post.excerpt,
    highlights: [
      "Confirm the core facts before the filing or follow-up starts.",
      "Keep supporting records aligned with the exact submission step.",
      "Make the next action visible before the process goes quiet.",
    ],
    sections: [
      {
        heading: "Why this matters",
        paragraphs: [post.excerpt],
      },
      {
        heading: "How Exxonim approaches it",
        paragraphs: [
          "Exxonim keeps registration, licensing, and compliance work moving by making the requirement clear, organizing the supporting records, and tying follow-up to the next specific action instead of a vague status update.",
        ],
      },
    ],
  };
  const author = getBlogAuthorById(post.authorId);
  const categoryLabel = getBlogCategoryById(post.categoryId)?.label ?? "Insight";
  const authorName = author?.name ?? "Exxonim Team";
  const relatedPosts = getRelatedBlogPosts(post.slug);

  return (
    <>
      <style>{resourceArticlePageStyles}</style>
      <section className="resource-article-page light-section">
        <div className="container resource-article-shell">
          <a className="resource-article-back" href={routes.resources}>
            <span aria-hidden="true">&larr;</span>
            Back to resources
          </a>

          <article className="resource-article-card">
            <div className="resource-article-meta">
              <span className="resource-article-pill">{categoryLabel}</span>
              <span>{formatBlogDate(post.publishedAt)}</span>
              {post.readTimeMinutes ? <span>{post.readTimeMinutes} min read</span> : null}
            </div>

            <header className="resource-article-header">
              <h1>{post.title}</h1>
              <p className="resource-article-intro">{article.introduction}</p>
            </header>

            <div className="resource-article-author" aria-label="Article author">
              <span className="resource-article-author-badge" aria-hidden="true">
                {getAuthorInitials(authorName)}
              </span>
              <div>
                <strong>{authorName}</strong>
                <div>{author?.role ?? "Exxonim Team"}</div>
              </div>
            </div>

            <div className="resource-article-cover">
              {post.coverImageSrc ? (
                <img src={post.coverImageSrc} alt={post.coverAlt ?? post.title} />
              ) : (
                <div className="resource-article-cover-fallback">{post.mediaLabel}</div>
              )}
            </div>

            <div className="resource-article-layout">
              <div className="resource-article-body">
                {article.sections.map((section) => (
                  <section key={section.heading} className="resource-article-section">
                    <h2>{section.heading}</h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </section>
                ))}
              </div>

              <aside className="resource-article-sidebar">
                <h2>Key takeaways</h2>
                <ul className="resource-article-highlights">
                  {article.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
                <p className="resource-article-sidebar-copy">
                  Need help applying this in practice? Exxonim can help you prepare
                  the next filing step before submission and follow-up work starts.
                </p>
                <a className="landing-cta landing-cta--primary" href={routes.contact}>
                  Contact Exxonim
                </a>
              </aside>
            </div>
          </article>

          {relatedPosts.length ? (
            <section className="resource-article-related">
              <h2>Related articles</h2>
              <div className="resource-article-related-grid">
                {relatedPosts.map((relatedPost) => (
                  <a
                    key={relatedPost.slug}
                    className="resource-article-related-card"
                    href={resourcePost(relatedPost.slug)}
                  >
                    <span className="page-card__eyebrow">
                      {getBlogCategoryById(relatedPost.categoryId)?.label ?? "Insight"}
                    </span>
                    <strong>{relatedPost.title}</strong>
                    <p>{relatedPost.excerpt}</p>
                  </a>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </>
  );
}
