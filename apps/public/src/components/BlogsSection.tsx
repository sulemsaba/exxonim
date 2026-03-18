import type { BlogPost } from "../types";
import { routes } from "../routes";

interface BlogsSectionProps {
  blogPosts: BlogPost[];
}

const blogsSectionStyles = `
  .blogs-section {
    padding: clamp(88px, 10vw, 124px) 0;
    background: var(--color-background-secondary);
  }

  .blogs-section__inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 clamp(20px, 5vw, 60px);
  }

  .blogs-section__heading {
    display: grid;
    gap: 14px;
    margin-bottom: 56px;
  }

  .blogs-section__topline {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--color-accent);
  }

  .blogs-section__title {
    margin: 0;
    font-size: clamp(28px, 5vw, 48px);
    line-height: 1.2;
    font-weight: 700;
    color: var(--color-text);
  }

  .blogs-section__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 28px;
  }

  .blog-card {
    display: flex;
    flex-direction: column;
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    text-decoration: none;
    color: inherit;
  }

  .blog-card:hover {
    border-color: var(--color-accent);
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
  }

  .blog-card__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    background: var(--color-background-secondary);
  }

  .blog-card__content {
    padding: 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .blog-card__meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  .blog-card__category {
    display: inline-block;
    padding: 4px 8px;
    background: var(--color-accent-light);
    color: var(--color-accent);
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .blog-card__date {
    font-size: 12px;
  }

  .blog-card__title {
    margin: 0 0 12px;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.4;
    color: var(--color-text);
  }

  .blog-card__excerpt {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: var(--color-text-secondary);
    flex: 1;
    margin-bottom: 16px;
  }

  .blog-card__author {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--color-text-secondary);
  }

  .blog-card__author-avatar {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--color-background-secondary);
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: var(--color-accent);
  }

  @media (max-width: 768px) {
    .blogs-section {
      padding: clamp(60px, 8vw, 88px) 0;
    }

    .blogs-section__title {
      font-size: clamp(24px, 4vw, 36px);
    }

    .blogs-section__grid {
      grid-template-columns: 1fr;
    }
  }
`;

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function getAuthorInitials(authorName: string | null | undefined): string {
  if (!authorName) return "A";
  return authorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function BlogsSection({ blogPosts }: BlogsSectionProps) {
  if (!blogPosts || blogPosts.length === 0) {
    return null;
  }

  return (
    <>
      <style>{blogsSectionStyles}</style>
      <section className="blogs-section">
        <div className="blogs-section__inner">
          <div className="blogs-section__heading">
            <div className="blogs-section__topline">
              <span>Featured Content</span>
              <span aria-hidden="true">→</span>
            </div>
            <h2 className="blogs-section__title">Latest Blog Posts</h2>
          </div>

          <div className="blogs-section__grid">
            {blogPosts.map((post) => (
              <a
                key={post.id}
                href={`${routes.resources}${post.slug}/`}
                className="blog-card"
              >
                {post.coverImageSrc && (
                  <img
                    src={post.coverImageSrc}
                    alt={post.coverAlt || post.title}
                    className="blog-card__image"
                    loading="lazy"
                  />
                )}

                <div className="blog-card__content">
                  <div className="blog-card__meta">
                    {post.category && (
                      <span className="blog-card__category">
                        {post.category.label}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="blog-card__date">
                        {formatDate(post.publishedAt)}
                      </span>
                    )}
                  </div>

                  <h3 className="blog-card__title">{post.title}</h3>

                  {post.excerpt && (
                    <p className="blog-card__excerpt">{post.excerpt}</p>
                  )}

                  {post.author && (
                    <div className="blog-card__author">
                      <div className="blog-card__author-avatar">
                        {getAuthorInitials(post.author.name)}
                      </div>
                      <span>{post.author.name}</span>
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
