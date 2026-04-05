import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import {
  getBlogWorkspaceStatus,
  toAdminPayloadFromSystemOSPost,
  toSystemOSPost,
} from "../../features/blog/systemosAdapter";
import { adminRoutes, type AdminRouteMatch } from "../../lib/adminRoutes";
import {
  createAdminBlogPost,
  getAdminBlogPost,
  listAdminBlogAuthors,
  listAdminBlogCategories,
  listAdminBlogPosts,
  updateAdminBlogPost,
} from "../../services/adminBlogService";
import { uploadMediaFile } from "../../services/adminMediaService";
import { SystemOSBlogManager } from "../../systemos/SystemOSBlogManager";
import { SystemOSFrame } from "../../systemos/SystemOSFrame";
import type { SystemOSPost, SystemOSWorkspaceNotice } from "../../systemos/types";
import { createBlogCommand } from "../../systemos/utils";
import type { ApiBlogPost } from "../../types/api";
import { getAdminErrorMessage } from "../../utils/admin";

interface BlogPostsPageProps {
  mode: AdminRouteMatch["mode"];
  entityId?: number;
  theme: "light" | "dark";
}

function postsAreEqual(left: SystemOSPost, right: SystemOSPost) {
  return JSON.stringify(left) === JSON.stringify(right);
}

