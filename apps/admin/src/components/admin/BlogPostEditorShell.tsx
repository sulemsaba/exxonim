import { useEffect, useMemo, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminDeleteDialog } from "./AdminDeleteDialog";
import { AdminFormBanner } from "./AdminFormBanner";
import { BlogHighlightsEditor } from "./BlogHighlightsEditor";
import { BlogIntroductionCard } from "./BlogIntroductionCard";
import { BlogMediaCard } from "./BlogMediaCard";
import { BlogPermalinkCard } from "./BlogPermalinkCard";
import { BlogPostBasicsCard } from "./BlogPostBasicsCard";
import { BlogPostEditorHeader } from "./BlogPostEditorHeader";
import { BlogPostPreviewMode } from "./BlogPostPreviewMode";
import { BlogPublishCard } from "./BlogPublishCard";
import { BlogRelatedPostsCard } from "./BlogRelatedPostsCard";
import { BlogSectionsEditor } from "./BlogSectionsEditor";
import { BlogSeoCard } from "./BlogSeoCard";
import { BlogTaxonomyCard } from "./BlogTaxonomyCard";
import { BlogValidationChecklist } from "./BlogValidationChecklist";
import { ErrorMessage } from "../ErrorMessage";
import { LoadingSpinner } from "../LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import { adminRoutes, type AdminRouteMatch } from "../../lib/adminRoutes";
import { resourcePost } from "../../routes";
import {
  createAdminPost,
  deleteAdminPost,
  getAdminAuthors,
  getAdminCategories,
  getAdminPost,
  getAdminPosts,
  updateAdminPost,
} from "../../services/adminBlogService";
import type { ApiBlogPost, ApiMedia } from "../../types/api";
import { getAdminMedia } from "../../services/adminMediaService";
import {
  buildBlogPreviewData,
  buildBlogValidationChecklist,
  blogEditorSchema,
  createDefaultBlogEditorValues,
  postToBlogEditorValues,
  resolveSubmitStatus,
  toBlogPostPayload,
  type BlogEditorFormValues,
  type BlogEditorSubmitIntent,
} from "../../utils/blogEditor";
import { getAdminErrorMessage, slugify } from "../../utils/admin";

const CREATE_BANNER_KEY = "exxonim-admin-blog-editor-banner";

interface BlogPostEditorShellProps {
  mode: Extract<AdminRouteMatch["mode"], "new" | "edit">;
  entityId?: number;
}

