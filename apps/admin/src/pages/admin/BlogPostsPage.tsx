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
  createAdminPost,
  deleteAdminPost,
  getAdminAuthors,
  getAdminCategories,
  getAdminPosts,
  updateAdminPost,
} from "../../services/adminBlogService";
import type { ApiBlogPost, ApiContentStatus } from "../../types/api";
import {
  fromDatetimeLocalValue,
  getContentStatus,
  getAdminErrorMessage,
  parseJsonValue,
  prettyJson,
  slugify,
  toDatetimeLocalValue,
  tryParseJsonValue,
} from "../../utils/admin";

const contentStatusSchema = z.enum(["draft", "published", "archived"]);

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required."),
  slug: z.string().min(1, "Slug is required."),
  excerpt: z.string().optional(),
  content_json: z
    .string()
    .min(2, "Content JSON is required.")
    .refine((value) => {
      const parsed = tryParseJsonValue<Record<string, unknown>>(value);
      return Boolean(parsed && typeof parsed === "object" && !Array.isArray(parsed));
    }, "Content must be a valid JSON object."),
  category_id: z.string().optional(),
  author_id: z.string().optional(),
  featured_image: z.string().optional(),
  cover_alt: z.string().optional(),
  media_label: z.string().optional(),
  featured_slot: z.string().optional(),
  featured_on_home: z.boolean(),
  read_time_minutes: z
    .string()
    .optional()
    .refine(
      (value) => !value || Number.isInteger(Number(value)),
      "Read time must be an integer."
    ),
  related_slugs_text: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  og_image_url: z.string().optional(),
  published_at: z.string().optional(),
  status: contentStatusSchema,
});

type BlogPostFormValues = z.infer<typeof blogPostSchema>;

interface BlogPostsPageProps {
  mode: AdminRouteMatch["mode"];
  entityId?: number;
}

const defaultContent = {
  introduction: "",
  highlights: [],
  sections: [],
};

const defaultValues: BlogPostFormValues = {
  title: "",
  slug: "",
  excerpt: "",
  content_json: prettyJson(defaultContent),
  category_id: "",
  author_id: "",
  featured_image: "",
  cover_alt: "",
  media_label: "",
  featured_slot: "",
  featured_on_home: false,
  read_time_minutes: "",
  related_slugs_text: "",
  meta_title: "",
  meta_description: "",
  og_image_url: "",
  published_at: "",
  status: "draft",
};

