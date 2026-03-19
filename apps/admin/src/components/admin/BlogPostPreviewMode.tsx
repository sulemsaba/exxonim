import type { BlogPreviewData } from "../../utils/blogEditor";

function getAuthorInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

interface BlogPostPreviewModeProps {
  preview: BlogPreviewData;
  onBack: () => void;
}

export function BlogPostPreviewMode({
  preview,
  onBack,
}: BlogPostPreviewModeProps) {
  return (
    <section className="blog-preview">
      <div className="blog-preview__toolbar">
        <button className="blog-editor-header__back" type="button" onClick={onBack}>
          &larr; Back to editor
        </button>
        <div className="blog-preview__permalink">
          <span>Previewing</span>
          <code>{preview.permalink}</code>
        </div>
      </div>

      <article className="blog-preview__card">
        <div className="blog-preview__meta">
          {preview.category_label ? <span className="blog-preview__pill">{preview.category_label}</span> : null}
          <span>{preview.published_label}</span>
          {preview.read_time_minutes ? <span>{preview.read_time_minutes} min read</span> : null}
        </div>

        <header className="blog-preview__header">
          <h2>{preview.title}</h2>
          <p>{preview.introduction || preview.excerpt || "Add an introduction to preview the lead paragraph."}</p>
        </header>

        {preview.author ? (
          <div className="blog-preview__author">
            <span className="blog-preview__author-badge" aria-hidden="true">
              {getAuthorInitials(preview.author.name)}
            </span>
            <div>
              <strong>{preview.author.name}</strong>
              {preview.author.role ? <div>{preview.author.role}</div> : null}
            </div>
          </div>
        ) : null}

        <div className="blog-preview__cover">
          {preview.cover_image ? (
            <img src={preview.cover_image} alt={preview.cover_alt ?? preview.title} />
          ) : (
            <div className="blog-preview__cover-fallback">
              {preview.media_label || "Cover image preview"}
            </div>
          )}
        </div>

        <div className="blog-preview__layout">
          <div className="blog-preview__body">
            {preview.sections.length ? (
              preview.sections.map((section) => (
                <section key={section.heading} className="blog-preview__section">
                  <h3>{section.heading}</h3>
                  {section.paragraphs.map((paragraph) => (
                    <p key={`${section.heading}-${paragraph}`}>{paragraph}</p>
                  ))}
                </section>
              ))
            ) : (
              <div className="blog-preview__empty">
                <strong>No article sections yet.</strong>
                <p>Add at least one section to preview the body layout.</p>
              </div>
            )}
          </div>

          <aside className="blog-preview__sidebar">
            <h3>Highlights</h3>
            {preview.highlights.length ? (
              <ul>
                {preview.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            ) : (
              <p>No highlights added yet.</p>
            )}
          </aside>
        </div>
      </article>

      {preview.related_posts.length ? (
        <section className="blog-preview__related">
          <h3>Related articles</h3>
          <div className="blog-preview__related-grid">
            {preview.related_posts.map((post) => (
              <a key={post.slug} className="blog-preview__related-card" href={post.href}>
                {post.category_label ? <span>{post.category_label}</span> : null}
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            ))}
          </div>
        </section>
      ) : null}
    </section>
  );
}
