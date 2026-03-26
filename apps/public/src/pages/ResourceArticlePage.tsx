import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useBlogPost } from "../hooks/useBlogPost";
import { useBlogPosts } from "../hooks/useBlogPosts";
import { usePage } from "../hooks/usePage";
import { useResolvedBlogSeo } from "../hooks/useResolvedSeo";
import { resourcePost, routes } from "../routes";
import type { BlogPost, ResourcesPageContent } from "../types";
import {
  getBlogArticleIntro,
  getRelatedBlogPosts,
  getRenderableBlogHtml,
  getRenderableBlogSections,
  hasUsableBlogBody,
} from "../utils/blog";

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

  .resource-article-section--html {
    gap: 1rem;
  }

  .resource-article-section--html h2,
  .resource-article-section--html h3 {
    margin: 0;
    font-size: 1.3rem;
    line-height: 1.28;
  }

  .resource-article-section--html p {
    margin: 0;
    color: rgba(17, 35, 37, 0.76);
    line-height: 1.78;
  }

  .resource-article-section--html ul,
  .resource-article-section--html ol {
    margin: 0;
    padding-left: 1.25rem;
    display: grid;
    gap: 0.65rem;
    color: rgba(17, 35, 37, 0.76);
    line-height: 1.72;
  }

  .resource-article-section--html blockquote {
    margin: 0;
    padding-left: 1rem;
    border-left: 3px solid rgba(15, 92, 99, 0.2);
    color: var(--color-text-muted);
    font-size: 1.02rem;
    line-height: 1.72;
  }

  .resource-article-section--html img {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    border-radius: 1rem;
    border: 1px solid var(--cinematic-card-border);
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
  html[data-theme="dark"] .resource-article-section--html p,
  html[data-theme="dark"] .resource-article-section--html ul,
  html[data-theme="dark"] .resource-article-section--html ol,
  html[data-theme="dark"] .resource-article-section--html blockquote,
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
  slug: string;
}

export function ResourceArticlePage({ slug }: ResourceArticlePageProps) {
  const { data: post, isPending, error } = useBlogPost(slug);
  const { data: posts = [] } = useBlogPosts();
  const { data: resourcesPage } = usePage<ResourcesPageContent>("resources");
  useResolvedBlogSeo(post);

  if (isPending) {
    return <LoadingSpinner label="Loading article..." />;
  }

  if (error || !post) {
    return (
      <ErrorMessage
        title="Unable to load the article."
        detail="Check that the blog API is available."
      />
    );
  }

  if (!hasUsableBlogBody(post.content)) {
    return (
      <ErrorMessage
        title="Article content is unavailable."
        detail="This article is missing its published body content."
      />
    );
  }

  const article = post.content!;
  const articleHtml = getRenderableBlogHtml(article);
  const articleSections = getRenderableBlogSections(post);
  const introText = getBlogArticleIntro(post);
  const categoryLabel = post.category?.label;
  const articleSidebar = resourcesPage?.content.article_sidebar;
  const relatedPosts = getRelatedBlogPosts(post, posts);
  const metaParts = [formatBlogDate(post.publishedAt)];

  if (post.readTimeMinutes) {
    metaParts.push(`${post.readTimeMinutes} min read`);
  }

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
              {categoryLabel ? (
                <span className="resource-article-pill">{categoryLabel}</span>
              ) : null}
              {metaParts.map((part) => (
                <span key={part}>{part}</span>
              ))}
            </div>

            <header className="resource-article-header">
              <h1>{post.title}</h1>
              <p className="resource-article-intro">{introText}</p>
            </header>

            {post.author ? (
              <div className="resource-article-author" aria-label="Article author">
                <span className="resource-article-author-badge" aria-hidden="true">
                  {getAuthorInitials(post.author.name)}
                </span>
                <div>
                  <strong>{post.author.name}</strong>
                  {post.author.role ? <div>{post.author.role}</div> : null}
                </div>
              </div>
            ) : null}

            <div className="resource-article-cover">
              {post.coverImageSrc ? (
                <img src={post.coverImageSrc} alt={post.coverAlt ?? post.title} />
              ) : (
                <div className="resource-article-cover-fallback">
                  {post.mediaLabel || post.title}
                </div>
              )}
            </div>

            <div className="resource-article-layout">
              <div className="resource-article-body">
                {articleHtml ? (
                  <section
                    className="resource-article-section resource-article-section--html"
                    dangerouslySetInnerHTML={{ __html: articleHtml }}
                  />
                ) : (
                  articleSections.map((section) => (
                    <section key={section.heading} className="resource-article-section">
                      <h2>{section.heading}</h2>
                      {section.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </section>
                  ))
                )}
              </div>

              {article.highlights.length > 0 || articleSidebar ? (
                <aside className="resource-article-sidebar">
                  <h2>{articleSidebar?.title ?? "Highlights"}</h2>
                  {article.highlights.length > 0 ? (
                    <ul className="resource-article-highlights">
                      {article.highlights.map((highlight) => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  ) : null}
                  {articleSidebar?.description ? (
                    <p className="resource-article-sidebar-copy">
                      {articleSidebar.description}
                    </p>
                  ) : null}
                  {articleSidebar?.primary_cta ? (
                    <a
                      className="landing-cta landing-cta--primary"
                      href={articleSidebar.primary_cta.href}
                    >
                      {articleSidebar.primary_cta.label}
                    </a>
                  ) : null}
                </aside>
              ) : null}
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
                    {relatedPost.category?.label ? (
                      <span className="page-card__eyebrow">
                        {relatedPost.category.label}
                      </span>
                    ) : null}
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
