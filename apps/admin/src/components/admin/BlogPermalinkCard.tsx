import { useFormContext, useWatch } from "react-hook-form";
import { AdminSectionCard } from "./AdminSectionCard";
import { resourcePost } from "../../routes";
import type { BlogEditorFormValues } from "../../utils/blogEditor";

interface BlogPermalinkCardProps {
  onSlugManualEdit: () => void;
  onSlugReset: () => void;
}

export function BlogPermalinkCard({
  onSlugManualEdit,
  onSlugReset,
}: BlogPermalinkCardProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<BlogEditorFormValues>();
  const slug = useWatch({
    control,
    name: "slug",
  });
  const permalink = resourcePost((slug || "untitled-post").trim() || "untitled-post");

  return (
    <AdminSectionCard
      title="Permalink"
      description="Keep the slug human-readable and stable once the post is shared."
      actions={
        <button className="blog-editor-add-button blog-editor-add-button--subtle" type="button" onClick={onSlugReset}>
          Reset from title
        </button>
      }
    >
      <div className="blog-editor-stack">
        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-permalink-slug">Slug</label>
          <input
            id="blog-permalink-slug"
            type="text"
            {...register("slug", {
              onChange: onSlugManualEdit,
            })}
          />
          {errors.slug ? <p className="admin-form__error">{errors.slug.message}</p> : null}
        </div>

        <div className="blog-editor-link-preview">
          <span>Preview URL</span>
          <code>{permalink}</code>
        </div>
      </div>
    </AdminSectionCard>
  );
}
