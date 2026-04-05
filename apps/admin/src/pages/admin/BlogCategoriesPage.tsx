import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import {
  createAdminBlogCategory,
  deleteAdminBlogCategory,
  listAdminBlogCategories,
  updateAdminBlogCategory,
} from "../../services/adminBlogService";
import { SystemOSFrame } from "../../systemos/SystemOSFrame";
import { formatDate, relativeTime } from "../../systemos/utils";
import type { ApiBlogCategory } from "../../types/api";
import { getAdminErrorMessage, slugify } from "../../utils/admin";

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

interface BlogCategoriesPageProps {
  theme: "light" | "dark";
}

function isRecent(value: string) {
  const createdAt = new Date(value).getTime();
  return Date.now() - createdAt <= 30 * 24 * 60 * 60 * 1000;
}

export function BlogCategoriesPage({ theme }: BlogCategoriesPageProps) {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [slugDirty, setSlugDirty] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiBlogCategory | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const categoriesQuery = useQuery({
    queryKey: ["admin", "blog", "categories"],
    queryFn: listAdminBlogCategories,
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
    mutationFn: createAdminBlogCategory,
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
    }) => updateAdminBlogCategory(id, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "categories"] });
      setFormMessage("Category updated.");
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to update category."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminBlogCategory,
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

  const categories = categoriesQuery.data ?? [];
  const filteredCategories = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return categories;

    return categories.filter((category) =>
      [category.name, category.slug, category.description ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [categories, query]);

  const stats = useMemo(
    () => [
      {
        label: "Total Categories",
        value: categories.length,
        note: "Available to classify blog posts.",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        ),
      },
      {
        label: "With Description",
        value: categories.filter((category) => Boolean(category.description?.trim())).length,
        note: "Categories with supporting copy.",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M6 4h9l3 3v13H6z" />
            <path d="M15 4v3h3" />
            <path d="M9 12h6M9 16h4" />
          </svg>
        ),
      },
      {
        label: "Recent",
        value: categories.filter((category) => isRecent(category.created_at)).length,
        note: "Created in the last 30 days.",
        icon: (
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="13" r="7" />
            <path d="M12 9v4l2.5 1.5" />
            <path d="M9 3h6" />
          </svg>
        ),
      },
      {
        label: "Slug Ready",
        value: categories.filter((category) => category.slug.trim().length >= 3 && !/--/.test(category.slug)).length,
        note: "Stable slugs ready for production links.",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5 10 17l9-10" />
          </svg>
        ),
      },
    ],
    [categories]
  );

  function resetFormState() {
    setSelectedId(null);
    setSlugDirty(false);
    setFormMessage(null);
    reset(defaultValues);
  }

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
        detail="Blog categories could not be loaded right now."
      />
    );
  }

  return (
    <>
      <SystemOSFrame theme={theme} padded={false}>
        <div style={{ display: "grid", gap: 14 }}>
          <section className="stats">
            {stats.map((item) => (
              <article className="card stat" key={item.label}>
                <div className="stat-top">
                  <div>
                    <div className="stat-label">{item.label}</div>
                    <div className="stat-value">{item.value}</div>
                    <div className="stat-note">{item.note}</div>
                  </div>
                  <div className="stat-icon">{item.icon}</div>
                </div>
              </article>
            ))}
          </section>

          <div className="workspace-split">
            <div className="workspace-stack">
              <section className="card toolbar">
                <div style={{ display: "grid", gap: 14 }}>
                  <div className="analytics-head">
                    <div>
                      <div className="analytics-kicker">Taxonomy</div>
                      <div className="analytics-title">Category list</div>
                      <div className="analytics-copy">
                        These categories are available for blog post classification.
                      </div>
                    </div>
                    <div className="workspace-form-actions-end">
                      <button className="btn small" type="button" onClick={resetFormState}>
                        New Category
                      </button>
                    </div>
                  </div>

                  <div className="search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="7" />
                      <path d="m20 20-3.5-3.5" />
                    </svg>
                    <input
                      className="field"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Search name, slug, or description"
                    />
                  </div>
                </div>
              </section>

              <section className="card table-card">
                {filteredCategories.length ? (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Name / Slug</th>
                          <th>Description</th>
                          <th>Created</th>
                          <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCategories.map((category) => (
                          <tr key={category.id}>
                            <td>
                              <button
                                className="title-btn"
                                type="button"
                                onClick={() => {
                                  setSelectedId(category.id);
                                  setFormMessage(null);
                                }}
                              >
                                {category.name}
                              </button>
                              <div className="subtext">/{category.slug}</div>
                            </td>
                            <td>
                              <div className="workspace-copy">
                                {category.description?.trim() || "No description provided."}
                              </div>
                            </td>
                            <td>
                              {relativeTime(category.created_at)}
                              <div className="subtext">{formatDate(category.created_at)}</div>
                            </td>
                            <td>
                              <div className="icon-actions">
                                <button
                                  className="icon-btn"
                                  type="button"
                                  aria-label="Edit"
                                  onClick={() => {
                                    setSelectedId(category.id);
                                    setFormMessage(null);
                                  }}
                                >
                                  <svg viewBox="0 0 24 24">
                                    <path d="M4 20h4l10-10-4-4L4 16v4Z" />
                                    <path d="m12 6 4 4" />
                                  </svg>
                                </button>
                                <button
                                  className="icon-btn danger"
                                  type="button"
                                  aria-label="Delete"
                                  onClick={() => setDeleteTarget(category)}
                                >
                                  <svg viewBox="0 0 24 24">
                                    <path d="M4 7h16" />
                                    <path d="m10 11 1 6" />
                                    <path d="m14 11-1 6" />
                                    <path d="M9 7V5h6v2" />
                                    <path d="M6 7l1 12h10l1-12" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty">
                    <div className="empty-title">No categories match the current search</div>
                    <div className="empty-note">
                      Clear the search or create a new category to keep taxonomy organized.
                    </div>
                  </div>
                )}
              </section>
            </div>

            <section className="card workspace-form-card">
              <div className="section-head">
                <div className="section-title">
                  {selectedCategory ? "Edit Category" : "Create Category"}
                </div>
                <div className="section-note">
                  Use descriptive labels and stable slugs that will not break links.
                </div>
              </div>

              <form style={{ display: "grid", gap: 22 }} onSubmit={handleSubmit(onSubmit)}>
                <section className="modal-section">
                  <div className="section-head">
                    <div className="section-title">Identity</div>
                    <div className="section-note">
                      Keep naming simple and make the slug stable before posts start using it.
                    </div>
                  </div>

                  <div className="form-grid">
                    <div>
                      <label className="label" htmlFor="category-name">Name</label>
                      <input className="field" id="category-name" type="text" {...register("name")} />
                      {errors.name ? <div className="help">{errors.name.message}</div> : null}
                    </div>
                    <div>
                      <label className="label" htmlFor="category-slug">Slug</label>
                      <input
                        className="field"
                        id="category-slug"
                        type="text"
                        {...register("slug", {
                          onChange: () => setSlugDirty(true),
                        })}
                      />
                      {errors.slug ? <div className="help">{errors.slug.message}</div> : null}
                    </div>
                  </div>
                </section>

                <section className="modal-section">
                  <div className="section-head">
                    <div className="section-title">Description</div>
                    <div className="section-note">
                      Add short editorial context so category meaning stays clear across the team.
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="category-description">Description</label>
                    <textarea
                      className="textarea"
                      id="category-description"
                      rows={5}
                      {...register("description")}
                    />
                  </div>
                </section>

                {formMessage ? <div className="hero-note">{formMessage}</div> : null}

                <div className="workspace-form-actions">
                  <div className="workspace-copy">
                    {selectedCategory ? `Selected category created ${formatDate(selectedCategory.created_at)}.` : "Create a category and reuse it across blog posts."}
                  </div>
                  <div className="workspace-form-actions-end">
                    {selectedCategory ? (
                      <button className="btn small" type="button" onClick={resetFormState}>
                        Clear
                      </button>
                    ) : null}
                    <button
                      className="btn primary"
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
                </div>
              </form>
            </section>
          </div>
        </div>
      </SystemOSFrame>

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
