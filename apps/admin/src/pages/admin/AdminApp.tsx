import { AdminLayout } from "../../components/admin/AdminLayout";
import { ErrorMessage } from "../../components/ErrorMessage";
import type { AdminRouteMatch } from "../../lib/adminRoutes";
import {
  BlogAuthorsPage,
  BlogCategoriesPage,
  BlogPostsPage,
} from "../../features/blog";
import { AdminDashboardPage } from "../../features/dashboard";
import { MediaPage } from "../../features/media";
import { NavigationPage } from "../../features/navigation";
import { PagesPage } from "../../features/pages";
import { PricingPage } from "../../features/pricing";
import { SiteSettingsPage } from "../../features/site-settings";
import { TestimonialsPage } from "../../features/testimonials";

interface AdminAppProps {
  match: AdminRouteMatch;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function AdminApp({ match, theme, onToggleTheme }: AdminAppProps) {
  const content =
    match.title === "Admin" ? (
      <ErrorMessage
        title="Admin route not found."
        detail="The requested admin route did not match a registered workspace."
      />
    ) : match.section === "dashboard" ? (
      <AdminDashboardPage />
    ) : match.section === "blog-posts" ? (
      <BlogPostsPage mode={match.mode} entityId={match.entityId} />
    ) : match.section === "blog-categories" ? (
      <BlogCategoriesPage />
    ) : match.section === "blog-authors" ? (
      <BlogAuthorsPage />
    ) : match.section === "pages" ? (
      <PagesPage mode={match.mode} entityId={match.entityId} />
    ) : match.section === "navigation" ? (
      <NavigationPage />
    ) : match.section === "pricing" ? (
      <PricingPage />
    ) : match.section === "testimonials" ? (
      <TestimonialsPage />
    ) : match.section === "site-settings" ? (
      <SiteSettingsPage />
    ) : match.section === "media" ? (
      <MediaPage />
    ) : (
      <ErrorMessage
        title="Admin section is not available."
        detail={`The ${match.title} workspace could not be resolved.`}
      />
    );

  return (
    <AdminLayout
      activeSection={match.section}
      title={match.title}
      description={match.description}
      breadcrumbs={match.breadcrumbs}
      theme={theme}
      onToggleTheme={onToggleTheme}
    >
      {content}
    </AdminLayout>
  );
}
