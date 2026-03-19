import { useFormContext } from "react-hook-form";
import { AdminSectionCard } from "./AdminSectionCard";
import type { ApiBlogAuthor, ApiBlogCategory } from "../../types/api";
import type { BlogEditorFormValues } from "../../utils/blogEditor";

interface BlogTaxonomyCardProps {
  authors: ApiBlogAuthor[];
  categories: ApiBlogCategory[];
  autoReadTimeMinutes: number | null;
  resolvedReadTimeMinutes: number | null;
  hasCustomReadTime: boolean;
}

export function BlogTaxonomyCard({
  authors,
  categories,
  autoReadTimeMinutes,
  resolvedReadTimeMinutes,
  hasCustomReadTime,
}: BlogTaxonomyCardProps) {
  const { register, watch, formState: { errors } } = useFormContext<BlogEditorFormValues>();
  const featuredOnHome = watch("featured_on_home");

  return (
    <AdminSectionCard
      title="Taxonomy"
      description="Assign ownership, category placement, reading time, and homepage promotion."
    >
      <div className="blog-editor-stack">
        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-taxonomy-category">Category</label>
          <select id="blog-taxonomy-category" {...register("category_id")}>
            <option value="">No category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-taxonomy-author">Author</label>
          <select id="blog-taxonomy-author" {...register("author_id")}>
            <option value="">No author</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-taxonomy-read-time">Read time override</label>
          <input id="blog-taxonomy-read-time" type="text" {...register("read_time_override")} />
          {errors.read_time_override ? (
            <p className="admin-form__error">{errors.read_time_override.message}</p>
          ) : null}
          <p className="admin-form__hint">
            {hasCustomReadTime
              ? `Custom read time: ${resolvedReadTimeMinutes ?? "Not set"} min`
              : `Auto read time: ${autoReadTimeMinutes ?? "Not enough content yet"} min`}
          </p>
        </div>

        <label className="admin-form__checkbox">
          <input type="checkbox" {...register("featured_on_home")} />
          Feature this article on the homepage
        </label>

        {featuredOnHome ? (
          <div className="admin-form__field admin-form__field--full">
            <label htmlFor="blog-taxonomy-featured-slot">Featured slot</label>
            <input id="blog-taxonomy-featured-slot" type="text" {...register("featured_slot")} />
          </div>
        ) : null}
      </div>
    </AdminSectionCard>
  );
}
