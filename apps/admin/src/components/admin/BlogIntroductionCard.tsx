import { useFormContext } from "react-hook-form";
import { AdminSectionCard } from "./AdminSectionCard";
import type { BlogEditorFormValues } from "../../utils/blogEditor";

export function BlogIntroductionCard() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BlogEditorFormValues>();

  return (
    <AdminSectionCard
      title="Introduction"
      description="Lead with the framing paragraph readers see at the top of the article."
    >
      <div className="admin-form__field admin-form__field--full">
        <label htmlFor="blog-editor-introduction">Introduction</label>
        <textarea id="blog-editor-introduction" rows={6} {...register("introduction")} />
        {errors.introduction ? (
          <p className="admin-form__error">{errors.introduction.message}</p>
        ) : null}
      </div>
    </AdminSectionCard>
  );
}
