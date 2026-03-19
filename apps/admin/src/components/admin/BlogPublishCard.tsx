import { useFormContext, useWatch } from "react-hook-form";
import { AdminSectionCard } from "./AdminSectionCard";
import type { BlogEditorFormValues } from "../../utils/blogEditor";

interface BlogPublishCardProps {
  adminRole: string;
  canDelete: boolean;
  isDeleting: boolean;
  onDelete: () => void;
}

export function BlogPublishCard({
  adminRole,
  canDelete,
  isDeleting,
  onDelete,
}: BlogPublishCardProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<BlogEditorFormValues>();
  const status = useWatch({
    control,
    name: "status",
  });

  return (
    <AdminSectionCard
      title="Publish"
      description="Control status, publication timing, and destructive actions from one place."
    >
      <div className="blog-editor-stack">
        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-publish-status">Status</label>
          <select
            id="blog-publish-status"
            {...register("status")}
            disabled={adminRole === "editor" && status === "archived"}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived" disabled={adminRole !== "admin"}>
              Archived
            </option>
          </select>
          {adminRole === "editor" && status === "archived" ? (
            <p className="admin-form__hint">
              Archived posts can only be restored or changed by an admin.
            </p>
          ) : null}
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-publish-at">Published at</label>
          <input id="blog-publish-at" type="datetime-local" {...register("published_at")} />
          {errors.published_at ? (
            <p className="admin-form__error">{errors.published_at.message}</p>
          ) : null}
          <p className="admin-form__hint">
            Leave empty to stamp the current time when publishing for the first time.
          </p>
        </div>

        {canDelete ? (
          <div className="blog-editor-danger-zone">
            <strong>Danger zone</strong>
            <p>Deleting removes this post from the admin workspace and the public resources flow.</p>
            <button
              className="admin-danger-button"
              type="button"
              disabled={isDeleting}
              onClick={onDelete}
            >
              {isDeleting ? "Deleting..." : "Delete Post"}
            </button>
          </div>
        ) : null}
      </div>
    </AdminSectionCard>
  );
}
