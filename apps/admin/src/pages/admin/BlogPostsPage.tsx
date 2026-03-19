import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BlogPostEditorShell } from "../../components/admin/BlogPostEditorShell";
import { AdminDeleteDialog } from "../../components/admin/AdminDeleteDialog";
import { AdminSectionCard } from "../../components/admin/AdminSectionCard";
import { AdminStatusBadge } from "../../components/admin/AdminStatusBadge";
import { AdminToolbar } from "../../components/admin/AdminToolbar";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { useAuth } from "../../contexts/AuthContext";
import { adminRoutes, type AdminRouteMatch } from "../../lib/adminRoutes";
import { deleteAdminPost, getAdminPosts } from "../../services/adminBlogService";
import type { ApiBlogPost } from "../../types/api";
import { getContentStatus, getAdminErrorMessage } from "../../utils/admin";

interface BlogPostsPageProps {
  mode: AdminRouteMatch["mode"];
  entityId?: number;
}

export function BlogPostsPage({ mode, entityId }: BlogPostsPageProps) {
  const queryClient = useQueryClient();
  const { admin } = useAuth();
  const [deleteTarget, setDeleteTarget] = useState<ApiBlogPost | null>(null);
  const adminRole = admin?.role ?? "admin";

  const postsQuery = useQuery({
    queryKey: ["admin", "blog", "posts"],
    queryFn: getAdminPosts,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminPost,
    onSuccess: async () => {
      const deletedSlug = deleteTarget?.slug;

      await queryClient.invalidateQueries({ queryKey: ["admin", "blog", "posts"] });
      await queryClient.invalidateQueries({ queryKey: ["blog", "posts"] });

      if (deletedSlug) {
        await queryClient.invalidateQueries({
          queryKey: ["blog", "post", deletedSlug],
        });
      }

      setDeleteTarget(null);
    },
  });

  if (mode === "new" || mode === "edit") {
    return <BlogPostEditorShell mode={mode} entityId={entityId} />;
  }

  if (postsQuery.isPending) {
    return <LoadingSpinner label="Loading blog post workspace..." />;
  }

  if (postsQuery.error || !postsQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load blog post management."
        detail="Check that the admin blog endpoints are available."
      />
    );
  }

  return (
    <>
      <AdminSectionCard
        title="Blog posts"
        description="Review articles, publication state, and metadata before sending visitors to the resource page."
      >
        <AdminToolbar
          meta={`${postsQuery.data.length} posts stored`}
          actions={
            <a className="admin-action-button" href={adminRoutes.blogPostsNew}>
              New Blog Post
            </a>
          }
        />

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
                {postsQuery.data.map((post) => {
                  const status = getContentStatus(post);

                  return (
                    <tr key={post.id}>
                      <td>
                        <strong>{post.title}</strong>
                        <p>{post.excerpt ?? "No excerpt provided."}</p>
                      </td>
                      <td>{post.category?.name ?? "Unassigned"}</td>
                      <td>
                        <AdminStatusBadge label={status} />
                      </td>
                      <td>
                        <div className="admin-table__actions">
                          <a className="admin-table__action" href={adminRoutes.blogPostEdit(post.id)}>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-empty">
            <strong>No blog posts yet.</strong>
            <p>Create the first resource article to populate the public resources section.</p>
          </div>
        )}
      </AdminSectionCard>

      <AdminDeleteDialog
        open={Boolean(deleteTarget)}
        title="Delete blog post?"
        description={`This will permanently remove ${deleteTarget?.title ?? "the selected post"}.`}
        isPending={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) {
            return;
          }

          deleteMutation.mutate(deleteTarget.id, {
            onError: (error) => {
              setDeleteTarget(null);
              window.alert(getAdminErrorMessage(error, "Unable to delete blog post."));
            },
          });
        }}
      />
    </>
  );
}
