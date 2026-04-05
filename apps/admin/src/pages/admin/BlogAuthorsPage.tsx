import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import {
  createAdminBlogAuthor,
  deleteAdminBlogAuthor,
  getAdminBlogAuthorMe,
  listAdminBlogAuthors,
  updateAdminBlogAuthor,
  updateAdminBlogAuthorMe,
} from "../../services/adminBlogService";
import { SystemOSFrame } from "../../systemos/SystemOSFrame";
import type { ApiBlogAuthor } from "../../types/api";
import { getAdminErrorMessage, slugify } from "../../utils/admin";

const authorSchema = z.object({
  name: z.string().min(1, "Name is required."),
  slug: z.string().min(1, "Slug is required."),
  role: z.string().optional(),
  avatar_src: z.string().url("Avatar must be a valid URL.").optional().or(z.literal("")),
  bio: z.string().optional(),
});

type AuthorFormValues = z.infer<typeof authorSchema>;

const defaultValues: AuthorFormValues = {
  name: "",
  slug: "",
  role: "",
  avatar_src: "",
  bio: "",
};

interface BlogAuthorsPageProps {
  theme: "light" | "dark";
}

function getInitials(name?: string | null) {
  return (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("") || "AU";
}

function getProfileCompletion(author: Pick<ApiBlogAuthor, "role" | "avatar_src" | "bio">) {
  let score = 1;
  if (author.role?.trim()) score += 1;
  if (author.avatar_src?.trim()) score += 1;
  if (author.bio?.trim()) score += 1;
  return `${Math.round((score / 4) * 100)}%`;
}

function renderAvatar(author: Pick<ApiBlogAuthor, "name" | "avatar_src">) {
  if (author.avatar_src?.trim()) {
    return <img src={author.avatar_src} alt={author.name} />;
  }

  return getInitials(author.name);
}

export function BlogAuthorsPage({ theme }: BlogAuthorsPageProps) {
  const queryClient = useQueryClient();
  const { admin } = useAuth();
  const isAuthorSelfService = admin?.role === "author";
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [slugDirty, setSlugDirty] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ApiBlogAuthor | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const authorsQuery = useQuery({
    queryKey: ["admin", "blog", "authors"],
    queryFn: listAdminBlogAuthors,
    enabled: !isAuthorSelfService,
  });
  const authorMeQuery = useQuery({
    queryKey: ["admin", "blog", "authors", "me"],
    queryFn: getAdminBlogAuthorMe,
    enabled: isAuthorSelfService,
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

  const selectedAuthor = isAuthorSelfService
    ? authorMeQuery.data ?? null
    : authorsQuery.data?.find((author) => author.id === selectedId) ?? null;
  const authors = authorsQuery.data ?? [];

  const createMutation = useMutation({
    mutationFn: createAdminBlogAuthor,
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
    }) => updateAdminBlogAuthor(id, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "authors"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "authors", "me"] });
      setFormMessage("Author updated.");
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to update author."));
    },
  });

  const updateSelfMutation = useMutation({
    mutationFn: updateAdminBlogAuthorMe,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "authors", "me"] });
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "authors"] });
      setFormMessage("Profile updated.");
    },
    onError: (error) => {
      setFormMessage(getAdminErrorMessage(error, "Unable to update author profile."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminBlogAuthor,
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
        bio: selectedAuthor.bio ?? "",
      });
      setSlugDirty(true);
      return;
    }

    reset(defaultValues);
    setSlugDirty(false);
  }, [reset, selectedAuthor]);

  const filteredAuthors = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return authors;

    return authors.filter((author) =>
      [author.name, author.slug, author.role ?? "", author.bio ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [authors, query]);

  const stats = useMemo(
    () => [
      {
        label: "Total Authors",
        value: authors.length,
        note: "Available for blog bylines and editorial assignment.",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
            <circle cx="9.5" cy="7" r="4" />
            <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        ),
      },
      {
        label: "With Avatar",
        value: authors.filter((author) => Boolean(author.avatar_src?.trim())).length,
        note: "Author records ready for richer public bylines.",
        icon: (
          <svg viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="2" />
            <path d="m21 16-4.5-4.5L7 21" />
          </svg>
        ),
      },
      {
        label: "With Bio",
        value: authors.filter((author) => Boolean(author.bio?.trim())).length,
        note: "Profiles with useful context for readers.",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M7 4h10l3 3v13H7z" />
            <path d="M17 4v3h3" />
            <path d="M10 11h7M10 15h5" />
          </svg>
        ),
      },
      {
        label: "Role Defined",
        value: authors.filter((author) => Boolean(author.role?.trim())).length,
        note: "Profiles with a clear editorial or functional title.",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M12 2v6" />
            <path d="M5 7h14" />
            <path d="M6 7v10a5 5 0 0 0 5 5h2a5 5 0 0 0 5-5V7" />
          </svg>
        ),
      },
    ],
    [authors]
  );

  const selfServiceStats = useMemo(() => {
    if (!selectedAuthor) return [];

    return [
      {
        label: "Profile Completion",
        value: getProfileCompletion(selectedAuthor),
        note: "Based on role, avatar, and bio coverage.",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M5 12.5 10 17l9-10" />
          </svg>
        ),
      },
      {
        label: "Avatar",
        value: selectedAuthor.avatar_src?.trim() ? "Set" : "Missing",
        note: "Public bylines can use an image if one is configured.",
        icon: (
          <svg viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <circle cx="9" cy="10" r="2" />
            <path d="m21 16-4.5-4.5L7 21" />
          </svg>
        ),
      },
      {
        label: "Role",
        value: selectedAuthor.role?.trim() || "Unset",
        note: "Displayed with your author byline when available.",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M12 2v6" />
            <path d="M5 7h14" />
            <path d="M6 7v10a5 5 0 0 0 5 5h2a5 5 0 0 0 5-5V7" />
          </svg>
        ),
      },
      {
        label: "Slug",
        value: selectedAuthor.slug,
        note: "Keep this stable once your profile is linked to posts.",
        icon: (
          <svg viewBox="0 0 24 24">
            <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 1 0-7.07-7.07L11.17 4" />
            <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07L12.83 20" />
          </svg>
        ),
      },
    ];
  }, [selectedAuthor]);

  function resetFormState() {
    setSelectedId(null);
    setSlugDirty(false);
    setFormMessage(null);
    reset(defaultValues);
  }

  async function onSubmit(values: AuthorFormValues) {
    setFormMessage(null);

    if (isAuthorSelfService) {
      await updateSelfMutation.mutateAsync(values);
      return;
    }

    if (selectedAuthor) {
      await updateMutation.mutateAsync({ id: selectedAuthor.id, values });
      return;
    }

    await createMutation.mutateAsync(values);
  }

  if ((isAuthorSelfService && authorMeQuery.isPending) || (!isAuthorSelfService && authorsQuery.isPending)) {
    return (
      <LoadingSpinner
        label={isAuthorSelfService ? "Loading your author profile..." : "Loading blog authors..."}
      />
    );
  }

  if (
    (isAuthorSelfService && (authorMeQuery.error || !authorMeQuery.data)) ||
    (!isAuthorSelfService && (authorsQuery.error || !authorsQuery.data))
  ) {
    return (
      <ErrorMessage
        title={isAuthorSelfService ? "Unable to load your author profile." : "Unable to load blog authors."}
        detail={
          isAuthorSelfService
            ? "Your author profile could not be loaded right now."
            : "Author records could not be loaded right now."
        }
      />
    );
  }

  if (isAuthorSelfService && selectedAuthor) {
    return (
      <SystemOSFrame theme={theme} padded={false}>
        <div style={{ display: "grid", gap: 14 }}>
          <section className="stats">
            {selfServiceStats.map((item) => (
              <article className="card stat" key={item.label}>
                <div className="stat-top">
                  <div>
                    <div className="stat-label">{item.label}</div>
                    <div className="stat-value" style={{ fontSize: 24, lineHeight: 1 }}>
                      {item.value}
                    </div>
                    <div className="stat-note">{item.note}</div>
                  </div>
                  <div className="stat-icon">{item.icon}</div>
                </div>
              </article>
            ))}
          </section>

          <section className="card workspace-form-card">
            <div className="analytics-head">
              <div className="workspace-inline-start">
                <div className="workspace-avatar">{renderAvatar(selectedAuthor)}</div>
                <div>
                  <div className="analytics-kicker">Author Workspace</div>
                  <div className="analytics-title">Your author profile</div>
                  <div className="analytics-copy">
                    Update the byline information shown on your published articles.
                  </div>
                </div>
              </div>
            </div>

            <form style={{ display: "grid", gap: 22 }} onSubmit={handleSubmit(onSubmit)}>
              <section className="modal-section">
                <div className="section-head">
                  <div className="section-title">Identity</div>
                  <div className="section-note">
                    Keep your public name and slug stable once articles are linked to your profile.
                  </div>
                </div>

                <div className="form-grid">
                  <div>
                    <label className="label" htmlFor="author-name">Name</label>
                    <input className="field" id="author-name" type="text" {...register("name")} />
                    {errors.name ? <div className="help">{errors.name.message}</div> : null}
                  </div>
                  <div>
                    <label className="label" htmlFor="author-slug">Slug</label>
                    <input
                      className="field"
                      id="author-slug"
                      type="text"
                      {...register("slug", {
                        onChange: () => setSlugDirty(true),
                      })}
                    />
                    {errors.slug ? <div className="help">{errors.slug.message}</div> : null}
                  </div>
                  <div>
                    <label className="label" htmlFor="author-role">Role</label>
                    <input className="field" id="author-role" type="text" {...register("role")} />
                  </div>
                  <div>
                    <label className="label" htmlFor="author-avatar">Avatar URL</label>
                    <input className="field" id="author-avatar" type="url" {...register("avatar_src")} />
                    {errors.avatar_src ? <div className="help">{errors.avatar_src.message}</div> : null}
                  </div>
                </div>
              </section>

              <section className="modal-section">
                <div className="section-head">
                  <div className="section-title">Bio</div>
                  <div className="section-note">
                    Add concise professional context so your byline feels credible and complete.
                  </div>
                </div>

                <div>
                  <label className="label" htmlFor="author-bio">Bio</label>
                  <textarea className="textarea" id="author-bio" rows={6} {...register("bio")} />
                </div>
              </section>

              {formMessage ? <div className="hero-note">{formMessage}</div> : null}

              <div className="workspace-form-actions">
                <div className="workspace-copy">
                  Your author profile is used anywhere posts render a byline or author summary.
                </div>
                <div className="workspace-form-actions-end">
                  <button
                    className="btn primary"
                    type="submit"
                    disabled={updateSelfMutation.isPending}
                  >
                    {updateSelfMutation.isPending ? "Saving..." : "Update Profile"}
                  </button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </SystemOSFrame>
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
                      <div className="analytics-kicker">Editorial Profiles</div>
                      <div className="analytics-title">Author directory</div>
                      <div className="analytics-copy">
                        Maintain the names, roles, bios, and avatar references used across blog posts.
                      </div>
                    </div>
                    <div className="workspace-form-actions-end">
                      <button className="btn small" type="button" onClick={resetFormState}>
                        New Author
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
                      placeholder="Search name, role, slug, or bio"
                    />
                  </div>
                </div>
              </section>

              <section className="card table-card">
                {filteredAuthors.length ? (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Name / Slug</th>
                          <th>Role</th>
                          <th>Profile</th>
                          <th style={{ textAlign: "right" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAuthors.map((author) => (
                          <tr key={author.id}>
                            <td>
                              <div className="workspace-inline-start">
                                <div className="workspace-avatar">{renderAvatar(author)}</div>
                                <div>
                                  <button
                                    className="title-btn"
                                    type="button"
                                    onClick={() => {
                                      setSelectedId(author.id);
                                      setFormMessage(null);
                                    }}
                                  >
                                    {author.name}
                                  </button>
                                  <div className="subtext">/{author.slug}</div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="workspace-copy">{author.role?.trim() || "No role assigned."}</div>
                            </td>
                            <td>
                              <div className="workspace-copy">
                                {author.bio?.trim() || "Bio not provided yet."}
                              </div>
                              <div className="subtext">
                                Completion {getProfileCompletion(author)}
                              </div>
                            </td>
                            <td>
                              <div className="icon-actions">
                                <button
                                  className="icon-btn"
                                  type="button"
                                  aria-label="Edit"
                                  onClick={() => {
                                    setSelectedId(author.id);
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
                                  onClick={() => setDeleteTarget(author)}
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
                    <div className="empty-title">No author profiles match the current search</div>
                    <div className="empty-note">
                      Clear the search or create a new author profile for future post assignments.
                    </div>
                  </div>
                )}
              </section>
            </div>

            <section className="card workspace-form-card">
              <div className="section-head">
                <div className="section-title">{selectedAuthor ? "Edit Author" : "Create Author"}</div>
                <div className="section-note">
                  Complete author profiles make blog posts feel more credible and easier to manage.
                </div>
              </div>

              <form style={{ display: "grid", gap: 22 }} onSubmit={handleSubmit(onSubmit)}>
                <section className="modal-section">
                  <div className="section-head">
                    <div className="section-title">Identity</div>
                    <div className="section-note">
                      Keep the public name clear and use a slug that will remain stable over time.
                    </div>
                  </div>

                  <div className="form-grid">
                    <div>
                      <label className="label" htmlFor="author-name">Name</label>
                      <input className="field" id="author-name" type="text" {...register("name")} />
                      {errors.name ? <div className="help">{errors.name.message}</div> : null}
                    </div>
                    <div>
                      <label className="label" htmlFor="author-slug">Slug</label>
                      <input
                        className="field"
                        id="author-slug"
                        type="text"
                        {...register("slug", {
                          onChange: () => setSlugDirty(true),
                        })}
                      />
                      {errors.slug ? <div className="help">{errors.slug.message}</div> : null}
                    </div>
                    <div>
                      <label className="label" htmlFor="author-role">Role</label>
                      <input className="field" id="author-role" type="text" {...register("role")} />
                    </div>
                    <div>
                      <label className="label" htmlFor="author-avatar">Avatar URL</label>
                      <input className="field" id="author-avatar" type="url" {...register("avatar_src")} />
                      {errors.avatar_src ? <div className="help">{errors.avatar_src.message}</div> : null}
                    </div>
                  </div>
                </section>

                <section className="modal-section">
                  <div className="section-head">
                    <div className="section-title">Preview</div>
                    <div className="section-note">
                      This gives editors a quick sense of whether the profile is complete enough for production.
                    </div>
                  </div>

                  <div className="workspace-inline-start">
                    <div className="workspace-avatar">
                      {renderAvatar({
                        name: watch("name"),
                        avatar_src: watch("avatar_src"),
                      })}
                    </div>
                    <div style={{ display: "grid", gap: 6 }}>
                      <div style={{ fontSize: 16, fontWeight: 700 }}>{watch("name") || "Author name"}</div>
                      <div className="workspace-copy">{watch("role") || "Role will appear here."}</div>
                      <div className="subtext">/{watch("slug") || "author-slug"}</div>
                    </div>
                  </div>
                </section>

                <section className="modal-section">
                  <div className="section-head">
                    <div className="section-title">Bio</div>
                    <div className="section-note">
                      Add concise background details that can be reused in author cards and post footers.
                    </div>
                  </div>

                  <div>
                    <label className="label" htmlFor="author-bio">Bio</label>
                    <textarea className="textarea" id="author-bio" rows={6} {...register("bio")} />
                  </div>
                </section>

                {formMessage ? <div className="hero-note">{formMessage}</div> : null}

                <div className="workspace-form-actions">
                  <div className="workspace-copy">
                    {selectedAuthor
                      ? `Profile completion ${getProfileCompletion(selectedAuthor)}.`
                      : "Create an author profile and attach it to published articles later."}
                  </div>
                  <div className="workspace-form-actions-end">
                    {selectedAuthor ? (
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
                        : selectedAuthor
                          ? "Update Author"
                          : "Create Author"}
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
