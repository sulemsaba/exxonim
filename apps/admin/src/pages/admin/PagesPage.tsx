import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import { adminRoutes, type AdminRouteMatch } from "../../lib/adminRoutes";
import {
  createAdminPage,
  deleteAdminPage,
  getAdminPages,
  updateAdminPage,
} from "../../services/adminPageService";
import type { ApiContentStatus, ApiPage } from "../../types/api";
import {
  getContentStatus,
  getAdminErrorMessage,
  parseJsonValue,
  prettyJson,
  slugify,
  tryParseJsonValue,
} from "../../utils/admin";

const contentStatusSchema = z.enum(["draft", "published", "archived"]);

const pageSchema = z.object({
  title: z.string().min(1, "Title is required."),
  slug: z.string().min(1, "Slug is required."),
  content_json: z
    .string()
    .min(2, "Content JSON is required.")
    .refine((value) => {
      const parsed = tryParseJsonValue<Record<string, unknown>>(value);
      return Boolean(parsed && typeof parsed === "object" && !Array.isArray(parsed));
    }, "Content must be a valid JSON object."),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  og_image_url: z.string().optional(),
  status: contentStatusSchema,
});

type PageFormValues = z.infer<typeof pageSchema>;

interface PagesPageProps {
  mode: AdminRouteMatch["mode"];
  entityId?: number;
  pageSlug?: string;
}

const defaultValues: PageFormValues = {
  title: "",
  slug: "",
  content_json: prettyJson({}),
  meta_title: "",
  meta_description: "",
  og_image_url: "",
  status: "draft",
};

function formatTimestamp(value?: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleString();
}

function toPayload(values: PageFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    content: parseJsonValue<Record<string, unknown>>(values.content_json),
    meta_title: values.meta_title || null,
    meta_description: values.meta_description || null,
    og_image_url: values.og_image_url || null,
    status: values.status,
  };
}