export function BlogPostEditorShell({
  mode,
  entityId,
}: BlogPostEditorShellProps) {
  const queryClient = useQueryClient();
  const { admin } = useAuth();
  const adminRole = admin?.role ?? "admin";
  const [slugDirty, setSlugDirty] = useState(mode === "edit");
  const [banner, setBanner] = useState<{ tone: "success" | "error"; message: string } | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ApiBlogPost | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const previewScrollRef = useRef(0);

  const form = useForm<BlogEditorFormValues>({
    resolver: zodResolver(blogEditorSchema),
    defaultValues: createDefaultBlogEditorValues(),
  });
  const {
    control,
    formState: { isDirty, isSubmitting },
    handleSubmit,
    reset,
    setValue,
  } = form;
  const values = useWatch({ control }) as BlogEditorFormValues;

  const postQuery = useQuery({
    queryKey: ["admin", "blog", "post", entityId],
    queryFn: () => getAdminPost(entityId as number),
    enabled: mode === "edit" && Boolean(entityId),
  });
  const categoriesQuery = useQuery({
    queryKey: ["admin", "blog", "categories"],
    queryFn: getAdminCategories,
  });
  const authorsQuery = useQuery({
    queryKey: ["admin", "blog", "authors"],
    queryFn: getAdminAuthors,
  });
  const postsQuery = useQuery({
    queryKey: ["admin", "blog", "posts"],
    queryFn: getAdminPosts,
  });
  const mediaQuery = useQuery({
    queryKey: ["admin", "media"],
    queryFn: getAdminMedia,
  });

  const createMutation = useMutation({
    mutationFn: createAdminPost,
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ReturnType<typeof toBlogPostPayload> }) =>
      updateAdminPost(id, payload),
  });
  const deleteMutation = useMutation({
    mutationFn: deleteAdminPost,
  });

  const selectedPost = mode === "edit" ? postQuery.data ?? null : null;
  const checklist = useMemo(() => buildBlogValidationChecklist(values), [values]);
  const preview = useMemo(
    () =>
      buildBlogPreviewData(values, {
        authors: authorsQuery.data ?? [],
        categories: categoriesQuery.data ?? [],
        posts: postsQuery.data ?? [],
        currentPostId: selectedPost?.id,
      }),
    [authorsQuery.data, categoriesQuery.data, postsQuery.data, selectedPost?.id, values]
  );

  useEffect(() => {
    if (!slugDirty) {
      setValue("slug", slugify(values.title ?? ""), {
        shouldValidate: true,
        shouldDirty: false,
      });
    }
  }, [setValue, slugDirty, values.title]);

  useEffect(() => {
    if (mode === "edit" && selectedPost) {
      reset(postToBlogEditorValues(selectedPost));
      setSlugDirty(true);
      setLastSavedAt(selectedPost.updated_at);
      return;
    }

    if (mode === "new") {
      reset(createDefaultBlogEditorValues());
      setSlugDirty(false);
      setLastSavedAt(null);
    }
  }, [mode, reset, selectedPost]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const bannerMessage = window.sessionStorage.getItem(CREATE_BANNER_KEY);

    if (!bannerMessage) {
      return;
    }

    setBanner({
      tone: "success",
      message: bannerMessage,
    });
    window.sessionStorage.removeItem(CREATE_BANNER_KEY);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirty || createMutation.isPending || updateMutation.isPending) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [createMutation.isPending, isDirty, updateMutation.isPending]);

  async function invalidateAfterSave(previousSlug?: string, nextSlug?: string) {
    await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "posts"] });
    await queryClient.invalidateQueries({ queryKey: ["blog", "posts"] });

    if (typeof entityId === "number") {
      await queryClient.invalidateQueries({
        queryKey: ["admin", "blog", "post", entityId],
      });
    }

    if (previousSlug) {
      await queryClient.invalidateQueries({
        queryKey: ["blog", "post", previousSlug],
      });
    }

    if (nextSlug) {
      await queryClient.invalidateQueries({
        queryKey: ["blog", "post", nextSlug],
      });
    }
  }

  async function submitEditor(
    submittedValues: BlogEditorFormValues,
    intent: BlogEditorSubmitIntent
  ) {
    setBanner(null);

    const targetStatus = resolveSubmitStatus(submittedValues.status, intent);
    const resolvedChecklist = buildBlogValidationChecklist(submittedValues);

    if (targetStatus === "published" && !resolvedChecklist.can_publish) {
      setBanner({
        tone: "error",
        message: "Publishing is blocked until every required checklist item is complete.",
      });
      return;
    }

    const payload = toBlogPostPayload(submittedValues, intent);

    try {
      if (mode === "edit" && selectedPost) {
        const savedPost = await updateMutation.mutateAsync({
          id: selectedPost.id,
          payload,
        });

        queryClient.setQueryData(["admin", "blog", "post", selectedPost.id], savedPost);
        reset(postToBlogEditorValues(savedPost));
        setLastSavedAt(savedPost.updated_at);
        setSlugDirty(true);
        setBanner({
          tone: "success",
          message:
            payload.status === "published"
              ? "Published changes saved."
              : "Draft changes saved.",
        });

        await invalidateAfterSave(selectedPost.slug, savedPost.slug);
        return;
      }

      const createdPost = await createMutation.mutateAsync(payload);
      await invalidateAfterSave(undefined, createdPost.slug);

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(CREATE_BANNER_KEY, "Blog post created.");
        window.location.assign(adminRoutes.blogPostEdit(createdPost.id));
      }
    } catch (error) {
      setBanner({
        tone: "error",
        message: getAdminErrorMessage(error, "Unable to save blog post."),
      });
    }
  }

  function submitWithIntent(intent: BlogEditorSubmitIntent) {
    void handleSubmit(async (submittedValues) => submitEditor(submittedValues, intent))();
  }

  function handleBackToPosts() {
    if (isDirty && typeof window !== "undefined") {
      const shouldLeave = window.confirm(
        "You have unsaved changes. Leave the editor and discard them?"
      );

      if (!shouldLeave) {
        return;
      }
    }

    if (typeof window !== "undefined") {
      window.location.assign(adminRoutes.blogPosts);
    }
  }

  function handleTogglePreview() {
    if (typeof window === "undefined") {
      setIsPreview((current) => !current);
      return;
    }

    if (!isPreview) {
      previewScrollRef.current = window.scrollY;
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsPreview(true);
      return;
    }

    setIsPreview(false);

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: previewScrollRef.current });
    });
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(deleteTarget.id);
      await invalidateAfterSave(deleteTarget.slug, deleteTarget.slug);
      setDeleteTarget(null);

      if (typeof window !== "undefined") {
        window.location.assign(adminRoutes.blogPosts);
      }
    } catch (error) {
      setDeleteTarget(null);
      setBanner({
        tone: "error",
        message: getAdminErrorMessage(error, "Unable to delete blog post."),
      });
    }
  }

  function handleMediaUploaded(media: ApiMedia) {
    queryClient.setQueryData<ApiMedia[]>(["admin", "media"], (current) => {
      const items = current ?? [];

      return [media, ...items.filter((item) => item.id !== media.id)];
    });
  }

  if (mode === "edit" && !entityId) {
    return (
      <ErrorMessage
        title="Missing blog post id."
        detail="Open this route from the blog posts index so a valid post can be loaded."
      />
    );
  }

  if (
    categoriesQuery.isPending ||
    authorsQuery.isPending ||
    (mode === "edit" && postQuery.isPending)
  ) {
    return <LoadingSpinner label="Loading blog post editor..." />;
  }

  if (
    categoriesQuery.error ||
    authorsQuery.error ||
    (mode === "edit" && postQuery.error) ||
    !categoriesQuery.data ||
    !authorsQuery.data ||
    (mode === "edit" && !selectedPost)
  ) {
    return (
      <ErrorMessage
        title="Unable to load blog editor."
        detail="Check that the admin blog, author, and category endpoints are available."
      />
    );
  }

  const currentStatus = values.status ?? "draft";
  const primaryIntent: BlogEditorSubmitIntent =
    currentStatus === "archived" || currentStatus === "published"
      ? "respect-status"
      : "publish";
  const primaryActionLabel =
    currentStatus === "archived"
      ? "Update Archived"
      : currentStatus === "published"
        ? "Update Published"
        : "Publish";

  return (
    <FormProvider {...form}>
      <div className="blog-editor-shell">
        <BlogPostEditorHeader
          title={values.title.trim() || "Untitled draft"}
          status={currentStatus}
          isDirty={isDirty}
          isPreview={isPreview}
          isSubmitting={isSubmitting || createMutation.isPending || updateMutation.isPending}
          lastSavedAt={lastSavedAt}
          onBack={handleBackToPosts}
          onTogglePreview={handleTogglePreview}
          onSaveDraft={() => submitWithIntent("draft")}
          onPrimaryAction={() => submitWithIntent(primaryIntent)}
          primaryActionLabel={primaryActionLabel}
        />

        {banner ? <AdminFormBanner tone={banner.tone} message={banner.message} /> : null}

        {isPreview ? (
          <BlogPostPreviewMode preview={preview} onBack={handleTogglePreview} />
        ) : (
          <form className="blog-editor-layout" onSubmit={(event) => event.preventDefault()}>
            <div className="blog-editor-layout__main">
              <BlogPostBasicsCard />
              <BlogIntroductionCard />
              <BlogHighlightsEditor />
              <BlogSectionsEditor />
              <BlogRelatedPostsCard
                posts={postsQuery.data ?? []}
                currentPostId={selectedPost?.id}
              />
            </div>

            <div className="blog-editor-layout__sidebar">
              <BlogPublishCard
                adminRole={adminRole}
                canDelete={Boolean(selectedPost) && adminRole === "admin"}
                isDeleting={deleteMutation.isPending}
                onDelete={() => {
                  if (selectedPost) {
                    setDeleteTarget(selectedPost);
                  }
                }}
              />
              <BlogPermalinkCard
                onSlugManualEdit={() => setSlugDirty(true)}
                onSlugReset={() => {
                  setSlugDirty(false);
                  setValue("slug", slugify(values.title ?? ""), {
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                }}
              />
              <BlogTaxonomyCard
                authors={authorsQuery.data}
                categories={categoriesQuery.data}
                autoReadTimeMinutes={checklist.auto_read_time_minutes}
                resolvedReadTimeMinutes={checklist.resolved_read_time_minutes}
                hasCustomReadTime={checklist.has_custom_read_time}
              />
              <BlogMediaCard
                media={mediaQuery.data ?? []}
                mediaError={
                  mediaQuery.error
                    ? getAdminErrorMessage(
                        mediaQuery.error,
                        "Recent media could not be loaded."
                      )
                    : null
                }
                onMediaUploaded={handleMediaUploaded}
              />
              <BlogSeoCard />
              <BlogValidationChecklist checklist={checklist} />
            </div>
          </form>
        )}
      </div>

      <AdminDeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete blog post?"
        description={`This will permanently remove ${deleteTarget?.title ?? "the selected post"}.`}
        isPending={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          void handleConfirmDelete();
        }}
      />
    </FormProvider>
  );
}