function parseSlugList(value?: string) {
  if (!value) {
    return [];
  }

  return value
    .split(/[\n,]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function toPayload(values: BlogPostFormValues) {
  return {
    title: values.title,
    slug: values.slug,
    excerpt: values.excerpt || null,
    content: parseJsonValue<Record<string, unknown>>(values.content_json),
    category_id: values.category_id ? Number(values.category_id) : null,
    author_id: values.author_id ? Number(values.author_id) : null,
    featured_image: values.featured_image || null,
    cover_alt: values.cover_alt || null,
    media_label: values.media_label || null,
    featured_slot: values.featured_slot || null,
    featured_on_home: values.featured_on_home,
    read_time_minutes: values.read_time_minutes ? Number(values.read_time_minutes) : null,
    related_slugs: parseSlugList(values.related_slugs_text),
    meta_title: values.meta_title || null,
    meta_description: values.meta_description || null,
    og_image_url: values.og_image_url || null,
    published_at: fromDatetimeLocalValue(values.published_at),
    status: values.status,
  };
}

function formatTimestamp(value?: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleString();
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

export function BlogPostsPage({ mode, entityId }: BlogPostsPageProps) {
  const queryClient = useQueryClient();
  const { admin } = useAuth();
  const [slugDirty, setSlugDirty] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ApiBlogPost | null>(null);
  const adminRole = admin?.role ?? "admin";

  const postsQuery = useQuery({
    queryKey: ["admin", "blog", "posts"],
    queryFn: getAdminPosts,
  });
  const categoriesQuery = useQuery({
    queryKey: ["admin", "blog", "categories"],
    queryFn: getAdminCategories,
  });
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
  } = useForm<BlogPostFormValues>({
    resolver: zodResolver(blogPostSchema),
    defaultValues,
  });

  const selectedPost =
    mode === "edit"
      ? postsQuery.data?.find((post) => post.id === entityId) ?? null
      : null;
  const watchedTitle = watch("title");

  useEffect(() => {
    if (!slugDirty) {
      setValue("slug", slugify(watchedTitle), { shouldValidate: true });
    }
  }, [setValue, slugDirty, watchedTitle]);

  useEffect(() => {
    if (mode === "edit" && selectedPost) {
      reset({
        title: selectedPost.title,
        slug: selectedPost.slug,
        excerpt: selectedPost.excerpt ?? "",
        content_json: prettyJson(selectedPost.content ?? defaultContent),
        category_id: selectedPost.category?.id ? String(selectedPost.category.id) : "",
        author_id: selectedPost.author?.id ? String(selectedPost.author.id) : "",
        featured_image: selectedPost.featured_image ?? "",
        cover_alt: selectedPost.cover_alt ?? "",
        media_label: selectedPost.media_label ?? "",
        featured_slot: selectedPost.featured_slot ?? "",
        featured_on_home: selectedPost.featured_on_home,
        read_time_minutes:
          selectedPost.read_time_minutes === null || selectedPost.read_time_minutes === undefined
            ? ""
            : String(selectedPost.read_time_minutes),
        related_slugs_text: (selectedPost.related_slugs ?? []).join(", "),
        meta_title: selectedPost.meta_title ?? "",
        meta_description: selectedPost.meta_description ?? "",
        og_image_url: selectedPost.og_image_url ?? "",
        published_at: toDatetimeLocalValue(selectedPost.published_at),
        status: getContentStatus(selectedPost),
      });
      setSlugDirty(true);
      return;
    }

    reset(defaultValues);
    setSlugDirty(false);
  }, [mode, reset, selectedPost]);

  const createMutation = useMutation({
    mutationFn: createAdminPost,
    onSuccess: async (post) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "posts"] });
      await queryClient.invalidateQueries({ queryKey: ["blog", "posts"] });

      if (typeof window !== "undefined") {
        window.location.assign(adminRoutes.blogPostEdit(post.id));
      }
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to create blog post."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      values,
      previousSlug,
    }: {
      id: number;
      values: BlogPostFormValues;
      previousSlug: string;
    }) => updateAdminPost(id, toPayload(values)),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "posts"] });
      await queryClient.invalidateQueries({ queryKey: ["blog", "posts"] });
      await queryClient.invalidateQueries({
        queryKey: ["blog", "post", variables.previousSlug],
      });
      await queryClient.invalidateQueries({
        queryKey: ["blog", "post", variables.values.slug],
      });
      setFormMessage("Blog post updated.");
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to update blog post."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminPost,
    onSuccess: async () => {
      const deletedSlug = deleteTarget?.slug;

      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "posts"] });
      await queryClient.invalidateQueries({ queryKey: ["blog", "posts"] });

      if (deletedSlug) {
        await queryClient.invalidateQueries({ queryKey: ["blog", "post", deletedSlug] });
      }

      setDeleteTarget(null);

      if (typeof window !== "undefined") {
        window.location.assign(adminRoutes.blogPosts);
      }
    },
    onError: (error) => {
      setDeleteTarget(null);
      setFormMessage(getAdminErrorMessage(error, "Unable to delete blog post."));
    },
  });

  async function onSubmit(values: BlogPostFormValues) {
    setFormMessage(null);

    if (mode === "edit" && selectedPost) {
      await updateMutation.mutateAsync({
        id: selectedPost.id,
        values,
        previousSlug: selectedPost.slug,
      });
      return;
    }

    await createMutation.mutateAsync(toPayload(values));
  }

  if (postsQuery.isPending || categoriesQuery.isPending || authorsQuery.isPending) {
    return <LoadingSpinner label="Loading blog post workspace..." />;
  }

  if (
    postsQuery.error ||
    categoriesQuery.error ||
    authorsQuery.error ||
    !postsQuery.data ||
    !categoriesQuery.data ||
    !authorsQuery.data
  ) {
    return (
      <ErrorMessage
        title="Unable to load blog post management."
        detail="Check that the admin blog endpoints are available."
      />
    );
  }

  if (mode === "edit" && !entityId) {
    return (
      <ErrorMessage
        title="Missing blog post id."
        detail="Open this route from the blog posts index so a valid post can be loaded."
      />
    );
  }

  if (mode === "edit" && !selectedPost) {
    return (
      <ErrorMessage
        title="Blog post not found."
        detail="The requested blog post could not be loaded from the admin API."
      />
    );
  }

  if (mode === "index") {
    return (
      <>
        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Blog posts</h2>
              <p>Review articles, publication state, and metadata before sending visitors to the resource page.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <div className="admin-toolbar">
              <span className="admin-toolbar__meta">
                {postsQuery.data.length} posts stored
              </span>
              <a className="admin-action-button" href={adminRoutes.blogPostsNew}>
                New Blog Post
              </a>
            </div>

            {postsQuery.data.length ? (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Post</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postsQuery.data.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <strong>{post.title}</strong>
                          <p>{post.excerpt ?? "No excerpt provided."}</p>
                        </td>
                        <td>{post.category?.name ?? "Unassigned"}</td>
                        <td>
                          <span className={getStatusClassName(getContentStatus(post))}>
                            {getContentStatus(post)}
                          </span>
                        </td>
                        <td>
                          <div className="admin-table__actions">
                            <a
                              className="admin-table__action"
                              href={adminRoutes.blogPostEdit(post.id)}
                            >
                              Edit
                            </a>
                            {adminRole === "admin" ? (
                              <button
                                className="admin-table__action admin-table__action--danger"
                                type="button"
                                onClick={() => setDeleteTarget(post)}
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
                <strong>No blog posts yet.</strong>
                <p>Create the first resource article to populate the public resources section.</p>
              </div>
            )}
          </div>
        </section>

        <AdminDeleteDialog
          open={Boolean(deleteTarget)}
          title="Delete blog post?"
          description={`This will permanently remove ${deleteTarget?.title ?? "the selected post"}.`}
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
              <h2>{mode === "edit" ? "Edit blog post" : "Create blog post"}</h2>
              <p>Keep the structured article JSON aligned with what the public resource page expects.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <form className="admin-form" onSubmit={handleSubmit(onSubmit)}>
              <div className="admin-form__grid">
                <div className="admin-form__field">
                  <label htmlFor="post-title">Title</label>
                  <input id="post-title" type="text" {...register("title")} />
                  {errors.title ? <p className="admin-form__error">{errors.title.message}</p> : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="post-slug">Slug</label>
                  <input
                    id="post-slug"
                    type="text"
                    {...register("slug", {
                      onChange: () => setSlugDirty(true),
                    })}
                  />
                  {errors.slug ? <p className="admin-form__error">{errors.slug.message}</p> : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="post-category">Category</label>
                  <select id="post-category" {...register("category_id")}>
                    <option value="">No category</option>
                    {categoriesQuery.data.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form__field">
                  <label htmlFor="post-author">Author</label>
                  <select id="post-author" {...register("author_id")}>
                    <option value="">No author</option>
                    {authorsQuery.data.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-form__field">
                  <label htmlFor="post-read-time">Read time</label>
                  <input id="post-read-time" type="text" {...register("read_time_minutes")} />
                  {errors.read_time_minutes ? (
                    <p className="admin-form__error">{errors.read_time_minutes.message}</p>
                  ) : null}
                </div>

                <div className="admin-form__field">
                  <label htmlFor="post-featured-slot">Featured slot</label>
                  <input id="post-featured-slot" type="text" {...register("featured_slot")} />
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="post-excerpt">Excerpt</label>
                  <textarea id="post-excerpt" rows={4} {...register("excerpt")} />
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="post-featured-image">Featured image URL</label>
                  <input id="post-featured-image" type="text" {...register("featured_image")} />
                </div>

                <div className="admin-form__field">
                  <label htmlFor="post-cover-alt">Cover alt</label>
                  <input id="post-cover-alt" type="text" {...register("cover_alt")} />
                </div>

                <div className="admin-form__field">
                  <label htmlFor="post-media-label">Media label</label>
                  <input id="post-media-label" type="text" {...register("media_label")} />
                </div>

                <div className="admin-form__field">
                  <label htmlFor="post-published-at">Published at</label>
                  <input
                    id="post-published-at"
                    type="datetime-local"
                    {...register("published_at")}
                  />
                </div>

                <div className="admin-form__field">
                  <label htmlFor="post-status">Status</label>
                  <select
                    id="post-status"
                    {...register("status")}
                    disabled={adminRole === "editor" && watch("status") === "archived"}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived" disabled={adminRole !== "admin"}>
                      Archived
                    </option>
                  </select>
                  {adminRole === "editor" && watch("status") === "archived" ? (
                    <p className="admin-form__hint">
                      Archived posts can only be restored or changed by an admin.
                    </p>
                  ) : null}
                  <label className="admin-form__checkbox">
                    <input type="checkbox" {...register("featured_on_home")} />
                    Feature this article on the homepage
                  </label>
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="post-meta-title">Meta title</label>
                  <input id="post-meta-title" type="text" {...register("meta_title")} />
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="post-meta-description">Meta description</label>
                  <textarea
                    id="post-meta-description"
                    rows={4}
                    {...register("meta_description")}
                  />
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="post-og-image">Open graph image URL</label>
                  <input id="post-og-image" type="text" {...register("og_image_url")} />
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="post-related">Related slugs</label>
                  <textarea id="post-related" rows={4} {...register("related_slugs_text")} />
                  <p className="admin-form__hint">Separate related article slugs with commas or new lines.</p>
                </div>

                <div className="admin-form__field admin-form__field--full">
                  <label htmlFor="post-content">Content JSON</label>
                  <textarea id="post-content" rows={18} {...register("content_json")} />
                  {errors.content_json ? (
                    <p className="admin-form__error">{errors.content_json.message}</p>
                  ) : null}
                  <p className="admin-form__hint">
                    Provide an object with introduction, highlights, and sections arrays for the public article layout.
                  </p>
                </div>
              </div>

              {formMessage ? <p className="admin-form__hint">{formMessage}</p> : null}

              <div className="admin-form__actions">
                <a className="admin-form__cancel" href={adminRoutes.blogPosts}>
                  Back to Posts
                </a>
                {mode === "edit" && adminRole === "admin" ? (
                  <button
                    className="admin-danger-button"
                    type="button"
                    onClick={() => setDeleteTarget(selectedPost)}
                  >
                    Delete Post
                  </button>
                ) : null}
                <button
                  className="admin-form__submit"
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : mode === "edit"
                      ? "Update Post"
                      : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="admin-card">
          <div className="admin-card__header">
            <div>
              <h2>Editor notes</h2>
              <p>Use the supporting fields to keep article metadata in sync with the resource listing and article detail page.</p>
            </div>
          </div>
          <div className="admin-card__body">
            <div className="admin-empty">
              <strong>{mode === "edit" ? selectedPost?.title : "New post draft"}</strong>
              <p>Published at: {formatTimestamp(selectedPost?.published_at)}</p>
              <p>Updated at: {formatTimestamp(selectedPost?.updated_at)}</p>
              <p>Available categories: {categoriesQuery.data.length}</p>
              <p>Available authors: {authorsQuery.data.length}</p>
            </div>
          </div>
        </section>
      </div>

      <AdminDeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete blog post?"
        description={`This will permanently remove ${deleteTarget?.title ?? "the selected post"}.`}
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
