import { AdminStatusBadge } from "./AdminStatusBadge";

interface BlogPostEditorHeaderProps {
  title: string;
  status: "draft" | "published" | "archived";
  isDirty: boolean;
  isPreview: boolean;
  isSubmitting: boolean;
  lastSavedAt?: string | null;
  onBack: () => void;
  onTogglePreview: () => void;
  onSaveDraft: () => void;
  onPrimaryAction: () => void;
  primaryActionLabel: string;
}

export function BlogPostEditorHeader({
  title,
  status,
  isDirty,
  isPreview,
  isSubmitting,
  lastSavedAt,
  onBack,
  onTogglePreview,
  onSaveDraft,
  onPrimaryAction,
  primaryActionLabel,
}: BlogPostEditorHeaderProps) {
  const saveStateLabel = isDirty
    ? "Unsaved changes"
    : lastSavedAt
      ? `Last saved ${new Date(lastSavedAt).toLocaleString()}`
      : "Not yet saved";

  return (
    <section className="blog-editor-header">
      <div className="blog-editor-header__meta">
        <button className="blog-editor-header__back" type="button" onClick={onBack}>
          &larr; Back to posts
        </button>
        <div className="blog-editor-header__title">
          <div className="blog-editor-header__eyebrow">Authoring workspace</div>
          <div className="blog-editor-header__title-row">
            <h2>{title}</h2>
            <AdminStatusBadge label={status} />
          </div>
          <p>{saveStateLabel}</p>
        </div>
      </div>

      <div className="blog-editor-header__actions">
        <button className="admin-form__cancel" type="button" onClick={onTogglePreview}>
          {isPreview ? "Back to Editor" : "Preview"}
        </button>
        <button
          className="blog-editor-header__ghost"
          type="button"
          onClick={onSaveDraft}
          disabled={isSubmitting}
        >
          Save Draft
        </button>
        <button
          className="admin-form__submit"
          type="button"
          onClick={onPrimaryAction}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : primaryActionLabel}
        </button>
      </div>
    </section>
  );
}
