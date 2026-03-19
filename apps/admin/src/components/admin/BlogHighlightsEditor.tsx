import { useFieldArray, useFormContext } from "react-hook-form";
import { AdminSectionCard } from "./AdminSectionCard";
import {
  createEmptyHighlight,
  type BlogEditorFormValues,
} from "../../utils/blogEditor";

export function BlogHighlightsEditor() {
  const { control, register } = useFormContext<BlogEditorFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "highlights",
  });

  return (
    <AdminSectionCard
      title="Highlights"
      description="Capture the quick takeaways that should appear in the article sidebar."
      actions={
        <button
          className="blog-editor-add-button"
          type="button"
          onClick={() => append(createEmptyHighlight())}
        >
          Add highlight
        </button>
      }
    >
      {fields.length ? (
        <div className="blog-editor-stack">
          {fields.map((field, index) => (
            <div key={field.id} className="blog-editor-inline-card">
              <div className="admin-form__field admin-form__field--full">
                <label htmlFor={`blog-highlight-${field.id}`}>Highlight {index + 1}</label>
                <input
                  id={`blog-highlight-${field.id}`}
                  type="text"
                  {...register(`highlights.${index}.value` as const)}
                />
              </div>
              <div className="blog-editor-inline-actions">
                <button
                  className="blog-editor-inline-action"
                  type="button"
                  onClick={() => move(index, Math.max(0, index - 1))}
                  disabled={index === 0}
                >
                  Move up
                </button>
                <button
                  className="blog-editor-inline-action"
                  type="button"
                  onClick={() => move(index, Math.min(fields.length - 1, index + 1))}
                  disabled={index === fields.length - 1}
                >
                  Move down
                </button>
                <button
                  className="blog-editor-inline-action blog-editor-inline-action--danger"
                  type="button"
                  onClick={() => remove(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <strong>No highlights yet.</strong>
          <p>Add concise takeaways to power the article sidebar and preview mode.</p>
        </div>
      )}
    </AdminSectionCard>
  );
}