function formatShortcutTitle(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getStatusClassName(status: ApiContentStatus) {
  if (status === "published") {
    return "admin-status admin-status--published";
  }

  if (status === "archived") {
    return "admin-status admin-status--danger";
  }

  return "admin-status admin-status--draft";
}

export function PagesPage({ mode, entityId, pageSlug }: PagesPageProps) {
  const queryClient = useQueryClient();
  const { admin } = useAuth();
  const [slugDirty, setSlugDirty] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiPage | null>(null);
  const adminRole = admin?.role ?? "admin";
  const isShortcut = mode === "shortcut" && Boolean(pageSlug);

  const pagesQuery = useQuery({
    queryKey: ["admin", "pages"],
    queryFn: getAdminPages,
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues,
  });

  const selectedPage =
    mode === "edit"
      ? pagesQuery.data?.find((page) => page.id === entityId) ?? null
      : isShortcut && pageSlug
        ? pagesQuery.data?.find((page) => page.slug === pageSlug) ?? null
      : null;
  const isExistingRecord = Boolean(selectedPage);
  const watchedTitle = watch("title");
  const watchedStatus = watch("status");

  useEffect(() => {
    if (isShortcut && pageSlug) {
      setValue("slug", pageSlug, { shouldValidate: true });
      return;
    }

    if (!slugDirty) {
      setValue("slug", slugify(watchedTitle), { shouldValidate: true });
    }
  }, [isShortcut, pageSlug, setValue, slugDirty, watchedTitle]);

  useEffect(() => {
    if ((mode === "edit" || isShortcut) && selectedPage) {
      reset({
        title: selectedPage.title,
        slug: selectedPage.slug,
        content_json: prettyJson(selectedPage.content),
        meta_title: selectedPage.meta_title ?? "",
        meta_description: selectedPage.meta_description ?? "",
        og_image_url: selectedPage.og_image_url ?? "",
        status: getContentStatus(selectedPage),
      });
      setSlugDirty(true);
      return;
    }

    if (isShortcut && pageSlug) {
      reset({
        ...defaultValues,
        title: formatShortcutTitle(pageSlug),
        slug: pageSlug,
      });
      setSlugDirty(true);
      return;
    }

    reset(defaultValues);
    setSlugDirty(false);
  }, [isShortcut, mode, pageSlug, reset, selectedPage]);

  const createMutation = useMutation({
    mutationFn: createAdminPage,
    onSuccess: async (page) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "pages"] });
      await queryClient.invalidateQueries({ queryKey: ["pages", page.slug] });

      if (typeof window !== "undefined") {
        window.location.assign(
          isShortcut && pageSlug
            ? adminRoutes.pageShortcut(pageSlug as Parameters<typeof adminRoutes.pageShortcut>[0])
            : adminRoutes.pageEdit(page.id)
        );
      }
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to create page."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
      previousSlug,
    }: {
      id: number;
      values: PageFormValues;
      previousSlug: string;
    }) => updateAdminPage(id, toPayload(values)),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "pages"] });
      await queryClient.invalidateQueries({
        queryKey: ["pages", variables.previousSlug],
      });
      await queryClient.invalidateQueries({ queryKey: ["pages", variables.values.slug] });
      setFormMessage("Page updated.");
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to update page."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminPage,
    onSuccess: async () => {
      const deletedSlug = deleteTarget?.slug;

      await queryClient.invalidateQueries({ queryKey: ["admin", "pages"] });
      if (deletedSlug) {
        await queryClient.invalidateQueries({ queryKey: ["pages", deletedSlug] });
      }

      setDeleteTarget(null);

      if (typeof window !== "undefined") {
        window.location.assign(adminRoutes.pages);
      }
    },
    onError: (error) => {
      setDeleteTarget(null);
      setFormMessage(getAdminErrorMessage(error, "Unable to delete page."));
    },
  });

  async function onSubmit(values: PageFormValues) {
    setFormMessage(null);

    if (selectedPage) {
      await updateMutation.mutateAsync({
        id: selectedPage.id,
        values,
        previousSlug: selectedPage.slug,
      });
      return;
    }

    await createMutation.mutateAsync(toPayload(values));
  }

  if (pagesQuery.isPending) {
    return <LoadingSpinner label="Loading pages workspace..." />;
  }

  if (pagesQuery.error || !pagesQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load page management."
        detail="Check that the admin page endpoint is available."
      />
    );
  }

  if (mode === "edit" && !entityId) {
    return (
      <ErrorMessage
        title="Missing page id."
        detail="Open this route from the pages index so a valid record can be loaded."
      />
    );
  }

  if (mode === "edit" && !selectedPage) {
    return (
      <ErrorMessage
        title="Page not found."
        detail="The requested page could not be loaded from the admin API."
      />
    );
  }

  if (mode === "index") {
    return (
      <>
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Pages</h2>
              <p>Manage published page records that power the public route content.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <div className="admin-toolbar">
              <span className="admin-toolbar__meta">
                {pagesQuery.data.length} pages stored
              </span>
              <a className="admin-action-button" href={adminRoutes.pagesNew}>
                New Page
              </a>
            </div>

            {pagesQuery.data.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Slug</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagesQuery.data.map((page) => (
                      <tr key={page.id}>
                        <td>
                          <strong>{page.title}</strong>
                          <p>{page.meta_description ?? "No meta description provided."}</p>
                      </td>
                      <td>{page.slug}</td>
                      <td>
                        <span className={getStatusClassName(getContentStatus(page))}>
                          {getContentStatus(page)}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <a
                            className="admin-table__action"
                            href={adminRoutes.pageEdit(page.id)}
                          >
                            Edit
                          </a>
                          {adminRole === "admin" ? (
                            <button
                              className="admin-table__action admin-table__action--danger"
                              type="button"
                              onClick={() => setDeleteTarget(page)}
                            >
                              Delete
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-empty">
                <strong>No pages yet.</strong>
                <p>Create the first page record to populate the frontend route content API.</p>
              </div>
            )}
          </div>
        </section>

        <AdminDeleteDialog
          open={Boolean(deleteTarget)}
          title="Delete page?"
          description={`This will permanently remove ${deleteTarget?.title ?? "the selected page"}.`}
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

  return (
    <>
      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>
                {isExistingRecord
                  ? "Edit page"
                  : isShortcut && pageSlug
                    ? `${formatShortcutTitle(pageSlug)} page`
                    : "Create page"}
              </h2>
              <p>
                {isShortcut
                  ? "This shortcut route edits page content only. The slug stays fixed so the public route remains stable."
                  : "Page content is stored as raw JSON so public routes can render typed content from the API."}
              </p>
            </div>
          </div>
          <div className="admin-card__body">
            <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="admin-form__grid">
                <div className="admin-form__field">
                  <label htmlFor="page-title">Title</label>
                  <input id="page-title" type="text" {...register("title")} />
                  {errors.title ? <p className="admin-form__error">{errors.title.message}</p> : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="page-slug">Slug</label>
                  <input
                    id="page-slug"
                    type="text"
                    disabled={isShortcut}
                    {...register("slug", {
                      onChange: () => setSlugDirty(true),
                    })}
                  />
                  {errors.slug ? <p className="admin-form__error">{errors.slug.message}</p> : null}
                  {isShortcut ? (
                    <p className="admin-form__hint">
                      Shortcut pages keep a fixed slug so the route mapping never drifts.
                    </p>
                  ) : null}
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="page-meta-title">Meta title</label>
                  <input id="page-meta-title" type="text" {...register("meta_title")} />
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="page-meta-description">Meta description</label>
                  <textarea
                    id="page-meta-description"
                    rows={4}
                    {...register("meta_description")}
                  />
                </div>

                <div className="admin-form__field">
                  <label htmlFor="page-og-image">Open graph image URL</label>
                  <input id="page-og-image" type="text" {...register("og_image_url")} />
                </div>

                <div className="admin-form__field">
                  <label htmlFor="page-status">Status</label>
                  <select
                    id="page-status"
                    {...register("status")}
                    disabled={adminRole === "editor" && watchedStatus === "archived"}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived" disabled={adminRole !== "admin"}>
                      Archived
                    </option>
                  </select>
                  {adminRole === "editor" && watchedStatus === "archived" ? (
                    <p className="admin-form__hint">
                      Archived pages can only be restored or changed by an admin.
                    </p>
                  ) : null}
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="page-content">Content JSON</label>
                  <textarea id="page-content" rows={20} {...register("content_json")} />
                  {errors.content_json ? (
                    <p className="admin-form__error">{errors.content_json.message}</p>
                  ) : null}
                </div>
              </div>

              {formMessage ? <p className="admin-form__hint">{formMessage}</p> : null}

              <div className="admin-form__actions">
                <a className="admin-form__cancel" href={adminRoutes.pages}>
                  Back to Pages
                </a>
                {isExistingRecord && adminRole === "admin" ? (
                  <button
                    className="admin-danger-button"
                    type="button"
                    onClick={() => setDeleteTarget(selectedPage)}
                  >
                    Delete Page
                  </button>
                ) : null}
                <button
                  className="admin-form__submit"
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : isExistingRecord
                      ? "Update Page"
                      : "Create Page"}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Record details</h2>
              <p>
                Keep route slugs stable once a public page is live, because frontend queries resolve content by slug.
              </p>
            </div>
          </div>
          <div className="admin-card__body">
            <div className="admin-empty">
              <strong>
                {isExistingRecord
                  ? selectedPage?.title
                  : isShortcut && pageSlug
                    ? `${formatShortcutTitle(pageSlug)} draft`
                    : "New page draft"}
              </strong>
              <p>Created at: {formatTimestamp(selectedPage?.created_at)}</p>
              <p>Updated at: {formatTimestamp(selectedPage?.updated_at)}</p>
            </div>
          </div>
        </section>
      </div>

      <AdminDeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete page?"
        description={`This will permanently remove ${deleteTarget?.title ?? "the selected page"}.`}
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
