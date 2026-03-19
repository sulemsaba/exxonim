import { AdminLayout } from "../../components/admin/AdminLayout";
import { ErrorMessage } from "../../components/ErrorMessage";
import { useAuth } from "../../contexts/AuthContext";
import {
  isAdminSectionRestrictedForEditor,
  type AdminRouteMatch,
} from "../../lib/adminRoutes";
import {
  BlogAuthorsPage,
  BlogCategoriesPage,
  BlogPostsPage,
} from "../../features/blog";
import { ConsultationsPage } from "../../features/consultations";
import { AdminDashboardPage } from "../../features/dashboard";
import { NavigationPage } from "../../features/navigation";
import { PagesPage } from "../../features/pages";
import { PricingPage } from "../../features/pricing";
import { TestimonialsPage } from "../../features/testimonials";
import { AccessRolesPage } from "./AccessRolesPage";
import { BrandSettingsPage } from "./BrandSettingsPage";
import { ContactMapSettingsPage } from "./ContactMapSettingsPage";
import { FooterSettingsPage } from "./FooterSettingsPage";
import { JobsPage } from "./JobsPage";
import { SeoDefaultsPage } from "./SeoDefaultsPage";

interface AdminAppProps {
  match: AdminRouteMatch;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function AdminApp({ match, theme, onToggleTheme }: AdminAppProps) {
  const { admin } = useAuth();
  const adminRole = admin?.role ?? "admin";

  if (adminRole === "editor" && isAdminSectionRestrictedForEditor(match.section)) {
    return (
      <AdminLayout
        activeSection={match.section}
        title={match.title}
        description={match.description}
        breadcrumbs={match.breadcrumbs}
        theme={theme}
        onToggleTheme={onToggleTheme}
      >
        <ErrorMessage
          title="Restricted workspace"
          detail="Editors cannot access this admin section."
        />
      </AdminLayout>
    );
  }

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
    ) : match.section === "consultations" ? (
      <ConsultationsPage />
    ) : [
        "page-home",
        "page-services",
        "page-about",
        "page-faq",
        "page-contact",
        "page-careers",
        "pages",
      ].includes(match.section) ? (
      <PagesPage mode={match.mode} entityId={match.entityId} pageSlug={match.pageSlug} />
    ) : match.section === "jobs" ? (
      <JobsPage mode={match.mode} entitySlug={match.entitySlug} />
    ) : match.section === "brand-settings" ? (
      <BrandSettingsPage />
    ) : match.section === "contact-settings" ? (
      <ContactMapSettingsPage />
    ) : match.section === "navigation" ? (
      <NavigationPage />
    ) : match.section === "pricing" ? (
      <PricingPage />
    ) : match.section === "testimonials" ? (
      <TestimonialsPage />
    ) : match.section === "footer-settings" ? (
      <FooterSettingsPage />
    ) : match.section === "seo-settings" ? (
      <SeoDefaultsPage />
    ) : match.section === "access-roles" ? (
      <AccessRolesPage />
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
