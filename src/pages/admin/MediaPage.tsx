import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import { ImageUpload } from "../../components/admin/ImageUpload";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  createAdminMedia,
  deleteAdminMedia,
  getAdminMedia,
  updateAdminMedia,
} from "../../services/adminMediaService";
import { getAdminErrorMessage } from "../../utils/admin";
import type { ApiMedia } from "../../types/api";

const mediaSchema = z.object({
  url: z.string().url("A valid media URL is required."),
  alt_text: z.string().optional(),
});

type MediaFormValues = z.infer<typeof mediaSchema>;

const defaultValues: MediaFormValues = {
  url: "",
  alt_text: "",
};

function formatBytes(value?: number | null) {
  if (!value) {
    return "Unknown size";
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiMedia | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const mediaQuery = useQuery({
    queryKey: ["admin", "media"],
    queryFn: getAdminMedia,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MediaFormValues>({
    resolver: zodResolver(mediaSchema),
    defaultValues,
  });

  const selectedMedia =
    mediaQuery.data?.find((mediaItem) => mediaItem.id === selectedId) ?? null;

  const createMutation = useMutation({
    mutationFn: createAdminMedia,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
      setFormMessage("Media record created.");
      setSelectedId(null);
      reset(defaultValues);
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to create media record."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: MediaFormValues;
    }) => updateAdminMedia(id, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
      setFormMessage("Media record updated.");
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to update media record."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminMedia,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
      setDeleteTarget(null);
      setFormMessage("Media record deleted.");
      if (selectedId && deleteTarget?.id === selectedId) {
        setSelectedId(null);
        reset(defaultValues);
      }
    },
    onError: (error) => {
      setDeleteTarget(null);
      setFormMessage(getAdminErrorMessage(error, "Unable to delete media."));
    },
  });

  useEffect(() => {
    if (selectedMedia) {
      reset({
        url: selectedMedia.url,
        alt_text: selectedMedia.alt_text ?? "",
      });
      return;
    }

    reset(defaultValues);
  }, [reset, selectedMedia]);

  async function onSubmit(values: MediaFormValues) {
    setFormMessage(null);
    if (selectedMedia) {
      await updateMutation.mutateAsync({ id: selectedMedia.id, values });
      return;
    }

    await createMutation.mutateAsync(values);
  }

  if (mediaQuery.isPending) {
    return <LoadingSpinner label="Loading media library..." />;
  }

  if (mediaQuery.error || !mediaQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load the media library."
        detail="Check that the admin media endpoint is available."
      />
    );
  }

  return (
    <>
      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Media library</h2>
              <p>Upload images locally or register external asset URLs for reuse.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <div className="admin-list-grid">
              <ImageUpload
                onUploaded={async (media) => {
                  await queryClient.invalidateQueries({ queryKey: ["admin", "media"] });
                  setSelectedId(media.id);
                  setFormMessage("Image uploaded successfully.");
                }}
              />

              <div className="admin-media-grid">
                {mediaQuery.data.map((mediaItem) => (
                  <article key={mediaItem.id} className="admin-media-card">
                    <img src={mediaItem.url} alt={mediaItem.alt_text ?? ""} />
                    <div className="admin-media-card__meta">
                      <strong>{mediaItem.alt_text ?? mediaItem.url}</strong>
                      <span>{mediaItem.mime_type ?? "Unknown type"}</span>
                      <span>{formatBytes(mediaItem.file_size)}</span>
                    </div>
                    <div className="admin-table__actions">
                      <button
                        className="admin-table__action"
                        type="button"
                        onClick={() => {
                          setSelectedId(mediaItem.id);
                          setFormMessage(null);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="admin-table__action admin-table__action--danger"
                        type="button"
                        onClick={() => setDeleteTarget(mediaItem)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>{selectedMedia ? "Edit media metadata" : "Register external media"}</h2>
              <p>Use this form for external URLs or to update the metadata of uploaded files.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="admin-form__grid">
                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="media-url">Media URL</label>
                  <input id="media-url" type="url" {...register("url")} />
                  {errors.url ? (
                    <p className="admin-form__error">{errors.url.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="media-alt">Alt text</label>
                  <textarea id="media-alt" rows={5} {...register("alt_text")} />
                </div>
              </div>

              {formMessage ? <p className="admin-form__hint">{formMessage}</p> : null}

              <div className="admin-form__actions">
                {selectedMedia ? (
                  <button
                    className="admin-form__cancel"
                    type="button"
                    onClick={() => {
                      setSelectedId(null);
                      setFormMessage(null);
                      reset(defaultValues);
                    }}
                  >
                    Clear
                  </button>
                ) : null}
                <button
                  className="admin-form__submit"
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : selectedMedia
                      ? "Update Media"
                      : "Create Media Record"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <AdminDeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete media item?"
        description="This will remove the media record and delete the uploaded file if it is stored locally."
        isPending={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id);
          }
        }}
      />
    </>
  );
}