export function BlogPostsPage({ mode, entityId, theme }: BlogPostsPageProps) {
  const { admin } = useAuth();
  const queryClient = useQueryClient();
  const [workspacePosts, setWorkspacePosts] = useState<SystemOSPost[]>([]);
  const [workspaceNotice, setWorkspaceNotice] = useState<SystemOSWorkspaceNotice | null>(null);
  const workspacePostsRef = useRef<SystemOSPost[]>([]);
  const syncQueueRef = useRef<Promise<void>>(Promise.resolve());

  const postsQuery = useQuery({
    queryKey: ["admin", "blog", "posts"],
    queryFn: () => listAdminBlogPosts(),
  });

  const categoriesQuery = useQuery({
    queryKey: ["admin", "blog", "categories"],
    queryFn: () => listAdminBlogCategories(),
  });

  const authorsQuery = useQuery({
    queryKey: ["admin", "blog", "authors"],
    queryFn: () => listAdminBlogAuthors(),
  });

  const selectedPostQuery = useQuery({
    queryKey: ["admin", "blog", "post", entityId],
    queryFn: () => getAdminBlogPost(entityId as number),
    enabled: mode === "edit" && typeof entityId === "number",
  });

  const selectedPost = mode === "edit" ? selectedPostQuery.data ?? null : null;

  const combinedApiPosts = useMemo(() => {
    const basePosts = postsQuery.data ? [...postsQuery.data] : [];

    if (!selectedPost) {
      return basePosts;
    }

    const selectedIndex = basePosts.findIndex((post) => post.id === selectedPost.id);
    if (selectedIndex >= 0) {
      basePosts[selectedIndex] = selectedPost;
      return basePosts;
    }

    return [selectedPost, ...basePosts];
  }, [postsQuery.data, selectedPost]);

  const apiPostById = useMemo(() => {
    const nextMap = new Map<number, ApiBlogPost>();
    combinedApiPosts.forEach((post) => nextMap.set(post.id, post));
    return nextMap;
  }, [combinedApiPosts]);

  const systemPosts = useMemo(() => combinedApiPosts.map(toSystemOSPost), [combinedApiPosts]);

  useEffect(() => {
    setWorkspacePosts(systemPosts);
    workspacePostsRef.current = systemPosts;
  }, [systemPosts]);

  const routeCommand = useMemo(() => {
    if (mode === "new") {
      return createBlogCommand("new");
    }

    if (mode === "edit" && typeof entityId === "number" && selectedPost) {
      return createBlogCommand("edit", entityId);
    }

    return null;
  }, [entityId, mode, selectedPost]);

  async function persistWorkspaceChanges(previousPosts: SystemOSPost[], nextPosts: SystemOSPost[]) {
    const categories = categoriesQuery.data ?? [];
    const authors = authorsQuery.data ?? [];
    const previousPostsById = new Map(previousPosts.map((post) => [post.id, post]));
    const createdPosts = nextPosts.filter((post) => !previousPostsById.has(post.id));
    const updatedPosts = nextPosts.filter((post) => {
      const previousPost = previousPostsById.get(post.id);
      return previousPost ? !postsAreEqual(previousPost, post) : false;
    });

    if (!createdPosts.length && !updatedPosts.length) {
      return;
    }

    const changedSlugs = new Set<string>();
    const changedIds = new Set<number>();

    for (const post of createdPosts) {
      const savedPost = await createAdminBlogPost(
        toAdminPayloadFromSystemOSPost(post, {
          categories,
          authors,
        })
      );

      changedIds.add(savedPost.id);
      changedSlugs.add(savedPost.slug);
    }

    for (const post of updatedPosts) {
      const originalPost = apiPostById.get(post.id) ?? null;
      const savedPost = await updateAdminBlogPost(
        post.id,
        toAdminPayloadFromSystemOSPost(post, {
          categories,
          authors,
          original: originalPost,
        })
      );

      changedIds.add(savedPost.id);
      changedSlugs.add(savedPost.slug);

      if (originalPost?.slug) {
        changedSlugs.add(originalPost.slug);
      }
    }

    await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "posts"] });
    await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "posts", "analytics"] });
    await queryClient.invalidateQueries({ queryKey: ["blog", "posts"] });

    for (const postId of changedIds) {
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "post", postId] });
    }

    for (const slug of changedSlugs) {
      await queryClient.invalidateQueries({ queryKey: ["blog", "post", slug] });
    }

    setWorkspaceNotice(null);
  }

  function handleWorkspacePostsChange(nextPosts: SystemOSPost[]) {
    const previousPosts = workspacePostsRef.current;
    workspacePostsRef.current = nextPosts;
    setWorkspacePosts(nextPosts);

    syncQueueRef.current = syncQueueRef.current
      .then(() => persistWorkspaceChanges(previousPosts, nextPosts))
      .catch(async (error) => {
        await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "posts"] });
        await queryClient.invalidateQueries({ queryKey: ["blog", "posts"] });
        setWorkspaceNotice({
          tone: "error",
          message: getAdminErrorMessage(error, "Unable to save blog post changes."),
        });
      });
  }

  function handleCloseEditor() {
    if (typeof window !== "undefined" && (mode === "new" || mode === "edit")) {
      window.location.assign(adminRoutes.blogPosts);
    }
  }

  async function handleRouteEdit(postId: number) {
    if (typeof window === "undefined") {
      return;
    }

    window.location.assign(adminRoutes.blogPostEdit(postId));
  }

  function handleRouteNew() {
    if (typeof window !== "undefined") {
      window.location.assign(adminRoutes.blogPostsNew);
    }
  }

  async function refreshBlogQueries(post?: ApiBlogPost | null, previousSlug?: string | null) {
    await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "posts"] });
    await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "posts", "analytics"] });
    await queryClient.invalidateQueries({ queryKey: ["blog", "posts"] });

    const slugs = new Set<string>();
    if (post?.slug) slugs.add(post.slug);
    if (previousSlug) slugs.add(previousSlug);

    if (post?.id) {
      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "post", post.id] });
    }

    for (const slug of slugs) {
      await queryClient.invalidateQueries({ queryKey: ["blog", "post", slug] });
    }
  }

  async function saveSystemOSPost(
    post: SystemOSPost,
    previousPost: SystemOSPost | null
  ) {
    const categories = categoriesQuery.data ?? [];
    const authors = authorsQuery.data ?? [];
    const originalPost = previousPost ? apiPostById.get(previousPost.id) ?? null : null;

    if (previousPost) {
      const saved = await updateAdminBlogPost(
        previousPost.id,
        toAdminPayloadFromSystemOSPost(post, {
          categories,
          authors,
          original: originalPost,
        })
      );

      await refreshBlogQueries(saved, originalPost?.slug ?? null);
      return saved;
    }

    const created = await createAdminBlogPost(
      toAdminPayloadFromSystemOSPost(post, {
        categories,
        authors,
      })
    );

    await refreshBlogQueries(created, null);
    if (mode === "new" && typeof window !== "undefined") {
      window.history.replaceState({}, "", adminRoutes.blogPostEdit(created.id));
    }
    return created;
  }

  async function updateRevisionBeforeAction(post: SystemOSPost) {
    const categories = categoriesQuery.data ?? [];
    const authors = authorsQuery.data ?? [];
    const originalPost = apiPostById.get(post.id) ?? null;

    await updateAdminBlogPost(
      post.id,
      toAdminPayloadFromSystemOSPost(post, {
        categories,
        authors,
        original: originalPost,
      })
    );

    return originalPost;
  }

  if (mode === "edit" && typeof entityId !== "number") {
    return (
      <ErrorMessage
        title="Missing blog post id."
        detail="Select a post from the blog workspace before trying to edit it."
      />
    );
  }

  if (
    postsQuery.isPending ||
    categoriesQuery.isPending ||
    authorsQuery.isPending ||
    (mode === "edit" && selectedPostQuery.isPending)
  ) {
    return <LoadingSpinner label="Loading blog post workspace..." />;
  }

  if (postsQuery.error || !postsQuery.data || categoriesQuery.error || authorsQuery.error) {
    return (
      <ErrorMessage
        title="Unable to load blog post management."
        detail="Blog posts could not be loaded right now."
      />
    );
  }

  if (mode === "edit" && (selectedPostQuery.error || !selectedPost)) {
    return (
      <ErrorMessage
        title="Unable to load blog editor."
        detail="The selected blog post could not be found or opened."
      />
    );
  }

  return (
    <SystemOSFrame theme={theme} padded={false}>
      <SystemOSBlogManager
        posts={workspacePosts}
        onPostsChange={handleWorkspacePostsChange}
        categories={(categoriesQuery.data ?? []).map((category) => category.name)}
        authors={(authorsQuery.data ?? []).map((author) => author.name)}
        command={routeCommand}
        onCloseEditor={handleCloseEditor}
        onRequestNew={mode === "index" ? handleRouteNew : undefined}
        onRequestEdit={mode === "index" ? (postId) => void handleRouteEdit(postId) : undefined}
        currentUserLabel={admin?.full_name || admin?.email || "Administrator"}
        currentUserRole={admin?.role || "admin"}
        workspaceNotice={workspaceNotice}
        onDismissWorkspaceNotice={() => setWorkspaceNotice(null)}
        onUploadCover={async (file) => {
          const media = await uploadMediaFile(file);
          return {
            url: media.url,
            fileName: file.name,
            altText: media.alt_text ?? null,
          };
        }}
        onSavePost={async (post, options) => {
          const saved = await saveSystemOSPost(post, options.previousPost);
          return toSystemOSPost(saved);
        }}
      />
    </SystemOSFrame>
  );
}
