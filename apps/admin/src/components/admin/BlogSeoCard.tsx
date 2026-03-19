import { useFormContext, useWatch } from "react-hook-form";
import { AdminSectionCard } from "./AdminSectionCard";
import type { BlogEditorFormValues } from "../../utils/blogEditor";

export function BlogSeoCard() {
  const { control, register } = useFormContext<BlogEditorFormValues>();
  const metaTitle = useWatch({
    control,
    name: "meta_title",
  });
  const metaDescription = useWatch({
    control,
    name: "meta_description",
  });

  return (
    <AdminSectionCard
      title="SEO"
      description="These values override the public defaults when they are present."
    >
      <div className="blog-editor-stack">
        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-seo-title">Meta title</label>
          <input id="blog-seo-title" type="text" {...register("meta_title")} />
          <p className="admin-form__hint">{metaTitle.trim().length}/60 target characters</p>
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-seo-description">Meta description</label>
          <textarea id="blog-seo-description" rows={4} {...register("meta_description")} />
          <p className="admin-form__hint">
            {metaDescription.trim().length}/160 target characters
          </p>
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-seo-og-image">Open graph image URL</label>
          <input id="blog-seo-og-image" type="text" {...register("og_image_url")} />
          <p className="admin-form__hint">
            Leave blank to fall back to the cover image or site-wide SEO defaults.
          </p>
        </div>
      </div>
    </AdminSectionCard>
  );
}
