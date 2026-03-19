import { EngineSection } from "../components/EngineSection";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ResultsSection } from "../components/ResultsSection";
import { ServicePackagesSection } from "../components/ServicePlansSection";
import { ServicesOverviewSection } from "../components/ServicesOverviewSection";
import { usePage } from "../hooks/usePage";
import { useResolvedPageSeo } from "../hooks/useResolvedSeo";
import { routes } from "../routes";
import type { ServicesPageContent } from "../types";

export function ServicesPage() {
  const { data: page, isPending, error } = usePage<ServicesPageContent>("services");
  useResolvedPageSeo(page, routes.services);

  if (isPending) {
    return <LoadingSpinner label="Loading services..." />;
  }

  if (error || !page) {
    return (
      <ErrorMessage
        title="Unable to load services."
        detail="Check that the page endpoint is available."
      />
    );
  }

  return (
    <>
      <ServicesOverviewSection content={page.content.overview} />
      <EngineSection content={page.content.catalog} />
      <ServicePackagesSection variant="page" />
      <ResultsSection content={page.content.tracking_section} />
    </>
  );
}
