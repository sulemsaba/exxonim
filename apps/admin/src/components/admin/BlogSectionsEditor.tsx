import { useFieldArray, useFormContext } from "react-hook-form";
import { AdminSectionCard } from "./AdminSectionCard";
import {
  createEmptyParagraph,
  createEmptySection,
  type BlogEditorFormValues,
} from "../../utils/blogEditor";

interface BlogSectionFieldsProps {
  index: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
}

function BlogSectionFields({
  index,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onRemove,
}: BlogSectionFieldsProps) {
  const { control, register } = useFormContext<BlogEditorFormValues>();
  const {
    fields: paragraphFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `sections.${index}.paragraphs` as const,
  });

  return (
    <article className="blog-editor-section-card">
      <div className="blog-editor-section-card__header">
        <div>
          <strong>Section {index + 1}</strong>
          <p>Build the long-form article body one section at a time.</p>
        </div>
        <div className="blog-editor-inline-actions">
          <button
            className="blog-editor-inline-action"
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
          >
            Move up
          </button>
          <button
            className="blog-editor-inline-action"
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
          >
            Move down
          </button>
          <button
            className="blog-editor-inline-action blog-editor-inline-action--danger"
            type="button"
            onClick={onRemove}
          >
            Remove
          </button>
        </div>
      </div>

      <div className="admin-form__field admin-form__field--full">
        <label htmlFor={`blog-section-heading-${index}`}>Heading</label>
        <input
          id={`blog-section-heading-${index}`}
          type="text"
          {...register(`sections.${index}.heading` as const)}
        />
      </div>

      <div className="blog-editor-stack">
        {paragraphFields.map((paragraphField, paragraphIndex) => (
          <div key={paragraphField.id} className="blog-editor-paragraph-card">
            <div className="admin-form__field admin-form__field--full">
              <label htmlFor={`blog-section-${index}-paragraph-${paragraphField.id}`}>
                Paragraph {paragraphIndex + 1}
              </label>
              <textarea
                id={`blog-section-${index}-paragraph-${paragraphField.id}`}
                rows={4}
                {...register(`sections.${index}.paragraphs.${paragraphIndex}.value` as const)}
              />
            </div>
            <div className="blog-editor-inline-actions">
              <button
                className="blog-editor-inline-action blog-editor-inline-action--danger"
                type="button"
                onClick={() => remove(paragraphIndex)}
                disabled={paragraphFields.length === 1}
              >
                Remove paragraph
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        className="blog-editor-add-button blog-editor-add-button--subtle"
        type="button"
        onClick={() => append(createEmptyParagraph())}
      >
        Add paragraph
      </button>
    </article>
  );
}

export function BlogSectionsEditor() {
  const { control } = useFormContext<BlogEditorFormValues>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "sections",
  });

  return (
    <AdminSectionCard
      title="Article sections"
      description="Structure the body into readable, reorderable sections with clean paragraphs."
      actions={
        <button
          className="blog-editor-add-button"
          type="button"
          onClick={() => append(createEmptySection())}
        >
          Add section
        </button>
      }
    >
      {fields.length ? (
        <div className="blog-editor-stack">
          {fields.map((field, index) => (
            <BlogSectionFields
              key={field.id}
              index={index}
              canMoveUp={index > 0}
              canMoveDown={index < fields.length - 1}
              onMoveUp={() => move(index, index - 1)}
              onMoveDown={() => move(index, index + 1)}
              onRemove={() => remove(index)}
            />
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <strong>No sections yet.</strong>
          <p>Add a section to start building the published article body.</p>
        </div>
      )}
    </AdminSectionCard>
  );
}
