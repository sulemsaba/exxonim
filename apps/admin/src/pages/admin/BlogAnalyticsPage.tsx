import { useQuery } from "@tanstack/react-query";

import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { toSystemOSPost } from "../../features/blog/systemosAdapter";
import { adminRoutes } from "../../lib/adminRoutes";
import { listAdminBlogPosts } from "../../services/adminBlogService";
import { SystemOSAnalyticsDashboard } from "../../systemos/SystemOSAnalyticsDashboard";
import { SystemOSFrame } from "../../systemos/SystemOSFrame";

interface BlogAnalyticsPageProps {
  theme: "light" | "dark";
}

export function BlogAnalyticsPage({ theme }: BlogAnalyticsPageProps) {
  const postsQuery = useQuery({
    queryKey: ["admin", "blog", "posts", "analytics"],
    queryFn: () => listAdminBlogPosts(),
  });

  if (postsQuery.isPending) {
    return <LoadingSpinner label="Loading blog analytics..." />;
  }

  if (postsQuery.error || !postsQuery.data) {
    return (
      <ErrorMessage
        title="Unable to load blog analytics."
        detail="Blog analytics could not be loaded right now."
      />
    );
  }

  const posts = postsQuery.data.map(toSystemOSPost);

  return (
    <SystemOSFrame theme={theme} padded={false}>
      <div style={{ display: "grid", gap: 12 }}>
        <section className="card analytics-panel">
          <div className="analytics-kicker">Integration note</div>
          <div className="analytics-title">Blog analytics are estimate-based for now</div>
          <div className="analytics-copy">
            This view is powered by the real blog inventory, but traffic values are derived
            until a dedicated analytics endpoint is connected.
          </div>
        </section>

        <SystemOSAnalyticsDashboard
          posts={posts}
          defaultRange={30}
          onOpenPost={(postId) => {
            if (typeof window !== "undefined") {
              window.location.assign(adminRoutes.blogPostEdit(postId));
            }
          }}
          onShowTrending={() => {
            if (typeof window !== "undefined") {
              window.location.assign(adminRoutes.blogPosts);
            }
          }}
          onCreateSimilar={() => {
            if (typeof window !== "undefined") {
              window.location.assign(adminRoutes.blogPostsNew);
            }
          }}
        />
      </div>
    </SystemOSFrame>
  );
}
