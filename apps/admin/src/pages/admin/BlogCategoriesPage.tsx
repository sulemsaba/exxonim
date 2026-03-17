import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from "../../services/adminBlogService";
import { getAdminErrorMessage, slugify } from "../../utils/admin";
import type { ApiBlogCategory } from "../../types/api";

const categorySchema = z.object({
  name: z.string().min(1, "Name is required."),
  slug: z.string().min(1, "Slug is required."),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const defaultValues: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
};

export function BlogCategoriesPage() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [slugDirty, setSlugDirty] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiBlogCategory | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  const categoriesQuery = useQuery({
    queryKey: ["admin", "blog", "categories"],
    queryFn: getAdminCategories,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  const selectedCategory =
    categoriesQuery.data?.find((category) => category.id === selectedId) ?? null;

  const createMutation = useMutation({
    mutationFn: createAdminCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "categories"] });
      setFormMessage("Category created.");
      setSelectedId(null);
      setSlugDirty(false);
      reset(defaultValues);
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to create category."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: CategoryFormValues;
    }) => updateAdminCategory(id, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "categories"] });
      setFormMessage("Category updated.");
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to update category."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "categories"] });
      setDeleteTarget(null);
      setFormMessage("Category deleted.");
      if (selectedId && deleteTarget?.id === selectedId) {
        setSelectedId(null);
        setSlugDirty(false);
        reset(defaultValues);
      }
    },
    onError: (error) => {
      setDeleteTarget(null);
      setFormMessage(getAdminErrorMessage(error, "Unable to delete category."));
    },
  });

  const watchedName = watch("name");

  useEffect(() => {
    if (!slugDirty) {
      setValue("slug", slugify(watchedName), { shouldValidate: true });
    }
  }, [setValue, slugDirty, watchedName]);

  useEffect(() => {
    if (selectedCategory) {
      reset({
        name: selectedCategory.name,
        slug: selectedCategory.slug,
        description: selectedCategory.description ?? "",
      });
      setSlugDirty(true);
      return;
    }

    reset(defaultValues);
    setSlugDirty(false);
  }, [reset, selectedCategory]);

  async function onSubmit(values: CategoryFormValues) {
    setFormMessage(null);
    if (selectedCategory) {
      await updateMutation.mutateAsync({ id: selectedCategory.id, values });
      return;
    }

    await createMutation.mutateAsync(values);
  }

  if (categoriesQuery.isPending) {
    return <LoadingSpinner label="Loading blog categories..." />;
  }

  if (categoriesQuery.error || !categoriesQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load blog categories."
        detail="Check that the admin blog category endpoint is available."
      />
    );
  }

  return (
    <>
      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Category list</h2>
              <p>These categories are available for blog post classification.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <div className="admin-toolbar">
              <span className="admin-toolbar__meta">
                {categoriesQuery.data.length} categories stored
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
                New Category
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categoriesQuery.data.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <strong>{category.name}</strong>
                      </td>
                      <td>{category.slug}</td>
                      <td>
                        <p>{category.description ?? "No description provided."}</p>
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <button
                            className="admin-table__action"
                            type="button"
                            onClick={() => {
                              setSelectedId(category.id);
                              setFormMessage(null);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="admin-table__action admin-table__action--danger"
                            type="button"
                            onClick={() => setDeleteTarget(category)}
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
              <h2>{selectedCategory ? "Edit category" : "Create category"}</h2>
              <p>Use descriptive labels and stable slugs that will not break links.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="admin-form__grid">
                <div className="admin-form__field">
                  <label htmlFor="category-name">Name</label>
                  <input id="category-name" type="text" {...register("name")} />
                  {errors.name ? (
                    <p className="admin-form__error">{errors.name.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="category-slug">Slug</label>
                  <input
                    id="category-slug"
                    type="text"
                    {...register("slug", {
                      onChange: () => setSlugDirty(true),
                    })}
                  />
                  {errors.slug ? (
                    <p className="admin-form__error">{errors.slug.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="category-description">Description</label>
                  <textarea
                    id="category-description"
                    rows={5}
                    {...register("description")}
                  />
                </div>
              </div>

              {formMessage ? <p className="admin-form__hint">{formMessage}</p> : null}

              <div className="admin-form__actions">
                {selectedCategory ? (
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
                    : selectedCategory
                      ? "Update Category"
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>

      <AdminDeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete category?"
        description={`This will permanently remove ${deleteTarget?.name ?? "the selected category"}.`}
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
