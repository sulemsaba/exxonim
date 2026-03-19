import { useFormContext, useWatch } from "react-hook-form";
import { AdminSectionCard } from "./AdminSectionCard";
import { ImageUpload } from "./ImageUpload";
import type { ApiMedia } from "../../types/api";
import type { BlogEditorFormValues } from "../../utils/blogEditor";

interface BlogMediaCardProps {
  media: ApiMedia[];
  mediaError?: string | null;
  onMediaUploaded: (media: ApiMedia) => void;
}

export function BlogMediaCard({
  media,
  mediaError,
  onMediaUploaded,
}: BlogMediaCardProps) {
  const {
    control,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<BlogEditorFormValues>();
  const featuredImage = useWatch({
    control,
    name: "featured_image",
  });

  function applyMedia(mediaItem: ApiMedia) {
    setValue("featured_image", mediaItem.url, {
      shouldDirty: true,
      shouldTouch: true,
    });

    if (!getValues("cover_alt").trim() && mediaItem.alt_text?.trim()) {
      setValue("cover_alt", mediaItem.alt_text.trim(), {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    if (!getValues("og_image_url").trim()) {
      setValue("og_image_url", mediaItem.url, {
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }

  return (
    <AdminSectionCard
      title="Cover media"
      description="Paste a URL, upload inline, or reuse recent media without leaving the editor."
    >
      <div className="blog-editor-stack">
        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-media-featured-image">Featured image URL</label>
          <input id="blog-media-featured-image" type="text" {...register("featured_image")} />
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-media-cover-alt">Cover alt</label>
          <input id="blog-media-cover-alt" type="text" {...register("cover_alt")} />
          {errors.cover_alt ? <p className="admin-form__error">{errors.cover_alt.message}</p> : null}
        </div>

        <div className="admin-form__field admin-form__field--full">
          <label htmlFor="blog-media-label">Media label</label>
          <input id="blog-media-label" type="text" {...register("media_label")} />
          <p className="admin-form__hint">Optional fallback label when no cover image is available.</p>
        </div>

        {featuredImage ? (
          <div className="blog-editor-cover-preview">
            <img src={featuredImage} alt={getValues("cover_alt") || "Cover preview"} />
          </div>
        ) : null}

        <ImageUpload
          onUploaded={(mediaItem) => {
            applyMedia(mediaItem);
            onMediaUploaded(mediaItem);
          }}
        />

        <div className="blog-editor-stack">
          <div className="blog-editor-subheading">
            <strong>Recent media</strong>
            <span>{media.length} assets available</span>
          </div>
          {mediaError ? <p className="admin-form__error">{mediaError}</p> : null}
          {media.length ? (
            <div className="blog-editor-media-grid">
              {media.slice(0, 6).map((mediaItem) => (
                <button
                  key={mediaItem.id}
                  className="blog-editor-media-choice"
                  type="button"
                  onClick={() => applyMedia(mediaItem)}
                >
                  <img src={mediaItem.url} alt={mediaItem.alt_text ?? "Media preview"} />
                  <span>{mediaItem.original_name ?? mediaItem.url}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="admin-empty">
              <strong>No media available yet.</strong>
              <p>Upload an image above to start building the reusable media library.</p>
            </div>
          )}
        </div>
      </div>
    </AdminSectionCard>
  );
}
