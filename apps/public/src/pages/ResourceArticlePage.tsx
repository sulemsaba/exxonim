import { ErrorMessage } from "../components/ErrorMessage";
import { LoadBoundary } from "../components/LoadBoundary";
import { useBlogPost } from "../hooks/useBlogPost";
import { useBlogPosts } from "../hooks/useBlogPosts";
import { usePage } from "../hooks/usePage";
import { useResolvedBlogSeo } from "../hooks/useResolvedSeo";
import { resourceArticlePath, routes } from "../routes";
import type { BlogPost, ResourcesPageContent } from "../types";
import {
  getBlogArticleIntro,
  getRelatedBlogPosts,
  getRenderableBlogHtml,
  getRenderableBlogSections,
  hasUsableBlogBody,
} from "../utils/blog";


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
  const hasArticleBody = hasUsableBlogBody(post?.content);

  return (
    <LoadBoundary
      error={error}
      errorDetail="This article could not be loaded right now."
      errorTitle="Unable to load the article."
      isPending={isPending}
      isReady={Boolean(post)}
      loadingLabel="Loading article..."
    >
      {() =>
        hasArticleBody ? (
          (() => {
          const article = post!.content!;
          const articleHtml = getRenderableBlogHtml(article);
          const articleSections = getRenderableBlogSections(post!);
          const introText = getBlogArticleIntro(post!);
          const categoryLabel = post!.category?.label;
          const articleSidebar = resourcesPage?.content.article_sidebar;
          const relatedPosts = getRelatedBlogPosts(post!, posts);
          const metaParts = [formatBlogDate(post!.publishedAt)];

          if (post!.readTimeMinutes) {
            metaParts.push(`${post!.readTimeMinutes} min read`);
          }

            return (
            <>
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
                      <h1>{post!.title}</h1>
                      <p className="resource-article-intro">{introText}</p>
                    </header>

                    {post!.author ? (
                      <div className="resource-article-author" aria-label="Article author">
                        <span className="resource-article-author-badge" aria-hidden="true">
                          {getAuthorInitials(post!.author.name)}
                        </span>
                        <div>
                          <strong>{post!.author.name}</strong>
                          {post!.author.role ? <div>{post!.author.role}</div> : null}
                        </div>
                      </div>
                    ) : null}

                    <div className="resource-article-cover">
                      {post!.coverImageSrc ? (
                        <img src={post!.coverImageSrc} alt={post!.coverAlt ?? post!.title} />
                      ) : (
                        <div className="resource-article-cover-fallback">
                          {post!.mediaLabel || post!.title}
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
                            href={resourceArticlePath(relatedPost.slug)}
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
          })()
        ) : (
          <ErrorMessage
            detail="This article is missing its published body content."
            title="Article content is unavailable."
          />
        )
      }
    </LoadBoundary>
  );
}
