import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProviderSection } from "../components/ProviderSection";
import { ReferenceHero } from "../components/ReferenceHero";
import { ServicePackagesSection } from "../components/ServicePlansSection";
import { StackSection } from "../components/StackSection";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import { routes } from "../routes";
import type { HomePageContent } from "../types";

export function HomePage() {
  const {
    data: page,
    isPending: pagePending,
    error: pageError,
  } = usePage<HomePageContent>("home");

  useResolvedPageSeo(page, routes.home);

  if (pagePending) {
    return <LoadingSpinner label="Loading homepage..." />;
  }

  if (pageError || !page) {
    return (
      <ErrorMessage
        title="Unable to load the homepage."
        detail="Check that the page endpoint is available."
      />
    );
  }

  return (
    <>
      <ReferenceHero content={page.content.hero} />
      {page.content.provider_section && (
        <ProviderSection content={page.content.provider_section} />
      )}
      {page.content.stack_section && (
        <StackSection
          items={page.content.stack_section.items}
          defaultFeatureRows={page.content.stack_section.default_feature_rows}
          featureVisualContentMap={page.content.stack_section.feature_visual_content}
        />
      )}
      <ServicePackagesSection />
    </>
  );
}
