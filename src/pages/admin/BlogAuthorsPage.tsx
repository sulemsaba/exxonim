import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  createAdminAuthor,
  deleteAdminAuthor,
  getAdminAuthors,
  updateAdminAuthor,
} from "../../services/adminBlogService";
import { getAdminErrorMessage, slugify } from "../../utils/admin";
import type { ApiBlogAuthor } from "../../types/api";

const authorSchema = z.object({
  name: z.string().min(1, "Name is required."),
  slug: z.string().min(1, "Slug is required."),
  role: z.string().optional(),
  avatar_src: z.string().url("Avatar must be a valid URL.").optional().or(z.literal("")),
});

type AuthorFormValues = z.infer<typeof authorSchema>;

const defaultValues: AuthorFormValues = {
  name: "",
  slug: "",
  role: "",
  avatar_src: "",
};

export function BlogAuthorsPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [slugDirty, setSlugDirty] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiBlogAuthor | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const authorsQuery = useQuery({
    queryKey: ["admin", "blog", "authors"],
    queryFn: getAdminAuthors,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AuthorFormValues>({
    resolver: zodResolver(authorSchema),
    defaultValues,
  });

  const selectedAuthor =
    authorsQuery.data?.find((author) => author.id === selectedId) ?? null;

  const createMutation = useMutation({
    mutationFn: createAdminAuthor,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "authors"] });
      setFormMessage("Author created.");
      setSelectedId(null);
      setSlugDirty(false);
      reset(defaultValues);
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to create author."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: AuthorFormValues;
    }) => updateAdminAuthor(id, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "authors"] });
      setFormMessage("Author updated.");
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to update author."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminAuthor,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "authors"] });
      setDeleteTarget(null);
      setFormMessage("Author deleted.");
      if (selectedId && deleteTarget?.id === selectedId) {
        setSelectedId(null);
        setSlugDirty(false);
        reset(defaultValues);
      }
    },
    onError: (error) => {
      setDeleteTarget(null);
      setFormMessage(getAdminErrorMessage(error, "Unable to delete author."));
    },
  });

  const watchedName = watch("name");

  useEffect(() => {
    if (!slugDirty) {
      setValue("slug", slugify(watchedName), { shouldValidate: true });
    }
  }, [setValue, slugDirty, watchedName]);

  useEffect(() => {
    if (selectedAuthor) {
      reset({
        name: selectedAuthor.name,
        slug: selectedAuthor.slug,
        role: selectedAuthor.role ?? "",
        avatar_src: selectedAuthor.avatar_src ?? "",
      });
      setSlugDirty(true);
      return;
    }

    reset(defaultValues);
    setSlugDirty(false);
  }, [reset, selectedAuthor]);

  async function onSubmit(values: AuthorFormValues) {
    setFormMessage(null);

    if (selectedAuthor) {
      await updateMutation.mutateAsync({ id: selectedAuthor.id, values });
      return;
    }

    await createMutation.mutateAsync(values);
  }

  if (authorsQuery.isPending) {
    return <LoadingSpinner label="Loading blog authors..." />;
  }

  if (authorsQuery.error || !authorsQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load blog authors."
        detail="Check that the admin author endpoint is available."
      />
    );
  }

  return (
    <>
      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Author list</h2>
              <p>Author records are reused by blog post metadata and article bylines.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <div className="admin-toolbar">
              <span className="admin-toolbar__meta">
                {authorsQuery.data.length} author profiles stored
              </span>
              <button
                className="admin-action-button"
                type="button"
                onClick={() => {
                  setSelectedId(null);
                  setSlugDirty(false);
                  setFormMessage(null);
                  reset(defaultValues);
                }}
              >
                New Author
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {authorsQuery.data.map((author) => (
                    <tr key={author.id}>
                      <td>
                        <strong>{author.name}</strong>
                        <p>{author.avatar_src ?? "No avatar URL configured."}</p>
                      </td>
                      <td>{author.slug}</td>
                      <td>{author.role ?? "No role"}</td>
                      <td>
                        <div className="admin-table__actions">
                          <button
                            className="admin-table__action"
                            type="button"
                            onClick={() => {
                              setSelectedId(author.id);
                              setFormMessage(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-table__action admin-table__action--danger"
                            type="button"
                            onClick={() => setDeleteTarget(author)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>{selectedAuthor ? "Edit author" : "Create author"}</h2>
              <p>Use a stable slug and an optional avatar URL if bylines should show imagery.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="admin-form__grid">
                <div className="admin-form__field">
                  <label htmlFor="author-name">Name</label>
                  <input id="author-name" type="text" {...register("name")} />
                  {errors.name ? (
                    <p className="admin-form__error">{errors.name.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="author-slug">Slug</label>
                  <input
                    id="author-slug"
                    type="text"
                    {...register("slug", {
                      onChange: () => setSlugDirty(true),
                    })}
                  />
                  {errors.slug ? (
                    <p className="admin-form__error">{errors.slug.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="author-role">Role</label>
                  <input id="author-role" type="text" {...register("role")} />
                </div>

                <div className="admin-form__field">
                  <label htmlFor="author-avatar">Avatar URL</label>
                  <input id="author-avatar" type="url" {...register("avatar_src")} />
                  {errors.avatar_src ? (
                    <p className="admin-form__error">{errors.avatar_src.message}</p>
                  ) : null}
                </div>
              </div>

              {formMessage ? <p className="admin-form__hint">{formMessage}</p> : null}

              <div className="admin-form__actions">
                {selectedAuthor ? (
                  <button
                    className="admin-form__cancel"
                    type="button"
                    onClick={() => {
                      setSelectedId(null);
                      setSlugDirty(false);
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
                    : selectedAuthor
                      ? "Update Author"
                      : "Create Author"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <AdminDeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete author?"
        description={`This will permanently remove ${deleteTarget?.name ?? "the selected author"}.`}
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
