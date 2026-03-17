import { useQuery } from "@tanstack/react-query";
import { ErrorMessage } from "../../components/ErrorMessage";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { getAdminAuthors, getAdminCategories, getAdminPosts } from "../../services/adminBlogService";
import { getAdminMedia } from "../../services/adminMediaService";
import { getAdminNavigation } from "../../services/adminNavigationService";
import { getAdminPages } from "../../services/adminPageService";
import { getAdminPricingPlans } from "../../services/adminPricingService";
import { getAdminSiteSettings } from "../../services/adminSiteSettingsService";
import { getAdminTestimonials } from "../../services/adminTestimonialService";

export function AdminDashboardPage() {
  const postsQuery = useQuery({
    queryKey: ["admin", "blog", "posts"],
    queryFn: getAdminPosts,
  });
  const pagesQuery = useQuery({
    queryKey: ["admin", "pages"],
    queryFn: getAdminPages,
  });
  const navigationQuery = useQuery({
    queryKey: ["admin", "navigation"],
    queryFn: getAdminNavigation,
  });
  const pricingQuery = useQuery({
    queryKey: ["admin", "pricing"],
    queryFn: getAdminPricingPlans,
  });
  const testimonialsQuery = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: getAdminTestimonials,
  });
  const settingsQuery = useQuery({
    queryKey: ["admin", "site-settings"],
    queryFn: getAdminSiteSettings,
  });
  const mediaQuery = useQuery({
    queryKey: ["admin", "media"],
    queryFn: getAdminMedia,
  });
  const categoriesQuery = useQuery({
    queryKey: ["admin", "blog", "categories"],
    queryFn: getAdminCategories,
  });
  const authorsQuery = useQuery({
    queryKey: ["admin", "blog", "authors"],
    queryFn: getAdminAuthors,
  });

  if (
    postsQuery.isPending ||
    pagesQuery.isPending ||
    navigationQuery.isPending ||
    pricingQuery.isPending ||
    testimonialsQuery.isPending ||
    settingsQuery.isPending ||
    mediaQuery.isPending ||
    categoriesQuery.isPending ||
    authorsQuery.isPending
  ) {
    return <LoadingSpinner label="Loading admin overview..." />;
  }

  if (
    postsQuery.error ||
    pagesQuery.error ||
    navigationQuery.error ||
    pricingQuery.error ||
    testimonialsQuery.error ||
    settingsQuery.error ||
    mediaQuery.error ||
    categoriesQuery.error ||
    authorsQuery.error
  ) {
    return (
      <ErrorMessage
        title="Unable to load the admin overview."
        detail="Check that the admin API is reachable and try again."
      />
    );
  }

  const posts = postsQuery.data ?? [];
  const publishedPosts = posts.filter((post) => post.is_published).length;
  const pages = pagesQuery.data ?? [];
  const publishedPages = pages.filter((page) => page.is_published).length;
  const navigationCount = navigationQuery.data?.length ?? 0;
  const pricingCount = pricingQuery.data?.length ?? 0;
  const testimonialCount = testimonialsQuery.data?.length ?? 0;
  const settingsCount = settingsQuery.data?.length ?? 0;
  const mediaCount = mediaQuery.data?.length ?? 0;
  const categoryCount = categoriesQuery.data?.length ?? 0;
  const authorCount = authorsQuery.data?.length ?? 0;

  return (
    <div className="admin-list-grid">
      <section className="admin-card">
        <div className="admin-card__header">
          <div>
            <h2>Workspace summary</h2>
            <p>Current content volume across the editable resources.</p>
          </div>
        </div>
        <div className="admin-card__body">
          <div className="admin-metric-grid">
            <article className="admin-metric">
              <strong>Blog Posts</strong>
              <span>{posts.length}</span>
              <p>{publishedPosts} published</p>
            </article>
            <article className="admin-metric">
              <strong>Pages</strong>
              <span>{pages.length}</span>
              <p>{publishedPages} published</p>
            </article>
            <article className="admin-metric">
              <strong>Navigation Roots</strong>
              <span>{navigationCount}</span>
              <p>Top-level menu groups</p>
            </article>
            <article className="admin-metric">
              <strong>Categories</strong>
              <span>{categoryCount}</span>
              <p>Available post categories</p>
            </article>
            <article className="admin-metric">
              <strong>Authors</strong>
              <span>{authorCount}</span>
              <p>Configured author profiles</p>
            </article>
            <article className="admin-metric">
              <strong>Pricing Plans</strong>
              <span>{pricingCount}</span>
              <p>Plans currently stored</p>
            </article>
            <article className="admin-metric">
              <strong>Testimonials</strong>
              <span>{testimonialCount}</span>
              <p>Managed proof points</p>
            </article>
            <article className="admin-metric">
              <strong>Site Settings</strong>
              <span>{settingsCount}</span>
              <p>Global JSON settings</p>
            </article>
            <article className="admin-metric">
              <strong>Media Assets</strong>
              <span>{mediaCount}</span>
              <p>Available uploaded or linked files</p>
            </article>
          </div>
        </div>
      </section>

      <section className="admin-card">
        <div className="admin-card__header">
          <div>
            <h2>Phase 4 focus</h2>
            <p>The admin surface is live. Each sidebar section now manages a real API-backed resource.</p>
          </div>
        </div>
        <div className="admin-card__body">
          <div className="admin-empty">
            <strong>Use the sidebar to move between resource managers.</strong>
            <p>
              Blog posts and pages use dedicated create/edit routes. The other sections use
              split-view list and form workspaces for faster editing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
