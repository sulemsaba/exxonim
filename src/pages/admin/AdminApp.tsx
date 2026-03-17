import { AdminLayout } from "../../components/admin/AdminLayout";
import { ErrorMessage } from "../../components/ErrorMessage";
import type { AdminRouteMatch } from "../../lib/adminRoutes";
import { BlogAuthorsPage } from "./BlogAuthorsPage";
import { BlogCategoriesPage } from "./BlogCategoriesPage";
import { BlogPostsPage } from "./BlogPostsPage";
import { AdminDashboardPage } from "./Dashboard";
import { MediaPage } from "./MediaPage";
import { NavigationPage } from "./NavigationPage";
import { PagesPage } from "./PagesPage";
import { PricingPage } from "./PricingPage";
import { SiteSettingsPage } from "./SiteSettingsPage";
import { TestimonialsPage } from "./TestimonialsPage";

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
