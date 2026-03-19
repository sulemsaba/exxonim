import { useFormContext } from "react-hook-form";
import { AdminSectionCard } from "./AdminSectionCard";
import type { BlogEditorFormValues } from "../../utils/blogEditor";

export function BlogPostBasicsCard() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BlogEditorFormValues>();

  return (
    <AdminSectionCard
      title="Post basics"
      description="Set the editorial headline and the short summary shown on cards and SEO surfaces."
    >
      <div className="blog-editor-field-grid">
        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-editor-title">Title</label>
          <input id="blog-editor-title" type="text" {...register("title")} />
          {errors.title ? <p className="admin-form__error">{errors.title.message}</p> : null}
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-editor-excerpt">Excerpt</label>
          <textarea id="blog-editor-excerpt" rows={4} {...register("excerpt")} />
          {errors.excerpt ? <p className="admin-form__error">{errors.excerpt.message}</p> : null}
        </div>
      </div>
    </AdminSectionCard>
  );
}
