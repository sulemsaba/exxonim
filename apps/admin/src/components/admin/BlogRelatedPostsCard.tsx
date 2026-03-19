import { useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AdminSectionCard } from "./AdminSectionCard";
import type { ApiBlogPost } from "../../types/api";
import type { BlogEditorFormValues } from "../../utils/blogEditor";

interface BlogRelatedPostsCardProps {
  posts: ApiBlogPost[];
  currentPostId?: number;
}

export function BlogRelatedPostsCard({
  posts,
  currentPostId,
}: BlogRelatedPostsCardProps) {
  const { control, setValue } = useFormContext<BlogEditorFormValues>();
  const [searchValue, setSearchValue] = useState("");
  const selectedSlugs = useWatch({
    control,
    name: "related_slugs",
  });

  const availablePosts = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return posts
      .filter((post) => post.id !== currentPostId)
      .filter((post) => {
        if (!normalizedSearch) {
          return true;
        }

        return (
          post.title.toLowerCase().includes(normalizedSearch) ||
          post.slug.toLowerCase().includes(normalizedSearch) ||
          post.excerpt?.toLowerCase().includes(normalizedSearch)
        );
      })
      .sort((left, right) => left.title.localeCompare(right.title));
  }, [currentPostId, posts, searchValue]);

  function toggleSlug(slug: string) {
    const nextValue = selectedSlugs.includes(slug)
      ? selectedSlugs.filter((item) => item !== slug)
      : [...selectedSlugs, slug];

    setValue("related_slugs", nextValue, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }

  return (
    <AdminSectionCard
      title="Related articles"
      description="Link readers to adjacent posts without editing comma-separated slug text."
    >
      <div className="blog-editor-stack">
        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-related-search">Search posts</label>
          <input
            id="blog-related-search"
            type="search"
            placeholder="Find posts by title, slug, or excerpt"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>

        {availablePosts.length ? (
          <div className="blog-editor-related-list" role="list">
            {availablePosts.map((post) => {
              const checked = selectedSlugs.includes(post.slug);

              return (
                <label key={post.id} className={`blog-editor-related-item${checked ? " is-selected" : ""}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSlug(post.slug)}
                  />
                  <div>
                    <strong>{post.title}</strong>
                    <p>{post.excerpt ?? "No excerpt provided."}</p>
                    <span>{post.slug}</span>
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="admin-empty">
            <strong>No matching posts.</strong>
            <p>Try a broader search or create more posts to build related-article links.</p>
          </div>
        )}
      </div>
    </AdminSectionCard>
  );
}
